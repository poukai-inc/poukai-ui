# Design spec: Radio + RadioGroup

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-21

---

## Intent

`RadioGroup` and `Radio` are the canonical single-selection form primitive for the pouk.ai design system. Together they replace any ad-hoc `<input type="radio">` usage on form surfaces.

`RadioGroup` wraps `@radix-ui/react-radio-group` `Root`. `Radio` wraps `RadioGroup.Item`. Both are exported as flat named exports — no namespace, no `RadioGroup.Root`, no `RadioGroup.Item` on the consumer surface. This is a hard naming constraint: the engineer must not ship a `RadioGroup.Root` compound API. The public surface is exactly:

```tsx
import { RadioGroup, Radio } from "@poukai-inc/ui";
```

**Primary use cases**: mutually exclusive option selection inside form surfaces — settings panes, onboarding flows, filter panels, anywhere a single choice from a discrete set is required.

**Non-goals:**

- No `<label>` injection. Label pairing is the consumer's responsibility (see §Composition).
- No validation logic. Consumer responsibility (Zod, React Hook Form, etc.).
- No icon or description slots on `Radio` itself. Consumer composes via sibling elements.
- No custom indicator graphics or brand illustrations inside the circle.

---

## API

### `RadioGroup`

Thin `forwardRef` wrapper around `@radix-ui/react-radio-group` `Root`. The Radix primitive handles ARIA group role, keyboard navigation, and `aria-required`/`aria-disabled` propagation.

```tsx
interface RadioGroupProps {
  // Value / change — controlled
  value?: string;
  onValueChange?: (value: string) => void;

  // Uncontrolled initial value
  defaultValue?: string;

  // Form field name (native form submission)
  name?: string;

  // Layout — default "vertical"
  orientation?: "horizontal" | "vertical";

  // Accessibility — one of these is required when RadioGroup is not
  // wrapped by an element that already provides a visible heading.
  // If neither is supplied, Radix will still render, but AT users
  // will have no group label. Document in worked examples.
  "aria-label"?: string;
  "aria-labelledby"?: string;

  // State
  disabled?: boolean;
  required?: boolean;

  // Standard
  className?: string;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}
```

**Orientation layout contract:**

| `orientation` | flex-direction | gap             |
| ------------- | -------------- | --------------- |
| `"vertical"`  | column         | `var(--space-2)` |
| `"horizontal"`| row            | `var(--space-4)` |

Default is `"vertical"`. This matches the form-field reading direction and keeps labels scannable in a column without cognitive cost.

---

### `Radio`

Thin `forwardRef` wrapper around `@radix-ui/react-radio-group` `RadioGroup.Item`. Radix handles `role="radio"`, `aria-checked`, and keyboard routing within the group.

```tsx
interface RadioProps {
  // Required — binds this item's checked state to the group value
  value: string;

  // State
  disabled?: boolean;

  // Standard forwarding
  id?: string;
  className?: string;
  ref?: Ref<HTMLButtonElement>;

  // aria-* forwarded via ...rest
}
```

`Radio` is control-only. It renders no label text. Label pairing is always a consumer responsibility — see §Composition.

---

## Anatomy

```
[RadioGroup — <div role="radiogroup">]
  └── [Radio — <button role="radio">]          (repeated)
        └── [Radix Indicator — <span>]
              └── [::after pseudo — 8px dot]   (visible when checked)
```

**Radio circle (the control):**

- 16 × 16 px element
- `border-radius: 50%`
- `border: 1px solid var(--hairline)` at rest
- `background: var(--bg)`
- `flex-shrink: 0` — never squashed when placed beside label text

**Checked indicator:**

- Radix mounts the `Indicator` child only when the item is checked (`data-state="checked"`). The engineer styles it as an inline-flex centering shell (`display: flex; align-items: center; justify-content: center; width: 100%; height: 100%`).
- The 8 px filled dot is a CSS `::after` pseudo on the Indicator:
  - `width: 8px; height: 8px`
  - `border-radius: 50%`
  - `background: var(--fg)`
  - No separate SVG, no Lucide icon, no `<Icon>` component.

**Rationale for CSS-only indicator:** The `<Icon>` component pulls Lucide icons as React components. Wiring Lucide inside a Radix Indicator creates a component-test (CT) import-graph dependency that has blocked prior atoms in CI. A CSS `::after` pseudo is semantically complete, visually correct, and has zero external dependencies. It is also trivially invertible for dark mode without any code change (the dot inherits `--fg` which flips automatically).

---

## Tokens used

No new tokens. All values resolved from the existing vocabulary.

