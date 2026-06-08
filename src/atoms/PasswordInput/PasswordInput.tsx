"use client";

import { forwardRef, useState, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import { Input, type InputSize } from "../Input";
import { IconButton } from "../IconButton";
import styles from "./PasswordInput.module.css";

export interface PasswordInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "size" | "type"
> {
  /**
   * Visual size — maps to the shared `--btn-h-*` height ladder.
   * @default "md"
   */
  size?: InputSize;

  /**
   * Error-state styling, forwarded to the underlying Input
   * (`data-invalid` / `aria-invalid`). Prefer wiring through `<Field>`.
   */
  invalid?: boolean;

  /**
   * Accessible label for the reveal toggle in its hidden state.
   * @default "Show password"
   */
  revealLabel?: string;

  /**
   * Accessible label for the reveal toggle in its shown state.
   * @default "Hide password"
   */
  hideLabel?: string;
}

/**
 * Password input with a built-in show/hide reveal toggle.
 *
 * Composes the {@link Input} primitive with a ghost {@link IconButton}
 * (Lucide Eye / EyeOff). Toggling flips the input `type` between `password`
 * and `text`. Stateful — must run on the client (`"use client"`).
 *
 * Ref forwards to the underlying `<input>`.
 *
 * @example
 * // Inside Field (recommended):
 * <Field label="Password" id="password">
 *   <PasswordInput autoComplete="current-password" />
 * </Field>
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      size = "md",
      invalid,
      revealLabel = "Show password",
      hideLabel = "Hide password",
      className,
      ...rest
    },
    ref,
  ) {
    const [shown, setShown] = useState(false);

    return (
      <div className={clsx(styles.root, className)}>
        <Input
          ref={ref}
          type={shown ? "text" : "password"}
          size={size}
          invalid={invalid ?? false}
          className={styles.input}
          {...rest}
        />
        <IconButton
          type="button"
          icon={shown ? EyeOff : Eye}
          aria-label={shown ? hideLabel : revealLabel}
          aria-pressed={shown}
          variant="ghost"
          size="sm"
          className={styles.toggle}
          onClick={() => setShown((s) => !s)}
        />
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
