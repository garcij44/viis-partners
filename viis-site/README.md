# VIIS Partners — website

Single-page brochure site for VIIS Partners. Astro 7, static output, no
client-side framework, no runtime third-party requests. Deploys to Azure Static
Web Apps.

Design authority is split in two, and both are enforced, not aspirational:
[`docs/VIIS-Site-Brief.md`](./docs/VIIS-Site-Brief.md) for intent and structure,
[`src/styles/tokens.css`](./src/styles/tokens.css) for every built value. Where they
disagree, `tokens.css` wins. Read both before touching anything visual.

---

## Local setup

```sh
npm install
cp .env.example .env      # then edit values (all are safe/public — see below)
npm run dev               # http://localhost:4321
```

Requires Node >= 22.12.

## Commands

| Command           | Does                                              |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Dev server with HMR                               |
| `npm run build`   | Production build to `dist/` (also compiles types) |
| `npm run preview` | Serve the built `dist/` locally                   |
| `npm run check`   | `astro check` — type + template diagnostics       |

There is no unit-test suite (a static brochure site); `npm run check` plus
`npm run build` are the CI gates. See "Verification" below for how the form and
security headers were validated.

## Environment variables

The site inlines **no** environment variables at build time. Every setting
belongs to the API and is read at request time from the Static Web App's
application settings (Azure Portal → the static web app → Settings →
Environment variables, or `az staticwebapp appsettings set`).

| Setting                          | Required | Purpose                                                                                       |
| -------------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `LEADS_TABLE_CONNECTION_STRING`  | Yes      | Azure Storage account connection string. Leads and rate-limit counters are written to a table. |
| `LEADS_TABLE_NAME`               | No       | Table name. Default `leads`. Created on first use.                                            |
| `MAIL_CONNECTION_STRING`         | Yes      | Azure Communication Services connection string, used for both emails.                        |
| `MAIL_FROM`                      | Yes      | A verified sender address on the ACS Email domain, e.g. `DoNotReply@<domain>`.               |
| `MAIL_NOTIFY_TO`                 | No       | Where new-lead notifications go. Default `jgarcia@viispartners.com`.                         |
| `MAIL_TRANSPORT`                 | No       | `acs` (default) or `log`. `log` writes emails to the function log instead of sending; local use only. |
| `RATE_LIMIT_PER_HOUR`            | No       | Submissions accepted per client address per hour. Default `5`.                               |

Names avoid the prefixes Static Web Apps reserves (`APPSETTING_`, `AZURE_FUNCTION_`,
`FUNCTIONS_`, `WEBSITE_`, `AzureWeb`, …). Missing required settings make every
request return 500 with a `audit.config` log line rather than dropping leads
quietly. See [`api/local.settings.example.json`](./api/local.settings.example.json).

---

### Analytics variables

Two optional build-time variables, read by `src/layouts/Layout.astro`:

| Variable | Effect when set |
|---|---|
| `PUBLIC_GA_MEASUREMENT_ID` | Renders `/scripts/analytics.js` with the ID, which loads GA4's `gtag.js` after the page has loaded, reports page views, and sends a `generate_lead` event when an audit request is accepted (fetch path) or when `/thanks/` loads (no-JS path). No form data travels with the event. |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Renders the `google-site-verification` meta tag for Search Console. **Not used: Search Console is verified by DNS record** (decided 2026-09-06). The variable stays available as a fallback; leave it unset. |

Unset, the build ships no analytics script and no verification tag. Set them in the GitHub Actions build step's `env` (from repository variables), not in a committed `.env`. Mark `generate_lead` as a key event in the GA4 property so it reports as a conversion.


## Form architecture

The audit form is the primary conversion point (brief §2.8). Three layers,
degrading safely:

1. **No JavaScript** — a plain `<form method="post" action="/api/audit">`. Native
   validation applies; the function answers with a `303` to `/thanks/`.
2. **Enhancement** — [`public/scripts/audit.js`](./public/scripts/audit.js), a
   static same-origin module (the CSP allows it with no hash or nonce), adds
   inline validation and inline states. It sets `form.noValidate` at runtime so
   its inline errors own the presentation instead of browser bubbles; with JS
   off, native validation remains the only guard. It never gates on a bot
   heuristic — an earlier form on this site discarded real leads behind a fake
   confirmation.
3. **Backend** — [`api/`](./api), a managed Azure Function on the Static Web
   App, same origin, no third party in the lead path.

### Field contract

Five fields and nothing else — every extra field costs conversions.

