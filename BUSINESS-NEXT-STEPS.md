# VIIS — Lead Capture & DBA Filing

Two decisions, researched August 6, 2026. Neither blocks the site overhaul; the form UI
is being built against a swappable endpoint.

---

# Part 1 — Contact form backend

## The strategic point first

You are selling security judgment to owner-operators. The contact form is the first
technical artifact a prospect ever touches from you. If a lead's name, email, company,
and description of their problem gets POSTed to a third-party SaaS you don't control,
that is a live counter-example to your own pitch — and a sophisticated prospect may
notice.

That argues for the self-hosted route. But it's a real build, and a site that isn't
launched captures zero leads. So: ship on something fast, migrate when the design is
settled. The endpoint is configurable specifically so this swap is a one-line change.

## Option A — Azure Function + Microsoft Graph (recommended destination)

Your site already deploys to Azure Static Web Apps, and the free plan includes managed
Azure Functions with 1 million free executions. The form POSTs to a function in the same
app, on the same domain, which sends via Microsoft Graph as `jgarcia@viispartners.com`.

**Cost:** $0 on top of what you already pay. The mail goes out through the M365 Business
Basic license you hold.

**Why this is the right destination:** no third party ever sees a lead. The data path is
browser → your Azure tenant → your mailbox. Nothing to disclose, nothing to put in a
vendor register, and it's a thing you can point at in a sales conversation.

**The security detail that matters:** `Mail.Send` as an *application* permission grants
the ability to send as **any mailbox in the tenant**. It is one of the most commonly
over-granted permissions in M365. Do not stop at the app registration:

1. Register the app in Entra ID, grant `Mail.Send` (Application), admin-consent it.
2. Create a mail-enabled security group in Exchange Online containing only
   `jgarcia@viispartners.com`.
3. In Exchange Online PowerShell:
   `New-ApplicationAccessPolicy -AccessRight RestrictAccess -AppId <client-id> -PolicyScopeGroupId <group> -Description "VIIS site contact form"`
4. Verify with `Test-ApplicationAccessPolicy -Identity jgarcia@viispartners.com -AppId <client-id>`
5. Prefer certificate auth over a client secret. If you use a secret, put it in Key Vault
   referenced from SWA app settings — not in a plain application setting, and never in
   the repo.

Microsoft is moving these policies toward RBAC for Applications in Exchange, so check
whether the RBAC path is the better implementation by the time you build it.

**Effort:** a few hours, most of it in Entra and Exchange PowerShell rather than code.

## Option B — Web3Forms or similar (recommended for launch)

Free tier is 250 submissions/month with unlimited forms and hCaptcha included — far more
than you will see. Formspree's free tier is only 50/month, and its first paid tier is
$15/month for 200, which is poor value at your volume. Formspark sells 250 submissions
as a one-time total rather than monthly.

**Cost:** $0.
**Effort:** minutes. Change one environment variable.
**Tradeoff:** a third party holds your lead data. Acceptable for launch, not where you
should still be in six months.

## Option C — Azure Communication Services Email

Sends without touching your M365 tenant at all. Priced per message, effectively pennies.
Worth considering only if you later want transactional mail (proposal delivery, invoice
notifications) separated from your personal mailbox. Skip for now.

## Recommendation

Launch on **B**, build **A** as the second sprint. Add Cloudflare Turnstile in front of
either — it's free, invisible to real users, and cheaper than reading spam.

One more thing regardless of backend: forward every submission into somewhere you'll
actually work it. A lead sitting in an inbox you check between client sessions is a lead
you lose. Even a Microsoft List or a pinned Outlook folder with a follow-up flag beats
an unstructured inbox.

---

# Part 2 — Texas DBA for "VIIS Partners"

## What you need and why

Your legal entity is **VIIS LLC**. You are about to operate publicly as **VIIS Partners** —
it's the domain, it's the email, it will be on the site and on proposals. Under Texas
Business & Commerce Code § 71.103, an LLC regularly conducting business under a name
other than its legal name **must** file an assumed name certificate. This isn't optional
paperwork; §§ 71.201–71.203 carry both civil and criminal penalties for not filing.

Practically, you also need it to accept a check made out to "VIIS Partners" and to put
that name on the business account you're opening.

