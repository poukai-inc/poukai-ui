# Accordion

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`<Accordion>` is the system's canonical collapsible-disclosure group — a Radix-wrapped molecule that renders one or more vertically stacked items, each with a trigger header and a collapsible content panel. It serves FAQ lists, settings groups, and any surface where multiple sections of content must be progressively disclosed without consuming full vertical space at rest. Supports both `type="single"` (only one item open at a time) and `type="multiple"` (any number open simultaneously).

## 2. Anatomy

```
┌─ Accordion.Root ──────────────────────────────┐
│ ┌─ Accordion.Item ──────────────────────────┐ │
│ │ ┌─ Accordion.Trigger ───────────────────┐ │ │
│ │ │  [chevron icon]  Trigger label        │ │ │
│ │ └───────────────────────────────────────┘ │ │
│ │ ┌─ Accordion.Content ───────────────────┐ │ │
│ │ │  Content panel (any ReactNode)        │ │ │
│ │ └───────────────────────────────────────┘ │ │
│ └───────────────────────────────────────────┘ │
│  … additional items                           │
└───────────────────────────────────────────────┘
```

- **Root**: `@radix-ui/react-accordion` `Accordion` — owns `type`, `value`, `defaultValue`, `collapsible`.
- **Item**: `Accordion.Item` — wraps one trigger + content pair; carries a `value` string.
- **Trigger**: `Accordion.Trigger` — full-width button row. Renders trigger label (slot: `children`) + trailing chevron Icon (`lucide-react`, `--icon-sm`). Chevron rotates 180° when open.
- **Content**: `Accordion.Content` — animated height-collapse panel. Accepts any `ReactNode`; idiomatic usage is `<Prose>` or plain text.
- **Dividers**: `--hairline-w` border-bottom on each Item; `--hairline-w` border-top on Root to cap the stack.

## 3. Tokens

- `--fg` — trigger label text color
- `--fg-muted` — chevron icon color at rest
- `--bg` — content panel background (inherits page canvas)
- `--surface` — optional tinted content panel background (consumer opt-in via `tone="tinted"`)
- `--hairline` — item divider border color
- `--hairline-w` — border width (1px)
- `--font-sans` — trigger font family
- `--fs-body` — trigger label font size
- `--lh-body` — trigger label line-height
- `--space-4` — trigger block padding (top + bottom) and content block padding
- `--space-6` — content inline padding
- `--accent` — focus ring color on trigger
- `--radius-1` — focus ring border-radius
- `--dur-fast` — content height transition duration (180ms)
- `--easing` — content height transition easing (expo-out)
- `--icon-sm` — chevron icon size (16px)

## 4. Variants / Props

| Prop | Type | Default | Rationale |
|---|---|---|---|
| `type` | `"single" \| "multiple"` | `"single"` | Single is the FAQ default; multiple for settings groups where independent rows matter |
| `collapsible` | `boolean` | `true` | Allows the sole open item to close; `false` forces one always-open (rare, explicit opt-out) |
| `defaultValue` | `string \| string[]` | `undefined` | Uncontrolled initial open item(s) |
| `value` | `string \| string[]` | `undefined` | Controlled open state |
| `onValueChange` | `fn` | `undefined` | Controlled change handler |
| `tone` | `"default" \| "tinted"` | `"default"` | `tinted` applies `--surface` to content panels for increased separation |

`Accordion.Item` props: `value: string` (required), `disabled?: boolean`.

`Accordion.Trigger` props: `children: ReactNode` (the label). Chevron is always rendered by the DS — consumers do not slot it.

`Accordion.Content` props: `children: ReactNode`.

## 5. Interaction

- **Click / tap trigger**: toggles the item open/closed per `type` rules.
- **Keyboard (Radix default)**:
  - `Space` / `Enter` on focused trigger: toggle.
  - `Tab` / `Shift+Tab`: move focus between triggers and any focusable content inside open panels.
  - `Arrow Down` / `Arrow Up`: move focus between triggers within the accordion.
  - `Home` / `End`: jump to first / last trigger.
- **Hover**: trigger background shifts to `--surface` at `@media (hover: hover)`.
- **Focus-visible**: `outline: 2px solid var(--accent)` with `outline-offset: 4px` and `border-radius: var(--radius-1)` on the trigger button.
- **Disabled item**: trigger is `[disabled]`, cursor `not-allowed`, `--fg-muted` text, no hover treatment.

## 6. A11y

- Radix renders the trigger as `<button>` with `aria-expanded` (true/false) and `aria-controls` pointing to the content panel id.
- Content panel carries `role="region"` and `aria-labelledby` pointing to its trigger id.
- Root renders as a `<div>` — no additional landmark role; the surrounding page context (e.g. `<section>` from `Section`) provides the landmark.
- `disabled` items carry `aria-disabled="true"` (Radix default).
- Chevron icon must be `aria-hidden="true"` — it is decorative; the trigger label provides the accessible name.
- axe rules in play: `button-name`, `aria-required-children`, `color-contrast` on trigger text.

## 7. Motion

- **Content panel**: height animates using Radix's `data-state` attribute (`data-state="open"` / `data-state="closed"`). CSS: `grid-row` trick (`0fr` → `1fr`) or `max-height` transition on the Radix `Content` element.
  - Duration: `var(--dur-fast)` (180ms).
  - Easing: `var(--easing)` (expo-out) for open; `ease-in` at same duration for close.
- **Chevron rotation**: `transform: rotate(0deg)` → `rotate(180deg)`, same `--dur-fast` / `--easing`.
- **`prefers-reduced-motion`**: the global `@media (prefers-reduced-motion: reduce)` block in `tokens.css` clamps all `transition-duration` to `0.01ms` — both the height transition and the chevron rotation collapse to instant. No per-component override needed.

## 8. Anti-patterns

- **Not a replacement for `<Disclosure>`**: a single show/hide toggle does not need Accordion. Use `Disclosure` for standalone expandable rows; use `Accordion` only when two or more items form a logical group.
- **Not a navigation component**: trigger actions should disclose content, not navigate to a new URL. Use `NavLink` or `LinkList` for navigation.
- **Not a stepper or tab set**: Accordion items are independent disclosure units, not sequential steps (`Stepper`) or mutually exclusive views (`Tabs`).
- **Not a modal**: long-form content that requires full attention belongs in a `Dialog`, not an Accordion panel.
- **Not a data table**: collapsible row expansion in a table is a `DataTable` concern, not a standalone Accordion.

## 9. Depends on

- `@radix-ui/react-accordion` — Radix primitive (explicit per instructions; Radix wrap is called for in the issue).
- `Heading` — for trigger labels that need semantic heading weight inside `FAQItem`.
- `Icon` (`lucide-react` `ChevronDown`) — trailing chevron in the trigger row.

## Open questions

- **Trigger heading level**: FAQ usage typically wants the trigger label to carry an `h3` for document outline correctness. The current spec treats the trigger as a plain `<button>`. An optional `headingAs?: "h2" | "h3" | "h4"` prop on `Accordion.Trigger` (wrapping the label in the named heading inside the button, per ARIA Authoring Practices) would solve this — but it adds complexity. Needs a call before implementation.
- **Content panel background token gap**: `tone="tinted"` uses `--surface` for the panel background. If a mid-tier between `--bg` and `--surface` is ever needed for nested accordion panels, a `--surface-inset` token would be required. No such token exists today; `--surface` is the closest existing value.
