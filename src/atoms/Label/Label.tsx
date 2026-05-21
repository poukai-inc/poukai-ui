import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Label.module.css";

export type LabelTone = "default" | "muted";

export interface LabelProps extends Omit<
  ComponentPropsWithoutRef<"label">,
  "htmlFor" | "children"
> {
  /** The `id` of the form control this label describes. Type-level required. */
  htmlFor: string;
  /** Label text. Typically a short string; may include inline emphasis. */
  children: ReactNode;
  /**
   * When `true`, renders a trailing `<span aria-hidden="true">*</span>` in
   * `var(--danger)`. The ARIA required contract lives on the bound control
   * (`aria-required="true"` / `required`), not on this element.
   */
  required?: boolean;
  /**
   * Text color variant.
   * - `"default"` (default) — `var(--fg)`. Primary form fields.
   * - `"muted"` — `var(--fg-muted)`. Nested fieldsets, secondary form sections.
   */
  tone?: LabelTone;
}

/**
 * Canonical form-label atom. Renders a `<label>` element bound to its control
 * via `htmlFor`. Provides a typed, token-aligned wrapper so every form surface
 * speaks the same typographic and semantic contract.
 *
 * @example
 *   <Label htmlFor="email">Email address</Label>
 *   <input id="email" type="email" />
 *
 * @example Required indicator (visual only; consumer adds aria-required on control)
 *   <Label htmlFor="email" required>Email address</Label>
 *   <input id="email" type="email" aria-required="true" />
 *
 * @example Muted tone for secondary fields
 *   <Label htmlFor="timezone" tone="muted">Timezone</Label>
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { htmlFor, children, required = false, tone = "default", className, ...rest },
  ref,
) {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={clsx(styles.root, tone === "muted" && styles.toneMuted, className)}
      {...rest}
    >
      {children}
      {required && (
        <span aria-hidden="true" className={styles.requiredMark}>
          *
        </span>
      )}
    </label>
  );
});

Label.displayName = "Label";