## The filing

**Form 503 — Assumed Name Certificate**, filed with the **Texas Secretary of State only**.

Since HB 3609 (effective September 1, 2019), the county-level filing requirement was
eliminated for LLCs. **You do not file anything with Bexar County.** A lot of DBA guidance
online is still pre-2019 and will tell you otherwise.

| | |
|---|---|
| Form | [Form 503 (PDF)](https://www.sos.state.tx.us/corp/forms/503_boc.pdf) |
| Fee | $25 (+2.7% statutory convenience fee if paid by credit card) |
| Where | SOSDirect online, or mail **in duplicate** to P.O. Box 13697, Austin, TX 78711-3697 |
| Duration | Up to 10 years — take the full 10 |
| Renewal | File a new certificate within 6 months of expiration |

### How to fill it out

- **Item 1 — Assumed name:** `VIIS Partners`. This differs from your legal name, so it
  will not be rejected. (A Form 503 gets rejected if item 1 exactly matches the legal name.)
- **Item 2 — Entity name:** your exact legal name as it appears on the certificate of
  formation. Pull it from your filed formation document rather than from memory.
- **Items 3–4:** Limited liability company; include your SOS file number to speed processing.
- **Item 5 — Jurisdiction:** Texas.
- **Item 6 — Principal office address:** ⚠️ **see the flag below before you write anything here.**
- **Item 7 — Duration:** 10 years.
- **Item 8 — Counties:** check **All**. You are not limiting yourself to Bexar — the
  Seattle/California track and any remote client would sit outside it.

### ⚠️ The address decision — resolve this before filing

Your project memory already flags that using your home address as registered agent puts
it into public record, and you noted that as a cleanup item given your security
background. **Form 503 is a second public record with the same problem**, and there is
**no amendment or correction procedure** — if the address changes materially you have to
file an entirely new certificate.

So sequence it: sort out a commercial mail address or registered agent service *first*,
then file Form 503 once with the address you actually want permanently public. Doing it
in the other order means paying $25 twice and leaving the home address in the record
anyway.

### What this filing does not do

Filing an assumed name is a **notice filing only**. Per TBCC § 71.157 it does not
establish priority in the name, and the Secretary of State does not check it against
anything already on file. It confers no trademark rights and no protection against
someone else using "VIIS Partners."

That connects directly to the trademark clearance item already on your list — Classes 9,
35, and 42, with the one existing Class 5 filing (dietary supplements) that appears
non-conflicting. Filing the DBA does not advance that at all. If the name matters to you
long-term, the clearance opinion is the thing that protects it.

*Not legal advice — the clearance opinion and the entity questions belong with your
attorney, and anything touching tax treatment belongs with the CPA.*

### Timing note

The Texas SOS posted a maintenance window: **SOSDirect and SOSUpload are down Friday,
August 7 at 6:00 p.m. through Sunday, August 9 at 12:00 p.m.** If you want to file
online this week, do it today or wait until Sunday afternoon.

---

## Suggested order

1. Decide the public business address (blocks the DBA filing)
2. File Form 503 — $25, ~10 minutes once the address is settled
3. Add "VIIS Partners" to the business bank account once the certificate comes back
4. Launch the site on the Web3Forms endpoint
5. Build the Azure Function + Graph backend and migrate
6. Trademark clearance with the attorney — separate track, not urgent, not free

## Sources

- [Form 503 — Instructions for Assumed Name Certificate, Texas SOS](https://www.sos.state.tx.us/corp/instructions/503.shtml)
- [Form 503 (PDF)](https://www.sos.state.tx.us/corp/forms/503_boc.pdf)
- [Name Filings FAQs, Texas SOS](https://www.sos.state.tx.us/corp/namefilingsfaqs.shtml)
- [Azure Static Web Apps pricing](https://azure.microsoft.com/en-us/pricing/details/app-service/static/)
- [Microsoft Graph permissions reference](https://learn.microsoft.com/en-us/graph/permissions-reference)
- [Restricting Mail.Send to a single mailbox — Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/5947342/restricting-access-for-mail-send-permission-to-sin)
- [Control Graph Mail.Send Permission with RBAC for Applications](https://office365itpros.com/2026/02/17/mail-send-rbac-for-applications/)
