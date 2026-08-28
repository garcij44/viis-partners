# VIIS Site — Pre-Launch Audit

Audited against `ART-DIRECTION.md` and the `taste-skill` / `redesign-skill` standards
now installed at `.claude/skills/`. Ordered by severity. Nothing here requires a
rewrite — the foundation is sound and the art direction is unusually disciplined.

---

## Blockers (fix before pointing the domain)

### 1. `.section` has no bottom padding — content collides with the next hairline
`global.css:292` sets `border-top` and `padding-top: var(--sp-8)` but never a
`padding-bottom`. Combined with the `p { margin: 0 }` reset, the last line of each
service paragraph sits flush against the next section's 1px rule. Zero gap.

This is exactly the failure `ART-DIRECTION.md:71` warns about ("watch CSS specificity
between section- and element-level selectors so section padding isn't silently
cancelled"). The whitespace is doing most of the work on this design, and it's missing
in five places.

**Fix:** `padding-block: var(--sp-8)` on `.section`, `var(--sp-6)` at the 640px
breakpoint. Then re-check the rhythm — with symmetric padding the gap between two
sections becomes 256px, which may be one step too generous. Consider `--sp-8` top /
`--sp-7` bottom.

### 2. No social / link-preview metadata
`Layout.astro` has `description` and nothing else. No `og:title`, `og:description`,
`og:image`, `og:url`, `twitter:card`, no canonical. Every time this URL gets pasted
into LinkedIn, iMessage, or a client email, the preview renders blank.

For a practice whose entire pitch is "we are serious about your systems," a blank
unfurl is a bad first impression from a channel you don't control.

**Fix:** full OG/Twitter block plus a 1200×630 share image. The share image should be
the monochrome wordmark on `--ink` — it will be the only place the brand appears
outside the site.

### 3. `<meta name="theme-color">` missing
Mobile Safari and Chrome paint the browser chrome white before/around a dark page.
On a `#121319` site that's a visible white band. One line: `<meta name="theme-color"
content="#121319">`.

---

## Craft gaps (these are what separate "clean" from "expensive")

### 4. Geist Mono is not preloaded but renders above the fold
`Layout.astro:20-21` preloads Fraunces and Geist Sans. The logotype (`VIIS`, top-left,
first thing anyone sees) and `San Antonio, Texas` are both Geist Mono. It flashes to a
fallback monospace on every cold load.

The mono face is named in the art direction as **the signature**. It should not be the
one that FOUTs.

### 5. Variable fonts declared as static weights
`@font-face` for Geist and Geist Mono both declare `font-weight: 400`. These are
variable files. As declared, any attempt at 500/600 gets synthetic (faux) bold, which
looks smeared. Declare the real ranges (`font-weight: 100 900` for Geist) — this
unlocks typographic contrast you currently can't reach.

### 6. The hero support paragraph is a 45-word run-on
`ART-DIRECTION.md:76-78` is explicit: "The hero is composed, not dumped… Max ~9 words
per line." The `<h1>` is composed correctly. The paragraph beneath it is one
undifferentiated block running the full 64ch measure with two em-dash clauses.

Right now it restates the three service sections that appear immediately below it.
Cut it to one line, or break it into two short stacked lines with the mono face
carrying a qualifier.

### 7. There is no signature moment
`--brass (#B79663)` is specified in the art direction as an optional single accent and
is **not defined in `global.css` at all**. The result: the page is tonally correct but
completely flat — nothing anywhere earns a second look.

The restraint is right. But restraint reads as *deliberate* only when there's one
moment that proves you could have done more. Candidates, pick exactly one:
- Brass on the `.cta` hover underline only
- A single hairline rule in brass under the hero
- The mono `VIIS` logotype in brass

### 8. All five sections get identical treatment
`SECURE / ADOPT / BUILD / ADVISE` are parallel services. `ENGAGE — How we work` is a
different *category* of content (process, not offering) and currently renders in the
exact same label + heading + paragraph shell.

Flattening a category distinction is a composition miss. Give "How we work" a
different structural shape — full-width above the closing statement, or a mono
definition list, or set it after the closing line rather than in the service run.

---

## Polish

- **No skip-to-content link.** One `<a class="skip">` before the header.
- **No 404 page.** Astro will serve the Azure default, which is off-brand.
- **No `robots.txt` or `sitemap.xml`.** Trivial with `@astrojs/sitemap`.
- **`.cta-arrow` uses `&rarr;`** — a text glyph whose weight and baseline won't match
  Geist Mono. An inline SVG arrow is one more line and renders identically everywhere.
- **`--measure: 64ch`** at 18px Geist is ~63em wide. Sound per spec, but on the
  `.col-4-11` sections the measure never binds because the column is narrower. Dead
  rule in three of five places — worth confirming it's doing anything.

---

## What is already right (don't let a redesign undo these)

- Near-monochrome with no bright accent. This is the single most senior decision on the
  page and it is correctly held.
- Warm `#ECE7DB` on cool `#121319`. Never pure white, never pure black.
- Fraunces + Geist + Geist Mono, self-hosted, zero third-party requests at runtime.
- Mono label in the left margin column — a real editorial device, not decoration.
- CTA as an underlined text link with a translating arrow. No pill, no filled button.
- `prefers-reduced-motion` respected. Visible `:focus-visible` outlines.
- The copy is genuinely good and does not read as AI-generated.

---

## Suggested order

1. `.section` padding (#1) — one line, unblocks judging everything else
2. Font declarations + mono preload (#4, #5)
3. Head metadata: OG, theme-color, canonical (#2, #3)
4. Hero paragraph rewrite (#6)
5. Pick the signature moment (#7)
6. Restructure "How we work" (#8)
7. Polish pass, then re-run the six-question self-audit in `ART-DIRECTION.md:120`

---

# Open findings — sprint 2 review (2026-08-20)

Raised by `design-auditor`, `form-integrity-reviewer` and `azure-swa-engineer`
against `92bf9a5..HEAD`. Everything below is **open**; closed items are not
listed. File:line refs are against the branch head at time of review.

## Deferred by decision

### V5 — `/thanks` and `404` strand the footer over dead ink
`src/pages/thanks.astro`, `src/pages/404.astro`; no min-height on the shell
(`src/layouts/Layout.astro:90-93`, `src/styles/global.css:86-98`).

Measured at 1440×900: content ends at 614.9px, leaving **285.1px** of bare
`--ink` below the `--ink-raised` footer band. At 375 the footer ends around 58%
of viewport height and the bottom ~42% is empty ink. The raised band reads as a
stripe abandoned mid-page rather than the foot of the page.

`/thanks` is the landing page for every no-JS submit — the phone path. Not a
named rule violation, but it fails ART-DIRECTION's "would Klim ship this" and
undercuts the footer-as-quiet-system-readout intent.

### V6 — `var(--measure)` yields three different rag edges in one column
`src/styles/global.css` — `.inquiry`, `.inquiry-status`, `.inquiry-note`.

`ch` resolves against each element's own font, so one token produces three
physical widths in the same column: **763.8px** (18px Geist, clamped by the
760px column), **636.5px** (`.inquiry-note`, 15px Geist), **499.2px**
(`.inquiry-status`, 13px Geist Mono). The intro, privacy note and success
message each rag at an unrelated edge.

The letter of the rule is kept — the token is used, no bespoke value — but the
effect is three bespoke widths arrived at by accident. `--measure` is a *body*
measure; applying it to 13px mono is what produces the odd 499px.

### V7 — section rhythm measures 161–267px against a stated 96–128px

Deferred 2026-08-27 by decision: real, but changing it alters the rhythm of every
section, and that wants before/after screenshots rather than a blind edit.

Measured last-text-to-next-text at 1440: 161px across five section boundaries, 226px
engage→closing, **257px** closing→contact, 267px hero→first. At 375: 113–137px, and
211px after the hero. No boundary on the page falls inside the stated 96–128px.

Two distinct problems, and they point opposite ways:

- `.section` / `.lifecycle` use asymmetric 96/64 (`global.css`), which is deliberate and
  documented — but `padding-bottom: var(--sp-6)` = 64px is below the stated desktop
  range, and the mobile `--sp-5` = 48px is below the stated 64px mobile.
- `.closing` and `.contact` use symmetric `--sp-8`, producing the 257px void that the
  Sections comment explicitly rejects. ART-DIRECTION now records the ruling that the
  code is wrong here, not the comment.

Fixing this means deciding whether the stated range describes resulting gaps or padding
tokens, then re-deriving every section's padding from that. Not a one-line change.

### V8 — the closing statement widows `cheap.` at 320px, and no wrap mode fixes it

Logged 2026-08-27 while resolving N4. `.type-h2` is 30px Fraunces; at 320px the column is
272px, and the closing statement sets 10 lines there. Measured, all three wrap modes are
identical at that width:

| width | normal | balance | pretty |
|---|---|---|---|
| 320 | widow `cheap.` | widow `cheap.` | widow `cheap.` |
| 360 | interior 1-word line | widow `cheap.` | interior 1-word line |
| 375 | ok (2 words) | **widow `cheap.`** | ok (2 words) |
| 414 | ok (3 words) | ok (3 words) | ok (3 words) |

The switch to `pretty` was still correct — it is better than or equal to `balance` at
every width and it cleared the 375px widow that `balance` was itself causing. What remains
is measure-bound, not algorithm-bound: 30px display type in a 272px column cannot set this
copy without a short line. Fixing it means either a mobile step for `.type-h2` (the type
scale has none) or shortening the copy. 320px is not one of the named check widths.

## Open, no decision yet

### A1 — `text-transform: uppercase` leaks into accessible names
`src/styles/global.css` — `.field-label`, `.option-label`.

Chrome computes the accessible names as `"NAME"`, `"WORK EMAIL"`, `"ADOPT"`.
CSS text-transform is applied to the accname in Chrome and WebKit, and short
all-caps tokens are read letter-by-letter as initialisms by some screen readers.
The source text is already sentence case, so this is inherent to the technique
rather than a typo. **Needs a real assistive-technology check before launch**;
`aria-label` on the affected controls is the escape hatch if it reads badly.

### H2 — a tripped `botcheck` is unobservable
Nothing logs, surfaces or counts a bot rejection, and Web3Forms does not
document its response to one. Low likelihood (a checkbox is not autofilled) but
it is the one remaining path where a submission could disappear without a trace.

### H3 — CAPTCHA would break the CSP claims
Adding hCaptcha or Turnstile requires widening `script-src`, `frame-src` and
`connect-src`, and both vendors inject inline `<style>` — which would force
`style-src 'unsafe-inline'` and invalidate the "no unsafe-inline" claim in
README → Security controls. Write the tradeoff down before reaching for one.

### ART-DIRECTION clauses that need resolving
- **RESOLVED 2026-08-27.** The 2026-08-20 spacing amendment says 4px is the
  convention for "all three" including hairline widths, but every hairline is 1px
  and the CTA thickens to 2px. Reword so 4px binds `outline-offset` and
  `text-underline-offset` only.
  *What changed:* the Spacing exception was split into three separate
  conventions — offsets at 4px (`outline-offset`, `text-underline-offset`, and
  the CTA arrow's `translateX`), border and rule widths at 1px doubling to 2px,
  and a one-line `min-height` reserve. The amendment is flagged in
  `ART-DIRECTION.md` as a dated correction recording that the old clause
  described nothing real: no hairline on the site has ever been 4px.
- **RESOLVED 2026-08-27.** AD:131 "no layout shift" does not say whether it
  governs only a control's rest→focus transition or also the reveal of inline
  error text. Resolved in code for now by treating the stricter reading as
  binding.
  *What changed:* the stricter reading is now the written rule, and it binds the
  status region and inline errors as well as control states. It is enforced by a
  measured 40-character budget on both `setStatus` and `setFieldError` copy
  rather than by the reserve alone — the reserve cannot hold on its own, which is
  what the 92-character failure string had been quietly breaking. Verified 0px
  shift across all five status states at 375 and 1440. Line-number citations of
  the form `AD:131` were also replaced throughout `global.css` with clause-name
  citations, because the numbers drift on every amendment.

### Azure / platform
- **Fork PRs fail at the build guard**, not at deploy, because a public repo
  passes no secrets to fork-triggered runs. Not a regression — fork PRs could
  never deploy — but the error reads as a misconfiguration.
- **`.webmanifest` mimeType and `manifest-src 'self'` are dead config.** No
  manifest is built and no page carries `rel="manifest"`.
- **`$schema` in `staticwebapp.config.json` is not in Microsoft's documented key
  list.** Widely used in practice, but unverifiable until a deploy — and if SWA
  rejected the file it would silently ignore *all* of it. The post-merge
  `curl -I` covers this.

---

## 2026-08-27 — design-auditor, full report (post batch 1 + 2)

Run against a settled tree. `src/styles/global.css` md5 **`d73a80da03594b28c2a39ce82f5f0efb`**
at start and at end of the audit — one consistent state, nothing edited during the run.
Built clean (`astro build`, 3 pages); `dist/index.html` byte-identical to what
`localhost:4321` served, so all measurements are against the built cascade in
`dist/_astro/Layout.K0fR8ebf.css`. Geometry measured in headless Chromium, DPR 2 unless
noted.

> **Line numbers below refer to the audited state (`d73a80da…`).** `global.css` was
> edited immediately after this run to fix F1, F4, F5 and F12; it is now
> `48f4659f8489453d53995a1a8cbf01d3`, and refs into it have shifted. Refs to
> `ART-DIRECTION.md`, `index.astro` and `inquiry.js` also predate those edits.
> Status markers on each finding record what happened after the audit closed.

### Part 1 — The two prior defects: both confirmed gone

**Defect A (3px two-colour composite stroke on selection) — FIXED.** At 375, 414 and
1440 the selected label measures `box-shadow: none`, `border-bottom-width: 0px`,
`text-decoration: none`. Selection is colour (`rgb(236,231,219)`) plus `::before` at
`opacity: 1`. Nothing paints on the row's border edge.

**Defect B (selected segment floating ~42px above the row rule on wrap) — FIXED.** At
375 and 414 the row wraps to 2 lines (`Secure/Adopt/Build/Advise` at y=579, `Not sure
yet` at y=614). Selecting `Not sure yet` renders its marker at 2 × 18.19px on its own
line box. Screenshot confirms the bar sits beside the word on line 2, not above the rule.

**Error rule is a clean 2px, not a composite.** Pixel-sampled at DPR 4,
`global.css:771-774`: rest = 4 device rows of `#9a968c` (1 CSS px); error = 8 device rows
of `#9a968c` (2 CSS px). One colour, contiguous. Correct per `ART-DIRECTION.md:187`.

**Focus / selection / hover are mutually distinguishable.** Measured with `Adopt`
selected and `Secure` focused (the validation-recovery path):

| | colour | marker | outline | row rule |
|---|---|---|---|---|
| rest | dim | 0 | none | 1px dim |
| hover | paper | 0 | none | paper *(see F1)* |
| focus | paper | 0 | 1px paper @4px | unchanged |
| selected | paper | 1 | none | unchanged |
| selected+focused | paper | 1 | 1px paper @4px | unchanged |

Focus-vs-selection is legible: outline present / marker absent vs. marker present /
outline absent. `:focus` (not `:focus-visible`) confirmed working — after a real pointer
`click('[data-submit]')` with name+email valid, `activeElement` is `service-0` and it
carries `outline: 1px solid rgb(236,231,219) off 4px`. The one collision is hover, F1.

**Zero layout shift, verified.** `.option-row` height 69.38px (375/414) and 35.19px
(1440) is byte-identical across rest → selected → focused → hovered → error.
`.field-input` height 46.69px identical across rest/hover/focus/filled/error. Distance
from row top to `.inquiry-actions` is 586px before and after the error reveal, at every
width. `.field-error` at 375 is 133×18px at y=520 with the next label at y=505.4 after
scroll normalisation — 6.0px clear, no overlap.

### F1 — RESOLVED — row-rule hover contradicted `ART-DIRECTION.md:217`
`src/styles/global.css:754-756`

```css
.option-row:hover {
  border-bottom-color: var(--paper);
}
```

`ART-DIRECTION.md:217` says, verbatim: *"Hover on the row is the option's colour only;
**the row's rule does not respond**, because hover cannot be an affordance here at
all."* `ART-DIRECTION.md:194-195` reinforces it: *"The service radio row runs the same
ladder for **rest and error**, which apply to the row's single rule."* Hover is excluded
twice. Batch 1 added the row-level hover as code; Batch 2 was the documentation
reconciliation pass and did not touch this clause. Measured at 1440: hovering the row
brightens the rule to `rgb(236,231,219)`.

Secondary consequence: `.option-row` is a `div` spanning the full 760px column at 1440,
but the options only occupy 438–835px. Hovering the ~400px of empty space to the right of
`Not sure yet` brightens the rule with no control under the pointer.

**Resolved after the audit:** the row-level hover was reverted rather than the clause
amended — the dead-space behaviour made the doc the better of the two. Hover is on
`.option-label` only. The ladder table's hover row was qualified per control (text input
= rule brightens; radio = option colour only, row rule unchanged).

### F2 — OPEN — `.cta-inline` is dead in the cascade; the mailto renders 20% oversized
`src/styles/global.css:551-553` and `:555-561`; confirmed in `dist/_astro/Layout.K0fR8ebf.css`

```
.cta-inline{font-size:15px}.cta{...font-size:18px...}
```

Both are specificity (0,1,0) and `.cta-inline` is **declared first**, so `.cta`'s 18px
wins. Computed on `a.cta.cta-inline`: `font-size: 18px`. The code comment at
`global.css:550` says *"Inline mailto fallback: smaller than the standalone CTA, sits in
a sentence."* It is not smaller — it is identical to the standalone CTA, set inside a
15px `.type-small` sentence. Screenshot confirms `jgarcia@viispartners.com` visibly
overpowering "Prefer email?" beside it.

Exactly the failure `ART-DIRECTION.md:119-120` names ("watch CSS specificity between
section- and element-level selectors") and only shows in the built cascade. Also breaks
`ART-DIRECTION.md:156-158`, which specifies the mailto as a quiet plain treatment beside
the form.

### F3 — OPEN — `.hero-rule` carries an off-scale 9px bottom margin
`src/styles/global.css:376-380`

`.hero-rule` sets `margin-top: var(--sp-6)` and `border: 0` but never resets the UA `<hr>`
`margin-block-end: 0.5em`, which computes against the inherited 18px body size to **9px**.
Measured `margin-bottom: 9px` at 375 and 1440.

Effect: the gap from the brass signature hairline to the section boundary is 105px at 1440
(intended 96 = `--sp-7`) and 73px at 375 (intended 64 = `--sp-6`). `ART-DIRECTION.md:78` —
*"8px base. Use only these steps: 8, 16, 24, 32, 48, 64, 96, 128 px."* 9px is not one, and
none of the three named exceptions (4px offsets, one-line reserve, 1px/2px rules) covers
it. The site's one signature moment is the element sitting on an unintended value.

### F4 — RESOLVED — `max-width: 26ch` on `.hero-lead` never binds, and the comment claiming it does is false
`src/styles/global.css:328-332`; comment at `:325-327`

`26ch` of Fraunces resolves to **671.34px at 40px** and **928.10px at 56px**. The widest
the hero column ever gets is `.col-1-9` at `--grid-max`: **858px**. The cap is therefore
inert at 320, 375, 414, 640, 768, 810, 900, 1024, 1090, 1280, 1440 and 1920 — re-run at
every width with `max-width: none`, the line breaks are **identical in all twelve cases**.

The comment at `global.css:326-327` states: *"it is what keeps the line count from
collapsing to two very long lines on a wide screen."* That is done by `.col-1-9`, not by
the cap. `ART-DIRECTION.md:124` recorded the composition as being held by *"a `ch` measure
cap plus `text-wrap: balance`"* — half of that mechanism does nothing.

This is the same defect class the file itself corrected on 2026-08-27
(`ART-DIRECTION.md:101-105`): a clause that *"described nothing real."* Reintroduced two
clauses later. Also: `928.099px` is a new off-scale `max-width`; `ART-DIRECTION.md:65-70`
names exactly one container-width exception (`--grid-max`) and derives it, whereas `26` is
undocumented and underived.

**Resolved after the audit:** cap removed from `.hero-lead`; the CSS comment and
`ART-DIRECTION.md` both restated to say the composition is held by the column span
(cols 1–9) plus `text-wrap: balance`.

### F5 — PARTIALLY RESOLVED — hero widow persists at 810px, and the "identical output" verification was wrong at 414
`src/styles/global.css:328-332`; `src/pages/index.astro:70-72`

Measured line breaks, `text-wrap: balance` as shipped at audit time:

| width | lines | last line | interior single-word lines |
|---|---|---|---|
| 320 | 6 | `guesswork.` | `technology` (L2) |
| 375 | 6 | `guesswork.` | `technology` (L2) |
| 414 | 5 | `guesswork.` | — |
| **810** | **5** | **`guesswork.`** | — |
| 640/768/900/1024/1090/1280/1440/1920 | 3-4 | 2-3 words | — |

At 320 and 375, `balance`, `pretty`, `stable` and `auto` produce byte-identical breaks,
with and without the cap. At 40px display in a 327px column that break is copy-bound.

**But two claims in the batch note did not hold.** First, at **414px** the modes are *not*
identical: `balance` gives `…businesses that / have outgrown / guesswork.` while
`pretty`/`stable`/`auto` give `…businesses that have / outgrown / guesswork.` (`balance`
is the better of the two — but the stated verification was wrong). Second, the widow was
**not confined to ≤414px**: it recurred at **810px at 56px display**, iPad landscape, the
exact band Batch 1 set out to repair. `ART-DIRECTION.md:134` — *"No orphans or widows — no
single words hanging off the edge."* At 320/375 there is additionally an interior
single-word line (`technology`).

**Resolved after the audit, for the 801–842 band:** root cause was the display step, not
the wrap algorithm. Crossing 800 → 801 the 12-column grid engages and the hero column
collapses from **657px to 487px** — it narrows 170px as the viewport widens 1px — while
the type steps *up* to 56px, putting the largest face in the narrowest column. Measured:
56px widows from 801 to 842 and rags clean from 850 up. The `.type-h1` breakpoint moved
800px → 900px. Re-measured after: 801/810 now 3 lines with 3 words on the last; 842–1920
all 2 words. **Still open:** the ≤414px widow and the 320/375 interior `technology` line,
both copy-bound at 40px display; copy is the owner's to change.

### F6 — OPEN — four mono elements render at line-height 1.65; the scale says 1.4
`src/styles/global.css:124-143` (`.skip`), `:291-298` (`.logotype`), `:300-306`
(`.header-meta`), `:943-948` (`.footer-line`)

None declares `line-height`, so all four inherit `1.65` from `body` (`global.css:92`).
Measured computed values: `13px / 21.45px`. `ART-DIRECTION.md:53` specifies Utility/label
as `13px, 1.4` — measured on `.type-label`, `.field-label`, `.option-label` as
`13px / 18.2px`, correct. The mono voice runs at two different line-heights depending on
which selector styles it; header/footer/skip are the off-scale ones.

Additionally, `.footer-line` (`global.css:943-948`) is mono 13px at `+0.08em` in
**sentence case** ("VIIS · Jadrin Garcia, Principal · San Antonio, Texas",
`index.astro:165`). That is neither Utility/label (`+0.08em`, uppercase,
`ART-DIRECTION.md:53`) nor Utility/prose (normal tracking, sentence case, `:54-57`). A
third mono combination with no row in the scale. `ART-DIRECTION.md:276` describes the
footer's tone but not its type spec.

### F7 — OPEN — `.type-h3` and `.type-small` render with inherited tracking; the scale says `normal`
`src/styles/global.css:227-234` (`.type-h3`), `:244-249` (`.type-small`)

Neither resets `letter-spacing`, and `body` (`global.css:93`) sets `0.005em`, which
inherits **as the computed absolute value 0.09px** regardless of the child's font-size.
Measured: `h2.type-h3.section-heading`, `p.type-h3.phase-lede`, `p.field-hint.type-small`,
`p.inquiry-note.type-small`, `p.type-small.contact-alt` all compute
`letter-spacing: 0.09px`.

`ART-DIRECTION.md:50` — *"h3: Fraunces, 21px, 1.3, 500, **normal**."*
`ART-DIRECTION.md:52` — *"Small: Geist, 15px, 1.6, 400, **normal**."* `.type-h1`,
`.type-h2` and `.type-body` all restate theirs; these two do not.

### F8 — OPEN — `.field-optional` is a third use of `letter-spacing: normal` on mono, outside the licensed scope
`src/styles/global.css:625-630`

`ART-DIRECTION.md:54-57` licenses `letter-spacing: normal` on mono for the Utility/prose
row — scoped to *"status and error messages"* — and closes with *"**This is the only
licensed use** of `letter-spacing: normal` on mono."* `.field-error` (`:855`) and
`.inquiry-status` (`:881`) are covered. `.field-optional` is the word "optional" inside a
field label — not a status, not an error message. Either the clause names it or the code
is out of bounds.

### F9 — OPEN — `.cta` sets Geist Mono at 18px with no line-height; the type scale has no such row
`src/styles/global.css:555-567`

The Type section (`ART-DIRECTION.md:44-45`) assigns mono to *"eyebrows, section labels,
metadata, footer, and any figures"* and gives it exactly two rows, both 13px.
`ART-DIRECTION.md:141` separately permits the CTA to be *"a text link (mono or sans)."*
These two clauses conflict, and the code takes the second: mono at 18px, a face/size pair
with no scale row.

Compounding it, `.cta` declares no `line-height`, so the same class renders at three:
`button.cta.cta-submit` → `normal` (UA button default), `a.cta.cta-inline` → `28.8px`
(1.6 from `.type-small`), a bare `.cta` → `29.7px` (1.65 from body).

### F10 — OPEN — two sections put the mono label above the heading, not in the left margin column
`src/pages/index.astro:97` (`APPROACH`), `:121` (`ENGAGE`); `src/styles/global.css:439-442`, `:498-501`

`ART-DIRECTION.md:72` — *"Section pattern: mono label in the left margin (cols 1–3),
content in cols 4–11."* `ART-DIRECTION.md:147` — *"Section labels: mono, 13px, uppercase,
+0.08em, --paper-dim, **in the left margin column**."*

`SECURE/ADOPT/BUILD/ADVISE` and `CONTACT` follow this. `APPROACH` and `ENGAGE` stack the
label above the heading inside `col-1-9`. The CSS comments at `global.css:427-431` and
`:485-489` argue the departure well — a different layout family for a different category
of content, which is genuinely the right call — but **`ART-DIRECTION.md` states one
pattern and the page ships three**, with no clause licensing the second and third. Needs
an AD amendment, not a code fix.

### F11 — OPEN — the selection marker and focus ring hang outside the grid's left edge below 800px
`src/styles/global.css:732-743` (`left: calc(var(--sp-1) * -1)`), `:722-726` (`outline-offset: 4px`)

At 1440 the row starts at x=438 (col 4) and the marker at x=430 lands inside the 24px
column gap — invisible as a problem. At ≤800px the columns collapse, the row starts at the
24px page gutter (x=24), and the marker for whichever option is **first on its line**
renders at **x=16**, 8px outside the left edge every other element on the page holds. The
focus ring extends to x=19.

Screenshot at 375 with `Not sure yet` selected shows the bar clearly outboard of the label,
the legend, and the whole text column. Nothing else on the site hangs into the gutter.
`ART-DIRECTION.md:64` — *"12-column grid. Everything sits on it"*; `:74` — *"Left-aligned
throughout."* At 320px it lands 16px from the viewport edge.

### F12 — RESOLVED — `ART-DIRECTION.md:68-69` says "exactly `--measure`"; it is off by 3.77px

The column arithmetic itself **verifies clean** and holds in the rendered page. At
1280/1440/1920 the computed `grid-template-columns` is twelve exact `74px` tracks, and
`.col-4-11` measures **760.00px** — `8 × 74 + 7 × 24 = 760`. Confirmed.

What does not verify is the second half of the claim. `--measure` (`64ch` of Geist at
18px) resolves to **763.766px**, not 760px. The two are not equal; the column merely
clamps the wider value, which hides it. The clause warns *"Changing it silently decouples
the two, so change both or neither"* — they are already decoupled by 3.77px, and the
derivation is stated as exact.

**Resolved after the audit:** the clause now reads that 760px *clamps* `--measure`
(763.77px) to within 4px, with "they are close, not equal — do not treat the equality as
load-bearing."

### Verified-correct at this run

- **`.field-error` budget.** Longest string `Enter a valid work email.` at 25ch / 195px;
  `Choose a service.` 17ch / 133px. All three ≤25ch, all render at h18 (one line), all
  clear the next label by 6.0px at 375. Advance measured at **7.81px/char**, matching the
  documented 7.8. Budget recorded at `inquiry.js:52-56`.
- **Status budget.** Longest is `Didn't send. Use the email link below.` — 38ch / 296px,
  single line, inside the 327px region. `.inquiry-status` `min-height: 18.2px` holds at
  every state.
- **Hero `<br>` removed from markup.** No `.hero-break` in `index.astro`; the
  `@media (max-width: 640px)` suppression block is gone. The 810px "practice" orphan is
  confirmed gone (L2 is now `practice for`), and the 1280+ "guesswork." widow is confirmed
  gone (L3 is `outgrown guesswork.`).
- **Error beats hover on the same property.** `.field-group[aria-invalid='true']
  .option-row` is (0,3,0) vs `.option-row:hover` (0,2,0). `.field-input[aria-invalid=
  'true']` (`:824`) and `.field-input:hover` (`:815`) are both (0,2,0), error later —
  error wins. `.field-input:focus-visible` (`:832`) is last and beats error. Declaration
  order correct; the comment at `:776-782` is accurate.
- **`--rule` on zero interactive elements.** All nine remaining uses (`:280, 400, 434,
  460, 493, 494, 518, 533, 931`) are section/header/footer/phase dividers — decorative,
  exempt from 1.4.11. `.skip` is now `--paper-dim`.
- **Contrast, every state, recomputed.** paper/ink **15.02**, paper-dim/ink **6.28**,
  paper/ink-raised **13.91**, paper-dim/ink-raised **5.81**, brass/ink **6.67**, rule/ink
  **1.32**. Every text and every control boundary clears its threshold; the only sub-3:1
  values are `--rule` dividers, which are decorative. The ladder table at
  `ART-DIRECTION.md:180-187` is numerically accurate. One stale number: the comment at
  `global.css:133` says `--rule` is 1.19:1 on `--ink-raised`; it is **1.22:1**. Immaterial
  — both far below 3:1 and the conclusion is right.
- **Hover scoping.** Every `:hover` on the page is inside `@media (hover: hover)` — `.cta`
  (`:578`), `.option-row`/`.option-label` (`:753`), `.field-input` (`:814`). No latching
  on touch.
- **Reduced motion / forced colors.** `:950-958` covers every transitioning element;
  `.skip` has its own at `:149-153`. `:970-991` restores the full ladder with
  outline/border-style/system keywords. No ambient motion anywhere.
- **No horizontal overflow** at 320/375/414 (`scrollWidth === clientWidth`). `/thanks` and
  `/404` scan clean against the size and spacing scales at both 375 and 1440.

### Self-audit, seven questions, unsoftened

1. **Any consultancy's site, or unmistakably VIIS?** — **No.** Unmistakably VIIS. Cool ink
   + warm paper, Fraunces at 56px against a mono margin label, a single brass hairline, no
   accent, no card anywhere. Nothing is a template default.
2. **Resembles an AI-default look?** — **No.** None of the three named families. The
   palette is cool-ink/warm-paper, the inverse of the banned cream+brass default, and
   brass appears exactly once as a 1px stroke.
3. **Hero running text instead of a composed statement?** — **No.** H1 plus a two-line
   flex stack (`hero-support-lead` / `hero-support-sub`), max 5 words per support line,
   well inside the ~9-word rule.
4. **Any value on screen not in the scales?** — **YES. Not done.** `hr.hero-rule`
   `margin-bottom: 9px` (F3). `max-width: 928.099px` on `.hero-lead` (F4, since resolved).
   `line-height: 21.45px` on four mono elements where the scale says 18.2px (F6).
   `letter-spacing: 0.09px` on `.type-h3` and `.type-small` where the scale says normal
   (F7). Geist Mono at 18px with `line-height: normal` (F9). Five distinct off-scale
   values.
5. **Anything centered, pilled, or bright-accented?** — **No.** No `text-align: center`,
   no `border-radius` anywhere, no fills, brass used once.
6. **Would Klim or Commercial Type ship this, or cut first?** — **YES, they would cut
   first. Not done.** They would not ship F2: an inline mailto rendering 20% larger than
   the sentence it sits in is a visible typographic error in the page's closing move, and
   the only thing on the page plainly wrong to the eye. Nor a widow at 810px (F5), nor a
   marker breaking the left edge on the phone view (F11).
7. **Does the contact form read as a boxed web form rather than a ruled document?** —
   **No.** Baseline rules only, no boxes, no radii, no shadows, mono labels, CTA is an
   underlined text link. It reads as a ruled document.

**Two yeses (Q4, Q6). Per `ART-DIRECTION.md:311`, not done.**

### ART-DIRECTION amendments the auditor recommends

1. **`:217` and `:194-195`** must be reconciled with the shipped row-rule hover — one
   direction or the other. *(Done: code reverted, table qualified. See F1.)*
2. **`:124-130`** should drop the `ch` cap from the stated mechanism, or the cap should be
   given a value that actually binds. *(Done. See F4.)*
3. **`:68-69`** should say 760px *clamps* `--measure` (763.8px) rather than equals it.
   *(Done. See F12.)*
4. **`:72` / `:147`** should name the label-above-heading variant used by `APPROACH` and
   `ENGAGE`, or the page should be brought to one pattern. *(Open — F10.)*
5. **`:98-99`** already concedes that standalone marker dimensions "are governed by
   nothing here and should be." The 2px marker width and its `-8px` inset are live,
   ungoverned values. *(Open — F11.)*
6. **`:44-45` vs `:141`** conflict on whether mono may be set at 18px. Whichever wins, the
   CTA needs a line-height on the scale. *(Open — F9.)*
7. **`:54-57`** should either cover `.field-optional` or the code should change; "the only
   licensed use" is currently a three-way count. *(Open — F8.)*

### Opinion, not findings

- The h1 stepped 40px → 56px in one jump at 800px, and 810px was the worst case on the
  page (5 lines, a widow, a 506px column carrying 56px type). A middle step would help.
  `ART-DIRECTION.md:59` specifies no curve, so this is preference, not a rule. *(The step
  has since moved to 900px; a middle step remains unexplored.)*
- `.skip { top: -4rem }` (`global.css:127`) equals 64px, on the scale, but is the one place
  a raw `rem` is used instead of `--sp-6`. Token hygiene only.
- `onSuccess` (`inquiry.js:131-133`) moves focus to an `h2[tabindex="-1"]`, which matches
  no focus rule in the CSS. `ART-DIRECTION.md:295` scopes visible focus to *interactive
  elements*, so this is out of scope — but a sighted keyboard user completing the form
  gets no focus indicator at the landing point.

**Excluded by owner decision, not re-flagged:** section rhythm (V7), `--measure` resolving
to three widths (V6), em-dashes in body copy, the textarea resize grip.
