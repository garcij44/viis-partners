# VIIS — Art Direction

How to use this file: this is the design source of truth for the site. Read it before
touching styles or layout. Every color, type, and spacing decision derives from here.
If a change would break a rule below, stop and flag it rather than working around it.
Do not introduce values that aren't in these scales.

## What we're designing

VIIS is a boutique technology practice: security and systems hardening, responsible AI
adoption, and premium custom software. A few clients at a time, fully embedded, fixed
retainer. The audience is business owners who can spend and who have outgrown guesswork.

The feeling is quiet, precise, trustworthy, discreet — private bank meets engineering
firm. Not a tech startup. Restraint is the whole point: this page proves seniority by
what it leaves out, not by what it piles on. Every element earns its place or it's cut.

The single job of the page: make a high-spend owner think "these people are serious, and
I want them on my systems."

## Palette

Near-monochrome by design. Personality is carried by type and space, not color. There is
no bright accent — going without one is deliberate and is the thing that reads senior.

- --ink        #121319  Page background. Deep ink, faint cool undertone. Not pure black.
- --ink-raised #1A1B22  Rare raised zones / footer band if one is used.
- --paper      #ECE7DB  Primary text. Warm off-white against cool ink — intentional. Never pure white.
- --paper-dim  #9A968C  Secondary text, captions, metadata.
- --rule       #2A2B33  Hairlines and dividers. Low contrast on purpose.
- --brass      #B79663  OPTIONAL single accent. Off by default. If used: hover states and one signature moment only — never a fill, never twice on a screen.

Rules: text is --paper or --paper-dim, never pure #FFF or #000. If brass is enabled it's
spent in exactly one place. No gradients, no glows, no colored shadows.

## Type

Three faces, three jobs. The monospace utility face is the signature — it grounds the
site in the world of systems, terminals, and runbooks.

- Display — serif, authority + editorial. Fraunces (variable; keep optical softness low).
  Alternative if too warm: Newsreader.
- Body — clean sans, chosen not defaulted. Geist. (Not Inter — Inter reads templated now.)
- Utility — monospace, the signature. Geist Mono or IBM Plex Mono. Used for eyebrows,
  section labels, metadata, footer, and any figures.

Scale (text on dark reads heavier, so weights stay lighter, body gets slight tracking):
- Display (h1): Fraunces, 56px, line-height 1.08, weight 440, tracking -0.015em
- h2:           Fraunces, 30px, 1.15, 440, -0.01em
- h3:           Fraunces, 21px, 1.3, 500, normal
- Body:         Geist, 18px, 1.65, 400, +0.005em
- Small:        Geist, 15px, 1.6, 400, normal
- Utility/label: Geist Mono, 13px, 1.4, 400, +0.08em, uppercase
- Utility/prose: Geist Mono, 13px, 1.4, 400, normal tracking, sentence case — for any
  mono set as a sentence rather than scanned as a label: status messages, inline field
  errors, and the lowercase "optional" qualifier inside a field label. Same face and
  size as Utility/label, but +0.08em is a label device that hurts legibility in running
  text. The governing test is the typographic one — is this read as prose or scanned as
  a label — not where it happens to sit; a sentence-case fragment inside a label is
  still prose.
- Utility/meta: Geist Mono, 13px, 1.4, 400, +0.08em, sentence case — for the footer
  readout line. Keeps the label's tracking because it is scanned, not read, but stays
  sentence case because it carries proper nouns (a name, a city) that would be shouted
  by uppercase.
- Utility/CTA: Geist Mono, 1.4, 400, normal tracking, at two sizes — **18px standalone**
  and **15px when set inline in a `.type-small` sentence**, which is what the mailto
  beside the form requires (Components mandates it be mono and beside the form). These
  are the only mono above 13px, and only for the `.cta` treatment. This row resolves the
  conflict between "mono carries eyebrows, labels, metadata, footer and figures" above
  and the Components clause permitting the CTA as "a text link (mono or sans)": the CTA
  may take mono, at this row, with an explicit line-height AND explicit tracking.
  Without both, the class picks them up from whatever element wears it — it rendered at
  three different line-heights that way, and `.notice-cta` on /thanks and /404 took the
  body's 0.005em as an absolute 0.09px.

**These four mono rows are exhaustive.** Utility/prose and Utility/CTA are the only two
that take `letter-spacing: normal`; Utility/label and Utility/meta both keep +0.08em.
Adding a fifth combination means amending this file first.

