# Design spec: Form validation hook

**Atomic layer**: molecules (hook co-located with Field)
**Status**: Shipped in v1.1.0
**Author**: poukai-design
**Last updated**: 2026-05-20

---

## 1. Purpose and non-goals

`useFieldErrors` is a validation-state management hook for Form surfaces. It owns the field-keyed error map and exposes imperative setters. It does not own validation logic.

**Non-goals:**

- Not a validator. `useFieldErrors` does not evaluate any rule, schema, or constraint.
- Not a schema library. No Zod, Yup, Valibot, or any third-party schema dependency is introduced.
- Not a form registration system. No field registration, ref collection, or dirty/touched tracking.
- Compatible with any validation library (Zod, React Hook Form, Yup, hand-rolled) or no library at all. The hook is shape-only — consumers bring their own validator and convert its output to the standard `FieldErrors` shape.

---

## 2. The `FieldErrors` shape

```ts
export type FieldErrors = Record<string, string | undefined>;
```

- **Keys** are `<input>` / `<textarea>` `name` attributes, matching exactly what `FormData` returns.
- **Values** are the user-facing error string for that field, or `undefined` to clear the field's error.
- Compatible with Zod's `flatten().fieldErrors` (after extracting the first message per field), RHF's `errors` object (after a single transform), and hand-rolled validators that produce a plain map.

---

## 3. `useFieldErrors()` hook

```ts
export function useFieldErrors(initial?: FieldErrors): {
  errors: FieldErrors;
  setErrors: (next: FieldErrors) => void;
  setFieldError: (name: string, message: string | undefined) => void;
  clearAll: () => void;
};
```

Pure state owner. No side effects, no network calls, no async handling. Uses `useState` for the error map and `useCallback` for stable setter references.

### Return values

| Name            | Type                                                   | Description                                                                                       |
| --------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `errors`        | `FieldErrors`                                          | The current field-keyed error map. Pass individual values to `<Field error={errors.fieldName}>`.  |
| `setErrors`     | `(next: FieldErrors) => void`                          | Replace the entire error map. Use after full-form validation runs.                                |
| `setFieldError` | `(name: string, message: string \| undefined) => void` | Set or clear the error for a single field. Preserves all other fields. Pass `undefined` to clear. |
| `clearAll`      | `() => void`                                           | Clear all errors. Call on successful submit or after server acknowledgement.                      |

All setters are stable across re-renders (referential equality guaranteed via `useCallback`).

---

## 4. Token contract

None. `useFieldErrors` is pure state — it renders no DOM, applies no styles, and consumes no design tokens. Visual error styling is owned by `<Field>` and `<Input>` / `<Textarea>`, which already use `--danger`, `--accent`, and related tokens for the invalid/error display tier.

---

## 5. Accessibility

None directly. The hook is invisible to assistive technology. A11y error signalling relies entirely on `<Field>`'s existing wiring:

- `aria-invalid="true"` injected onto the child control when `error` is set.
- `aria-describedby` pointing at the error `<p role="alert">` element.
- `role="alert"` on the error paragraph announces the message to screen readers on mount.

`useFieldErrors` drives these indirectly by providing the `error` string to `<Field>`. No additional ARIA work is required in the hook.

---

## 6. Integration patterns

### (a) Hand-rolled validator

```tsx
import { Form, Field, Input, Button, useFieldErrors, type FieldErrors } from "@poukai-inc/ui";

function ContactForm() {
  const { errors, setErrors, clearAll } = useFieldErrors();
  return (
    <Form
      onSubmit={(data) => {
        const email = String(data.get("email") ?? "");
        const next: FieldErrors = {};
        if (!email.includes("@")) next.email = "Enter a valid email";
        if (Object.keys(next).length === 0) {
          clearAll();
          return submit(data);
        }
        setErrors(next);
      }}
    >
      <Field label="Email" id="email" error={errors.email}>
        <Input type="email" name="email" />
      </Field>
      <Button type="submit">Send</Button>
    </Form>
  );
}
```

### (b) Zod

```tsx
import { z } from "zod";
import {
  Form,
  Field,
  Input,
  Textarea,
  Button,
  useFieldErrors,
  type FieldErrors,
} from "@poukai-inc/ui";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "At least 10 characters"),
});

function ContactForm() {
  const { errors, setErrors, clearAll } = useFieldErrors();
  return (
    <Form
      onSubmit={(data) => {
        const parsed = schema.safeParse(Object.fromEntries(data));
        if (parsed.success) {
          clearAll();
          return submit(parsed.data);
        }
        const next: FieldErrors = {};
        for (const [key, val] of Object.entries(parsed.error.flatten().fieldErrors)) {
          next[key] = val?.[0];
        }
        setErrors(next);
      }}
    >
      <Field label="Email" id="email" error={errors.email}>
        <Input type="email" name="email" />
      </Field>
      <Field label="Message" id="message" error={errors.message}>
        <Textarea name="message" />
      </Field>
      <Button type="submit">Send</Button>
    </Form>
  );
}
```

### (c) Async server validation

```tsx
import { Form, Field, Input, Button, useFieldErrors } from "@poukai-inc/ui";

function NewUserForm() {
  const { errors, setErrors, clearAll } = useFieldErrors();
  return (
    <Form
      onSubmit={async (data) => {
        const result = await fetch("/api/signup", { method: "POST", body: data });
        if (result.ok) {
          clearAll();
          navigate("/welcome");
          return;
        }
        const { fieldErrors } = await result.json();
        setErrors(fieldErrors); // server already returns FieldErrors shape
      }}
    >
      <Field label="Email" id="email" error={errors.email}>
        <Input type="email" name="email" />
      </Field>
      <Button type="submit">Create account</Button>
    </Form>
  );
}
```

---

## 7. Do NOT

- Add an async validator runner to the hook.
- Add server-action integration to the hook.
- Add field-level `onChange` validation (consumer's choice if and when to re-validate).
- Ship a Zod, Yup, RHF, or any other validation library dependency.
- Derive initials, parse schemas, or touch the DOM.

---

## 8. Open questions

**Should we ship `<FormField>` that wraps `<Field>` and auto-reads errors from a context?**

Post-1.x candidate. A `<FormField>` (or `<Form.Field>`) that subscribes to a `FieldErrors` context and automatically wires `error={errors[name]}` would reduce repetition in multi-field forms. Deferred: the right API shape depends on seeing two or three real multi-field surfaces in the site repo first.
