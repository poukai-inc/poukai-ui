# Design spec: Tabs

**Atomic layer**: organism
**Status**: Approved
**Author**: poukai-design (inline — promoted from ROADMAP "Maybe" by Arian, 2026-05-19)
**Last updated**: 2026-05-19

---

## 1. Purpose

`Tabs` is the canonical tabbed-interface primitive for the pouk.ai design system. It wraps `@radix-ui/react-tabs` (already declared in `dependencies`) so all accessibility plumbing — ARIA roles (`tablist`, `tab`, `tabpanel`), keyboard navigation (arrow keys, Home/End), focus management, and `aria-selected` / `aria-controls` / `aria-labelledby` wiring — is delegated to a battle-tested library. The DS adds brand styling only.

**Primary use cases**: content-organised product pages (e.g. a future `/work` page), settings panels, feature-category grids, any surface where a reader selects one of N mutually-exclusive content panels.

**Non-goals — explicit exclusions:**

- **Not a router.** Tabs do not own URL state or push history entries. Consumers who want URL-synced tabs manage `value` / `onValueChange` against their router themselves.
- **Not lazy-loadable at the DS level.** Content panels are rendered eagerly. Consumers who want deferred loading wrap `Tabs.Content` children in `<Suspense>` themselves.
- **Not a segmented control.** A segmented control is a form input that selects a value. Tabs are a navigation/content-organisation primitive. Distinct interaction semantics.
- **Not an accordion.** Vertical stacked disclosure is a future primitive.

---

## 2. Anatomy

### API shape decision: compound pattern + one convenience wrapper

Mirrors the `Dialog` pattern exactly. Two-layer API:

**Compound subcomponents** (`Tabs.Root`, `Tabs.List`, `Tabs.Trigger`, `Tabs.Content`) — full composition control. Consumers who need custom trigger rendering (icons, badges, tooltips), conditional panels, or mixed content use this directly.

**`TabsBasic` convenience wrapper** — data-driven API. Consumer passes a `tabs` array; the wrapper composes the compound parts. Covers the 90% case.

### Named anatomy parts

- **`Tabs.Root`** — State controller. Thin forwardRef wrapper around `Radix.Tabs.Root`. Accepts `value` + `onValueChange` (controlled) or `defaultValue` (uncontrolled). `orientation: "horizontal" | "vertical"` (default `"horizontal"`).
- **`Tabs.List`** — Wrapper for triggers. Sets `role="tablist"` via Radix. DS styles: horizontal hairline border-bottom, flex row, overflow-x scroll for narrow viewports.
- **`Tabs.Trigger`** — Individual tab button. Required `value` prop binds to a `Tabs.Content` of the same value. DS styles: meta typography, `--fg-muted` at rest, `--fg` on hover/active, accent inset shadow on active.
- **`Tabs.Content`** — Content panel for a given tab. Required `value` prop. DS styles: `padding-top: var(--space-6)`.

**`TabsBasic`** — Convenience wrapper. Props: `tabs: { value: string; label: string; content: ReactNode }[]`, `defaultValue?`, `value?`, `onValueChange?`, `orientation?`, `className?`. Internally composes the compound parts.

---

## 3. Tokens used

No new tokens. All values are drawn from the existing token vocabulary.

| Token          | Value                           | Role                                                                            |
| -------------- | ------------------------------- | ------------------------------------------------------------------------------- |
| `--hairline`   | `#d2d2d7`                       | Border-bottom on `Tabs.List` (horizontal) or border-right (vertical)            |
| `--hairline-w` | `1px`                           | Hairline stroke weight                                                          |
| `--space-1`    | `0.25rem` (4px)                 | `Tabs.Trigger` horizontal padding                                               |
| `--space-2`    | `0.5rem` (8px)                  | `Tabs.Trigger` vertical padding                                                 |
| `--space-4`    | `1rem` (16px)                   | Gap between triggers in `Tabs.List`                                             |
| `--space-6`    | `1.5rem` (24px)                 | `Tabs.Content` padding-top (horizontal); `Tabs.Content` padding-left (vertical) |
| `--fs-meta`    | `0.875rem` (14px)               | Trigger font size                                                               |
| `--lh-meta`    | `1.2`                           | Trigger line-height                                                             |
| `--font-sans`  | Geist stack                     | Trigger font family                                                             |
| `--fg`         | `#1d1d1f`                       | Trigger color on hover, active, and content text                                |
| `--fg-muted`   | `#6e6e73`                       | Trigger color at rest                                                           |
| `--accent`     | `#0071e3`                       | Active trigger inset shadow; focus ring                                         |
| `--radius-1`   | `2px`                           | Trigger and content focus ring border-radius                                    |
| `--dur-fast`   | `180ms`                         | Trigger color and box-shadow transition duration                                |
| `--easing`     | `cubic-bezier(0.16, 1, 0.3, 1)` | Trigger transition easing (expo-out)                                            |

