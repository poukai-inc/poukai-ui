import { forwardRef } from "react";
import clsx from "clsx";
import { Image, type ImageProps } from "../Image";
import styles from "./Logo.module.css";

export type LogoTone = "color" | "mono" | "muted";
export type LogoSize = "sm" | "md" | "lg";

export interface LogoProps extends Omit<ImageProps, "src" | "alt" | "width" | "height"> {
  /** The logo image URL. */
  src: string;
  /** Organisation name — required accessible label. */
  alt: string;
  /**
   * Visual treatment applied to the logo.
   * - "color": render as-is (full colour).
   * - "mono": grayscale silhouette (filter: grayscale(1) brightness(0)).
   * - "muted": grayscale + 0.55 opacity; hover/focus-visible raises to full opacity.
   * Default: "mono".
   */
  tone?: LogoTone;
  /**
   * Constrains rendered height via max-height.
   * "sm" → 24px, "md" → 32px, "lg" → 40px. Width always auto.
   * Default: "md".
   */
  size?: LogoSize;
  /**
   * Intrinsic pixel width of the source image — passed to <Image> for CLS-safe
   * aspect-ratio reservation. Override with true intrinsic dimensions when known.
   * Default: 200.
   */
  width?: number;
  /**
   * Intrinsic pixel height of the source image — passed to <Image> for CLS-safe
   * aspect-ratio reservation. Override with true intrinsic dimensions when known.
   * Default: 80.
   */
  height?: number;
}

const toneClass: Record<LogoTone, string> = {
  color: styles.toneColor!,
  mono: styles.toneMono!,
  muted: styles.toneMuted!,
};

const sizeClass: Record<LogoSize, string> = {
  sm: styles.sizeSm!,
  md: styles.sizeMd!,
  lg: styles.sizeLg!,
};

/**
 * Partner / customer logo cell for LogoCloud.
 *
 * Composes <Image> with logo-specific defaults: consistent max-height
 * via the size scale, and a tone treatment for uniform logo strips.
 *
 * @example
 *   <Logo src="/logos/acme.svg" alt="Acme Corp" />
 *   <Logo src="/logos/acme.svg" alt="Acme Corp" tone="color" size="lg" />
 *   <a href="https://acme.com"><Logo src="/logos/acme.svg" alt="Acme Corp" tone="muted" /></a>
 */
export const Logo = forwardRef<HTMLImageElement, LogoProps>(function Logo(
  { src, alt, tone = "mono", size = "md", width = 200, height = 80, className, ...rest },
  ref,
) {
  return (
    <Image
      ref={ref}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={clsx(toneClass[tone], sizeClass[size], className)}
      style={{ display: "inline-block", maxWidth: "none", width: "auto" }}
      {...rest}
    />
  );
});

Logo.displayName = "Logo";
