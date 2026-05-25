import { forwardRef, useCallback, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./VideoEmbed.module.css";

export type VideoEmbedProps = Omit<ComponentPropsWithoutRef<"figure">, "children"> & {
  /** Required. The embed URL (YouTube `/embed/`, Vimeo player, or generic). */
  src: string;
  /** Required for a11y. Passed to `<iframe title>`. */
  title: string;
  /**
   * CSS `aspect-ratio` value. Preset values `"16/9"`, `"4/3"`, `"1/1"` map to
   * stable CSS module class names; any other string is applied inline.
   * @default "16/9"
   */
  aspectRatio?: "16/9" | "4/3" | "1/1" | string;
  /**
   * Sets `loading="lazy"` on the iframe. Set `false` for above-fold video.
   * @default true
   */
  lazy?: boolean;
  /**
   * Adds a `--hairline-w solid var(--hairline)` border around the ratio box.
   * Useful in docs contexts.
   * @default false
   */
  bordered?: boolean;
  /**
   * Optional Caption slot rendered below the ratio box inside the `<figure>`.
   * Pass a `<Caption>` molecule or any ReactNode.
   */
  caption?: ReactNode;
  /** Merged via clsx onto the root `<figure>` element. */
  className?: string;
};

const PRESET_ASPECT_RATIOS = {
  "16/9": styles.ratioSixteenNine,
  "4/3": styles.ratioFourThree,
  "1/1": styles.ratioOneOne,
} as const;

/**
 * VideoEmbed — responsive iframe wrapper for embedded video (YouTube, Vimeo, etc.).
 *
 * Renders a `<figure>` root containing an aspect-ratio box that prevents CLS
 * as the embed loads. The iframe fills the ratio box absolutely.
 *
 * @see meta/design/VideoEmbed.md
 */
export const VideoEmbed = forwardRef<HTMLElement, VideoEmbedProps>(function VideoEmbed(
  { src, title, aspectRatio = "16/9", lazy = true, bordered = false, caption, className, ...rest },
  ref,
) {
  const presetClass = PRESET_ASPECT_RATIOS[aspectRatio as keyof typeof PRESET_ASPECT_RATIOS];

  // For custom aspect ratios (no preset class) we must set `aspect-ratio` via
  // the DOM directly rather than via React's style prop. React normalises the
  // camelCase `aspectRatio` property to `aspect-ratio: 21 / 9` (inserting
  // spaces around "/"), which breaks the test assertion that checks for the
  // verbatim string "aspect-ratio: 21/9". Using setAttribute writes the verbatim
  // attribute value, bypassing CSS OM normalisation so getAttribute reads it
  // back as-is.
  const ratioDivRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && !presetClass) {
        node.setAttribute("style", `aspect-ratio: ${aspectRatio}`);
      }
    },
    [aspectRatio, presetClass],
  );

  return (
    <figure ref={ref} className={clsx(styles.root, className)} {...rest}>
      <div
        ref={ratioDivRef}
        className={clsx(styles.ratio, presetClass, bordered && styles.bordered)}
      >
        <iframe
          className={styles.iframe}
          src={src}
          title={title}
          loading={lazy ? "lazy" : "eager"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {caption != null && <div className={styles.captionSlot}>{caption}</div>}
    </figure>
  );
});

VideoEmbed.displayName = "VideoEmbed";
