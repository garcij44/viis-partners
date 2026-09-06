# VIIS Partners — Website Redesign Brief

**For:** Claude Code
**From:** VIIS business-management Project
**Date:** September 5, 2026
**Target:** viispartners.com — Astro, deployed as an Azure Static Web App
**Reference sites:** [canopyseo.com](https://canopyseo.com) · [simeon.sh](https://simeon.sh) (screenshots supplied; use the screenshot-design skill)

---

## 0. What this site has to do

Referrals are being sent to this site and it isn't good enough to convert them. That is the entire problem.

The homepage is **VIIS's first portfolio piece**. It is simultaneously the pitch for website builds, the proof of the SEO service, and a working example of the lead-capture system VIIS sells. A weak site is a negative case study. Build it as if a prospect will judge the whole company on it, because they will.

**Primary conversion:** free audit request (form).
**Secondary conversion:** book a call to walk through audit results.

Do not build a "contact us" site. Build a site whose job is to produce audit requests.

---

## 1. Design direction

### What to take from the references

**From Canopy:** the green gradient field behind the hero fading into near-black; serif display against sans body; the reframe section placed before any feature content; the free-tools section; the comparison table; generous vertical rhythm.

**From Simeon:** monochrome restraint everywhere the accent isn't doing a job; monospace for eyebrows, labels, and data; the four-up capability row directly under the hero; one product artifact as the hero centerpiece; the closing CTA that restates the hero verbatim.

**From neither:** SaaS pricing tables with numbers, integration logo grids, free-trial mechanics. VIIS is a services firm.

### Palette

Dark theme. The green is an accent and a hero field — it is not a brand takeover.

```css
--ink:            #121319;  /* page ground */
--surface:        #171922;  /* cards, lifted panels */
--surface-2:      #1D202A;  /* nested/hover */
--cream:          #ECE7DB;  /* primary text, warm off-white */
--cream-dim:      #A8A49B;  /* secondary text */
--cream-faint:    #6E6B65;  /* tertiary, captions */
--hairline:       rgba(236, 231, 219, 0.08);

--accent:         #2F7F5E;  /* jade — buttons, links, active states */
--accent-bright:  #46A57C;  /* hover, small highlights */
--accent-dim:     #7BA894;  /* eyebrow labels, muted marks */
--accent-field-a: #0F1F19;  /* hero gradient top */
--accent-field-b: #121319;  /* hero gradient bottom (= ink) */
```

**Why this green and not Canopy's.** Canopy's emerald is cool; `#ECE7DB` is a warm cream. Cool green against warm cream fights. `#2F7F5E` is pulled slightly yellow so it agrees with the cream and with Fraunces, which is a warm typeface. Keep the cream, warm the green — not the other way round.

Verify contrast: cream on ink, cream on accent, and `--cream-dim` on ink must all clear WCAG AA (4.5:1 body, 3:1 large). Fix by adjusting the cream steps, never by brightening the green past `--accent-bright`.

### Typography

Three roles, no more.

| Role | Face | Use |
|---|---|---|
| Display | **Fraunces** | h1, h2, section headlines. Optical size high, weight ~400–500. Never for body. |
| Body | **Geist** | paragraphs, list items, buttons, nav |
| Utility | **Geist Mono** | eyebrow labels, table headers, data, captions, the audit-report artifact |

Eyebrow labels: Geist Mono, uppercase, ~0.72rem, letter-spacing ~0.12em, `--accent-dim`. Both reference sites do this; it's the cheapest way to make a page look considered.

Hero h1 clamps roughly `clamp(2.6rem, 6vw, 4.4rem)`, line-height ~1.05, and must not exceed two lines on desktop.

### Layout rules

- Content max-width **1120px**; text columns never exceed **68ch**.
- Section vertical padding: **160px** desktop, **96px** tablet, **72px** mobile. The references feel calm because of space, not decoration.
- **One idea per section.** If a section can't state whether it is the offer, proof of the offer, or the next step, cut it.
- One accent per section. One image per section.
- Cards: `--surface`, 1px `--hairline`, radius 12px, no drop shadows.
- Motion: fade-up on scroll intersection only, 300ms, respect `prefers-reduced-motion`. No parallax, no counters, no carousels.

### Anti-noise rules

The stated fear is an ugly, noisy site. Noise comes from indecision, not decoration. Enforce:

- No stock photography of people at laptops.
- No icon on every heading — icons only in the four-up row.
- No more than two font sizes per section.
- No gradient outside the hero field.
- Nothing blinks, bounces, auto-plays, or counts up.

---

## 2. Page structure

Single long homepage, plus four service pages. Sections in this order.

### 1 — Hero

Green gradient field (`--accent-field-a` → `--accent-field-b`), fading to flat ink by the section end.

- **Eyebrow:** `TECHNOLOGY CONSULTING · SAN ANTONIO`
- **H1:** Your website, and the systems that hold it up.
- **Subhead (one paragraph, ≤45 words):** A site that loads slowly. Email landing in spam. A Google Workspace nobody ever configured. DNS records missing since the last vendor. VIIS builds the website and fixes what's underneath it — then stays on to keep it working.
- **Trust line** (mono, small, with a small accent dot): `Free audit · No obligation · Results in 3 business days`
- **Primary CTA:** `Get your free site audit`
- **Secondary CTA:** `See the work`
- **Artifact:** a real audit report page, rendered as the hero image — the way Canopy shows its editor and Simeon shows its dashboard. This is the most important asset on the page. It makes the free offer tangible before anyone clicks and doubles as proof of the SEO service.

### 2 — Four-up capability row

Directly under the hero, on flat ink. Mono label, one-line heading, two-line description. Icons here only.

1. **Build it right** — A fast, accessible site you own outright. No vendor lock-in, no rented platform.
2. **Fix the foundation** — DNS, email authentication, Google Workspace, licences, security. The parts nobody audited.
3. **Get found** — Local search, Google Business Profile, technical SEO, and content that ranks for what people actually type.
4. **Automate the repetitive** — Lead capture, follow-up, reporting, and the workflows that eat your week.

### 3 — The reframe *(the most important section on the page)*

This is Canopy's "The new search" slot. It teaches the prospect something that makes VIIS the obvious answer, and it converts a generalist service list into a diagnostic method.

- **Eyebrow:** `WHAT WE USUALLY FIND`
- **H2:** The website is rarely the problem.
- **Body:** Nearly every site we're asked to fix is sitting on something broken. Email authentication that was never set up, so invoices land in spam. DNS records pointing at a vendor the business left two years ago. A Google Workspace running on defaults, with no security, no shared drives, and licences nobody uses. The site gets blamed because the site is the part you can see.
- **Closing line:** We look underneath first. That's usually where the money is going.
- **Visual:** a short list of real finding types in Geist Mono — `SPF/DKIM/DMARC missing` · `Orphaned DNS records` · `Workspace on defaults` · `No conversion tracking` · `Unclaimed Business Profile` · `Paying for licences nobody uses`. Restrained, no icons, no colour except accent bullets.

### 4 — The method (four service lines)

Present as **one path, not four doors.** Vertical sequence with a connecting rule, each linking to its service page.

- **Eyebrow:** `THE METHOD`
- **H2:** Each step comes out of the one before it.

**Websites** — Design and build on Astro, fast and accessible, deployed to infrastructure you own. Migration off rented platforms. You keep the code, the domain, and the hosting account.

**Foundations** — Domain, DNS, email authentication, Google Workspace and Microsoft 365, security settings, licence audit, backups, access control. The layer every website depends on and almost nobody maintains.

**Search** — Technical SEO, local search, Google Business Profile, analytics and conversion tracking, and ongoing content. Client funds their own campaigns and ad spend directly; VIIS runs the work.

**Automation** — Lead capture and routing, follow-up sequences, reporting pipelines, and AI-assisted workflows built on the stack you already pay for.

Close the section with the connective line: *Most clients start with a website. What we find while building it is usually where the rest of the work comes from.*

### 5 — Proof

- **Eyebrow:** `PROOF`
- **H2:** Every audit ships with a report.
- Show a **real audit report** — findings, severity, and what each one costs in plain language. Canopy's quality-report receipt is the pattern: the deliverable proves the service.
- Beneath it, the client outcome. **Client name requires written permission before publishing — confirm first, and use "a San Antonio medical practice" until you have it.**
  > A San Antonio medical practice was paying $499 a month to the website service bundled with their records vendor. They got a basic site, then stopped getting replies. We rebuilt it, moved them onto infrastructure they own, and found a half-configured Workspace and missing DNS records along the way. They now own the site and have someone who answers.
- **No invented metrics.** No percentages, no "3x traffic," no fabricated case-study numbers. There are no paid-results claims to make yet and making them is the fastest way to lose credibility with a referral who can check.

### 6 — Comparison

Canopy's structure, VIIS's honest columns.

| | **VIIS** | **Bundled vendor** | **Template DIY** | **Agency retainer** |
|---|---|---|---|---|
| Who owns the site | You | They do | You | Varies |
| After launch | Maintained | Replies stop | Your problem | Billed hourly |
| DNS, email, Workspace | Included in scope | Out of scope | Out of scope | Usually out of scope |
| When something breaks | Named person responds | Ticket queue | Forum search | Account manager |
| Cost of leaving | Take everything | Rebuild from zero | — | Rebuild from zero |

Keep it factual and unsmug. The table should read as orientation, not as an attack.

### 7 — Packages *(named tiers, no numbers)*

Three cards. What's included, who it's for, no pricing. CTA on each: `Talk it through`.

**Build** — For a business that needs a real site and wants to own it. Design, build, migration, launch, and the foundation work found along the way.

**Care** — For a business that has a site and needs it to keep working. Hosting, monitoring, backups, updates, small changes, and a named person who answers.

**Partner** — For a business treating VIIS as its technical lead. Everything in Care, plus search, automation, systems management, and defined project capacity each month.

Footer line: *Pricing is quoted after the audit, against what you're paying now.*

> **Note for the business Project, not the site:** these names must be reconciled with the rate card, which currently lists Watch / Care / Growth / Partner and a $299 tier that no longer matches what VIIS sells.

### 8 — The audit

Its own section, styled like Canopy's Toolkit — this is the lead magnet and it needs to look like a product, not a sales call.

- **Eyebrow:** `FREE`
- **H2:** A free audit of your site and the systems under it
- **Subhead:** A 20-point audit of your website and the systems underneath it. We run it, write it up, and send you the report. No obligation, and you keep the report whether or not you hire us.
- **What's checked** (four groups, mono labels):
  - **Site** — speed, mobile, accessibility, broken links, SSL, indexability
  - **Foundation** — DNS records, SPF/DKIM/DMARC, domain ownership, Workspace configuration, licence waste
  - **Search** — Google Business Profile, local visibility, metadata, schema, analytics and conversion tracking
  - **Risk** — backups, admin access, MFA, orphaned accounts, vendor lock-in
- **Form fields:** name, business name, email, website URL, *"what's bothering you about it?"* (optional, one line). Nothing else — every extra field costs conversions.
- **CTA:** `Get your free site audit`

**Delivery constraint — build this before promoting it.** The audit must be a templated, partly automated process with a fixed checklist and a report template. At 20 hours a week, an unbounded manual audit will consume the month if ten referrals convert. The automation is reusable across every future client, so it's delivery infrastructure, not overhead.

**Speed to lead:** requests must trigger an immediate acknowledgement and notify Jadrin at once. Response inside the hour is the differentiator this whole positioning rests on.

### 9 — FAQ

Accordion. Objection handling and SEO surface — both references run long FAQs for exactly this reason. Cover at minimum:

- What does a website cost?
- Do I own the site?
- What if I already have a website?
- Do you work with businesses outside San Antonio?
- Do you manage Google Workspace and Microsoft 365?
- Do you run ads?
- What happens after launch?
- How fast do you respond when something breaks?
- Who owns the domain and hosting accounts?
- Do you work with medical or regulated businesses?

On the last one: state that VIIS builds forms that collect non-clinical contact information only and does not handle patient records, so no BAA is required between the parties. Accurate, reusable, and a trust builder. Do **not** position VIIS as a HIPAA or healthcare specialist.

### 10 — Closing CTA

Restate the hero verbatim on the green field. Same headline logic, same button text, same trust line. Both references repeat the identical CTA rather than varying it — consistency converts, variety dilutes.

---

## 3. Service pages (SEO surface)

Four pages, one per service line, linked from the method section: `/websites`, `/foundations`, `/search`, `/automation`.

Each page: hero, the problem it solves, what's included, what it looks like in practice, FAQ specific to that service, same audit CTA. Distinct `<title>` and meta description per page — never a shared template.

These exist to rank, not to navigate. This is also VIIS demonstrating the SEO service on its own site, which is the most defensible proof available before there are client results.

Later additions once the four are live: San Antonio local landing pages, and comparison pages in the pattern Simeon uses in its footer.

---

## 4. Technical requirements

- **Astro**, static output, existing repo, deployed as an Azure Static Web App.
- **Lighthouse ≥ 95** on performance, accessibility, best practices, SEO. The site sells SEO; a mediocre score is disqualifying and a prospect can check it in thirty seconds.
- **Fonts self-hosted** (Fraunces, Geist, Geist Mono) — woff2, `font-display: swap`, preload the display face only.
- **Semantic HTML**, one `<h1>`, correct heading order, visible focus states, keyboard-navigable accordion and form.
- **Structured data:** `LocalBusiness` / `ProfessionalService` with San Antonio address and service area, plus `FAQPage` on the FAQ.
- **Meta:** unique title and description per page, Open Graph and Twitter cards, `sitemap.xml`, `robots.txt`, canonical URLs.
- **Analytics:** GA4 plus Search Console, and conversion tracking on the audit form. VIIS's own site must demonstrate the tracking it sells.
- **Form handling:** Azure Function or Power Automate endpoint → lead log → immediate autoresponder → notification to Jadrin. Honeypot field for spam; no CAPTCHA.
- **Contact:** jgarcia@viispartners.com. Sign-off and legal entity name render as **VIIS, LLC (d/b/a VIIS Partners)** until the Texas assumed-name filing is complete.
- **Responsive:** 375 / 768 / 1440 verified. No horizontal scroll at any width.
- **Dark theme only** is acceptable for this design — but set `color-scheme` and paint an explicit background so nothing inherits.

---

## 5. Voice

Plain professional. Concrete over clever.

**Banned:** unlock, elevate, seamless, empower, transform, leverage (as a verb), robust, cutting-edge, in today's digital landscape, we're passionate about, solutions provider.

**Wanted:** short sentences, specific nouns, real examples. "Email landing in spam" beats "communication reliability issues." Say what breaks and what it costs.

Every claim on this site must be defensible to a referral who calls and asks about it. Nothing about advertising performance, traffic multiples, or results VIIS has not produced.

---

## 6. Build order

1. Design system — tokens, type scale, spacing, base components. Verify contrast.
2. Hero and closing CTA (they share a treatment).
3. Reframe and method sections — the strategic core.
4. The audit section and a working form end-to-end.
5. Proof, comparison, packages.
6. FAQ, structured data, meta.
7. Four service pages.
8. Lighthouse, accessibility, and responsive passes.

**Blocking dependency:** section 5 needs a real audit report to exist, since it's both the hero artifact and the proof. Produce one against a real site — Athlon is available — before the page can be finished.
