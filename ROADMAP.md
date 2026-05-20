# @poukai-inc/ui — Roadmap

What we plan to add, in roughly the order we'd cut it. Nothing here is a
commitment; the surface evolves with what consuming products actually need.

## Shipped

### `0.0.1` → `0.1.0` — Phase 1 of the migration plan

- Atomic-Design restructure (`atoms/` / `molecules/` / `organisms/`).
- Atoms: `Wordmark`, `StatusBadge`, `Button`, `Stat`.
- Molecules: `Hero`, `RoleCard`, `Principle`, `FailureMode`.
- Organisms: `SiteShell`.
- Tokens: added `--fs-stat`, `--fs-stat-large`, `--tracking-stat`.

### Since `0.1.0` — component additions

Grouped by component, shipping version noted.

- `Statement` molecule — editorial statement block (`0.10.0`).
- `Portrait` molecule — editorial photography primitive with picture-element
  fallback chain and CLS-safe aspect ratio (`0.13.0`).
- Hero `illustration` slot — two-column layout above 720px (`0.15.0`).
- `EmailLink` atom — canonical `mailto:` affordance (`0.17.0`).
- `Eyebrow` atom — canonical micro-label, resolves the three independently
  authored eyebrow patterns (`0.17.0`).
- `Pull` molecule — inline editorial pull-quote (`0.17.0`).
- `Section` molecule — page-section wrapper consuming `Eyebrow` (`0.17.0`).
- `FeatureCard` molecule — structural feature-grid tile (`0.17.0`).
- `LinkCard` molecule — interactive card primitive (`0.17.0`).
- `TeamCard` molecule — person tile (`0.17.0`).
- `Tag` atom — inline categorical pill (`0.18.0`).
- `Avatar` atom — image / initials / empty (`0.18.0`).
- `Dialog` organism — Radix-wrapped compound modal + `DialogBasic` (`0.18.0`).
- `FieldNote` molecule — inline technical-aside primitive (`0.18.0`).
- `Footer` organism — site-footer content block (`0.18.0`).
- `Quote` molecule — attributed customer testimonial (`0.18.0`).
- Dark-mode tokens — `@media (prefers-color-scheme: dark)` tier appended to `tokens.css`; Apple-HIG-aligned dark palette; all contrast budgets met (`0.19.0`).

## Next

These are speculative candidates, not commitments — sequenced by likely
demand from the site rebuild and follow-on internal products.

| Candidate          | Layer    | Why                                                                                                                                                          |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Tabs`             | molecule | Radix-wrapped tab strip. Promoted from "Maybe" — needed once a `/work` or multi-view page lands.                                                             |
| `Form` primitives  | molecule | `Field`, `Input`, `Textarea`, `Label`. Only when consumers move off `mailto:`. Promoted from "Maybe" since the surface is otherwise complete enough to plan. |
| `Toast` / `Banner` | organism | Transient + persistent notification surface. No current consumer; flagged as the next likely gap once a logged-in product surface appears.                   |

## Maybe

Lower confidence. Will only build when a real consumer asks.

## Won't

- A re-export of `lucide-react`. The site imports Lucide directly; the DS
  lists it as a peer dep and never wraps it. (`RoleCard.icon` is a slot.)
- A router abstraction. `SiteShell` emits plain `<a href>`; framework
  routing is the consumer's job.
- A theming API beyond the existing CSS custom properties. Tokens are the
  contract; no `<ThemeProvider>` here.