Display drops to 40px below 900px — not at a mobile breakpoint; see Composition rules
for why the step sits there. Hold line-height and tracking. Never let display
line-height go below 1.05.

## Grid & layout

- 12-column grid. Everything sits on it, including the hero. Nothing runs full bleed.
- **Named exception: `--grid-max: 1280px`.** A container width is not a spacing value and
  is not on the 8px scale. 1280 is derived, not chosen: with the 64px gutter and the 24px
  column gap, columns compute to 74px, so the cols 4–11 content band is
  8 × 74 + 7 × 24 = **760px**, which clamps `--measure` (64ch of Geist at 18px =
  763.77px) to within 4px. It is the container width at which the section content band
  and the body measure converge. They are close, not equal — do not treat the equality
  as load-bearing — but 1280 is chosen so the band lands just inside the measure rather
  than overrunning it. Changing either pulls them apart, so change both or neither.
- Hero content spans columns 1–9. White space on the right is intentional.
- Section pattern: mono label in the left margin (cols 1–3), content in cols 4–11. This
  is the default and governs the services (SECURE / ADOPT / BUILD / ADVISE) and CONTACT.
- **Licensed variant: label stacked above the heading, inside cols 1–9.** Used by
  APPROACH and ENGAGE, and only by sections that are not offerings. The label-left
  anatomy is the *service* anatomy — reusing it for process content makes a lifecycle or
  an engagement model read as a fifth and sixth thing you can buy. APPROACH is the arc of
  a project set as three typographic phases, and ENGAGE is how the work runs, on a raised
  band at hero measure rather than indented into cols 4–11. Both deliberately break the
  service anatomy so they read as breadth, not as another offering. Recorded here because
  the reasoning previously lived only in CSS comments, where an audit correctly read one
  stated pattern against three shipped ones. A third variant needs amending this file
  first.
- Body measure caps at ~64ch.
- Left-aligned throughout. No centered paragraphs.

## Spacing

8px base. Use only these steps: 8, 16, 24, 32, 48, 64, 96, 128 px.

One narrow exception, so it stops being re-flagged on every audit: **optical offsets are
not layout spacing.** They may use sub-8px values. The exception does not extend to
padding, margin, or gap. **Three** separate conventions, which are not interchangeable —
the third does move layout, and is licensed anyway for the reason given there:

