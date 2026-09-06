# Claude Code — VIIS Sprint 2: Ship the Lead Capture

> **Historical.** This document predates the 2026-09-05 redesign and cites
> `ART-DIRECTION.md`, which was deleted that day (see git history). Design
> authority is now `docs/VIIS-Site-Brief.md` and `src/styles/tokens.css`; see
> `CLAUDE.md`. Nothing below is a current instruction.

Run from `~/Projects/VIIS`. Branch: `feat/pre-launch-overhaul`.

---

## How I want you to work

**Do not make assumptions.** Where this document leaves something genuinely open, stop
and ask me. When you ask, give me the options with their upsides *and* downsides — not a
recommendation dressed up as the only choice. I would rather answer three questions than
unwind three wrong guesses.

**Use the subagents.** Three are defined in `.claude/agents/`:

- `design-auditor` — run after every visual change and before calling anything done
- `form-integrity-reviewer` — run after any change to the form, its script, or its config
- `azure-swa-engineer` — for anything touching the workflow, CSP, or Azure

Delegate to them rather than self-reviewing. The failure this repo has already had is a
commit claiming a fix that the working tree had silently undone — a second pair of eyes
is the whole point.

**Commit after each numbered section.** The last sprint skipped this and left two
sections of work untracked for days. Do not repeat it.

**Read before you write:**

- `viis-site/ART-DIRECTION.md` — design source of truth, **amended 2026-08-19**, read it
  fresh rather than from memory
- `viis-site/AUDIT.md` — the pre-launch audit; items 6 and 8 are relevant again
- `.claude/skills/taste-skill/SKILL.md` — craft standard; ART-DIRECTION wins on conflict
- `BUSINESS-NEXT-STEPS.md` — the researched backend decision. Do not re-litigate it.

---

## Decisions already made — do not reopen these

| Question | Decision |
|---|---|
| Where the form lives | Homepage contact section. **No separate `/start` page.** The in-person handoff is a QR code pointing at `viispartners.com/#contact`. |
| Fields | Name, Email, Service of interest — **required**. Phone, Company, Project — **optional**. Six total, and six is the ceiling. |
| Service options | All four: Secure, Adopt, Build, Advise. |
| Backend now | Web3Forms. Free tier, 250 submissions/month. |
| Backend later | Azure Function + Microsoft Graph, per Option A in `BUSINESS-NEXT-STEPS.md`. **Sprint 3, not this one.** |
| "No form" rule | Already amended in `ART-DIRECTION.md`. The amendment is binding — read it. |

---

## 0. Unblock and snapshot

There is a stale `.git/index.lock` (0 bytes, no live git process). Confirm nothing is
actually running, remove it, then commit the currently-untracked work as a restore point
before changing anything. That snapshot includes `ContactForm.astro`, `inquiry.js`,
`404.astro`, the OG image, `robots.txt`, `sitemap.xml`, and `staticwebapp.config.json` —
all of it is untracked right now and one bad `git checkout` loses it.

Install the subagents:

```bash
mkdir -p .claude/agents && cp /path/to/outputs/agents/*.md .claude/agents/
```

(I'll give you the real source path — ask if I haven't.)

## 1. Fix the regression first

`src/pages/index.astro:74-76` is a flat 18-word hero support sentence. Commit `92bf9a5`
had already fixed this — split into `.hero-support-lead` / `.hero-support-sub` with a
flex stack in `global.css` — and the later uncommitted work reverted both. `AUDIT.md`
item 6 and `ART-DIRECTION.md` ("composed, not dumped… max ~9 words per line") are both
back in violation.

Restore the composed treatment. Recover it from `git show 92bf9a5` rather than rewriting
from scratch — it was reviewed and accepted once already.

Then run `design-auditor` and have it diff the working tree against every commit message
claiming a fix, to catch anything else that regressed the same way.

## 2. Change the field set

Current: Name, Email, Company, Project, Timeline.
Target: Name*, Email*, Service*, Phone, Company, Project.

- **Add** `phone` — `type="tel"`, `autocomplete="tel"`, optional, max 40. Do not add
  format masking or client-side phone validation; international formats vary enough that
  validation rejects real numbers more often than it catches typos.
- **Add** `service` — required, single select, options: Secure, Adopt, Build, Advise.
  There is a real design question here: a native `<select>` is accessible and
  zero-JS-friendly but is the one control you cannot fully style, and a styled dropdown
  will fight the "does not look like a form" rule. Radio buttons or a mono option row may
  suit the art direction better. **Ask me before you pick** — show me the tradeoff.
  Also ask whether a fifth "Not sure yet" option should exist; I have not decided, and
  omitting it may push someone to guess wrong or bounce.
