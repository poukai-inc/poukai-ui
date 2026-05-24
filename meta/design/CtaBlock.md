# CtaBlock

**Status:** Approved (Phase 2 pilot — user-stakeholder sign-off; pending poukai-design canonical pass).

## 1. Intent

`CtaBlock` is the reusable heading + body + action row used wherever a surface needs an inline conversion moment — the "Ready to start? [Get a demo]" pattern. It serves marketing pages, end-of-feature sections, and any content moment that needs to close with a call to action. It is a molecule, not a page section: it carries no `<section>` wrapper, no block padding, and no surface of its own. The `CTASection` organism composes `CtaBlock` inside a `Section` frame when full-page placement is needed.

## 2. Anatomy

```
┌─────────────────────────────────────┐
│ [heading]                           │
│ [body]                              │
│ [actions]                           │
└─────────────────────────────────────┘
  stacked (default)

┌──────────────────────┬──────────────┐
│ [heading]            │  [actions]   │
│ [body]               │              │
└──────────────────────┴──────────────┘
  horizontal (orientation="horizontal")
```

- **Heading** — `<h2>` by default (overridable via `headingAs`). Instrument Serif, `--fs-h2`.
- **Body** — supporting paragraph. Geist, `--fs-body`, `--fg-muted`. Optional.
- **Actions slot** — `ReactNode`. Accepts one or two `<Button>` instances. Consumer composes the buttons; `CtaBlock` provides the slot container and spacing.

In `orientation="horizontal"` the heading + body column sits on the left; the actions slot aligns to the trailing edge. Collapses to stacked below `--bp-md`.

## 3. Tokens

- `--font-serif` — heading font family
- `--fs-h2` — heading font size (`clamp(1.75rem, 1.25rem + 2vw, 2.5rem)`)
- `--font-sans` — body font family (inherited from body)
- `--fs-body` — body font size
- `--fg` — heading color
- `--fg-muted` — body color
- `--space-2` — heading → body gap
- `--space-6` — body → actions gap (stacked); also actions column inline padding (horizontal)
- `--space-8` — heading → actions gap when body is absent (stacked)
- `--bp-md` — breakpoint for horizontal → stacked collapse (`768px`)
- `--lh-body` — body line-height

## 4. Variants / Props

| Prop          | Type                        | Default     | Rationale                                                                                                                      |
| ------------- | --------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `heading`     | `ReactNode`                 | —           | Required. Primary CTA text.                                                                                                    |
| `headingAs`   | `"h1" \| "h2" \| "h3"`      | `"h2"`      | `h2` is correct when CtaBlock sits below a Hero h1. Override for nested contexts.                                              |
| `body`        | `ReactNode`                 | `undefined` | Optional. Absent: heading jumps directly to actions gap (`--space-8`).                                                         |
| `actions`     | `ReactNode`                 | —           | Required. The CTA button(s). Consumer owns the Button composition.                                                             |
| `orientation` | `"stacked" \| "horizontal"` | `"stacked"` | `stacked` is the safe default; `horizontal` is the wide-viewport editorial form.                                               |
| `align`       | `"start" \| "center"`       | `"start"`   | `start` matches the brand's restrained left-aligned register. `center` for symmetrical moments (e.g. a full-bleed CTASection). |

## 5. Interaction

None on the container. All interactive behavior is owned by the slotted `actions` content (Button, Link). Tab order follows document order: heading → body → first action → second action.

## 6. A11y

- Heading renders as the element specified by `headingAs` (`h2` default). Consumer must maintain correct heading hierarchy — `CtaBlock` cannot enforce it.
- Actions slot: no ARIA wrapper needed; the slot is a plain flow container. Individual buttons carry their own accessible labels.
- No `role` or `aria-*` on the CtaBlock root beyond what the semantic element provides.
- Contrast: `--fg` on `--bg` = 16.29:1 (AAA). `--fg-muted` on `--bg` = 4.91:1 (AA normal). Both pass at all text sizes.

## 7. Motion

None — static component. Slotted Button instances own their own hover/press transitions via `--dur-fast`, `--dur-press`, `--easing`. The `prefers-reduced-motion` block in `tokens.css` handles suppression globally.

## 8. Anti-patterns

- **Not a page section.** `CtaBlock` has no block padding and no `<section>` wrapper. For end-of-page placement, compose inside `CTASection` (organism).
- **Not a Hero replacement.** `CtaBlock` does not own the `<h1>`. It is a conversion moment, not the page's primary identity.
- **Not a card.** `CtaBlock` has no background surface, no border, no elevation. Do not use it as a card container.
- **Not for multi-step flows.** Action rows with three or more distinct choices should use a dedicated pattern (e.g. `Stepper`).
- **Not for form submission.** Inline form patterns (newsletter signup, waitlist) belong to `NewsletterField` or `SearchField`, not `CtaBlock`.

## 9. Depends on

- `Button` (atom) — the expected content of the `actions` slot
- `Heading` (atom) — optionally used by consumers who need heading slot polymorphism
- `Text` (atom) — optionally used by consumers for richer body content

## Open questions

None. All tokens consumed exist in `src/tokens/tokens.css`. No new tokens required.
