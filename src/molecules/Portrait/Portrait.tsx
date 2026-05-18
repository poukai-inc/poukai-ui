import { forwardRef, type ComponentPropsWithoutRef, type Ref } from "react";
import clsx from "clsx";
import styles from "./Portrait.module.css";

export type AspectRatio = "1:1" | "3:4" | "4:3" | "16:9" | "9:16";

export interface PortraitProps extends Omit<ComponentPropsWithoutRef<"picture">, "children"> {
  /** Base image URL. Also accepts Astro ImageMetadata-shaped objects (extracts .src). */
  src: string | { src: string; width?: number; height?: number };
  /** Required non-empty alt text. Portraits are never decorative (WCAG 1.1.1). */
  alt: string;
  /** Canonical aspect ratio — controls the CSS aspect-ratio and computed height attr. */
  aspect: AspectRatio;
  /** Canonical source image width in pixels — drives CLS-prevention attrs and srcset. */
  width: number;
  /** Whether the browser should load the image immediately or lazily. */
  loading?: "eager" | "lazy";
  /** Fetch priority hint passed as the fetchpriority attribute on the img element. */
  fetchPriority?: "high" | "auto" | "low";
  /** Responsive sizes hint for the browser. Defaults to 100vw. */
  sizes?: string;
  /** CSS object-position value. Defaults to center. */
  objectPosition?: string;
}

const SRCSET_DIVISORS = [1, 1.5, 2.34375, 3.75] as const;

function buildSrcset(url: string, width: number): string {
  return SRCSET_DIVISORS.map((d) => {
    const w = Math.round(width / d);
    return `${url}?w=${w} ${w}w`;
  }).join(", ");
}

/**
 * Parses an aspect ratio string like '3:4' into [width, height] as numbers.
 * The AspectRatio union type guarantees the format; the non-null assertions here
 * are safe because all valid AspectRatio values contain exactly one ':'.
 */
function parseAspect(aspect: AspectRatio): [number, number] {
  const colonIdx = aspect.indexOf(":");
  const aw = Number(aspect.slice(0, colonIdx));
  const ah = Number(aspect.slice(colonIdx + 1));
  return [aw, ah];
}

/**
 * Portrait — editorial photography primitive.
 *
 * Renders a picture element with AVIF > WebP > JPEG fallback chain, srcset
 * generation, CLS-safe width/height attributes, and a strict non-empty alt
 * contract (WCAG 1.1.1).
 *
 * @example
 *   <Portrait
 *     src="https://example.com/photo.jpg"
 *     alt="Arian Becker, founder of Poukai"
 *     aspect="3:4"
 *     width={1800}
 *     loading="eager"
 *     fetchPriority="high"
 *   />
 */
export const Portrait = forwardRef<HTMLElement, PortraitProps>(function Portrait(
  {
    src,
    alt,
    aspect,
    width,
    loading = "lazy",
    fetchPriority = "auto",
    sizes = "100vw",
    objectPosition = "center",
    className,
    ...rest
  },
  ref,
) {
  // Dev-mode alt invariant: portraits are never decorative (WCAG 1.1.1).
  // import.meta.env.DEV is replaced by Vite at build time (true in dev, false in prod/test).
  if (import.meta.env.DEV && alt.trim() === "") {
    throw new Error(
      "[Portrait] alt must be a non-empty string. Portraits are never decorative (WCAG 1.1.1).",
    );
  }

  const baseUrl = typeof src === "string" ? src : src.src;
  const [aw, ah] = parseAspect(aspect);
  const computedHeight = Math.round(width * (ah / aw));
  const srcset = buildSrcset(baseUrl, width);

  return (
    <picture ref={ref as Ref<HTMLElement>} className={clsx(styles.root, className)} {...rest}>
      <source type="image/avif" srcSet={srcset} sizes={sizes} />
      <source type="image/webp" srcSet={srcset} sizes={sizes} />
      <img
        src={baseUrl}
        alt={alt}
        width={width}
        height={computedHeight}
        loading={loading}
        fetchPriority={fetchPriority}
        className={styles.img}
        style={{
          aspectRatio: `${aw} / ${ah}`,
          objectPosition,
        }}
      />
    </picture>
  );
});

Portrait.displayName = "Portrait";
