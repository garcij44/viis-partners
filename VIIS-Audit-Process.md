# VIIS Audit — Process Specification

**Internal.** This is the source of truth for what the free audit checks, how the data is collected, and where the line sits between free and paid.

**Version:** 1.0 — September 7, 2026

---

## 1. The rule

**The free audit uses exactly two inputs: a domain and an email address.** Nothing that requires credentials, delegated access, OAuth consent, or a signed agreement appears in the free tier. Ever.

> **This is the pipeline's input contract, not the intake form's field list.** The collectors consume domain and email and nothing else, so that no other submitted value can ever render into a report.
>
> The form legitimately collects more — name and business for the reply, an optional note for context. Business name in particular improves check 13, the only manual step in the pipeline, where identifying the right Google Business Profile from a bare domain is unreliable.
>
> Keep the two separate: **form fields → lead record and reviewer view. Domain and email → collector input.** PII handling rules apply to every submitted field regardless of which side it lands on.

This is not a generosity calibration. It is the line that makes the audit an unattended workflow instead of an appointment. The moment a check needs access, it needs a human, a trust relationship, and a scoping call — at which point it is a paid engagement, and pricing it as free destroys the $450 product that already exists on the rate card.

**Corollary for the website:** the current "What's Checked" list advertises Workspace configuration, license waste, backups, admin access, MFA, and orphaned accounts. None of those are externally observable. If that list reads as the free offer, it over-promises on precisely the items that are most damaging to walk back. The page needs to split into two tiers before the audit goes live.

---

## 2. Free tier — 15 checks

Severity scale for every finding: **Critical / High / Medium / Low / Pass / Not assessable.**

"Not assessable" is a first-class result, not a failure. It is the mechanism that makes the paid tier legible.

### SITE

**1. Performance**
Lighthouse via PageSpeed Insights API, mobile and desktop. Report LCP, INP, CLS, TBT, plus CrUX field data where the origin has enough traffic to have any.
Thresholds: LCP ≤2.5s pass, 2.5–4.0s warn, >4.0s fail. CLS ≤0.1 / ≤0.25 / >0.25. INP ≤200ms / ≤500ms / >500ms.
*Lab data is a simulation.* Where field data exists, lead with field data and say so — lab-only scores are the single most common way these reports get argued with.

**2. Mobile rendering**
Viewport meta presence and correctness, horizontal overflow at 360px, tap target size and spacing, font legibility, mobile Lighthouse delta vs desktop.

**3. Accessibility**
axe-core via Playwright across the crawled page set. Report violations grouped by impact (critical / serious / moderate / minor) with the specific selector and rule for each.
**Mandatory caveat in the report:** automated testing detects roughly a third of WCAG 2.2 AA issues. Keyboard traps, focus order, alt-text *quality*, and screen-reader coherence require manual review. State this plainly — an accessibility claim that overreaches is the fastest way to lose a technically literate prospect, and the exposure if someone relies on it is real.

**4. Broken links**
Full internal crawl plus external link resolution. Report 4xx and 5xx separately from timeouts. Include redirect chains longer than two hops.

**5. TLS / certificate**
Issuer, expiry date, days remaining, chain validity, SAN coverage (apex + www), TLS versions offered, HSTS header presence and max-age.
Flag: expiry <30 days = High. TLS 1.0/1.1 still offered = Medium. No HSTS = Low.

**6. Indexability**
robots.txt presence and parse, sitemap.xml presence/validity/freshness, meta robots and X-Robots-Tag noindex, canonical tag consistency, HTTP→HTTPS redirect, apex/www canonicalization, soft-404 detection.
A `noindex` on a page the business wants ranking is the highest-value finding in this whole category. Check for it explicitly.

### FOUNDATION

**7. DNS**
A/AAAA, MX, NS, TXT, CNAME records with TTLs. Nameserver count and diversity. Whether DNS is managed at the registrar or delegated to a provider. Identify the hosting provider and CDN from record targets.

**8. Email authentication**
- **SPF** — present, syntactically valid, DNS lookup count (>10 is a hard RFC failure and silently breaks delivery), and whether it terminates in `~all` or `-all`.
- **DMARC** — present, policy value, `pct`, and whether `rua` reporting is configured. **`p=none` is the single most common finding here and the easiest to explain: the record exists, it looks like protection, and it enforces nothing.**
- **DKIM** — attempt discovery across common selectors (`google`, `selector1`, `selector2`, `s1`, `s2`, `k1`, `dkim`, `mail`, `default`, plus provider-specific ones inferred from the MX). If no selector resolves, report **"not verifiable externally"** — never "missing." DKIM absence cannot be proven from outside, and asserting it is a factual error that a competent IT vendor will catch.
- **MX provider** identification and whether the domain accepts mail at all.

