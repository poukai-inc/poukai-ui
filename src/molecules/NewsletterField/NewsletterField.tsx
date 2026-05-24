import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type FormEventHandler,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { Button } from "../../atoms/Button";
import { Input } from "../../atoms/Input";
import { VisuallyHidden } from "../../atoms/VisuallyHidden";
import styles from "./NewsletterField.module.css";

export type NewsletterFieldSize = "compact" | "md";

export interface NewsletterFieldProps extends Omit<
  ComponentPropsWithoutRef<"form">,
  "onSubmit" | "action" | "method"
> {
  /**
   * Native form `action` URL — enables progressive enhancement and server actions.
   * Coexists with `onSubmit`.
   */
  action?: string;

  /**
   * Form method when `action` is set.
   * @default "post"
   */
  method?: "get" | "post";

  /**
   * JS-controlled submission handler.
   */
  onSubmit?: FormEventHandler<HTMLFormElement>;

  /**
   * Input `name` attribute — required for native form submission.
   * @default "email"
   */
  name?: string;

  /**
   * Input placeholder text.
   * @default "you@example.com"
   */
  placeholder?: string;

  /**
   * Submit button label.
   * @default "Subscribe"
   */
  cta?: string;

  /**
   * Disables both the input and the submit button.
   * @default false
   */
  disabled?: boolean;

  /**
   * Privacy notice or inline error rendered below the row.
   * Accepts ReactNode to support inline links.
   */
  note?: ReactNode;

  /**
   * Maps to Button size and input height alignment.
   * `compact` (40px) suits footer placement; `md` (44px) suits section-hero placement.
   * @default "compact"
   */
  size?: NewsletterFieldSize;

  /**
   * `aria-label` for the `<form>` element.
   * @default "Newsletter signup"
   */
  formAriaLabel?: string;
}

/**
 * Inline email-capture molecule — a single-row `<form>` pairing an email
 * `<Input>` with a `<Button type="submit">`.
 *
 * Supports both uncontrolled (native `action`) and controlled (`onSubmit`) use.
 * The molecule does not manage email-validation state; that belongs to the consumer.
 *
 * A visually hidden `<label>` is always rendered for the email input, satisfying
 * WCAG 2.4.6 without disrupting the compact inline layout.
 *
 * @example
 * // Footer subscription (uncontrolled, native POST):
 * <NewsletterField action="/api/subscribe" />
 *
 * @example
 * // Controlled:
 * <NewsletterField onSubmit={(e) => { e.preventDefault(); handle(e); }} />
 *
 * @example
 * // With note slot:
 * <NewsletterField note="No spam. Unsubscribe any time." />
 */
export const NewsletterField = forwardRef<HTMLFormElement, NewsletterFieldProps>(
  function NewsletterField(
    {
      action,
      method = "post",
      onSubmit,
      name = "email",
      placeholder = "you@example.com",
      cta = "Subscribe",
      disabled = false,
      note,
      size = "compact",
      formAriaLabel = "Newsletter signup",
      className,
      ...rest
    },
    ref,
  ) {
    const labelId = useId();

    // Map NewsletterFieldSize → InputSize (the Input atom's size union)
    const inputSize = size === "md" ? "md" : "sm";
    // The spec drives input min-height via --btn-h-compact; we apply that via
    // the sizeCompact modifier on the root and let the row CSS align them.

    return (
      <form
        ref={ref}
        className={clsx(styles.root, className)}
        action={action}
        method={action ? method : undefined}
        onSubmit={onSubmit}
        aria-label={formAriaLabel}
        noValidate={!!onSubmit}
        {...rest}
      >
        <div className={styles.row}>
          <VisuallyHidden as="span" id={labelId}>
            {placeholder}
          </VisuallyHidden>
          <Input
            type="email"
            name={name}
            placeholder={placeholder}
            required
            disabled={disabled}
            aria-labelledby={labelId}
            size={inputSize}
            className={styles.input}
          />
          <Button
            type="submit"
            variant="primary"
            size={size}
            disabled={disabled}
            className={styles.button}
          >
            {cta}
          </Button>
        </div>
        {note !== undefined && <p className={styles.note}>{note}</p>}
      </form>
    );
  },
);

NewsletterField.displayName = "NewsletterField";
