# @poukai/ui — Roadmap

What we plan to add, in roughly the order we'd cut it. Nothing here is a
commitment; the surface evolves with what consuming products actually need.

## Shipped

### `0.0.1` → `0.1.0` — Phase 1 of the migration plan

- Atomic-Design restructure (`atoms/` / `molecules/` / `organisms/`).
- Atoms: `Wordmark`, `StatusBadge`, `Button`, `Stat`.
- Molecules: `Hero`, `RoleCard`, `Principle`, `FailureMode`.
- Organisms: `SiteShell`.
- Tokens: added `--fs-stat`, `--fs-stat-large`, `--tracking-stat` for the
  display-numeral scale.

## Next

These are the candidates for `0.2.x`, sequenced by likely demand from the
site rebuild and follow-on internal products.

| Candidate | Layer | Why |
|---|---|---|
| `EmailLink` | atom | Existing pattern (`<a href="mailto:...">`) is repeated across surfaces with the same hover/focus treatment. |
| `Eyebrow` | atom | The "Role 01" micro-label is reused inside `RoleCard`, `Principle` chrome, and CTA blocks. Currently inline classes. |
| `Section` | molecule | Page-section wrapper with consistent vertical rhythm + optional eyebrow + h2 + lede. Removes inline `<section>` styling from page templates. |
| `Pull` | molecule | Editorial pull-quote — long-form pages will want it once we have customer-story copy. |
| `Quote` | molecule | Customer-story attribution block (avatar slot + name + role + body). Blocked on Customer Story page going live. |
| `FieldNote` | molecule | Tight technical-aside callout for `/why-ai`. Smaller surface than `FailureMode`, plain text only. |
| `Footer` | organism | The hairline footer in `SiteShell` is currently a freeform slot. Once two surfaces have the same footer shape, lift into an organism. |

## Maybe

Lower confidence. Will only build when a real consumer asks.

- `Dialog` (Radix-wrapped) — no current need on the holding-page surface.
- `Tabs` (Radix-wrapped) — likely needed for a future `/work` page if we add one.
- `Form` primitives (`Field`, `Input`, `Textarea`) — only if we move off `mailto:`.
- Dark-mode tokens — current Apple-light palette is the brand contract. Dark
  mode is a content decision, not a token-set we'd add speculatively.

## Won't

- A re-export of `lucide-react`. The site imports Lucide directly; the DS
  lists it as a peer dep and never wraps it. (`RoleCard.icon` is a slot.)
- A router abstraction. `SiteShell` emits plain `<a href>`; framework
  routing is the consumer's job.
- A theming API beyond the existing CSS custom properties. Tokens are the
  contract; no `<ThemeProvider>` here.