**9. Domain ownership posture**
RDAP lookup: registrar, creation date, expiry date, days to expiry, auto-renew status, transfer lock (`clientTransferProhibited`), DNSSEC, registrant privacy.
Flag: expiry <90 days = High. No transfer lock = Medium. Domain registered to a third party rather than the business = **Critical** — this is the "you don't own it" finding from the rate card positioning notes, and it is the most commercially useful thing this audit can surface.

### SEARCH

**10. Metadata**
Title and meta description presence, length, and uniqueness across the crawl. H1 presence and uniqueness. Open Graph and Twitter card completeness. Duplicate titles across pages.

**11. Structured data**
schema.org types present and valid. For local businesses specifically: whether `LocalBusiness` / `Organization` exists, and whether the NAP (name, address, phone) in the markup matches what is rendered on the page and what appears on the Google Business Profile. Mismatched NAP across those three surfaces is a concrete, fixable local-SEO finding.

**12. Analytics and conversion tag presence**
Detect GA4, GTM, Meta pixel, Google Ads conversion tags, call-tracking scripts.
**Report presence only.** Whether a tag *fires correctly*, whether conversions are defined, and whether attribution works are all invisible from outside. A GTM container with zero configured tags is externally indistinguishable from a fully configured one. Say exactly that in the report — it is one of the strongest arguments for the paid tier.

**13. Google Business Profile — public view**
Existence, claimed/verified indicators, primary and secondary categories, hours, photo count, review count and average, posts recency, and NAP match against the website.
**Collected by human eyeball, not API.** The Places API costs $5/1,000 requests on Essentials (10,000/month free) but field selection silently reclassifies calls to Pro at $32/1,000. At VIIS's volume the API would be free, but the manual check is also free, carries no billing-surprise risk, and produces better qualitative notes. Revisit only if audit volume exceeds ~20/month.

### RISK — externally visible only

**14. Vendor lock-in and control**
Platform/CMS detection, host, CDN, registrar, DNS operator. Who controls each layer. Whether the business can move without the incumbent vendor's cooperation. Whether the domain, DNS, and hosting are held in accounts the business actually owns.

**15. External exposure**
Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy), server and framework version disclosure in headers, directory listing enabled, publicly reachable admin/login endpoints on default paths.

> **Scope constraint — do not violate this.** Check 15 is limited to passive observation and normal HTTP requests to paths the site itself exposes or that are conventional and unauthenticated. **No fuzzing, no credential probing, no vulnerability scanning, no requests designed to elicit errors.** Run it only on domains whose owner submitted the audit form, which is what supplies consent. Anything beyond that is unauthorized scanning, is not covered by E&O, and is not defensible regardless of intent.

---

## 3. Paid tier — what the free audit cannot see

Named in every free report, never delivered in one. These require the client to grant read access.

| Category | Check | Why it needs access |
|---|---|---|
| Foundation | Workspace / M365 configuration | Tenant admin read |
| Foundation | License waste and seat audit | Billing + directory read |
| Search | Local rank grid across the service area | Third-party tooling, per-location cost |
| Search | Search Console and GA4 performance data | Property-level delegated access |
| Search | Conversion tracking verification | Analytics property + tag manager access |
| Risk | Backup coverage and restore testing | Admin read |
| Risk | Admin account review | Directory read |
| Risk | MFA coverage | Directory read |
| Risk | Orphaned and stale accounts | Directory read |

**Offer structure — Systems Audit, $1,450.** Base covers up to 25 seats, one domain, one location; +$400 per additional 25 seats, +$350 per additional location. 50% of the fee credits against a project engagement of $2,500+ started within 90 days — project work only, never against a Care Plan. Full derivation and reasoning in the rate card §3.

**The paid tier is where remediation lives.** See §5.

**The section that sells it is not a CTA.** It is a report section titled *"What we could not assess from outside"* that lists these items by name. Precision about the blind spot is what makes the gap feel real; a call-to-action does not.

---

## 4. Data collection

Every tool below is free. Total recurring cost of the free audit: **$0.**