| Token          | Value                           | Role                                              |
| -------------- | ------------------------------- | ------------------------------------------------- |
| `--bg`         | `#fbfbfd`                       | Radio circle background at rest                   |
| `--bg-elevated`| `#ffffff`                       | Radio circle background when on elevated surface  |
| `--fg`         | `#1d1d1f`                       | Checked indicator dot fill                        |
| `--fg-muted`   | `#6e6e73`                       | Hover border color (one step darker than hairline)|
| `--hairline`   | `#d2d2d7`                       | Resting border                                    |
| `--accent`     | `#0071e3`                       | Focus ring                                        |
| `--danger`     | `#b3261e`                       | Invalid border (`aria-invalid="true"`)            |
| `--space-2`    | `0.5rem` (8px)                  | Gap between items — vertical orientation          |
| `--space-4`    | `1rem` (16px)                   | Gap between items — horizontal orientation        |
| `--radius-1`   | `2px`                           | Focus ring `border-radius`                        |
| `--dur-fast`   | `180ms`                         | Border-color and background transitions           |
| `--easing`     | `cubic-bezier(0.16, 1, 0.3, 1)` | Transition easing                                 |

**Zero new tokens introduced.**

---

## States

| State                     | Visual treatment                                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Default (unselected)      | `1px solid var(--hairline)` border; `var(--bg)` fill; no indicator                                                  |
| Hover (unselected, enabled)| Border shifts to `var(--fg-muted)` — one tone step darker than `--hairline`, signals affordance without accent bleed |
| Checked                   | Border holds `var(--hairline)`; Radix `Indicator` mounts; `::after` dot `var(--fg)` appears centered               |
| Hover (checked, enabled)  | Same as checked — border holds; no additional treatment                                                               |
| Focus-visible             | `outline: 2px solid var(--accent); outline-offset: 2px; border-radius: var(--radius-1)` on the `<button>` root      |
| Disabled                  | `opacity: 0.5; cursor: not-allowed; pointer-events: none` — applies to the item; group-level `disabled` cascades to all items |
| Invalid                   | `aria-invalid="true"` on `Radio` → border `var(--danger)` (see §A11y for when to set this)                          |

**Hover rationale:** Using `--fg-muted` (not `--accent`) for hover border keeps the unselected hover in the neutral register. The accent is reserved for focus (keyboard) and the active selection indicator — using it on hover would create accent-color noise across dense radio lists.

**Checked indicator color:** `--fg` (near-black in light mode, near-white in dark mode) rather than `--accent`. This reads as a content/state signal, not an interactive affordance, which is the correct register for a selection that has already been made. Dark mode inverts automatically without any additional CSS.

---

## A11y

Radix RadioGroup implements the WAI-ARIA [Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/). The DS inherits at zero cost:

- `role="radiogroup"` on the `RadioGroup` root element
- `role="radio"` on each `Radio` item
- `aria-checked="true"` on the selected item
- `aria-disabled` propagated from group `disabled` to each item
- `aria-required` propagated from group `required`

**Keyboard — Radix-native, do not override:**

| Key      | Behavior in vertical group       | Behavior in horizontal group      |
| -------- | -------------------------------- | --------------------------------- |
| `↓` / `→`| Move focus + select next item    | Move focus + select next item     |
| `↑` / `←`| Move focus + select previous item| Move focus + select previous item |
| `Tab`    | Move focus into / out of group   | Move focus into / out of group    |
| `Space`  | Select focused item              | Select focused item               |

Radix uses the [roving tabindex](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex) pattern: only the selected (or first) item is in the tab sequence; arrow keys move within the group. Do not add `onKeyDown` handlers that replicate arrow-key logic — this breaks native Radix behavior.

**Group label requirement:** Every `RadioGroup` must be programmatically labelled. Pass either:

- `aria-label="Group name"` — when no visible heading exists nearby
- `aria-labelledby="heading-id"` — when a visible heading already labels the group

If neither is supplied, AT users lose group context. The engineer should emit a `console.warn` in development when both are absent.

**Invalid state:** `aria-invalid="true"` on a `Radio` item signals an error condition to AT. The recommended pattern is to set it on the `RadioGroup` root (Radix forwards it) rather than individual items, unless the error is item-specific. Pair with a visible error message linked via `aria-describedby` on the group root.

**Contrast (verified against `meta/brand.md`):**

