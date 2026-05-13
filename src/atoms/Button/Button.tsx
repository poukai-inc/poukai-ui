import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render as a child element (e.g. <a>) — Radix Slot composition. */
  asChild?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: styles.variantPrimary!,
  secondary: styles.variantSecondary!,
  ghost: styles.variantGhost!,
};

const sizeClass: Record<ButtonSize, string> = {
  sm: styles.sizeSm!,
  md: styles.sizeMd!,
  lg: styles.sizeLg!,
};

/**
 * Primary interactive element. Use `asChild` to render the styles on an `<a>` or other element.
 *
 * @example
 *   <Button>Get in touch</Button>
 *   <Button asChild><a href="mailto:hello@pouk.ai">Email</a></Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", asChild = false, className, type, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={clsx(styles.root, variantClass[variant], sizeClass[size], className)}
      {...(asChild ? {} : { type: type ?? "button" })}
      {...rest}
    />
  );
});
