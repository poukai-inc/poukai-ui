import { forwardRef, type SVGProps } from "react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";
import styles from "./Icon.module.css";

export type IconSize = "xs" | "sm" | "md" | "lg";

/**
 * Pixel values keyed to the --icon-* token scale.
 * These mirror the token values in src/tokens/tokens.css:
 *   --icon-xs: 12px, --icon-sm: 16px, --icon-md: 20px, --icon-lg: 24px
 */
const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
};

const SIZE_CLASS: Record<IconSize, string> = {
  xs: styles.sizeXs!,
  sm: styles.sizeSm!,
  md: styles.sizeMd!,
  lg: styles.sizeLg!,
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "width" | "height" | "size"> {
  /** The Lucide icon component to render. Import from lucide-react and pass the ref. */
  icon: LucideIcon;
  /**
   * Size token. Resolves to the corresponding --icon-* CSS custom property value.
   * xs → 12px, sm → 16px (default), md → 20px, lg → 24px
   */
  size?: IconSize;
  /**
   * When true (default), the icon is decorative — aria-hidden="true" is applied.
   * When false, the icon carries semantic meaning. aria-label becomes required.
   */
  decorative?: boolean;
  /** Accessible label for non-decorative icons. Required when decorative={false}. */
  "aria-label"?: string;
  className?: string;
}

/**
 * Thin rendering wrapper around any lucide-react icon.
 * Enforces: token-aligned size scale, currentColor, and decorative-by-default a11y.
 *
 * @example
 *   import { Mail } from "lucide-react"
 *   <Icon icon={Mail} />
 *   <Icon icon={Mail} size="lg" decorative={false} aria-label="Email" />
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  {
    icon: LucideComponent,
    size = "sm",
    decorative = true,
    "aria-label": ariaLabel,
    className,
    ...rest
  },
  ref,
) {
  if (!decorative && !ariaLabel) {
    console.error(
      "[Icon] decorative={false} requires an aria-label. " +
        "A semantic icon with no label is an accessibility violation.",
    );
  }

  const px = SIZE_MAP[size];

  const a11yProps = decorative
    ? { "aria-hidden": true as const, focusable: "false" as const }
    : { role: "img" as const, "aria-label": ariaLabel, focusable: "false" as const };

  return (
    <LucideComponent
      ref={ref as React.Ref<SVGSVGElement>}
      width={px}
      height={px}
      className={clsx(SIZE_CLASS[size], className)}
      color="currentColor"
      strokeWidth={1.5}
      {...a11yProps}
      {...rest}
    />
  );
});

Icon.displayName = "Icon";