- **Offsets — 4px.** `outline-offset`, `text-underline-offset`, and the distance a hover
  micro-interaction translates (the CTA arrow's `translateX`). The CTA treatment below
  already specifies "a thin underline offset ~4px". Use 4px for all three, and do not
  invent a second offset value.
- **A one-line reserve.** A `min-height` that reserves exactly one line box of a scale
  type style (the status region's `calc(13px * 1.4)` = 18.2px) is licensed, even though
  it is a layout dimension off the 8px scale. It is derived from the type scale rather
  than chosen, and it exists precisely to PREVENT layout movement. Without this the file
  forbids in Spacing the reserve it mandates in Components. Licensed only in this form:
  a reserve equal to one line box, never a general off-scale height.
- **Border and rule widths — 1px, doubling to 2px.** Every rule on the site is 1px; an
  emphasis state (input focus, a selected option) doubles it to 2px, always via inset
  box-shadow so the width change costs no layout. There is no third border width. This
  binds borders and rules; it does not bind SVG `stroke-width`, which stays in user
  units inside the arrow's viewBox and scales with it.

**Documented uses, not exceptions.** These were previously described here as "governed by
nothing"; they are all on an existing scale and only wanted naming:

- The selection marker bar is **2px** wide — the same licensed emphasis width a rule
  doubles to, used here as a standalone mark rather than a border.
- Its **8px** offset from the option it marks, and the option row's matching **8px**
  left inset reserving that channel, are both the 8px spacing base. The inset is what
  keeps the marker and the focus ring inside the grid below 800px.
- The CTA arrow's box is **0.85em** of the CTA's own font-size — a ratio derived from
  the type scale, not a size value, so it tracks whichever CTA row it sits in.
- Transition duration is **0.2s** everywhere, without exception.

*Corrected 2026-08-27.* The 2026-08-20 amendment folded hairline widths in with the two
offsets and declared 4px "the standing convention for all three". No hairline on the site
has ever been 4px — they are all 1px — so the clause described nothing real and would have
licensed a 4px rule as compliant. Splitting the two conventions is the fix; 4px still binds
the offsets, unchanged.
- Between major sections: 96–128px desktop, 64px mobile. Generous and consistent. These
  are the RESULTING gaps, not padding tokens — two adjacent sections each contributing
  their own padding must still land in the range.
- **Ruling, 2026-08-27: `.closing` and `.contact` are wrong, the comment is right.** Both
  ship `padding-block: var(--sp-8)`, and two adjacent symmetric 128px sections produce a
  measured 257px gap — the exact treatment the Sections comment rejects by name 120 lines
  earlier ("Symmetric --sp-8 both sides would open a 256px void"). It is also double the
  top of the stated range. The comment states the rule correctly; the two sections were
  written against it. Correcting them changes the rhythm of the page's closing movement,
  so the code change is deferred to a dedicated pass with before/after screenshots — see
  AUDIT.md V7. Until then this clause records that the code is the party at fault, so the
  next audit does not re-open the question or "fix" it by relaxing the range.
- The whitespace is most of what makes this look expensive. Don't tighten it to fit more.
- Watch CSS specificity between section- and element-level selectors so section padding
  isn't silently cancelled.

## Composition rules

- The hero holds its composition with its column span (cols 1–9) plus `text-wrap:
  balance`, at every width. **No hard `<br>`.** One was used until 2026-08-27 and was suppressed only
  below 640px, which left it destructive from ~800 to ~1090px — iPad landscape and every
  scaled laptop window — where the column cannot hold the first clause and the break
  orphaned a single word mid-headline. A break is a fixed answer to a fluid problem; the
  column span works at all widths. `balance` rather than `pretty` because pretty
  protects only the last line.
- **`balance` up to ~6 lines; `pretty` beyond.** Chromium stops balancing past roughly
  six line boxes and silently falls back, so `balance` on a long block is an inert
  declaration that reads as protection and provides none — the same failure class as the
  4px hairline clause and the 26ch hero cap, both corrected on 2026-08-27. Short headings
  (h1 hero, h2, h3, the utility-page headings, the hero support stack) take `balance`.
  The closing statement runs 9 lines at 375px and 10 at 320px and takes `pretty`, which
  keeps working past the balance limit because it only protects the last line. Measured,
  `pretty` is better than or equal to `balance` at every width on that block and clears
  a widow at 375px. It does not clear 320px — no wrap mode does; see AUDIT.md V8. Check
  the line count before choosing, and do not assume `balance` is doing anything on a long
  block.
- The display face steps 56px → 40px at **900px, not 800px**. Crossing 800 → 801 the
  12-column grid engages and the hero column collapses from 657px to 487px — it narrows
  as the viewport widens. Stepping the type up at 800 put the largest face into the
  narrowest column and widowed the last word from 801 to 842. Measured, 56px rags clean
  from 850px up. This threshold tracks the hero copy's length; shorten the copy and it
  must be re-measured.
- The hero is composed, not dumped. A long sentence set as one flat block is the amateur
  tell. Either cut it to a sharp statement, or compose it: a larger lead clause, then
  supporting lines. Max ~9 words per line. Left-aligned. Constrain to cols 1–9.
- No orphans or widows — control the right rag, no single words hanging off the edge.
- One idea per section.
- Structural devices encode meaning. Section labels name what the thing is (e.g. SECURE,
  ADOPT, BUILD in mono). No 01/02/03 — the services are parallel, not a sequence.

## Components

Primary CTA: no pill, no filled black button. Default treatment is a text link (mono or
sans) with a thin underline offset ~4px and a small arrow; resting state quiet, hover is
where the craft lives (underline thickens or arrow translates). If one action needs more
weight, one — and only one — paper-white block with near-black text, 2–3px radius, used
once on the page.

Section labels: mono, 13px, uppercase, +0.08em, --paper-dim, in the left margin column —
or stacked directly above the heading in the licensed variant (see Grid & layout).

Contact: one form is permitted, and only in the closing contact section. This rule was
originally "no form." It was amended deliberately on 2026-08-19 because the mailto-only
treatment loses any lead on a phone or a locked-down work machine, and lead capture is
the page's commercial job. The restraint the original rule protected is preserved by the
constraints below, not by the absence of a form. Do not read this amendment as a general
loosening.

The mailto stays. jgarcia@viispartners.com remains beside the form as a plain mailto in
the mono face (underline+arrow treatment, not a button), for anyone who would rather
write directly. Optionally one quiet booking link beside it.

The form must not look like a form:

- No boxed inputs, no rounded rectangles, no drop shadows, no placeholder-as-label.
- Inputs are baseline-ruled on --paper-dim. **Any hairline that is the visible boundary
  of an interactive control must clear 3:1 against its background** (WCAG 2.2 SC 1.4.11)
  — that includes text inputs, textareas, and the service radio row. --paper-dim on
  --ink is 6.28:1. Focus thickens or brightens that rule; it never introduces an outline
  box, a glow, or a layout shift.

  *Corrected 2026-08-27.* This clause previously read "Inputs are baseline-ruled on the
  --rule hairline." That was wrong and it shipped: --rule on --ink is **1.32:1**, less
  than half the required 3:1 — not a quiet boundary but an absent one, leaving the form's
  fields effectively unfindable at rest. --rule is correct for dividers, which are
  decorative and exempt from 1.4.11; it was the wrong token for an interactive boundary.
  The token, not the ratio, is the thing to get right at the point of use, so the ratio is
  now stated here explicitly. --rule itself is unchanged.
- Input state ladder. Two orthogonal channels — colour (--paper-dim -> --paper) and
  weight (1px -> 2px) — so that no state is signalled by colour alone. Thickening is
  always an inset box-shadow, never border-width, so nothing in the ladder shifts layout.

  | State  | Rule                  | Contrast |
  |--------|-----------------------|----------|
  | rest     | 1px --paper-dim           | 6.28:1   |
  | hover    | 1px --paper (text inputs); option colour only, row rule unchanged (radios) | 15.02:1 |
  | focus    | 2px --paper (text inputs); 1px --paper outline ring (radios) | 15.02:1 |
  | filled   | unchanged from rest       | —        |
  | selected | --paper + marker bar (radios only) | 15.02:1  |
  | error    | 2px --paper-dim + message | 6.28:1   |

  Filled is deliberately not a rule state: the value renders in --paper at 15.02:1 and
  already distinguishes the field. Error takes the weight channel because the colour
  channel is spent by rest; it is never brass, which the palette caps at one use per
  screen while several fields can fail validation at once.

  The service radio row runs the same ladder for rest and error, which apply to the
  row's single rule — it is a required field and must not be the one control with no
  visual error signal. Selection and focus apply to the individual option, and neither
  may touch the rule. Three departures, all forced by the radio rather than chosen:

  **Selection and focus must not share a channel.** `validate()` moves focus to the
  first option — unchecked, that being why validation failed — so any treatment shared
  with selection would tell a sighted user that option is now chosen.

  **Neither may be anchored to the row's rule.** The row wraps to two lines at every
  width at or below 414px, which is most inbound traffic. An underline segment under a
  word on line 1 then floats ~42px above the rule with nothing beneath it — the
  word-width-stub signature the row rule exists to remove, only brighter. Selection is
  therefore the marker bar, which travels with its own word and is correct on any line.
  Focus is the site's standard 1px --paper outline ring; the bar on the rule ladder
  against an outline box applies to inputs, where it would box a ruled field, not to a
  single uppercase mono word.

  **Focus binds `:focus`, not `:focus-visible`,** because browsers do not match
  `:focus-visible` on a programmatically focused radio after a pointer-driven submit —
  which is the path a mouse user takes out of a validation error.

  Hover on the row is the option's colour only; the row's rule does not respond, because
  hover cannot be an affordance here at all (see the hover clause above).

  Thickening is carried by inset box-shadow everywhere, which forced-colors mode
  suppresses. Under `@media (forced-colors: active)` the ladder is restored with
  outline, border-style, and system colour keywords. The "no outline box on focus" rule
  is an aesthetic constraint on OUR palette; where the user has deliberately replaced
  that palette, a visible focus indicator outranks it.
- Hover is a refinement, never an affordance. Every hover rule on an interactive element
  is scoped in `@media (hover: hover)` — on touch, :hover latches after a tap and leaves
  a state the user cannot clear. The resting state must be sufficient on its own and is
  what most inbound traffic ever sees: leads arrive by QR code on a phone and will never
  hover. A change that is only visible on hover has not fixed anything.
- Labels use the existing section-label treatment: mono, 13px, uppercase, +0.08em,
  --paper-dim.
- The submit control is the existing .cta treatment — underlined text link with the
  arrow. Never a button, never a pill, never a filled block.
- The whole thing should read as filling in a well-set document, not as a web form.
- The service row's rule belongs to the ROW, not to each option. Per-option rules are
  word-width stubs, and a row of word-width underlines reads as navigation whatever
  colour it carries — measured, a field rule runs 760px continuous against stubs of
  53–106px. One continuous rule under the row reads as one field whose value is a
  choice. Selection marks a single word with the marker bar, never with an underline
  segment — see the wrap case in the ladder below.
- **Named exception: the project textarea keeps `resize: vertical`.** This is knowingly
  inconsistent with the reasoning that rejected `<select>` — both expose an unstylable
  browser widget at the moment of interaction. The exception is taken deliberately:
  `<select>`'s OS-rendered dropdown replaces the whole control and there is a clean
  substitute (the radio row); the resize grip is a small corner artifact on the one
  field where people write at length, and there is no substitute for letting them see
  what they wrote. Losing the affordance costs more than the artifact does. Recorded
  here so it stops being re-flagged on every audit — do not "fix" it.

Field-error copy: capped at **40 characters**, the same measured budget. This cap matters
more than the status one, not less: `.field-error` is absolutely positioned so that
revealing an error costs no layout movement, and the cost of that is that an overlong
string does not reflow — it overlaps the next field's label. At 375px the container is
327px against a 41.9-character line, so the margin is under one character. Longest
current string is 25.

Status copy: every string written into the live region is capped at **40 characters**.
The region reserves exactly one mono line, so the no-layout-shift rule holds only as a
constraint on the copy, not as a property of the reserve. The budget is measured, not
estimated: at 375px — the binding width — the region is 327px (the viewport less the
two 24px gutters) and Geist Mono at 13px advances 7.8px/char, giving 41.9. The cap is
40, because a desktop viewport carrying a classic scrollbar measures 312px / 40.0, and
40 is the figure that holds in both cases. A longer string reintroduces an 18.2px shift
on the two states that can least afford it. Changing this copy means re-measuring, not
eyeballing.

Field discipline: six fields is the ceiling and the current spec. Name, Email, and
Service of interest are required; Phone, Company, and Project are optional. Adding a
seventh field requires amending this file first, not a code review waiver.

Widths: the form obeys the grid and --measure like everything else. No bespoke
max-width values — that is what the anti-pattern list already forbids.

States: idle, submitting, success, error, handled inline with no layout shift and no
modals or toasts. On success, move keyboard focus to the status message.

Footer: quiet, mono, --paper-dim, low contrast — reads like a system readout, not a
marketing band.

## Signature

The monospace metadata treatment — labels, figures, footer, any status/location line set
in Geist Mono. The quiet fingerprint that says "we work in systems." Keep everything
around it disciplined so it carries.

## Reference register (the target, not to copy)

Klim Type Foundry (klim.co.nz), Commercial Type, Pentagram, Area of Practice, Collins.
The standard for composed, expensive, editorial restraint. When a choice is ambiguous,
ask which of these would make it — and whether it earns its place.

## Quality floor (non-negotiable, don't announce)

- Responsive to mobile; grid collapses cleanly, type scales per the scale above.
- Visible keyboard focus on every interactive element.
- prefers-reduced-motion respected — hover micro-interactions only, nothing ambient.
- No layout shift on load.

## Self-audit — run before calling any screen done

The failure mode of AI design work is regression to the average "nice" site, which is
the default look. Render the change, screenshot it, answer honestly. A yes to any one
means it's not done:
- Could this be any consultancy's site, or is it unmistakably VIIS?
- Does it resemble an AI-default look (cream + serif + terracotta / near-black + bright
  accent / hairline broadsheet)?
- Is the hero running text instead of a composed statement?
- Is there any value on screen — color, size, spacing — not in the scales above?
- Is anything centered, pilled, or bright-accented?
- Would Klim or Commercial Type ship this, or cut something first?
- Does the contact form read as a boxed web form rather than a ruled document?
Passes all seven → done. Otherwise fix and re-audit.

## Anti-patterns — never ship these

- Pure white text or pure black anything.
- A bright acid-green or vermilion accent.
- Fully-rounded pill buttons.
- Centered full-width paragraphs.
- Decorative 01/02/03 numbering on non-sequential content.
- Inter as a display or body face.
- Any color, size, or spacing value not in the scales above.
- A hero set as one undifferentiated block of running text.