| Pair                                        | Ratio     | Verdict                                        |
| ------------------------------------------- | --------- | ---------------------------------------------- |
| `--fg` (#1D1D1F) dot on `--bg` (#FBFBFD)    | 16.29 : 1 | AAA                                            |
| `--accent` focus ring on `--bg` (#FBFBFD)   | 5.41 : 1  | WCAG 1.4.11 non-text contrast 3:1 ✓            |
| `--danger` (#B3261E) on `--bg` (#FBFBFD)    | ~7.2 : 1  | AA — distinct from accent, reads as error ✓    |

---

## Motion

Color transitions only. No scale, bounce, or entrance animation.

```
border-color: transition var(--dur-fast) var(--easing)
background:   transition var(--dur-fast) var(--easing)
```

The `::after` indicator dot appears/disappears with Radix's conditional mount of the `Indicator` slot — no transition needed on the dot itself; the `--dur-fast` border transition provides sufficient visual continuity.

The global `@media (prefers-reduced-motion: reduce)` block in `tokens.css` zeroes all transitions system-wide. No per-component override needed.

---

## Composition

### (a) Control-only (consumer owns label)

```tsx
<RadioGroup
  value={plan}
  onValueChange={setPlan}
  aria-label="Billing plan"
>
  <label>
    <Radio value="monthly" id="plan-monthly" />
    Monthly
  </label>
  <label>
    <Radio value="annual" id="plan-annual" />
    Annual
  </label>
</RadioGroup>
```

`<label>` wraps both `Radio` and the text. Clicking the label text activates the radio. No `htmlFor` / `id` pairing needed when the label wraps the control directly.

### (b) Explicit `htmlFor` / `id` pairing

```tsx
<RadioGroup
  value={role}
  onValueChange={setRole}
  aria-label="Role"
>
  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
    <Radio value="engineer" id="role-engineer" />
    <label htmlFor="role-engineer">Engineer</label>
  </div>
  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
    <Radio value="designer" id="role-designer" />
    <label htmlFor="role-designer">Designer</label>
  </div>
</RadioGroup>
```

### (c) Horizontal layout

```tsx
<RadioGroup
  value={size}
  onValueChange={setSize}
  orientation="horizontal"
  aria-label="T-shirt size"
>
  {["XS", "S", "M", "L", "XL"].map((s) => (
    <label key={s} style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
      <Radio value={s.toLowerCase()} />
      {s}
    </label>
  ))}
</RadioGroup>
```

### (d) Inside `<Field>` with error

`Field` currently uses `cloneElement` to inject `aria-invalid` into a single child. For a `RadioGroup`, the recommended pattern is to pass the group directly as `Field`'s child. The engineer should verify `cloneElement` forwards `aria-invalid` to the Radix root div; if not, wire `aria-invalid` manually on `RadioGroup`.

```tsx
<Field label="Preferred contact" error="Please select one option." id="contact-method">
  <RadioGroup
    name="contact-method"
    aria-labelledby="contact-method-label"
  >
    <label><Radio value="email" /> Email</label>
    <label><Radio value="phone" /> Phone</label>
    <label><Radio value="slack" /> Slack</label>
  </RadioGroup>
</Field>
```

Note: `Field` generates an id for its label element. Pass that id as `aria-labelledby` on `RadioGroup` to wire the visible label to the group — this replaces `aria-label` when using `Field`.

### (e) Uncontrolled

```tsx
<RadioGroup defaultValue="standard" name="shipping" aria-label="Shipping speed">
  <label><Radio value="standard" /> Standard (3–5 days)</label>
  <label><Radio value="express" /> Express (1–2 days)</label>
</RadioGroup>
```

---

## Open questions

None at approval. Known future considerations deferred explicitly:

- **Description slot per item.** Some radio patterns show a title + supporting description per option (e.g. pricing cards). This is a consumer-side composition pattern (sibling `<p>` linked via `aria-describedby` on the `Radio`) — not a DS primitive. Revisit if a `RadioCard` molecule is needed.
- **`Field` + `RadioGroup` `cloneElement` compatibility.** The engineer should test whether `Field`'s `cloneElement` injection produces correct `aria-invalid` on the Radix root. If Radix filters unknown props, the pattern in §Composition (d) needs a manual `aria-invalid` prop instead.
- **Dark mode `--bg` on `Radio` background.** Dark mode `--bg` is `#000000`. The radio circle background will be pure black in dark mode, which is correct (it matches the page canvas). If future surfaces require an elevated-surface radio (e.g. inside a card with `--bg-elevated`), the engineer can accept a `surface` prop that swaps the background token. Not specified in v1.

---

## Changelog

| Date       | Author          | Change                                     |
| ---------- | --------------- | ------------------------------------------ |
| 2026-05-21 | poukai-design   | Initial spec authored. Status: Approved.   |
