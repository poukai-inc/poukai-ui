import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./Wordmark.module.css";
import { WORDMARK_INNER_SVG, WORDMARK_VIEWBOX } from "./wordmark-geometry";

export interface WordmarkProps extends ComponentPropsWithoutRef<"span"> {
  /** Rendered height in pixels. Width scales proportionally in both rendering paths. */
  height?: number;
  /**
   * Accessible label. Defaults to "Poukai".
   * - Bundled SVG path: populates a visually-hidden `<span>`.
   * - White-label path (`src` provided): becomes `<img alt>`. Must be non-empty when
   *   using `src` — a blank alt removes the accessible name from any link the mark
   *   lives inside.
   */
  label?: string;
  /**
   * Optional URL for a white-label logo image. When provided, the component renders
   * `<img src={src} alt={label} height={height} width="auto" />` instead of the
   * bundled inline SVG.
   *
   * **Color:** The `<img>` does NOT inherit `currentColor`. Colors are baked into the
   * image asset. Dark-mode inversion does not happen automatically — supply a separate
   * dark-mode asset and swap `src` conditionally at the call site if needed.
   *
   * **Security:** `javascript:` and `data:` scheme URLs are blocked at the attribute
   * boundary. If an unsafe scheme is detected, the component falls back to rendering
   * the bundled SVG mark. Only schemeless URLs (relative, root-relative, anchors) and
   * the explicit allowlist `https?`, `mailto`, `tel` are accepted.
   */
  src?: string;
}

/**
 * Returns `src` only if its scheme is safe to use in an `<img src>` attribute.
 *
 * Mirrors the `safeHref` posture from AudioPlayer: allow schemeless URLs and an
 * explicit allowlist of safe schemes; block `javascript:`, `data:`, `vbscript:`, etc.
 * Callers supplying an unsafe scheme receive `undefined` and the bundled mark renders
 * as the fallback.
 */
function safeSrc(src: string): string | undefined {
  const value = src.trim();
  // No scheme (relative / root-relative / protocol-relative / #anchor / ?query).
  if (!/^[a-z][a-z0-9+.-]*:/i.test(value)) return src;
  // Has a scheme — permit only the safe allowlist.
  return /^(https?|mailto|tel):/i.test(value) ? src : undefined;
}

/**
 * Full POUKAI wordmark + isotype lockup, with optional white-label image support.
 *
 * **Bundled path (no `src`):** Renders the POUKAI inline SVG using `fill="currentColor"`.
 * The mark inherits whatever foreground color is in scope — inversion requires no extra
 * props; set `color: var(--bg)` on a parent element.
 *
 * **White-label path (`src` provided):** Renders `<img src alt height width="auto">`.
 * The image does NOT inherit `currentColor` — colors are baked into the asset.
 * `javascript:` and `data:` schemes are blocked; the bundled mark is the fallback.
 *
 * Geometry is inlined from `wordmark-geometry.ts` (generated from
 * `src/atoms/Wordmark/poukai-logo.svg`). Self-contained — no `<symbol>` sprite required.
 */
export const Wordmark = forwardRef<HTMLSpanElement, WordmarkProps>(function Wordmark(
  { height = 64, label = "Poukai", src, className, style, ...rest },
  ref,
) {
  const resolvedSrc = src !== undefined ? safeSrc(src) : undefined;

  return (
    <span ref={ref} className={clsx(styles.root, className)} style={{ height, ...style }} {...rest}>
      {resolvedSrc !== undefined ? (
        <img src={resolvedSrc} alt={label} height={height} width="auto" className={styles.img} />
      ) : (
        <>
          <svg
            viewBox={WORDMARK_VIEWBOX}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
            className={styles.svg}
            style={{ height }}
            dangerouslySetInnerHTML={{ __html: WORDMARK_INNER_SVG }}
          />
          <span className={styles.sr}>{label}</span>
        </>
      )}
    </span>
  );
});

Wordmark.displayName = "Wordmark";
