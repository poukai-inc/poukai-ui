---
"@poukai-inc/ui": minor
---

Code-side cleanup pass closing the remaining 🟠 High items from the 2026-05-18 consistency audit. Per ADR-0003, token additions are a minor bump; this changeset is additive only and contains no breaking changes.

**New tokens (additive)**

- `--space-10: 2.5rem` — fills the previously-phantom rung between `--space-8` and `--space-12`. Used by Hero CTA desktop margin, FailureMode top padding, h1 desktop bottom margin (all of which previously consumed `var(--space-10, 2.5rem)` with a fallback).
- `--dur-press: 80ms` — tactile click/press feedback duration, deliberately shorter than `--dur-fast` so `:active` transforms feel immediate. Used by `<Button>` transform transition.
- `--dur-pulse: 1800ms` — `<StatusBadge status="available">` halo pulse. Replaces the previously-hardcoded `1800ms` literal.
- `--fs-card-title: clamp(1.5rem, 1.15rem + 1.2vw, 2rem)` (24–32px) — card-title rung shared by `<RoleCard>`, `<Principle>`, `<FailureMode>` titles. Replaces three duplicated `clamp(...)` declarations.

**Wider subpath surface (additive)**

- `@poukai-inc/ui/molecules` now re-exports `Statement` and `StatementProps` (previously only reachable via the root barrel) and the full Hero discriminated-union types: `HeroDefaultProps`, `HeroNoTitleProps`, `HeroSize`, `HeroEntrance`, `HeroVariant`, `HeroBleed`.
- Root barrel `@poukai-inc/ui` adds the three Hero types that were missing for parity with `Hero/index.ts`: `HeroDefaultProps`, `HeroNoTitleProps`, `HeroVariant`.

**Token-consumer migrations**

- `<Button>`: transitions now read `var(--dur-fast)` / `var(--easing)` for color and border; `var(--dur-press)` for transform. The wrong `var(--radius-2, 8px)` fallback (token is `4px`) is replaced with a plain `var(--radius-2)`.
- `<StatusBadge>`: pulse animation reads `var(--dur-pulse)`.
- `<RoleCard>`, `<Principle>`, `<FailureMode>`: title `font-size` reads `var(--fs-card-title)`.

**Test backfill**

- `<Button>`: variant assertions (primary/secondary/ghost class application); sm + lg size class + min-height assertions; className-merge and arbitrary-prop forwarding tests.
- `<StatusBadge>`: idle-status coverage; default-status coverage; dot `aria-hidden` assertion; pulse-element count guard for available vs idle/closed; CSS regression guard pinning `animation-duration: 1.8s` + `animation-iteration-count: infinite`; className-merge and arbitrary-prop forwarding tests.

CT suite goes from 242 to 270 passing tests with no fixtures or production-code regressions.