- **Remove** `timeline`. It was never in the spec.
- **Make optional**: `company`, `project`. Keep `project` as the textarea — it is where a
  serious buyer tells you they are serious.
- Update `aria-required`, the client validation in `inquiry.js`, and the README contract
  to match. All three currently describe the old field set.

Run `form-integrity-reviewer` when the markup settles.

## 3. Wire Web3Forms

Endpoint is `https://api.web3forms.com/submit` with an `access_key` field. I will give you
the key — **ask me for it, do not invent a placeholder that looks real.**

The access key is designed to be publicly visible in client-side markup; that is normal
for Web3Forms and not a leak. It does mean anyone can POST to your form, which is what
the honeypot and the timing gate are for.

Delegate the config work to `azure-swa-engineer`:

- `staticwebapp.config.json` — widen **both** `form-action` and `connect-src` to include
  `https://api.web3forms.com`. Missing either one breaks submission only in production.
  Change nothing else in the CSP.
- `PUBLIC_FORM_ENDPOINT` must be set in the **workflow `env:` block**, not the Azure
  Portal. `import.meta.env` bakes at build time and the build runs in GitHub Actions —
  the Portal cannot reach it. `README.md:148-149` currently says otherwise and is wrong;
  fix the doc.
- Verify the endpoint that actually lands in `dist/index.html` after a build. Trust the
  build output, not the source.

**Flag for me, do not decide alone:** Web3Forms means a third party holds lead PII during
the interim. `BUSINESS-NEXT-STEPS.md` argues this is acceptable for launch and not
acceptable in six months. Tell me if you think anything on the page or in a privacy note
should say so while it is true.

## 4. Fix the audit findings

In severity order. These all came out of the sprint-1 audit:

1. **The fake-success absorber** (`inquiry.js:76-82`) shows "Thank you. Your inquiry has
   been received." and never submits, when the honeypot is filled or the form is
   submitted inside 3 s. A password manager populating `company_url` — `autocomplete="off"`
   is widely ignored — makes a real lead vanish behind a confirmation message. Decide
   with me how to handle it: fail visibly, log it, or lengthen the window. This is the
   single most dangerous behaviour in the current code.
2. **`novalidate`** (`ContactForm.astro:21`) contradicts `README.md:53-54`, which claims
   native validation applies without JS. Either drop `novalidate` or fix the doc. Say
   which you chose and why.
3. **Success drops focus** (`inquiry.js:117`) — removes the focused submit button from
   the DOM, dumping focus to `<body>`. Move focus to the status message.
4. **Live region set while hidden** (`inquiry.js:26-28`) — set content after unhiding,
   or the announcement may not fire.
5. **`global.css:568` `max-width: 34rem`** on `.inquiry` — off-scale, not `--measure`,
   straight onto the anti-pattern list. Use the grid or `--measure`.
6. **`global.css:661` `line-height: 1.5`** on `.inquiry-status` — the mono scale is 1.4.
7. **`form_render_ts` is empty without JS** — whatever backend consumes it needs an
   explicit carve-out or it rejects every no-JS submission. Document the contract now
   while it is fresh; sprint 3 will implement it.
8. **Verify the JSON-LD inline script** (`Layout.astro:78`) against the live CSP. It has
   no nonce or hash under `script-src 'self'`. I have not confirmed whether it is being
   blocked — check the browser console on the deployed URL, do not reason about it.

## 5. Verify

- `npm run build` clean.
- `design-auditor` run, all **seven** self-audit questions answered honestly in writing.
  A yes on any one means keep working. The seventh is new: does the form read as a boxed
  web form rather than a ruled document?
- `form-integrity-reviewer` run, no Critical findings remaining.
- Submit the form for real end-to-end and confirm the email lands. Do not mark this done
  on the basis that the code looks correct — the last version of this form looked correct
  and posted into a 404 for weeks.
- Test with JS disabled. Confirm the visitor does not lose what they typed.
- Keyboard-only pass: tab through every control, submit, confirm focus lands somewhere
  sensible on success.

## 6. Report back

- What you changed and why.
- Anything you asked me about and what I decided.
- Your seven self-audit answers, unsoftened.
- Anything still wrong that you did not fix, and why you left it.

---

## Do not

- Do not build the Azure Function. That is sprint 3.
- Do not add a seventh field. The ceiling is in `ART-DIRECTION.md` now; adding one means
  amending that file first, with me.
- Do not touch the copy in the five service sections.
- Do not add analytics, chat widgets, cookie banners, or any third-party script beyond
  the form endpoint.
- Do not loosen the CSP beyond the two directives named in section 3.
- Do not create a `/start` page. That was considered and declined.
- Do not center anything, round anything past 3px, use Inter, or introduce a second
  accent. `--brass` is spent once, on `.hero-rule`, and that is correct.