**Zero new tokens introduced.**

---

## 4. Layout & rhythm

### Tabs.List — horizontal (default)

```
[Tabs.List]
  display: flex
  gap: var(--space-4)                       ← 16px between triggers
  border-bottom: var(--hairline-w) solid var(--hairline)
  overflow-x: auto
  scrollbar-width: none                     ← hide scrollbar (still scrollable)
```

Horizontal `Tabs.List` scrolls horizontally on overflow. This handles the 5+ tabs case without wrapping triggers to a second line (which breaks the tablist mental model).

### Tabs.List — vertical

```
[Tabs.List]
  flex-direction: column
  border-bottom: none
  border-right: var(--hairline-w) solid var(--hairline)
```

### Tabs.Trigger

```
[Tabs.Trigger]
  appearance: none
  border: none
  background: transparent
  cursor: pointer
  padding: var(--space-2) var(--space-1)
  font-family: var(--font-sans)
  font-size: var(--fs-meta)
  line-height: var(--lh-meta)
  font-weight: 500
  color: var(--fg-muted)                    ← rest
  box-shadow: none                          ← rest
  transition: color var(--dur-fast) var(--easing),
              box-shadow var(--dur-fast) var(--easing)
  border-radius: var(--radius-1)            ← for focus ring shape
  outline: none                             ← reset; :focus-visible handles ring

[Tabs.Trigger]:hover
  color: var(--fg)

[Tabs.Trigger][data-state="active"] — horizontal
  color: var(--fg)
  box-shadow: inset 0 -2px 0 var(--accent)  ← 2px inset bottom accent

[Tabs.Trigger][data-state="active"] — vertical
  color: var(--fg)
  box-shadow: inset -2px 0 0 var(--accent)  ← 2px inset right accent

[Tabs.Trigger]:focus-visible
  outline: 2px solid var(--accent)
  outline-offset: 2px
  border-radius: var(--radius-1)
```

### Tabs.Content

```
[Tabs.Content] — horizontal
  padding-top: var(--space-6)

[Tabs.Content] — vertical
  padding-top: 0
  padding-left: var(--space-6)

[Tabs.Content]:focus-visible
  outline: 2px solid var(--accent)
  outline-offset: 2px
  border-radius: var(--radius-1)
```

Radix moves focus to the content panel when a tab is activated via keyboard. The `:focus-visible` outline surfaces that focus for keyboard users.

---

## 5. States & motion

### Active indicator

The active tab is signalled by an inset `box-shadow` (2px) in `var(--accent)`:

- Horizontal: `inset 0 -2px 0 var(--accent)` — underline on the trigger's bottom edge, flush with the list's hairline border.
- Vertical: `inset -2px 0 0 var(--accent)` — left-side accent flush with the list's hairline right border.

`box-shadow` is preferred over `border-bottom` because it does not affect layout (no height/width shift). The inset direction ensures the accent overlaps the list's hairline, creating a clean "tab selected" visual without a gap.

### Transitions

`color` and `box-shadow` transition at `var(--dur-fast)` (180ms) with `var(--easing)` (expo-out). This matches the Button and Link hover transitions — snappy but not instantaneous.

### Reduced motion

The global block in `tokens.css` gates all animations and transitions behind `prefers-reduced-motion: reduce`. No per-component override needed.

---

## 6. Accessibility

Radix Tabs implements the WAI-ARIA Tabs pattern. The DS inherits at zero cost:

- `role="tablist"` on `Tabs.List`
- `role="tab"` on each `Tabs.Trigger`; `aria-selected="true"` on the active trigger
- `role="tabpanel"` on each `Tabs.Content`; `aria-labelledby` wired to the active trigger's id
- Arrow key navigation:
  - Horizontal: Left/Right arrows move focus between triggers
  - Vertical: Up/Down arrows move focus between triggers
  - Home: jump to first trigger; End: jump to last trigger
