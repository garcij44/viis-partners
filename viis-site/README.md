# VIIS Partners — website

Single-page brochure site for VIIS Partners. Astro 7, static output, no
client-side framework, no runtime third-party requests. Deploys to Azure Static
Web Apps.

Design rules live in [`ART-DIRECTION.md`](./ART-DIRECTION.md) and are enforced,
not aspirational: locked palette, three self-hosted typefaces, an 8px spacing
scale. Read it before touching anything visual.

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

| Variable               | Public? | Purpose                                             |
| ---------------------- | ------- | --------------------------------------------------- |
| `PUBLIC_FORM_ENDPOINT` | Yes     | URL the contact form POSTs to. Falls back to `/api/contact`. |

`PUBLIC_`-prefixed vars are inlined into the client bundle by Astro and are
visible in the browser **by design**. Never put a secret, key, or token in one.
See [`.env.example`](./.env.example). Real `.env` files are git-ignored.

---

## Form architecture

The contact form is the primary conversion point. It is built to work in three
layers, degrading safely:

1. **No JavaScript** — it is a plain `<form method="post" action={PUBLIC_FORM_ENDPOINT}>`.
   The browser's native validation applies and the POST still fires.
2. **Enhancement** — [`public/scripts/inquiry.js`](./public/scripts/inquiry.js)
   (a static, same-origin module so the CSP allows it with no hash/nonce) adds
   inline validation, inline submit states (idle / sending / success / error,
   no layout shift, no modal/toast), and first-pass bot friction.
3. **Backend** — not built yet. The form posts to `PUBLIC_FORM_ENDPOINT`
   (default `/api/contact`, intended as a same-origin Azure Function).

### The backend is a required, unbuilt piece

`inquiry.js` does client-side validation and two bot heuristics (a hidden
honeypot field and a submit-timing check). **These are usability and first-pass
friction only — they are not security.** Whatever receives the POST MUST, server-side:

- validate and **normalise** every field; enforce the same length caps
  (name 100, email 200, company 120, project 1500, timeline 80);
- **output-encode** any field before it is ever rendered (email body, admin UI);
- reject on filled honeypot (`company_url`) or a `form_render_ts` younger than ~3s;
- **rate-limit / throttle** submissions per IP;
- add a CAPTCHA if spam appears (insertion point is marked in `ContactForm.astro`;
  remember to add the widget's origins to the CSP — see below);
- return `2xx` on success, non-`2xx` on failure (the client shows the email
  fallback on failure);
- never log full lead PII; never expose the recipient address or credentials to
  the browser.

Until that endpoint exists, the form validates and reaches the "sending" state,
then shows the error path (which points the visitor at the mailto). It does not
fake success.

### Where leads go — decide before launch

Not yet decided. Options: an Azure Function that emails `jgarcia@viispartners.com`;
a hosted form backend (Formspree/Basin/etc.); or a Function + table storage.
Document, before launch: recipient, storage, who can access, and retention. If
you choose a **third-party** backend on a different origin, add that origin to
`form-action` and `connect-src` in the CSP (below) or the browser will block the
submission.

---

## Security controls

Implemented in this repo:

- **Security headers + CSP** — [`public/staticwebapp.config.json`](./public/staticwebapp.config.json),
  applied by Azure SWA to every response:
  - `Content-Security-Policy`: `default-src 'self'`, no `'unsafe-inline'` for
    script or style (verified — every asset is external and same-origin),
    `frame-ancestors 'none'`, `object-src 'none'`, `upgrade-insecure-requests`.
  - `Strict-Transport-Security` (2y, preload), `X-Content-Type-Options: nosniff`,
    `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
    a restrictive `Permissions-Policy`, `Cross-Origin-Opener-Policy: same-origin`,
    `Cross-Origin-Resource-Policy: same-origin`.
- **No secrets in the client** — the only env var is a public endpoint URL.
- **No third-party requests at runtime** — fonts self-hosted; no analytics, no
  tags, no CDN scripts. The CSP enforces this.
- **Honeypot + timestamp** anti-bot on the form (client + specified for server).
- **HTTPS** — provided and enforced by Azure SWA + HSTS.

Server-side controls (validation, anti-automation as appropriate to the chosen
backend, rate limiting, safe logging) are the backend's responsibility and are
specified above — they are **not** implemented here because the backend is not
built.

### CSP note

If you add any external resource (a CAPTCHA, a booking embed, a font, an
analytics tag) you must widen the CSP in `staticwebapp.config.json` to name its
exact origins. Do not add `'unsafe-inline'`. Prefer external same-origin files
(as `inquiry.js` does) so the strict policy holds.

---

## Third-party services

**None at runtime.** No analytics, no tag manager, no chat widget, no cookie
banner, no web fonts from a CDN. This is deliberate for a security practice's
own site. Any addition must be listed here with what data it receives and why.

Dev-only dependencies: `astro`, and `@astrojs/check` + `typescript` for the
type-check. No runtime dependencies ship to the browser.

---

## Deployment

- **Host:** Azure Static Web Apps. Workflow:
  `.github/workflows/azure-static-web-apps-salmon-coast-018dde90f.yml`
  (`app_location: viis-site`, `output_location: dist`, no API yet).
- **Preview URL:** https://salmon-coast-018dde90f.7.azurestaticapps.net
- **Production domain:** `viispartners.com` — not yet pointed at the app.
- PRs to the workflow's tracked branches get an SWA preview environment; merges
  deploy production. Roll back by reverting the merge (redeploys the prior build).
- Set `PUBLIC_FORM_ENDPOINT` in the SWA configuration (Portal → Configuration or
  the workflow) for production; the `/api/contact` fallback only works once an
  API is added.

### Share image

`public/og-image.svg` is the editable source of the 1200×630 social card;
`public/og-image.png` is the rasterized version the meta tags reference. To
regenerate the PNG after editing the SVG, render it at 1200×630 with the site's
self-hosted fonts loaded (any headless browser, or an SVG rasterizer that has
Fraunces + Geist Mono available) and overwrite `og-image.png`. No build-time
image dependency is added to the project.

---

## Launch checklist

Design / content:
- [ ] Owner sign-off on the **lifecycle section** wording (Define / Deliver /
      Launch) — currently structured from the brief taxonomy, placeholder prose.
- [ ] Owner sign-off on the hero support line and contact copy.

Form / backend (blocking):
- [ ] Build or connect the `PUBLIC_FORM_ENDPOINT` backend with the server-side
      controls listed under "Form architecture".
- [ ] Decide + document lead recipient, storage, access, retention.
- [ ] If the backend is a different origin, widen `form-action` + `connect-src`
      in the CSP.
- [ ] End-to-end test a real submission to the real inbox.

Platform:
- [ ] Point `viispartners.com` DNS at the SWA; confirm the managed certificate.
- [ ] Set `PUBLIC_FORM_ENDPOINT` in production config.
- [ ] Confirm security headers are live (`curl -I https://viispartners.com`).
- [ ] Add form-delivery monitoring / uptime check.
- [ ] Decide whether any privacy-conscious, cookieless analytics is wanted
      (none is installed; adding one requires a CSP update and a note here).

---

## Known limitations

- **No form backend.** The form is complete and secure on the client; it cannot
  actually deliver a lead until an endpoint exists. It shows the email fallback
  instead of faking success.
- **No server-side validation / rate limiting** in this repo — it lives with the
  (unbuilt) backend and is specified, not implemented.
- **Lifecycle copy is placeholder** pending owner wording.
- **No analytics**, so there is no conversion measurement yet. Intentional.
- The `og-image.png` must be regenerated by hand if the SVG changes (no pipeline).
