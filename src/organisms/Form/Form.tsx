import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./Form.module.css";

export interface FormProps extends Omit<ComponentPropsWithoutRef<"form">, "onSubmit"> {
  /**
   * Called after the native submit event is prevented. Receives the form's
   * `FormData` so consumers can extract values without touching the DOM.
   *
   * The handler may be async. If it throws, the error propagates to the
   * nearest error boundary — Form does not swallow exceptions.
   */
  onSubmit: (data: FormData) => void | Promise<void>;
}

/**
 * Structured submission container that composes `<Field>`, `<Input>`,
 * `<Textarea>`, and `<Button>` without owning a validation library.
 *
 * Root is `<form>`. Ref forwarded to the form element.
 *
 * Prevents the default browser submit, collects `new FormData(form)`, and
 * passes it to the consumer's `onSubmit` handler. Handler errors propagate —
 * they are not swallowed.
 *
 * @example
 * <Form onSubmit={(data) => console.log([...data.entries()])}>
 *   <Field label="Email" id="email">
 *     <Input type="email" name="email" placeholder="you@example.com" />
 *   </Field>
 *   <Button variant="primary" type="submit">Send</Button>
 * </Form>
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { onSubmit, className, children, ...rest },
  ref,
) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    void onSubmit(data);
  }

  return (
    <form ref={ref} className={clsx(styles.root, className)} onSubmit={handleSubmit} {...rest}>
      {children}
    </form>
  );
});

Form.displayName = "Form";
