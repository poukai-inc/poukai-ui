---
"@poukai-inc/ui": minor
---

Add `TeamCard` molecule — canonical person tile.

`<TeamCard>` surfaces a single team member as a brand object: portrait, name, role, optional bio, and optional contact affordance. Intended for /about and /team page contexts.

**API surface:**

```tsx
<TeamCard
  portrait={<Portrait src="…" alt="…" aspect="1:1" width={800} />}
  name="Arian Zargaran"
  role="Founder, Engineering"
  bio="Builds production AI systems end-to-end."
  contact={<EmailLink email="arian@pouk.ai" variant="muted" />}
  eyebrow="Founding team"
  layout="stacked" // "stacked" | "horizontal"
  nameAs="h3" // "h2" | "h3" | "h4"
  as="article" // "article" | "section" | "div"
/>
```

**Key design decisions:**

- No padding, no border, no background — content tile, not chrome tile. Consumer's grid owns the column gutter.
- `layout="horizontal"` pins portrait at `5rem` width; collapses to stacked below 768px.
- `aria-labelledby` wired automatically on landmark roots (`article`, `section`); omitted on `div`.
- Eyebrow string convention (auto-wrap in `<Eyebrow variant="muted">`) matches `<Section>` and `<Pull>`.
- `portrait` slot accepts `ReactNode` only — no `portraitSrc` shortcut. Portrait's API is authoritative.
- No new tokens. Constructed entirely from the existing vocabulary.