| Check | Tool | Cost |
|---|---|---|
| 1, 2 | PageSpeed Insights API | Free — 25,000 queries/day, 100 per 100s. No paid tier exists. API key free and recommended for automation. |
| 3 | Playwright + axe-core | Free, open source |
| 4 | Lychee (or linkinator) | Free, open source |
| 5 | testssl.sh / openssl | Free, open source |
| 6, 10, 11, 12, 15 | Own crawler (Node or Python) | Free |
| 7, 8 | dig, or DNS-over-HTTPS via 1.1.1.1 | Free |
| 9 | RDAP (rdap.org) | Free, no key, no rate limit of consequence |
| 13 | Manual browser check | Free |
| Render | Headless Chrome print-to-PDF | Free |
| Orchestration | Claude Code on existing Claude Max | $0 marginal — already paid |

**Explicitly rejected:**

- **HIBP breach data** — the $4.39/mo Core tier forbids use on behalf of third parties. MSP use requires **Pro at $379/mo minimum ($4,548/yr)**. Not worth it for one lookup per audit, and it pulls the report toward a fear-marketing register that doesn't match VIIS's voice.
- **BrightLocal / local rank grids** — $39/mo *per location*, which multiplies per client. Belongs in the paid tier or as a client-billed passthrough, never in the free audit.
- **Google Places API** — free at current volume but carries silent tier-reclassification risk. Manual check is equally free and safer.

### Pipeline shape

Each collector writes to one normalized JSON document. The report renderer reads only that document and never re-queries — so a report is reproducible from its stored input, which matters the first time a client disputes a finding.

```
{
  "audit_id", "domain", "email", "run_at", "collector_version",
  "checks": [
    { "id", "category", "name", "status",       // pass|low|medium|high|critical|not_assessable
      "evidence": {...},                         // raw tool output, verbatim
      "finding",                                 // what was observed
      "impact" }                                 // what it costs them to leave it
  ],
  "not_assessable": [...]                        // drives the paid-tier section
}
```

**There is no `remediation` field.** This is deliberate and is not an omission to be helpfully corrected later — see §5.

Two hard rules for the collector:

1. **Evidence is stored verbatim.** Every finding must be traceable to raw tool output. If a claim in the report cannot be tied to stored evidence, it does not go in the report.
2. **A failed collector is `not_assessable`, never `pass`.** A DNS timeout must never render as "no issues found." Silent failure that reads as a clean bill of health is the worst possible failure mode for this product.

### Human review gate

The agent produces a draft. It does not send. Target ~10 minutes of review per audit:

- Spot-check three findings against raw evidence
- Confirm nothing reads as a security assertion the collection method can't support
- Confirm the accessibility caveat is present
- Confirm no check that failed to run is rendering as a pass

---

## 5. Language rules

### The remediation rule

**The free report contains no remediation guidance. None.** Not fix steps, not configuration values, not tool recommendations, not "you'll want to set this to `p=reject`."

Each finding does exactly two things: **names what is broken**, and **states what it costs the business to leave it broken**. Then it stops.

This is the commercial hinge of the entire product. A free report containing fix instructions is a work order the prospect forwards to their existing web developer or IT vendor, and VIIS has performed unpaid scoping for a competitor. A report that names problems precisely and stops is a reason to call VIIS. Remediation is what the Systems Audit sells.

The pressure to be helpful here is real and should be resisted every time. Naming a problem precisely *is* the help.

### Quantifying impact without exaggeration

- **Never invent a dollar figure.** A fabricated number is the easiest thing for a skeptical prospect or their IT vendor to discredit, and it discredits the accurate findings alongside it.
- **Prefer mechanism over money.** "This page carries a `noindex` tag, so it cannot appear in search results at all" beats any estimated traffic figure and cannot be argued with.
- **Cite research as correlation, never as promise.** Performance and conversion are genuinely correlated; that is not a guarantee for a specific site.
- **Respect the local market.** Impact framing calibrated to California or New York does not transfer to San Antonio. If a figure depends on local rates, say so rather than importing a coastal number.
- **Some findings need no quantification at all.** "Your domain is registered to a third party and cannot be moved or recovered without their cooperation" is complete as written.

### General

- **Never call the free audit a security audit.** It observes external signals. E&O exposure and expectation-setting both argue for precision here.
- Findings state what was observed, then what it costs. No severity theater.
- No fear framing. Jadrin's voice is plain and professional; breach-panic copy reads as the opposite and is what every MSP already sends.
- Where a check is inconclusive, say inconclusive. "Not verifiable externally" is more credible than a guess, and it reinforces the paid tier at the same time.
