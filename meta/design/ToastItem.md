# Design spec: ToastItem

**Atomic layer**: molecule
**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).
**Author**: poukai-design
**Last updated**: 2026-05-24

---

## 1. Purpose

`ToastItem` is the **declarative, compound** Toast molecule for the pouk.ai design system. It exposes a single Radix `Toast.Root` item as a compound component with named sub-parts:

- `ToastItem` — the root item (`Toast.Root`)
- `ToastItem.Title` — optional heading text (`Toast.Title`)
- `ToastItem.Description` — body copy (`Toast.Description`)
- `ToastItem.Close` — close affordance (`Toast.Close`)
- `ToastItem.Action` — optional inline action (`Toast.Action`)

**Relationship to the Toast organism**: The `Toast` organism (`src/organisms/Toast/`) exposes an imperative API (`ToastProvider` + `useToast()`). `ToastItem` is the declarative counterpart — a single notification item that consumers compose manually inside a Radix `<Toast.Provider>` + `<Toast.Viewport>` they control.

**Primary use cases**: design-system story demos, inline component testing, custom toast layouts, cases where the imperative organism is too heavy.

**Non-goals**: queue management, viewport portal, or auto-dismiss orchestration — those belong to the `Toast` organism.

---

## 2. API shape

```tsx
<ToastItem tone="success" open duration={4000} onOpenChange={setOpen}>
  <ToastItem.Title>Saved</ToastItem.Title>
  <ToastItem.Description>Your changes have been saved.</ToastItem.Description>
  <ToastItem.Close />
</ToastItem>
```

```tsx
<ToastItem tone="danger" open onOpenChange={setOpen}>
  <ToastItem.Title>Error</ToastItem.Title>
  <ToastItem.Description>Something went wrong.</ToastItem.Description>
  <ToastItem.Action altText="Retry now" onClick={handleRetry}>
    Retry
  </ToastItem.Action>
  <ToastItem.Close />
</ToastItem>
```

---

## 3. Prop interfaces

### `ToastItem` (root)

| Prop           | Type                                                | Default  | Description                                             |
| -------------- | --------------------------------------------------- | -------- | ------------------------------------------------------- |
| `tone`         | `"info" \| "success" \| "warning" \| "danger"`      | `"info"` | Visual + semantic tone                                  |
| `open`         | `boolean`                                           | —        | Controlled open state                                   |
| `defaultOpen`  | `boolean`                                           | —        | Uncontrolled initial open state                         |
| `onOpenChange` | `(open: boolean) => void`                           | —        | Callback when open state changes                        |
| `duration`     | `number`                                            | `5000`   | Auto-dismiss duration in ms                             |
| `className`    | `string`                                            | —        | Merged with internal classes                            |
| `children`     | `ReactNode`                                         | required | `Title`, `Description`, `Close`, `Action` sub-parts     |

Tone maps to Radix `type`:
- `"info"` / `"success"` → `type="background"` (polite live region)
- `"warning"` / `"danger"` → `type="foreground"` (assertive live region)

### `ToastItem.Title`

Thin wrapper over `Toast.Title`. Accepts all `<div>` props + `className`.

### `ToastItem.Description`

Thin wrapper over `Toast.Description`. Accepts all `<div>` props + `className`.

### `ToastItem.Close`

Wraps Radix `Toast.Close`. Renders a 20×20 button with X icon. Props:
- `aria-label` (default `"Close"`)
- `className`

### `ToastItem.Action`

Wraps Radix `Toast.Action`. Props:
- `altText` (required string) — screen-reader alternative text
- `onClick` — click handler
- `children` — button label
- `className`

---

## 4. Tokens used

Inherits from `meta/design/Toast.md §3`. No new tokens. Same tone contract as the organism.

| Tone      | Background      | Left rule        | Text color        | Radix type     |
| --------- | --------------- | ---------------- | ----------------- | -------------- |
| `info`    | `--bg-elevated` | hairline border  | `--fg`            | `"background"` |
| `success` | `--bg-elevated` | `--accent`       | `--fg`            | `"background"` |
| `warning` | `--bg-warning`  | `--warning`      | `--fg-on-warning` | `"foreground"` |
| `danger`  | `--bg-danger`   | `--danger`       | `--fg-on-danger`  | `"foreground"` |

---

## 5. Composition rules

- `ToastItem` must be rendered inside a Radix `<Toast.Provider>` + `<Toast.Viewport>`. The organism's `<ToastProvider>` already wraps both.
- Consumers who want declarative control should render their own `<Toast.Provider>` + `<Toast.Viewport>` from `@radix-ui/react-toast`.
- For most product use cases, prefer the imperative `useToast()` organism over `ToastItem` directly.
