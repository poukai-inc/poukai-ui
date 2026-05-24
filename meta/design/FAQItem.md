# FAQItem

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

FAQItem is a single collapsible question-and-answer row for FAQ surfaces. It wraps one question (rendered as a heading) and a Prose answer inside an Accordion item, giving keyboard-accessible expand/collapse behaviour without bespoke state management. It is consumed by composing multiple FAQItem instances inside an `<Accordion type="single" collapsible>` or `type="multiple"` wrapper on marketing, docs, and support pages.

## 2. Anatomy

```
<Accordion.Item>               ← owns open/closed state
  <Accordion.Trigger>          ← clickable row
    [question heading]         ← Heading (h3 default, configurable)
    [chevron icon]             ← Icon, rotates on open
  </Accordion.Trigger>
  <Accordion.Content>          ← animated panel
    <Prose>                    ← answer body (slot)
    </Prose>
  </Accordion.Content>
</Accordion.Item>
```

- **Trigger row**: full-width button. Question text left-aligned; chevron icon right-aligned.
- **Question**: Heading atom at h3 (overridable). Font: `--font-sans`, `--fs-h3`, `--fg`.
- **Chevron**: Icon (lucide `chevron-down`), `--icon-sm` (16px). Rotates 180° when open.
- **Content panel**: animated height expansion. Holds a single Prose slot (ReactNode accepted).
- **Divider**: `--hairline-w` `--hairline` border-bottom on each item row; first item gets border-top too, creating a clean ruled list without a wrapping card surface.

## 3. Tokens

- `--fg` — question text color
- `--fg-muted` — chevron icon color at rest
- `--accent` — chevron icon color on trigger focus-visible
- `--font-sans` — question font family
- `--fs-h3` — question font size (1.125rem / 18px)
- `--fs-body` — answer body font size (inherited by Prose)
- `--lh-body` — answer line-height (inherited by Prose)
- `--hairline` — item border color
- `--hairline-w` — border width (1px)
- `--space-4` — trigger vertical padding (top + bottom), answer panel top padding
- `--space-6` — answer panel bottom padding
- `--icon-sm` — chevron size (16px)
- `--dur-mid` — chevron rotation duration (240ms)
- `--dur-fast` — panel height transition duration (180ms)
- `--easing` — timing function for both transitions

## 4. Variants / Props

| Prop         | Type                   | Default  | Rationale                                                                                                                                   |
| ------------ | ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `question`   | `string`               | required | The question text. Always a string; heading semantics applied internally.                                                                   |
| `value`      | `string`               | required | Unique key for Accordion state (Radix requirement).                                                                                         |
| `questionAs` | `"h2" \| "h3" \| "h4"` | `"h3"`   | Heading level. h3 is correct when FAQItem sits inside a Section with an h2 title; override to h2 for standalone FAQ with no parent heading. |
| `children`   | `ReactNode`            | required | Answer content. Consumers pass `<Prose>` or a plain paragraph. FAQItem does not opine on answer formatting beyond the Prose slot.           |

No `defaultOpen` prop — that is set on the parent `<Accordion>` via its `defaultValue`. FAQItem is a pure item; it holds no open/closed state of its own.

## 5. Interaction

- **Click / Space / Enter on trigger**: toggles the panel open or closed (delegated to Radix Accordion).
- **Arrow Up / Down**: moves focus between sibling triggers (Radix keyboard model).
- **Home / End**: focuses first / last trigger in the Accordion group (Radix keyboard model).
- **Chevron rotation**: 0° → 180° on open; reverses on close. Transition: `--dur-mid` `--easing`.
- **Panel height**: `height: 0` → `height: auto` via Radix's `--radix-accordion-content-height` CSS variable. Transition: `--dur-fast` `--easing`.
- **Hover on trigger**: `--fg-muted` chevron lifts to `--fg`. Transition: `--dur-fast`.
- **Focus-visible on trigger**: `2px solid var(--accent)` outline, `outline-offset: 4px`, `border-radius: var(--radius-1)`.

## 6. A11y

- Radix `Accordion.Trigger` renders as `<button>` with `aria-expanded` managed automatically.
- Radix `Accordion.Content` receives `role="region"` and `aria-labelledby` pointing to its trigger — forming a proper disclosure widget.
- The `questionAs` prop controls heading level; default h3 is correct when FAQItem lives under a Section h2. Consumers must not skip heading levels.
- No additional ARIA attributes needed beyond what Radix supplies.
- Contrast: `--fg` on `--bg` = 16.29:1 (AAA). `--fg-muted` on `--bg` = 4.91:1 (AA).
- axe rules in play: `button-name` (question text is the accessible name), `heading-order`.

## 7. Motion

- **Chevron rotation**: `transform: rotate(180deg)`, `transition: transform var(--dur-mid) var(--easing)`.
- **Panel expand/collapse**: `height` animated via Radix's CSS variable (`--radix-accordion-content-height`). `transition: height var(--dur-fast) var(--easing)`.
- **`prefers-reduced-motion: reduce`**: the global `tokens.css` block sets `transition-duration: 0.01ms !important`, collapsing both transitions to instant. No component-level override required.

## 8. Anti-patterns

- Do not use FAQItem for non-question content — it is not a generic disclosure row. Use `Disclosure` for "Show details" toggles.
- Do not nest FAQItem inside another FAQItem. Accordion nesting is not a supported pattern.
- Do not render a single FAQItem in isolation outside an `<Accordion>` wrapper — Radix's state and keyboard model require the wrapper.
- Do not put long interactive content (forms, tables) inside the answer slot — the animated height panel creates layout reflow; use a Popover or Dialog for complex interactive content.
- Do not rely on FAQItem for navigation (e.g. linking to anchor targets). Use `LinkList` for anchor lists.

## 9. Depends on

- `Accordion` molecule (Radix `@radix-ui/react-accordion` + DS tokens)
- `Heading` atom (question text)
- `Prose` molecule (answer body)
- `Icon` atom (chevron, lucide `chevron-down`)
