# Shipping viispartners.com — Runbook

Phase 1 target: live site on Azure Static Web Apps (free tier), deployed
automatically from GitHub, with viispartners.com pointed at it via Azure DNS.

Estimated cost: **$0/mo for hosting, ~$0.50/mo for the Azure DNS zone.**

---

## The shape of the whole thing

```
git push → GitHub Actions builds Astro → deploys dist/ to Static Web App
                                              ↑
viispartners.com → Azure DNS (ALIAS record) ──┘
```

Every step below produces something you can talk about in an interview:
a CI/CD pipeline, an Azure resource group, a DNS zone with delegation and
alias records. These map directly to AZ-104 exam objectives (marked ⭐).

---

## Step 0 — Prerequisites

- Azure subscription (free tier is fine)
- GitHub account
- CLIs installed locally: `git`, `az` (Azure CLI), optionally `gh` (GitHub CLI)
- Logged in: `az login` and `gh auth login`

## Step 1 — Put the code on GitHub

**Why:** the repo is both your source of truth and the *trigger* for
deployment. Azure Static Web Apps deploys by installing a GitHub Actions
workflow into your repo; every push to `main` rebuilds and redeploys.

**Decision: make the repo a monorepo.** Create it at the `VIIS/` level (not
`viis-site/`), so Phase 2 can add `terraform/`, `backend/`, etc. alongside the
site. One repo telling the whole project's story is better portfolio material
than scattered repos.

```bash
cd ~/Documents/Projects/VIIS
git init
git add .
git commit -m "Phase 1: VIIS brochure site (Astro)"
gh repo create viis-partners --public --source . --push
```

Public repo = visible portfolio. (If anything sensitive ever lands here,
that's what `.env` + `.gitignore` are for — already configured.)

## Step 2 — Create the Static Web App ⭐

**Why SWA:** it bundles hosting, global CDN-style distribution, free SSL, and
CI/CD wiring into one free resource. The `--login-with-github` flow below asks
Azure for GitHub access, then Azure *commits a workflow file into your repo*
and adds a deployment token as a repo secret. That's the whole pipeline.

```bash
# Resource group first — the container every Azure resource lives in ⭐
az group create --name rg-viis-prod --location eastus2

az staticwebapp create \
  --name swa-viis-site \
  --resource-group rg-viis-prod \
  --source https://github.com/<YOUR_GH_USERNAME>/viis-partners \
  --branch main \
  --app-location "viis-site" \
  --output-location "dist" \
  --location eastus2 \
  --sku Free \
  --login-with-github
```

Notes:
- `app-location "viis-site"` — path to the app *within the monorepo*.
- `output-location "dist"` — where `astro build` puts the static files.
- The `--location` only determines where SWA's control plane/metadata lives;
  content is served from Azure's global edge regardless.
- Naming (`rg-`, `swa-` prefixes) follows Microsoft's Cloud Adoption
  Framework conventions — small thing, reads as professionalism.

After it runs: `git pull` (Azure pushed a workflow file to your repo), then
open the Actions tab on GitHub and watch the first deploy. When it's green,
the app has a URL like `https://<random-name>.azurestaticapps.net` — verify
the site loads there before touching DNS.

## Step 3 — Read the workflow file (don't skip)

Open `.github/workflows/azure-static-web-apps-*.yml` and read it. Things to
notice, because interviewers ask exactly this:

- **Trigger**: `on: push` to `main` + pull requests. PRs get their own
  *staging environments* — a free preview URL per PR.
- **Secret**: `secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_*` — the deployment
  token. Secrets live in GitHub repo settings, never in code.
- **Oryx**: the deploy step auto-detects Astro, runs `npm install` and
  `npm run build` for you.

## Step 4 — DNS: point viispartners.com at it ⭐

**The apex-domain problem (worth understanding):** DNS forbids CNAME records
at the root of a domain (`viispartners.com`), and SWA doesn't give you a
stable IP for an A record. The fix is an **ALIAS record** — a non-standard
record type that behaves like a CNAME but is legal at the apex. Azure DNS
supports alias records natively, and SWA has a first-class integration:
choose **"Custom domain on Azure DNS"** and it creates the validation TXT
and the ALIAS record for you. This is the only fully-supported apex path.

```bash
# Create the DNS zone (~$0.50/mo) ⭐
az network dns zone create -g rg-viis-prod -n viispartners.com

# Get the four nameservers Azure assigned
az network dns zone show -g rg-viis-prod -n viispartners.com --query nameServers
```

Then, at your **registrar**: replace the nameservers with those four values.
This is *delegation* ⭐ — the registrar now answers "ask Azure" for anything
about viispartners.com. Propagation: minutes to 48h, usually fast.

Then, in the **SWA portal** → Custom domains:
1. Add `viispartners.com` → choose **Custom domain on Azure DNS** → select
   your zone. Azure creates the TXT + ALIAS records itself.
2. Add `www.viispartners.com` → CNAME type. Create the CNAME in the DNS zone
   pointing to the `*.azurestaticapps.net` hostname (portal shows the value).

SSL certificates are issued and renewed automatically for both. Free.

## Step 5 — Verify

- [ ] `https://viispartners.com` loads with a valid cert
- [ ] `https://www.viispartners.com` loads
- [ ] Push a trivial commit → Actions runs → change appears live
- [ ] `dig viispartners.com` / `dig NS viispartners.com` show Azure's answers
- [ ] Lighthouse check (Chrome DevTools) — static Astro should score ~100s

## Later (not blocking launch)

- `staticwebapp.config.json` — custom 404, security headers, www→apex redirect
- OG/social meta tags, sitemap, robots.txt
- Analytics (privacy-friendly, e.g. Plausible/GoatCounter, or App Insights)

---

## What you can now claim (resume/interview)

- Built and shipped a production site with **CI/CD via GitHub Actions**
- Provisioned and managed **Azure resource groups, Static Web Apps, DNS
  zones, delegation, and alias records**
- Explained apex-domain DNS constraints and their resolution — a classic
  troubleshooting interview topic
