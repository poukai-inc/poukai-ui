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

### `0.1.0` → `0.22.0` — component additions + infrastructure

Grouped by theme.

**Atoms**

- `EmailLink` — canonical `mailto:` affordance (`0.17.0`).
- `Eyebrow` — canonical micro-label, resolves three independently authored patterns (`0.17.0`).
- `Tag` — inline categorical pill (`0.18.0`).
- `Avatar` — image / initials / empty (`0.18.0`).

**Molecules**

- `Statement` — editorial statement block (`0.10.0`).
- `Portrait` — editorial photography primitive with picture-element fallback chain and CLS-safe aspect ratio (`0.13.0`).
- `Pull` — inline editorial pull-quote (`0.17.0`).
- `Section` — page-section wrapper consuming `Eyebrow` (`0.17.0`).
- `FeatureCard` — structural feature-grid tile (`0.17.0`).
- `LinkCard` — interactive card primitive (`0.17.0`).
- `TeamCard` — person tile (`0.17.0`).
- `FieldNote` — inline technical-aside primitive (`0.18.0`).
- `Quote` — attributed customer testimonial (`0.18.0`).
- `Banner` — persistent inline notification band (`0.19.0`+).
- `Field`, `Input`, `Textarea` — form primitives (`0.20.0`+).

**Organisms**

- `Dialog` + `DialogBasic` — Radix-wrapped compound modal (`0.18.0`).
- `Footer` — site-footer content block (`0.18.0`).
- `Tabs` — Radix-wrapped tab strip (`0.20.0`+).
- `Toast` + `useToast` — imperative notification organism (`0.21.0`+).
- `Form` — form layout organism wrapping field primitives (`0.22.0`).

**Hero slots + variants**

- `illustration` slot — two-column layout above `--bp-md` (`0.15.0`).
- `variant="no-title"` — editorial doorway pages (`0.11.0`).
- `size` prop — `"display"` / `"intimate"` (`0.7.0`).
- `entrance="stagger"` — CSS-only staggered reveal, `prefers-reduced-motion` honored (`0.8.0`).
- `bleed="full"` — full-bleed layout + `--content-max-bleed` token (`0.12.0`).

**Token + infrastructure**

- Dark-mode tokens — `@media (prefers-color-scheme: dark)` tier; Apple-HIG-aligned dark palette; all contrast budgets met (`0.19.0`).
- Apple-aligned palette: `--bg` → `#FBFBFD`, `--bg-elevated` added, three-step elevation rhythm (`0.6.0`).
- Warm-accent tier: `--bg-warm-accent`, `--fg-on-warm`, `--fg-on-warm-muted` (`0.13.0`).
- Breakpoint token: `--bp-md: 768px` + `@custom-media` declaration.
- Letter-spacing tokens: `--tracking-micro`, `--tracking-eyebrow`, `--tracking-numeric`.
- Line-height tokens: `--lh-body`, `--lh-body-relaxed`.
- Motion tokens: `--dur-press`, `--dur-pulse`.
- Firefox added as third CT browser; all 1572 tests passing across Chromium, Firefox, WebKit.
- Ladle showcase auto-deploys to GitHub Pages on every release.
- `llms.txt` + `llms-full.txt` as package exports; CI sync gate.

---

## Next — post-1.0 candidates

These are deferred from the 1.0.0 freeze. Each requires a real consumer need
before it moves to active work. See `meta/milestones/1.0.0.md` §5 for the
full rationale behind each deferral.

| Candidate                             | Priority      | Why deferred                                                                                                                                                          |
| ------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Form validation hook contract**     | Post-1.0      | Pair `Form` with Zod / RHF without the DS owning either. Provide a standard `error` → field id contract. Deferred until a real form-heavy consumer defines the shape. |
| **Toast queue persistence**           | Post-1.0      | Survive page navigation in SPAs. Requires a router-agnostic store strategy the DS does not currently own. Deferred until a consumer with SPA navigation asks for it.  |
| **Locale-aware date / number tokens** | Post-1.0      | Only if a consuming surface targets multiple locales. Not a DS responsibility until that surface exists.                                                              |
| **CSS-in-JS token variant**           | Post-1.0, low | `import tokens from '@poukai-inc/ui/tokens.js'` for consumers who cannot ship `tokens.css`. No current consumer has this constraint.                                  |

---

## Maybe

Lower confidence. Will only build when a real consumer asks.

- **Accordion** — vertical stacked disclosure. Distinct from Tabs (interaction semantics differ). No current consumer need.
- **Segmented control** — form input that selects a value from a fixed set. Similar visual territory to Tabs but different ARIA role (`radiogroup`).
- **Tooltip** — Radix-wrapped. Deferred because the current surface has no hover-dependent UI.
- **Popover** — Radix-wrapped. Same deferral reason as Tooltip.

---

## Won't

- A re-export of `lucide-react`. The site imports Lucide directly; the DS
  lists it as a peer dep and never wraps it. (`RoleCard.icon` is a slot.)
- A router abstraction. `SiteShell` emits plain `<a href>`; framework
  routing is the consumer's job.
- A theming API beyond the existing CSS custom properties. Tokens are the
  contract; no `<ThemeProvider>` here.
