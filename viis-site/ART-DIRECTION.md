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

Display drops to ~40px on mobile; hold line-height and tracking. Never let display
line-height go below 1.05.

## Grid & layout

- 12-column grid. Everything sits on it, including the hero. Nothing runs full bleed.
- Hero content spans columns 1–9. White space on the right is intentional.
- Section pattern: mono label in the left margin (cols 1–3), content in cols 4–11.
- Body measure caps at ~64ch.
- Left-aligned throughout. No centered paragraphs.

## Spacing

8px base. Use only these steps: 8, 16, 24, 32, 48, 64, 96, 128 px.
- Between major sections: 96–128px desktop, 64px mobile. Generous and consistent.
- The whitespace is most of what makes this look expensive. Don't tighten it to fit more.
- Watch CSS specificity between section- and element-level selectors so section padding
  isn't silently cancelled.

## Composition rules

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

Section labels: mono, 13px, uppercase, +0.08em, --paper-dim, in the left margin column.

Contact: no form. A short serif line inviting direct email, then jgarcia@viispartners.com
as a plain mailto in the mono face (underline+arrow treatment, not a button). Optionally
one quiet booking link beside it.

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
Passes all six → done. Otherwise fix and re-audit.

## Anti-patterns — never ship these

- Pure white text or pure black anything.
- A bright acid-green or vermilion accent.
- Fully-rounded pill buttons.
- Centered full-width paragraphs.
- Decorative 01/02/03 numbering on non-sequential content.
- Inter as a display or body face.
- Any color, size, or spacing value not in the scales above.
- A hero set as one undifferentiated block of running text.