| Field                          | Name       | Required | Cap | Server normalisation                                  |
| ------------------------------ | ---------- | -------- | --- | ----------------------------------------------------- |
| Name                           | `name`     | Yes      | 100 | one line                                              |
| Business name                  | `business` | Yes      | 120 | one line                                              |
| Email                          | `email`    | Yes      | 200 | one line, shape-checked, never verified               |
| Website URL                    | `website`  | Yes      | 200 | `https://` added if missing; must be http(s) with a dotted host; canonical URL stored |
| What's bothering you about it? | `note`     | No       | 300 | one line                                              |

Plus `botcheck`, a visually hidden honeypot **checkbox** (never autofilled,
unlike a text input). Any value means spam: the function answers as if it
succeeded and stores nothing. "One line" means control characters are stripped
and whitespace collapsed, so nothing submitted can inject a mail header or a log
line.

### What the function does

`POST /api/audit`, in this order:

1. Read the form body. Honeypot ticked → log `audit.dropped`, respond success.
2. Validate with zod; on failure `400` with one message per field.
3. Rate limit: the client address (`x-forwarded-for`) is hashed and counted per
   hour in the table; over the limit → `429`. No address → the limit is skipped
   and logged, so one missing header cannot lock the form for everyone.
4. Write the lead to the table (partition `lead-YYYY-MM`, newest first).
5. Send two emails in parallel: the notification to `MAIL_NOTIFY_TO` (reply-to
   the visitor) and the acknowledgement to the visitor (reply-to
   `MAIL_NOTIFY_TO`).
6. `200 {"ok":true}` if the lead landed anywhere; `500` only if the table **and**
   the notification both failed. A fetch submit (`Accept: application/json`)
   gets JSON; a plain submit gets a redirect or a small HTML page.

Logs are structured JSON (`audit.received`, `audit.dropped`, `audit.store`,
`audit.notify`, `audit.ack`, `audit.rate`, `audit.config`). They carry the
website hostname and a hash prefix, never a name or email. Logs need
Application Insights enabled on the static web app to be visible.

### Local development

```sh
cd viis-site/api
cp local.settings.example.json local.settings.json   # MAIL_TRANSPORT=log, Azurite storage
npm install
npx azurite --silent --location /tmp/azurite &        # table storage emulator
npm start                                              # builds, then func start on :7071
```

Then `swa start ../dist --api-location . ` from `api/`, or `swa start http://localhost:4321 --api-location .`
against the Astro dev server, serves the site with `/api` proxied. Azure Functions
Core Tools (`func`) must be installed. `npm test` runs the handler against
in-memory fakes and needs no emulator.

---

## Configure the form for production

Three Azure resources and seven settings. Nothing in this repo contains a
credential; every value below is created in Azure and pasted into the static
web app's application settings.

1. **Storage account** (the lead log). Any general-purpose v2 account in
   `rg-viis-prod`; Table service is on by default.
   `az storage account show-connection-string -g rg-viis-prod -n <account> -o tsv`
   → `LEADS_TABLE_CONNECTION_STRING`.
2. **Azure Communication Services** with an **Email Communication Service** and a
   sender domain. Fastest: the Azure-managed domain, which gives a
   `DoNotReply@<guid>.azurecomm.net` sender. Better: connect `viispartners.com`
   as a custom domain and add the TXT (verification + SPF) and two CNAME (DKIM)
   records ACS shows — the acknowledgement then comes from the brand's own
   domain with authenticated mail, which is the thing the audit itself checks.
   `az communication list-key -g rg-viis-prod -n <acs> --query primaryConnectionString -o tsv`
   → `MAIL_CONNECTION_STRING`; the sender address → `MAIL_FROM`.
3. **Application settings** on `swa-viis-site`:
   ```sh
   az staticwebapp appsettings set -n swa-viis-site -g rg-viis-prod --setting-names \
     LEADS_TABLE_CONNECTION_STRING='<from step 1>' \
     MAIL_CONNECTION_STRING='<from step 2>' \
     MAIL_FROM='DoNotReply@<domain>' \
     MAIL_NOTIFY_TO='jgarcia@viispartners.com'
   ```
   `MAIL_TRANSPORT`, `LEADS_TABLE_NAME`, and `RATE_LIMIT_PER_HOUR` keep their
   defaults unless there is a reason.
4. **Application Insights** on the static web app, so `audit.*` log lines are
   readable. Without it the function logs nowhere.
5. Deploy (merge to `main`; the workflow builds `viis-site/api` as the managed
   API on Node 22) and submit the form once. Confirm: a row in the `leads`
   table, a notification in the inbox, an acknowledgement at the address you
   submitted.

Managed functions cannot use managed identity or Key Vault references, so the
connection strings live in application settings. Rotate them there.

---

## Security controls

