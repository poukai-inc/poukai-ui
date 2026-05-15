# Design specs

Per-component design specs authored by the `poukai-design` agent. Each spec follows the template in [`.claude/agents/poukai-design.md`](../../.claude/agents/poukai-design.md) §3.

Layout:

```
meta/design/
  foundations.md         Type ramp · palette · spacing scale · motion catalog (synced with src/tokens/tokens.css).
  <component>.md         One file per atom / molecule / organism.
  marks/                 SVG source for Wordmark, isotype, banner, branded glyphs.
```

Status convention (set in each spec's frontmatter): `Draft → In review → Approved → Implemented`.

Once a spec hits `Approved`, the `poukai-ds-engineer` agent picks it up and writes the implementation under `src/`.
