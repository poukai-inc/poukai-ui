# Design spec: Form

**Atomic layer**: organism
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-20

---

## 1. Purpose

`<Form>` is the structured-submission container. It wraps a vertical column of `<Field>`, `<Input>`, `<Textarea>`, and `<Button>` components into a single cohesive submission unit, providing the DOM form semantics, submit interception, and `FormData` collection that all form surfaces need — without imposing a validation library, a state-management pattern, or server-action wiring on the consumer.

The Form organism solves one concrete problem: removing the boilerplate of `event.preventDefault()` + `new FormData(event.currentTarget)` from every surface that collects user input, while keeping the contract thin enough that consumers can pair it with any validation or submission approach they choose.

### What Form owns

- `<form>` root element with proper HTML semantics.
- Browser default submit prevention.
- `FormData` collection from named fields.
- Vertical-rhythm layout (flex column, `--space-4` gap, `--hero-max` max-width).
- Ref forwarding to the `<form>` element.

### What Form does not own

**Validation.** Form does not ship with Zod, React Hook Form, or any built-in field validation. Validation is the consumer's responsibility. Form's `onSubmit` receives `FormData` — the consumer extracts fields, validates them, and handles errors. The DS deliberately defers the validation hook contract to post-1.0 (see §10).

**Server-action wiring.** Form does not call `fetch`, use Next.js server actions, or integrate with any submission infrastructure. The `onSubmit` prop is a plain function — consumers wire it to their submission layer.

**Error state management.** Form does not track which fields have errors. Error state lives in the consumer's component. The consumer passes `error` to individual `<Field>` components; Form has no knowledge of field-level error state.

**Field composition.** Form does not enforce which children are rendered inside it. It is a layout and submission container — any valid form content can be a child. The DS recommends composing `<Field>` + `<Input>` / `<Textarea>` + `<Button type="submit">`, but this is convention, not constraint.

**Non-goals.** Form does not:

- Own a `<fieldset>` or `<legend>` wrapper — consumers add those via children if their use case requires grouped field semantics.
- Persist form state across navigation.
- Manage loading or success states — those belong in the consumer's UI layer.
- Auto-focus the first field on mount.
- Support file uploads specifically (though `FormData` natively handles file inputs that consumers place inside Form).

---

## 2. Anatomy

- **Root element**: `<form>`. Not polymorphic. Form always renders as a native `<form>` — this is load-bearing for browser submit semantics, accessibility, and `FormData` collection. No `as` prop.

- **Layout container**: the `<form>` root carries all layout styles directly via `Form.module.css`. No inner wrapper element. The root is a flex column with `gap: var(--space-4)`, `max-width: var(--hero-max)`, and `font-family: var(--font-sans)`.

- **Children slot**: any valid React children. By DS convention: one or more `<Field>` + `<Input>` / `<Textarea>` pairs followed by a `<Button variant="primary" type="submit">`. The convention is not enforced; Form renders whatever children it receives.

- **Ref**: forwarded to the `HTMLFormElement` via `forwardRef<HTMLFormElement, FormProps>`.

---

## 3. Tokens used

Form is a layout primitive. Its token footprint is minimal.

| Token         | Value           | Role                                                                      |
| ------------- | --------------- | ------------------------------------------------------------------------- |
| `--space-4`   | `1rem` (16px)   | Vertical gap between fields, between the last field and the submit button |
| `--hero-max`  | `38rem` (608px) | Max-width — matches the prose column cap used by Hero and Section         |
| `--font-sans` | Geist stack     | Font family inherited by all children (field labels, inputs, helper text) |

**Why `--hero-max` for the Form max-width.** Form is a data-entry surface and shares the same legible measure as prose columns. A 38rem (608px) column is wide enough for multi-word labels and placeholder text, narrow enough that the eye does not need to travel far between label and input. Wider forms feel unanchored on large screens. Using `--hero-max` aligns Form with the DS's established prose-column convention and avoids introducing a new width token.

**Why `--space-4` for the gap.** 16px between fields is tight enough to read as a unified form while still giving each `<Field>` (label + input + helper text) clear visual separation from its neighbours. `--space-6` (24px) was considered and would also be acceptable — but the stories confirm that `--space-4` reads correctly with the `<Field>` molecule's own internal spacing (`--space-1` label-to-input, `--space-2` input-to-helper). The cumulative rhythm is right.

**No new tokens required.** Form's visual contract is fully expressed by the existing three tokens.

---

## 4. Props API

```tsx
// INTENT ONLY — engineer designs the actual API
interface FormProps extends Omit<ComponentPropsWithoutRef<"form">, "onSubmit"> {
  /**
   * Called after the native submit event is prevented.
   * Receives the form's FormData so consumers can extract values
   * without touching the DOM directly.
   *
   * The handler may be async. If it throws, the error propagates to
   * the nearest React error boundary — Form does not swallow exceptions.
   */
  onSubmit: (data: FormData) => void | Promise<void>;
}
```

