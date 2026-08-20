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
