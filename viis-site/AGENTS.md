## Design — read before any UI, styling, layout, or copy work

Before touching anything visual — styles, layout, components, or copy — read
`ART-DIRECTION.md` in this project root and follow it exactly. It is the design source
of truth: every color, type, and spacing decision must come from its scales.

- Never use a color, font size, or spacing value that isn't in its scales.
- Never ship anything on its anti-patterns list.
- If a requested change would conflict with a rule in that file, stop and flag it
  instead of working around it.
- Run its self-audit checklist before calling any screen done.

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
