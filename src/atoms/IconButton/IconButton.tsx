import { forwardRef, type ComponentPropsWithoutRef } from "react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";
import { Button, type ButtonVariant, type ButtonSize } from "../Button/Button";
import { Icon, type IconSize } from "../Icon/Icon";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import styles from "./IconButton.module.css";

export type IconButtonVariant = ButtonVariant;
export type IconButtonSize = ButtonSize;

export interface IconButtonProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "aria-label"
> {
  /** The Lucide icon component to render. Import from lucide-react. */
  icon: LucideIcon;
  /** Accessible name for the icon-only button. Required — no default. */
  "aria-label": string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

const sizeClass: Record<IconButtonSize, string> = {
  sm: styles.sizeSm!,
  compact: styles.sizeCompact!,
  md: styles.sizeMd!,
  lg: styles.sizeLg!,
};

const ICON_SIZE_FOR_BUTTON_SIZE: Record<IconButtonSize, IconSize> = {
  sm: "sm",
  compact: "md",
  md: "md",
  lg: "lg",
};

/**
 * Square, icon-only interactive primitive. Inherits Button's variant, state,
 * focus, and disabled behavior; overrides geometry to square dimensions
 * driven by the --btn-h-* token ladder. The `aria-label` is mandatory at the
 * type level — an IconButton without an accessible name is a type error.
 *
 * @example
 *   import { X } from "lucide-react"
 *   <IconButton icon={X} aria-label="Close dialog" />
 *   <IconButton icon={X} aria-label="Close" variant="ghost" size="sm" />
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, "aria-label": ariaLabel, variant = "primary", size = "md", className, ...rest },
  ref,
) {
  const iconSize = ICON_SIZE_FOR_BUTTON_SIZE[size];
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      aria-label={ariaLabel}
      className={clsx(styles.root, sizeClass[size], className)}
      {...rest}
    >
      <Icon icon={icon} size={iconSize} />
      <VisuallyHidden>{ariaLabel}</VisuallyHidden>
    </Button>
  );
});

IconButton.displayName = "IconButton";
