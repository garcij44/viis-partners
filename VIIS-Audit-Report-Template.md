# VIIS Website & Domain Audit — Report Template

**Internal specification.** This defines the structure and language of the free audit report. The renderer builds this from the normalized JSON in `VIIS-Audit-Process.md` §4.

**Version:** 1.0 — September 7, 2026

---

## Hard rules

1. **No remediation.** No fix steps, configuration values, tool names, or recommended settings. Name the problem, state the cost, stop. (`VIIS-Audit-Process.md` §5)
2. **No invented numbers.** Mechanism over money. No dollar figure appears unless it comes from the client's own visible pricing or a cited source.
3. **A check that failed to run renders as "not assessed," never as a pass.**
4. **Every rendered claim traces to stored evidence.** If the JSON has no evidence for it, it does not appear.
5. **The words "security audit" never appear.**

---

## Structure

### 1. Cover

Business name · domain · date · "Website & Domain Audit" · VIIS Partners mark.

No score. No grade. No letter.

> **On scores:** a single composite number is what every free tool produces, it invites argument about methodology instead of attention to findings, and a mediocre score reads as an insult while a good one ends the conversation. Lead with findings.

### 2. Summary

Three to five sentences of plain prose. What was checked, how many findings by severity, and the two or three things that actually matter. Written for the owner, not their IT vendor.

Then a severity tally:

| Severity | Count |
|---|---|
| Critical | |
| High | |
| Medium | |
| Low | |
| Passed | |
| Not assessed | |

### 3. What matters most

The top three findings by severity, expanded. This is the section that gets read. Everything after it is reference.

### 4. Findings by category

SITE → FOUNDATION → SEARCH → RISK. Within each, ordered by severity descending. Passes listed compactly at the end of each category — they matter, but they are not the story.

### 5. What we could not assess from outside

The paid-tier section. Rendered from `not_assessable[]`.

Opens with a plain statement that these items require read access and cannot be determined from a domain and email address, then names each one specifically. Closes with the Systems Audit offer and price.

**Specificity is what sells here.** "We can also do a deeper audit" sells nothing. "We cannot see whether multi-factor authentication is enabled on your administrator accounts, whether your backups have ever been restore-tested, or how many former employees still have active logins" makes the gap real.

### 6. Method and limits

What was run, when, and what the results do not cover. Explicitly:

- Automated accessibility testing detects roughly a third of WCAG 2.2 AA issues.
- Lab performance data is a simulation; field data is reported where available.
- Tag *presence* was detected; whether tags fire correctly is not observable externally.
- DKIM was probed across common selectors; a negative result means not found, not absent.
- This is not a security assessment or a penetration test.

Putting limits in writing is a credibility move, not a hedge. It is also what keeps the report defensible.

---

## Finding format

Every finding renders as:

```
[SEVERITY]  Short declarative title

What we found.
  One or two sentences. Observed fact, with the specific value.

What it costs you.
  One or two sentences. Mechanism, not invented money.
```

No third block. The absence is the product.

---

## Worked examples

**Correct:**

> **HIGH — Your domain accepts forged email**
>
> **What we found.** Your DMARC record is published with a policy of `p=none`. The record exists but instructs receiving mail servers to take no action on messages that fail authentication.
>
> **What it costs you.** Anyone can send email that appears to come from your domain, and recipients' mail systems have been told not to reject it. For a business that sends invoices or booking confirmations, the exposure is customers acting on a message you did not send.

Names the problem exactly. Says why it matters concretely. Does not say `p=quarantine`, does not explain DNS records, does not mention reporting addresses.

**Correct:**

> **CRITICAL — You do not own your domain registration**
>
> **What we found.** `example.com` is registered to a third-party organization rather than to the business.
>
> **What it costs you.** You cannot move, renew, or recover this domain without that party's cooperation. If the relationship ends badly, your website and every email address on this domain go with it.

No dollar figure. None is needed.

**Wrong — leaks remediation:**

> ~~Your DMARC policy is set to `p=none`. Update it to `p=quarantine` and add a `rua` reporting address, then move to `p=reject` after monitoring for 30 days.~~

That is a work order. Their IT vendor executes it in ten minutes and VIIS is never called.

**Wrong — invents a number:**

> ~~Your 6.2s load time is costing you approximately $18,000 per year in lost revenue.~~

Unsupportable, trivially challenged, and it contaminates every accurate finding in the report.

**Right version of the same finding:**

> **HIGH — Your site takes 6.2 seconds to become usable on mobile**
>
> **What we found.** Largest Contentful Paint measured 6.2s on mobile. Google treats anything above 2.5s as poor.
>
> **What it costs you.** Most visitors arriving from a phone leave before your page finishes rendering. Site speed and conversion are consistently correlated in published research, though the size of the effect varies by industry and market.

---

## Tone

Per project memory: plain, professional, no jargon-heavy or AI-sounding construction. The reader is a business owner who is not technical and is not stupid.

- No fear framing. This is the register every MSP already sends and it reads as sales.
- No exclamation, no urgency language, no "act now."
- Technical terms get defined inline once, in a clause, without condescension.
- Say "we found" and "we could not determine." First person plural, direct.

---

## Rendering

Single-column HTML → headless Chrome print-to-PDF. VIIS art direction: deep ink `#121319`, warm off-white `#ECE7DB`, Fraunces display, Geist body, Geist Mono for measured values, record contents, and domain names.

Severity is communicated by label and weight, not by red/amber/green. A wall of red badges is the aesthetic of an automated scanner, which is the thing this report needs not to look like.

Footer on every page: business name, domain, run date, and `VIIS, LLC (d/b/a VIIS Partners)` with jgarcia@viispartners.com.