- Focus management: Radix activates the tab on focus (automatic activation model)
- Tab key: moves focus out of the tablist to the content panel

**Do NOT roll your own keyboard navigation.** Radix handles it. Adding custom `onKeyDown` handlers on `Tabs.Trigger` that duplicate arrow-key logic will break the native behavior.

**Contrast (all pairs verified against `meta/brand.md`):**

| Pair                                       | Ratio     | Verdict                             |
| ------------------------------------------ | --------- | ----------------------------------- |
| `--fg` (#1D1D1F) on `--bg` (#FBFBFD)       | 16.29 : 1 | AAA                                 |
| `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) | 4.91 : 1  | AA normal (14px weight 500) ✓       |
| `--accent` focus ring on `--bg` (#FBFBFD)  | 5.41 : 1  | WCAG 1.4.11 non-text contrast 3:1 ✓ |

---

## 7. Responsive behavior

| Viewport | Behavior                                                                                   |
| -------- | ------------------------------------------------------------------------------------------ |
| Any      | Horizontal `Tabs.List` scrolls horizontally via `overflow-x: auto` when triggers overflow. |
| Any      | Vertical `Tabs.Root` is `flex-direction: row` — list column left, content right.           |

No breakpoint-specific layout changes. The tab list scrollbar is hidden (`scrollbar-width: none`) but still accessible via scroll gestures. No "More" overflow menu — the scroll model is simpler and sufficient for the expected tab counts.

---

## 8. New tokens

Zero new tokens introduced. All values resolved from the existing vocabulary.

---

## 9. Prop intent

### Compound subcomponents

```tsx
// Tabs.Root — state controller
interface TabsRootProps {
  value?: string; // controlled active tab value
  defaultValue?: string; // uncontrolled initial value
  onValueChange?: (v: string) => void;
  orientation?: "horizontal" | "vertical"; // default "horizontal"
  children: ReactNode;
  className?: string;
}

// Tabs.List — trigger wrapper
interface TabsListProps extends ComponentPropsWithoutRef<"div"> {
  loop?: boolean; // keyboard navigation loops (default true via Radix)
}

// Tabs.Trigger — individual tab button
interface TabsTriggerProps extends ComponentPropsWithoutRef<"button"> {
  value: string; // required — binds to Tabs.Content of same value
}

// Tabs.Content — content panel
interface TabsContentProps extends ComponentPropsWithoutRef<"div"> {
  value: string; // required — binds to Tabs.Trigger of same value
}
```

### `TabsBasic` convenience wrapper

```tsx
interface TabItem {
  value: string; // unique identifier for this tab
  label: string; // visible trigger label
  content: ReactNode; // panel content rendered when this tab is active
}

interface TabsBasicProps {
  tabs: TabItem[]; // required
  defaultValue?: string; // defaults to tabs[0].value
  value?: string; // controlled mode
  onValueChange?: (v: string) => void; // controlled mode handler
  orientation?: "horizontal" | "vertical"; // default "horizontal"
  className?: string; // forwarded to Tabs.Root
}
```

---

## 10. Composition rules

- **`Tabs.Trigger` value must match a `Tabs.Content` value exactly.** Radix uses these values to wire `aria-controls` and `aria-labelledby`. Mismatched values produce orphaned panels.
- **`Tabs.List` must be a direct child of `Tabs.Root`.** Nesting it elsewhere breaks Radix's context wiring.
- **`Tabs.Content` must be a direct child of `Tabs.Root`.** Same reason.
- **Do not nest `Tabs.Root` inside another `Tabs.Root`.** Nested tab contexts produce conflicting ARIA relationships.
- **`TabsBasic` manages its own `defaultValue`.** When `defaultValue` is omitted, it defaults to `tabs[0].value`. Never passes `undefined` to Radix (Radix leaves the first tab active by default, but explicit value prevents any Radix version from differing).
- **Tab content is always mounted.** Radix renders all panels into the DOM; inactive panels are hidden via `display: none` (Radix default). Consumers who want deferred rendering wrap content in `<Suspense>` themselves — the DS does not add lazy-load or suspense boundaries.

---

## 11. Out of scope

- **URL-synced tabs.** URL state management is a router/application concern. Consumers wire `value` to a URL param themselves.
- **Lazy-loaded / suspended content panels.** Consumers wrap in `<Suspense>`.
- **Animated content transitions.** Fade or slide between panels would require `forceMount` + exit animation logic. Not specified — keep it simple; Radix's `display: none` is the content transition.
- **Icon-only triggers.** Triggers with icons require `aria-label` on the trigger. The DS does not block this; consumers pass icon + `aria-label` via `children` and `...rest`. Not a `TabsBasic` concern.
- **Badge/count inside trigger.** Consumer-side composition via compound API.
- **Disabled tabs.** Not specified in v1. Radix supports `disabled` on `Tabs.Trigger` natively — consumers can pass it via `...rest`.
- **Controlled overflow "More" menu.** The scroll model handles overflow. A dropdown menu for overflow tabs is a future pattern if needed.

---

## 12. Worked examples

### (a) Controlled `TabsBasic` with two tabs

```jsx
import { useState } from "react";
import { TabsBasic } from "@poukai-inc/ui";

function ServiceSelector() {
  const [tab, setTab] = useState("build");

  return (
    <TabsBasic
      value={tab}
      onValueChange={setTab}
      tabs={[
        {
          value: "build",
          label: "Build",
          content: <p>Custom AI builds — end-to-end production systems.</p>,
        },
        {
          value: "automate",
          label: "Automate",
          content: <p>Workflow automation — closed-loop inference pipelines.</p>,
        },
      ]}
    />
  );
}
```

### (b) Compound API with three tabs

```jsx
import { Tabs } from "@poukai-inc/ui";

function WorkPage() {
  return (
    <Tabs.Root defaultValue="principles">
      <Tabs.List>
        <Tabs.Trigger value="principles">Principles</Tabs.Trigger>
        <Tabs.Trigger value="failure-modes">Failure Modes</Tabs.Trigger>
        <Tabs.Trigger value="team">Team</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="principles">
        <h3>Ship the smallest real thing.</h3>
        <p>The only metric that matters is a production feedback loop closing.</p>
      </Tabs.Content>

      <Tabs.Content value="failure-modes">
        <h3>The chatbot-on-top-of-RAG plateau.</h3>
        <p>Most teams stop here. The demo dazzles; the production loop never closes.</p>
      </Tabs.Content>

      <Tabs.Content value="team">
        <h3>Senior-only.</h3>
        <p>No juniors, no coordinators. Every person ships to production.</p>
      </Tabs.Content>
    </Tabs.Root>
  );
}
```

### (c) Vertical orientation via compound API

```jsx
import { Tabs } from "@poukai-inc/ui";

function SettingsPanel() {
  return (
    <Tabs.Root defaultValue="general" orientation="vertical">
      <Tabs.List>
        <Tabs.Trigger value="general">General</Tabs.Trigger>
        <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="general">
        <h3>General settings</h3>
        <p>Workspace name, timezone, and locale preferences.</p>
      </Tabs.Content>

      <Tabs.Content value="notifications">
        <h3>Notification preferences</h3>
        <p>Email, Slack, and webhook delivery settings.</p>
      </Tabs.Content>

      <Tabs.Content value="billing">
        <h3>Billing</h3>
        <p>Plan, invoices, and payment method.</p>
      </Tabs.Content>
    </Tabs.Root>
  );
}
```

---

## 13. Story matrix

| Story name           | Description                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| `Default`            | `TabsBasic` uncontrolled, three tabs. Verifies triggers render, default tab active, content visible. |
| `Controlled`         | `TabsBasic` controlled via `useState`. Verifies `value` + `onValueChange` round-trip.                |
| `CompoundHorizontal` | Compound API, three tabs, horizontal (default). Verifies custom content rendering.                   |
| `CompoundVertical`   | Compound API, vertical orientation. Verifies `data-orientation="vertical"` on root + list.           |
| `WithOverflow`       | Seven tabs in a constrained-width container. Verifies horizontal scroll without wrapping.            |

---

## 14. Open questions

None. Spec is self-contained and addresses all known concerns at time of authoring. Future extensions (disabled tabs, overflow "More" menu, animated content transitions) are explicitly deferred — see §11.
