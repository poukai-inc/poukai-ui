import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties } from "react";
import clsx from "clsx";
import styles from "./Image.module.css";

export type ImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";
export type ImageRadius = "none" | "sm" | "md" | "lg";

export interface ImageProps extends Omit<
  ComponentPropsWithoutRef<"img">,
  "src" | "alt" | "width" | "height" | "loading" | "decoding"
> {
  /** The image URL. Passed directly as the <img> src attribute. */
  src: string;
  /**
   * Alt text for the image. Required at the type level.
   * - Pass a descriptive string for meaningful images: alt="Poukai logo"
   * - Pass an empty string for decorative images: alt=""
   * - Never omit. The type is `string`, not `string | undefined`.
   */
  alt: string;
  /** The image's intrinsic width in pixels (from the source file). */
  width: number;
  /** The image's intrinsic height in pixels (from the source file). */
  height: number;
  /**
   * Controls the browser's native lazy-loading behavior.
   * Default: "lazy". Use "eager" for above-the-fold images.
   */
  loading?: "lazy" | "eager";
  /**
   * Controls the browser's image decoding hint.
   * Default: "async". Allows off-main-thread decoding without blocking rendering.
   */
  decoding?: "async" | "sync" | "auto";
  /**
   * Maps to the object-fit CSS property.
   * Omit for most use cases (logos, illustrations sized to their container).
   * No DS default — when omitted, no object-fit style is written.
   */
  fit?: ImageFit;
  /**
   * Border-radius mapped to the DS radius scale.
   * Default: "none" (border-radius: 0).
   *   "none" → 0
   *   "sm"   → var(--radius-1) (2px)
   *   "md"   → var(--radius-2) (4px)
   *   "lg"   → var(--radius-3) (8px)
   */
  radius?: ImageRadius;
}

const radiusClass: Record<ImageRadius, string> = {
  none: styles.radiusNone!,
  sm: styles.radiusSm!,
  md: styles.radiusMd!,
  lg: styles.radiusLg!,
};

const fitClass: Record<ImageFit, string> = {
  cover: styles.fitCover!,
  contain: styles.fitContain!,
  fill: styles.fitFill!,
  none: styles.fitNone!,
  "scale-down": styles.fitScaleDown!,
};

/**
 * Token-aware plain-image atom. Renders a single `<img>` with CLS-safe
 * intrinsic sizing (aspect-ratio from width/height props), lazy loading by
 * default, and an optional border-radius from the DS radius scale.
 *
 * Non-polymorphic: always renders `<img>`. No `as` prop.
 * No srcset, no `<picture>`, no format negotiation — use `<Portrait>` for that.
 *
 * @example
 *   <Image src="/logo.svg" alt="Poukai logo" width={200} height={50} />
 *   <Image src="/screenshot.png" alt="Dashboard" width={1280} height={800} radius="md" fit="cover" />
 *   <Image src="/bg.jpg" alt="" width={1600} height={900} loading="eager" />
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    src,
    alt,
    width,
    height,
    loading = "lazy",
    decoding = "async",
    fit,
    radius = "none",
    className,
    style,
    ...rest
  },
  ref,
) {
  const baseStyle: CSSProperties = {
    maxWidth: "100%",
    height: "auto",
    aspectRatio: `${width} / ${height}`,
  };

  // Merge: base defaults first, then caller's style on top.
  // aspectRatio is structural (CLS prevention) but caller can override if truly needed.
  const mergedStyle: CSSProperties = { ...baseStyle, ...style };

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      className={clsx(
        styles.root,
        radiusClass[radius],
        fit !== undefined && fitClass[fit],
        className,
      )}
      style={mergedStyle}
      {...rest}
    />
  );
});

Image.displayName = "Image";
