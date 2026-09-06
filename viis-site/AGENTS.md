## Design — read before any UI, styling, layout, or copy work

Two files carry design authority. Read both before touching anything visual —
styles, layout, components, or copy.

- `docs/VIIS-Site-Brief.md` — intent and structure. What the site has to do, the
  page order, the section copy, the reference sites, the voice, the layout and
  anti-noise rules, and the build order.
- `src/styles/tokens.css` — the built values. Every colour, type step, spacing step,
  radius, and duration on the site comes from this file.

**Where the brief and `tokens.css` disagree, `tokens.css` wins.** It reflects the
contrast fixes made after the brief was written: `--accent-fill #2A7255` for any filled
surface that carries text (cream on the brief's `#2F7F5E` is 3.94:1 and fails AA), and
`--cream-faint #8A8780` (the brief's `#6E6B65` fails as text). The `WHY:` comments in
`tokens.css` record each deviation and the ratio behind it.

- Never use a colour, font size, or spacing value that isn't in `tokens.css`. Add a
  token first, with a `WHY:` comment, if one is genuinely missing.
- Never ship anything on the brief's anti-noise list (§1) or banned-word list (§5).
- If a requested change would conflict with either file, stop and flag it instead of
  working around it.
- Verify contrast with `src/lib/contrast.ts` before adding a colour: 4.5:1 for text,
  3:1 for large text and control boundaries.
- Check 375 / 768 / 1440 before calling any screen done. No horizontal scroll at any
  width.

The token and type specimen renders at `/dev/design-system` in dev only; it is excluded
from production builds.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
