# Claude Code — VIIS Site Overhaul Prompt

Copy everything below the line into Claude Code from `~/Projects/VIIS`.

---

Read these three files in full before you write any code:

- `viis-site/ART-DIRECTION.md` — the design source of truth. Non-negotiable.
- `viis-site/AUDIT.md` — the pre-launch audit. Every item in it is in scope.
- `.claude/skills/taste-skill/SKILL.md` — the frontend taste standard (frontmatter name: `design-taste-frontend`).

Then read `.claude/skills/redesign-skill/SKILL.md` (`redesign-existing-projects`) and apply
its audit-first methodology. Do not read the other skills in that directory unless you
decide you need them — `minimalist-skill`, `soft-skill`, and `brutalist-skill` are
alternative aesthetic directions and would pull you off the established art direction.

## What this is

VIIS is a boutique technology practice in San Antonio: security hardening, responsible AI
adoption, and premium custom software. A few clients at a time, fully embedded, fixed
monthly retainer. The audience is owner-operators who can spend real money and who have
outgrown guessing at their technology.

The site is a single-page Astro 7 brochure that has never launched. It deploys to Azure
Static Web Apps. The domain `viispartners.com` is not pointed at it yet — nothing here is
live, so you have full freedom to restructure.

The design already has a strong, disciplined foundation. This is an overhaul of execution,
not a change of direction.

## Hard constraints — violating any of these fails the task

**The palette is locked.** These are the only color values permitted anywhere in the
codebase. Do not add, adjust, tint, or "refine" them. Do not introduce a second accent.

```
--ink        #121319   page background
--ink-raised #1A1B22   rare raised zones, footer band
--paper      #ECE7DB   primary text
--paper-dim  #9A968C   secondary text, metadata
--rule       #2A2B33   hairlines
--brass      #B79663   THE single accent — see below
```

Never pure `#FFF`, never pure `#000`. No gradients, no glows, no colored shadows, no
bright accent of any kind.

**`--brass` is the one thing you may newly introduce.** It is specified in
`ART-DIRECTION.md` but was never added to `global.css`, which is why the page currently
has no signature moment. Add the token and spend it in **exactly one place on the entire
page**. Pick the single strongest option, implement it, and write one sentence in your
summary defending the choice. If you use it twice, you have failed.

**The typefaces are locked.** Fraunces (display), Geist (body), Geist Mono (utility).
Self-hosted from `public/fonts/`. No new font files, no Google Fonts, no runtime
third-party requests — this is a security practice's own site and it should make zero
external calls.

**The spacing scale is locked.** 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128 only.

**Stack constraints.** Astro 7, static output, no client-side framework, no Tailwind, no
CSS-in-JS. Plain CSS with custom properties, as it is now. Total page weight should go
down, not up. Keep it a single page unless a second page is genuinely required.

## Scope

### 1. Fix every item in `AUDIT.md`

Work in the order listed at the bottom of that file. The `.section` padding bug is first
because you cannot judge the composition until the vertical rhythm is real.

Two of those items are judgment calls I want you to actually exercise rather than
implement literally:

- **Item 6, the hero support paragraph.** It is a 45-word run-on that restates the three
  service sections appearing directly beneath it. Cut it hard or compose it into stacked
  lines. Do not preserve the sentence out of politeness.
- **Item 8, "How we work."** It is a different category of content than the four services
  and currently renders in an identical shell. Give it a structurally different treatment.

### 2. Apply the taste-skill standard to what remains

Where `taste-skill` and `ART-DIRECTION.md` disagree, `ART-DIRECTION.md` wins. Where
taste-skill has craft the art direction is silent on — optical alignment, rag control,
hover state timing, focus treatment, responsive type curves — apply it.

Specifically I want attention on:

- **Hero composition.** Currently one `<h1>` with a single `<br>`. It should read as
  composed, not typed.
- **Vertical rhythm.** With correct section padding, the page becomes long. Make the
  spacing intentional at every scale, not uniform.
- **The right margin.** Hero spans columns 1–9 and the empty right third is deliberate.
  Make sure it reads as confidence rather than an unfinished layout.
- **Rag and widows.** No single words hanging off line ends in any heading.
- **Motion.** Hover micro-interactions only. Nothing ambient, nothing on scroll.
  `prefers-reduced-motion` already respected — keep it that way.

### 3. Add a contact form

This is new. The page currently offers only a `mailto:`, which loses any lead who is on a
phone or a locked-down work machine. Keep the mailto — add a form beside it.

**Build the form UI and client-side submission only. Do not build the backend.** The
backend decision is not made yet. Point the form at a single configurable endpoint:

```
PUBLIC_FORM_ENDPOINT   // from import.meta.env, with a documented fallback
```

Requirements:

- Fields: Name, Email, Company (optional), Message. Nothing else. Every additional field
  costs conversions and this audience is impatient.
- **The form must not look like a form.** No boxed inputs, no rounded rectangles, no
  drop shadows, no placeholder-as-label. Baseline-ruled inputs on the `--rule` hairline,
  mono labels matching the existing section-label treatment, focus state that thickens or
  brightens the rule. It should look like filling in a well-set document.
- Submit control matches the existing `.cta` — underlined text link with the arrow. Not a
  button, not a pill, not a filled block.
- Real states: idle, submitting, success, error. Handle them inline without layout shift.
  No modals, no toasts.
- Progressive enhancement: `<form method="post" action={endpoint}>` that works without
  JS, upgraded by a small inline script. No form library.
- Honeypot field, hidden accessibly (not `display:none` on a focusable input), plus a
  timestamp check. Leave a clearly marked insertion point for a CAPTCHA widget — a
  Turnstile or hCaptcha script tag will go in later.
- Full a11y: real `<label>` elements, `aria-describedby` on errors,
  `aria-live="polite"` on the status region, visible focus on every control.

### 4. Head, metadata, and the launch floor

- Full Open Graph and Twitter card block. Canonical URL. `theme-color` set to `--ink`.
- A 1200×630 share image. Generate it as SVG committed to the repo and document how to
  rasterize it — do not add an image pipeline dependency. Monochrome wordmark on `--ink`,
  matching the site exactly.
- `robots.txt` and a sitemap.
- A 404 page that uses the same layout and does not feel like an error dump.
- Skip-to-content link.
- JSON-LD `ProfessionalService` block: VIIS Partners, San Antonio TX,
  `jgarcia@viispartners.com`.

## Working method

1. Read the three required files. Then run `npm run build` and confirm the current state
   builds clean before you change anything.
2. Work in the order given. Commit after each numbered section with a clear message.
3. After each visual change, build and actually look at the output — do not assess your
   own CSS by reading it.
4. Before you call it done, run the six-question self-audit at `ART-DIRECTION.md:120`
   and answer all six honestly in your summary. A "yes" on any of them means keep working.

## Do not

- Do not touch the copy in the five service sections. It is deliberate, it is not
  AI-generated, and it is not yours to improve. The hero support paragraph is the single
  exception, and it is explicitly in scope.
- Do not add a testimonials section, a logo wall, a stats band, a pricing table, an FAQ
  accordion, or a newsletter signup. There are no clients to name yet and inventing
  social proof is disqualifying for a practice selling trust.
- Do not add analytics, chat widgets, cookie banners, or any third-party script.
- Do not add dependencies without saying why in your summary.
- Do not center anything. Do not round anything past 3px. Do not use Inter.

## Deliverable

Working, committed, building clean. In your summary give me: what you changed and why,
where you spent `--brass` and your defense of that choice, your honest answers to the six
self-audit questions, and anything you think is still wrong that you did not fix.