- **Security headers + CSP** — [`public/staticwebapp.config.json`](./public/staticwebapp.config.json),
  applied by Azure SWA to every page response: `default-src 'self'`, no
  `'unsafe-inline'` for script or style (every asset is an external same-origin
  file), `connect-src 'self'`, `form-action 'self'`, `frame-ancestors 'none'`,
  `object-src 'none'`, `upgrade-insecure-requests`; HSTS, `nosniff`,
  `X-Frame-Options: DENY`, a strict `Referrer-Policy`, a restrictive
  `Permissions-Policy`, COOP and CORP `same-origin`. Global headers do not
  apply to API responses, so the function sets its own on every response.
- **Server-side validation** — zod at the API boundary; every field normalised
  to one line and capped; the website URL parsed and canonicalised; unknown
  fields never reach the schema.
- **Rate limiting** — per hashed client address per hour, in the table.
- **Honeypot** evaluated server-side only; bots receive a success and nothing
  is stored or sent.
- **No secrets in the client, none in the repo** — the API reads connection
  strings from application settings; `local.settings.json` is git-ignored.
- **No PII in logs** — hostnames and hash prefixes only.
- **Output encoding** — every submitted value is HTML-escaped before it appears
  in an email or an HTML response.
- **No third party in the lead path** — storage and mail are Azure services in
  the same subscription.

### CSP note

If you add any external resource (a booking embed, a font, an analytics tag)
you must widen the CSP in `staticwebapp.config.json` to name its exact origins.
Do not add `'unsafe-inline'`. Prefer external same-origin files, as
`audit.js` is, so the strict policy holds.

---

The policy admits Google's analytics origins, exactly as Google documents for `gtag.js`:

- `script-src https://*.googletagmanager.com` — the tag itself.
- `img-src https://*.google-analytics.com https://*.googletagmanager.com` — the pixel fallback the tag uses when `fetch`/beacon is unavailable.
- `connect-src https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com` — the collection endpoints, including the regional ones.

`style-src` stays `'self'` with no `'unsafe-inline'`: the loader is an external same-origin script and there is no inline snippet, so nothing else was loosened.


## Third-party services

**None in the browser.** No analytics, no tag manager, no chat widget, no
cookie banner, no CDN fonts. Server-side, the API uses two Azure services in
the same subscription: Azure Table Storage (lead log) and Azure Communication
Services Email (notification and acknowledgement). Any addition must be listed
here with what data it receives and why.

---

## Deployment

- **Host:** Azure Static Web Apps, `swa-viis-site` in `rg-viis-prod`. Workflow:
  `.github/workflows/azure-static-web-apps-salmon-coast-018dde90f.yml`
  (`app_location: viis-site`, `api_location: viis-site/api`, `output_location: dist`).
- **API runtime:** `node:22`, set in `staticwebapp.config.json` → `platform.apiRuntime`.
  The API is TypeScript; the deploy builds it with `npm run build`.
- **Preview URL:** https://salmon-coast-018dde90f.7.azurestaticapps.net
- **Production domain:** `viispartners.com`.
- PRs get an SWA preview environment; merges deploy production. Roll back by
  reverting the merge.

### Share image

`public/og-image.svg` is the editable source of the 1200×630 social card;
`public/og-image.png` is the rasterized version the meta tags reference. To
regenerate the PNG after editing the SVG, render it at 1200×630 with the site's
self-hosted fonts loaded and overwrite `og-image.png`.

---

## Launch checklist

Form / backend (blocking):
- [ ] Create the storage account and ACS resources; set the four application
      settings (see "Configure the form for production").
- [ ] Enable Application Insights on the static web app.
- [ ] Submit the form once in production; confirm the table row, the
      notification, and the acknowledgement.
- [ ] Connect `viispartners.com` as the ACS sender domain and publish its SPF
      and DKIM records, so the acknowledgement is authenticated mail.

Platform:
- [ ] Confirm security headers are live (`curl -I https://viispartners.com`).
- [ ] Add form-delivery monitoring (an alert on `audit.store` or `audit.notify`
      errors in Application Insights).
- [ ] **After this branch merges**, add `.gitattributes` with `* text=auto eol=lf`
      and renormalise, as its own commit. `main` is currently CRLF.
- [ ] Decide whether any privacy-conscious, cookieless analytics is wanted
      (none is installed; adding one requires a CSP update and a note here).

---

## Known limitations

- **Rate limiting is per address behind the SWA proxy.** It relies on
  `x-forwarded-for`; when absent the limit is skipped (and logged) rather than
  shared by everyone.
- **The rate counter is read-then-write.** Two simultaneous requests can both
  count as the same number. Accepted at this volume.
- **Email delivery is fire-and-forget.** The function returns once ACS accepts
  the message; a later delivery failure appears in ACS metrics, not in the
  function log.
- **Service pages** (`/websites`, `/foundations`, `/search`, `/automation`) are
  linked from the method section and do not exist until build step 7.
