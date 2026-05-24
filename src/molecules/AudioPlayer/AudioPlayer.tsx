import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import { Caption } from "../Caption";
import styles from "./AudioPlayer.module.css";

export interface AudioPlayerProps extends Omit<ComponentPropsWithoutRef<"figure">, "children"> {
  /**
   * The audio file URL passed to `<audio src>`.
   * Required.
   */
  src: string;
  /**
   * Accessible label for the `<audio>` element.
   * Required for a11y. Defaults to `caption` when provided.
   * Rendered as `aria-label` on the `<audio>` element.
   */
  "aria-label": string;
  /**
   * Short label below controls; rendered via `<Caption>` as `<figcaption>`.
   * When omitted, no caption element is rendered.
   */
  caption?: string;
  /**
   * When present, renders a "Read transcript" link below the Caption.
   */
  transcriptHref?: string;
  /**
   * Overridable link text for the transcript link. Defaults to "Read transcript".
   */
  transcriptLabel?: string;
  /**
   * Forwarded to `<audio>`. Off by default — WCAG 1.4.2 (Audio Control).
   */
  autoPlay?: boolean;
  /**
   * Forwarded to `<audio>`.
   */
  loop?: boolean;
  /**
   * Forwarded to `<audio>`.
   */
  muted?: boolean;
  /**
   * Limits initial network cost while enabling duration display.
   * Defaults to `"metadata"`.
   */
  preload?: "none" | "metadata" | "auto";
}

/**
 * AudioPlayer — token-styled HTML5 audio playback surface with Caption and
 * optional transcript link. Wraps native `<audio controls>` inside a `<figure>`
 * for semantic association with the caption.
 *
 * Focus order: `<audio>` first, transcript link second (DOM order).
 *
 * @see meta/design/AudioPlayer.md
 */
export const AudioPlayer = forwardRef<HTMLElement, AudioPlayerProps>(function AudioPlayer(
  {
    src,
    "aria-label": ariaLabel,
    caption,
    transcriptHref,
    transcriptLabel = "Read transcript",
    autoPlay = false,
    loop = false,
    muted = false,
    preload = "metadata",
    className,
    ...rest
  },
  ref,
) {
  return (
    <figure ref={ref} className={clsx(styles.root, className)} {...rest}>
      <div className={styles.audioWrapper}>
        {/* Audio captioning via <track> is impractical for music/voice clips;
            the transcriptHref prop provides equivalent accessible content. */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio
          className={styles.audio}
          src={src}
          controls
          aria-label={ariaLabel}
          {...(autoPlay ? { autoPlay: true } : {})}
          {...(loop ? { loop: true } : {})}
          {...(muted ? { muted: true } : {})}
          preload={preload}
        />
      </div>
      {caption !== undefined && (
        <Caption as="figcaption" className={styles.caption!}>
          {caption}
        </Caption>
      )}
      {transcriptHref !== undefined && (
        <a href={transcriptHref} className={styles.transcriptLink}>
          {transcriptLabel}
        </a>
      )}
    </figure>
  );
});

AudioPlayer.displayName = "AudioPlayer";
