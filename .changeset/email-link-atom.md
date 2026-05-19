---
"@poukai-inc/ui": minor
---

feat(atoms): add EmailLink atom

New `<EmailLink>` atom — the canonical `mailto:` affordance for the Poukai design system.

- `email` prop computes `href="mailto:${email}"` — consumers never pass `href` directly.
- `label` prop (optional) overrides visible text; defaults to the email string.
- `icon` prop (optional leading ReactNode) — shifts root to `inline-flex` when present.
- `qualifier` prop (optional) renders a trailing muted ` (qualifier)` span inside the anchor.
- `variant="default"` (default) — `--fg` → `--accent` on hover.
- `variant="muted"` — `--fg-muted` → `--fg` on hover; matches existing SiteShell `.muted-link` treatment.
- Persistent `text-decoration: underline` (intentional brand override of the global animated grow-underline — a `mailto:` is not a navigational link).
- Focus ring: 2px solid `--accent`, 4px offset (link convention, not button).
- No new tokens — built entirely from the existing token vocabulary.
- Exports: `EmailLink`, `EmailLinkProps`, `EmailLinkVariant` from `@poukai-inc/ui` and `@poukai-inc/ui/atoms`.