**Prop-by-prop intent:**

- `onSubmit` — required. The submission handler. Form's internal `handleSubmit` calls `event.preventDefault()`, constructs `new FormData(event.currentTarget)`, and calls `onSubmit(data)`. The handler receives `FormData` — not `React.FormEvent` — so consumers never need to call `event.preventDefault()` themselves. The handler may be async (`Promise<void>`). Handler exceptions propagate: Form calls `void onSubmit(data)`, which means unhandled promise rejections surface as unhandled rejections in the browser console and propagate to the nearest React error boundary if one exists. **Form does not wrap the call in `try/catch`.** This is a deliberate choice: swallowing exceptions would hide bugs in the consumer's submission logic. The consumer is responsible for handling errors in their `onSubmit` implementation.

- Standard `<form>` attributes — available via `Omit<ComponentPropsWithoutRef<"form">, "onSubmit">` spread. Consumers can pass `action`, `method`, `name`, `noValidate`, `autoComplete`, `aria-label`, `aria-labelledby`, `id`, `data-*`, and any other valid `<form>` attribute. `onSubmit` is omitted from the spread because Form replaces it with the typed `(data: FormData) => void | Promise<void>` signature.

- `className` — available via the spread. Merges with the root class via `clsx`. Use for layout overrides (e.g. adjusting `max-width` for a narrow sidebar form).

- `ref` — forwarded to the `HTMLFormElement`. Consumers who need to call `form.reset()` or inspect the form DOM can hold a ref.

- `children` — implicit via `ComponentPropsWithoutRef<"form">`. Any valid React children. The DS convention is `<Field>` + `<Input>` / `<Textarea>` + `<Button type="submit">`, but Form does not validate its children.

**What was not added and why:**

- `defaultValues` prop — rejected. `FormData` collection is stateless from Form's perspective. Consumers who need default values set them via `defaultValue` on individual `<Input>` and `<Textarea>` components. A top-level `defaultValues` map would require Form to own field registration, which is validation-library territory.
- `onReset` prop — not introduced. Consumers pass `onReset` via the standard HTML attribute spread if needed.
- `disabled` prop — not introduced at the Form level. Disabling an entire form is done by the consumer by disabling the submit `<Button>` and individual inputs. A form-level `disabled` would require Form to propagate the state via context to all children, which is out of scope.

---

## 5. Submit behavior — implementation detail

The engineer's implementation follows this exact pattern:

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  void onSubmit(data);
}
```

Key properties of this contract:

1. **`event.preventDefault()` always fires.** Form never allows native browser form submission (page reload or navigation). This is the correct behavior for all DS form surfaces.
2. **`FormData` is constructed from `event.currentTarget`.** This captures all named fields in the form at the moment of submission, including checkboxes, selects, file inputs, and hidden inputs. Fields without a `name` attribute are silently omitted by the browser's `FormData` constructor — this is native behavior, not a DS quirk.
3. **`void onSubmit(data)`** — the `void` operator discards the promise return value without awaiting it. This prevents an "unhandled promise rejection caught as implicit return" in strict TypeScript environments. The consumer's async logic runs; Form does not gate any UI on its completion.
4. **No internal loading state.** Form does not know when the submission has completed. Consumers who need loading UI (disabling the submit button during flight, showing a spinner) manage that state in their own component layer.

---

## 6. States and motion

**States.** Form is a structural container — it has no visual states of its own. Interactive states (hover, focus, error, disabled) belong to the leaf components: `<Input>`, `<Textarea>`, `<Button>`. Form renders identically whether the submission is in flight, succeeded, or failed. The consumer's state drives those outcomes.

**Motion.** None. Form is a layout container. No entrance animation, no transition, no reduced-motion variant is needed.

---

## 7. Responsive behavior

Form is identical across all breakpoints. `max-width: var(--hero-max)` (38rem / 608px) is a static cap — it constrains the form on wide viewports without any breakpoint switching. On narrow viewports below 38rem, the form expands to fill the available column width, which is the correct behavior for mobile form surfaces.

No layout change occurs at `--bp-md` (768px) or any other breakpoint. A form does not become a grid at wider viewports. The vertical stacking of fields is the correct layout for all form surfaces in this DS.

---

## 8. Accessibility

**Native `<form>` semantics.** Form renders as `<form>`. Browsers and assistive technologies treat this as a form landmark. Screen readers may announce it as a "form" region if it has an accessible name (via `aria-label` or `aria-labelledby`). If the page contains only one form, an accessible name is optional — the native `<form>` element is already self-describing. If the page contains multiple forms, each must have a distinct `aria-label` or `aria-labelledby`; consumers pass this via the standard attribute spread.

**Field accessibility.** Form does not own field-level accessibility. `<Field>` provides the `<label>` + `htmlFor` association, `aria-describedby` for helper/error text, and the `required` indicator. `<Input>` and `<Textarea>` provide `aria-invalid` on error state. Form trusts its children to carry their own a11y contracts.

**Submit button.** Consumers must include a `<Button type="submit">` (or a native `<button type="submit">`) as a child of Form. Without a submit button, the form can only be submitted via keyboard Enter in a single-input form — an unpredictable behavior. The DS does not enforce the presence of a submit button programmatically, but the spec requires it.

**`noValidate`.** Consumers who implement custom validation (Zod, React Hook Form, hand-rolled) should pass `noValidate` to Form to suppress browser-native validation UI, which conflicts with the DS's custom error display via `<Field error="…">`. Pass `noValidate` via the standard attribute spread: `<Form noValidate onSubmit={…}>`.

**Keyboard interaction.** Native `<form>` keyboard behavior is preserved: Tab moves between fields, Enter in a single-input form submits, Enter on a submit button submits. No custom keyboard management is introduced.

**Contrast.** Form introduces no new color values. All color contrast within a form surface is the responsibility of the leaf components (`<Field>`, `<Input>`, `<Textarea>`, `<Button>`), each of which has its own contrast documentation.

---

## 9. Worked examples

### (a) Simple form — single field + submit

```jsx
import { Form, Field, Input, Button } from "@poukai-inc/ui";

