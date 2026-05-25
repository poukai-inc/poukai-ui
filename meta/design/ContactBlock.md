# ContactBlock

**Status**: Approved

## 1. Intent

`ContactBlock` is a Section-framed organism that presents a contact row for marketing and portfolio surfaces: a primary email link, an availability signal via `StatusBadge`, and an optional slot for secondary CTA Buttons (e.g. "Book a call"). It serves the end-of-page "reach me" moment — the conversion surface where a visitor transitions from reading to initiating contact. Distinct from `Footer`, which is persistent page chrome; `ContactBlock` is a deliberate, standalone content section.

## 2. Anatomy

```
<Section>                          ← section frame, optional band bg
  <div class="inner">              ← flex column, centered, gap --space-6
    [status row]                   ← StatusBadge slot (optional)
    <EmailLink>                    ← primary contact anchor, display-scale
    [actions row]                  ← ReactNode slot for Button(s)
  </div>
</Section>
```

- **Section wrapper**: inherits `Section`'s vertical padding and optional `--surface-section` background band.
- **Status row**: `StatusBadge` slot — communicates availability ("Open for projects", "Available for new work"). Optional; omit when no availability signal is needed.
- **EmailLink**: the primary interactive element. Rendered at a larger scale than footer usage — `--fs-h3` weight, not `--fs-meta`. Uses `EmailLink` atom directly.
- **Actions row**: `ReactNode` slot accepting one or more `Button` instances. Optional; rendered below the email when present.

## 3. Tokens

- `--surface-section` — optional Section band background
- `--fg` — EmailLink label color at rest
- `--fg-muted` — supporting text / status label color
- `--accent` — EmailLink hover underline; focus ring color
- `--font-sans` — all text
- `--font-serif` — available for a heading slot if added (not in base)
- `--fs-h3` — EmailLink label scale (1.125rem / 18px)
- `--fs-meta` — StatusBadge label scale
- `--lh-meta` — StatusBadge line-height
- `--space-2` — gap within status row (dot + label)
- `--space-4` — gap between actions
- `--space-6` — gap between inner stack rows
- `--space-12` — Section block padding (inherited from Section)
- `--dur-fast` — EmailLink hover color transition
- `--dur-pulse` — StatusBadge available-state pulse
- `--radius-1` — focus ring border-radius
- `--hairline-w` / `--hairline` — optional Section top/bottom rule

## 4. Variants / Props

| Prop         | Type        | Default     | Rationale                                                                                                               |
| ------------ | ----------- | ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `email`      | `string`    | required    | Passed to `EmailLink`. The primary contact address.                                                                     |
| `emailLabel` | `string`    | `undefined` | Optional visible label override for `EmailLink` (e.g. `"Say hello"`). When absent, the raw address renders.             |
| `status`     | `ReactNode` | `undefined` | `StatusBadge` slot. When absent, the status row is not rendered.                                                        |
| `actions`    | `ReactNode` | `undefined` | CTA Button(s). When absent, actions row is not rendered.                                                                |
| `heading`    | `string`    | `undefined` | Optional short heading above the email (e.g. `"Get in touch"`). Renders at `--fs-h2` in Instrument Serif when provided. |

No `tone` or `variant` prop. `ContactBlock` has one visual register — centered, editorial, generous whitespace. Differentiation is achieved through the `heading` text and `status` content, not a parallel styling branch.

## 5. Interaction

- **EmailLink**: standard `<a href="mailto:…">` tap target. Hover: accent underline grows via the global `<a>` rule (`--dur-mid`, `--easing-link`). Focus-visible: 2px `--accent` outline, 4px offset, `--radius-1`.
- **Button(s) in actions slot**: each Button handles its own hover/focus/active per the Button atom spec.
- **StatusBadge**: non-interactive. Available-state pulse animation runs at `--dur-pulse`. No click/hover state on the badge itself.
- **Keyboard order**: heading (no tab stop) → EmailLink → Button(s) in DOM order.
- No dismiss, drag, or swipe behavior.

## 6. A11y

- `Section` wraps content in a `<section>` element. When a `heading` prop is provided, `Section` should receive a matching `aria-labelledby` pointing to the heading element so the section has an accessible name.
- `EmailLink` renders `<a href="mailto:…">` — accessible name is the visible label or email string; no additional ARIA needed.
- `StatusBadge` is non-interactive; rendered as `<span>` with text content. No ARIA role required.
- Buttons in the `actions` slot must each carry their own accessible label (Button atom contract).
- Contrast:
  - `--fg` on `--bg`: 16.29:1 (AAA)
  - `--fg-muted` on `--bg`: 4.91:1 (AA)
  - `--accent` focus ring on `--bg`: 4.54:1 (WCAG 1.4.11 non-text ✓)

## 7. Motion

- EmailLink hover: `background-size` transition, `--dur-mid` / `--easing-link` (global `<a>` rule — no override needed).
- StatusBadge pulse: `--dur-pulse` (1800ms) animation on the available-state dot (StatusBadge atom contract).
- No entrance animation on the block itself.
- `@media (prefers-reduced-motion: reduce)` in `tokens.css` clamps all transitions and animations globally; no per-component override needed.

## 8. Anti-patterns

- **Not a footer substitute.** `ContactBlock` is a content-section moment; `Footer` is persistent page chrome. Do not use `ContactBlock` as the page footer.
- **Not a form.** `ContactBlock` surfaces an email link and optional CTAs — it does not own a contact form. If a multi-field form is needed, compose a separate `Form` organism.
- **Not for dashboard or app surfaces.** This is a marketing/portfolio organism. App surfaces use inline action primitives (`Button`, `IconButton`) in their own layout contexts.
- **Do not place multiple `ContactBlock` instances on one page.** One contact moment per surface. Repetition dilutes the signal.
- **Do not use `ContactBlock` for non-contact CTAs.** Its semantic purpose is contact initiation. A general "Ready to start?" conversion block belongs in `CtaBlock` / `CTASection`.
- **Do not embed inside `<main>` content columns narrower than `--hero-max`.** The centered layout requires adequate horizontal breathing room; forcing it into a narrow column breaks the rhythm.

## 9. Depends on

- `Section` — outer frame, vertical padding, optional band background
- `EmailLink` — primary interactive element
- `Button` — for `actions` slot
- `StatusBadge` — for `status` slot