<Form onSubmit={(data) => console.log([...data.entries()])}>
  <Field label="Email address" id="email" helper="We'll never share your email.">
    <Input type="email" name="email" placeholder="you@example.com" />
  </Field>
  <Button variant="primary" type="submit">
    Subscribe
  </Button>
</Form>;
```

A minimal contact capture. One field, one submit. `FormData` will contain one entry: `email`.

### (b) Multi-field form — name, email, message

```jsx
import { Form, Field, Input, Textarea, Button } from "@poukai-inc/ui";

<Form onSubmit={(data) => console.log([...data.entries()])}>
  <Field label="Full name" id="name" required>
    <Input name="name" placeholder="Arian Zargaran" />
  </Field>
  <Field label="Email address" id="email" required helper="We'll reach out within 48 hours.">
    <Input type="email" name="email" placeholder="you@example.com" />
  </Field>
  <Field label="Message" id="message" helper="Tell us about your project.">
    <Textarea name="message" placeholder="What are you working on?" rows={5} />
  </Field>
  <Button variant="primary" type="submit">
    Send message
  </Button>
</Form>;
```

Contact form with `required` fields and helper text. On submit, `FormData` contains `name`, `email`, and `message` entries.

### (c) Form with an error state on one field

```jsx
import { Form, Field, Input, Textarea, Button } from "@poukai-inc/ui";

function ContactForm() {
  const [emailError, setEmailError] = useState<string | undefined>();

  async function handleSubmit(data: FormData) {
    const email = data.get("email") as string;
    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError(undefined);
    await sendMessage({ email, message: data.get("message") as string });
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Field label="Email address" id="email" error={emailError}>
        <Input type="email" name="email" defaultValue="not-an-email" />
      </Field>
      <Field label="Message" id="message">
        <Textarea name="message" placeholder="Tell us about your project…" />
      </Field>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
```

Consumer-owned validation: the consumer extracts `email` from `FormData`, validates it in `handleSubmit`, and sets the error state. `<Field error={emailError}>` handles the visual error display and `aria-invalid` wiring. Form itself has no knowledge of the error state.

---

## 10. Open questions

**Should Form own a validation hook contract?**

This is explicitly deferred to post-1.0. The question is: should `@poukai-inc/ui` export a `useForm` hook (or a `useField` hook) that provides field registration, error state management, and an ergonomic bridge to Zod or React Hook Form?

The case for: consumers currently wire validation manually, which means error state, `noValidate`, `aria-invalid`, and `FormData` extraction are duplicated across every form surface. A thin `useForm` hook could codify this pattern.

The case against: the right abstraction depends on what the first real multi-form consumer actually builds. Designing the contract speculatively — before seeing two or three real form surfaces — risks building the wrong abstraction and then being locked into it at 1.0.

**Decision**: resolved in v1.1.0. See `meta/design/form-validation.md` for the full spec. `useFieldErrors` ships as a validation-lib-agnostic error-state hook co-located with `<Field>`. Consumers import it from `@poukai-inc/ui` and wire `errors.fieldName` to `<Field error={…}>`. No validation library dependency was introduced.
