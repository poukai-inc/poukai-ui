import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Hero.module.css";

export type HeroAlign = "start" | "center";
export type HeroSize = "display" | "intimate";
export type HeroEntrance = "stagger";

export interface HeroProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  /** The display headline — usually an h1 or plain text. Rendered inside an h1. */
  title: ReactNode;
  /** Sub-headline / standfirst. Rendered inside a p.lede. */
  lede: ReactNode;
  /** Slot above the title — typically a StatusBadge. */
  status?: ReactNode;
  /** Slot beneath the lede — typically a Button or anchor. */
  cta?: ReactNode;
  /** Horizontal alignment of the column. Defaults to start. */
  align?: HeroAlign;
  /** Render title inside a different element. Defaults to h1. */
  titleAs?: "h1" | "h2";
  /**
   * Title font-size register. display (default) uses --fs-tagline (36-68 px).
   * intimate uses --fs-tagline-intimate (32-52 px) — quieter register for
   * low-density doorway pages. At `intimate`, vertical gaps between status, title, and lede also compress proportionally.
   */
  size?: HeroSize;
  /**
   * Opt-in CSS-only staggered entrance animation. When set to "stagger",
   * status, title, lede, and CTA animate in with a staggered top-down rise
   * (8–12px translateY + fade). Zero JS, no IntersectionObserver.
   * Default (undefined) preserves static behavior — no regression for existing consumers.
   * Accessibility: animation is fully disabled under prefers-reduced-motion: reduce.
   */
  entrance?: HeroEntrance;
}

const alignClass: Record<HeroAlign, string> = {
  start: styles.alignStart!,
  center: styles.alignCenter!,
};

const sizeClass: Record<HeroSize, string | undefined> = {
  display: undefined,
  intimate: styles.sizeIntimate!,
};

const entranceClass: Record<HeroEntrance, string> = {
  stagger: styles.entranceStagger!,
};

/**
 * Editorial hero block — owns the hand-tuned vertical rhythm from the
 * holding page. Status / Title / Lede / CTA, each its own slot.
 *
 * Imagery deliberately has no slot — Hero is text-only. Compose imagery
 * around the Hero in page templates, not inside it.
 *
 * @example
 *   <Hero
 *     status={<StatusBadge>Taking conversations for Q3.</StatusBadge>}
 *     title={<>Technical consulting for teams shipping with <em>AI</em>.</>}
 *     lede="We work alongside founders and platform teams to close the gap between pilot and production."
 *     cta={<Button asChild><a href="mailto:hello@pouk.ai">hello@pouk.ai</a></Button>}
 *   />
 */
export const Hero = forwardRef<HTMLElement, HeroProps>(function Hero(
  {
    title,
    lede,
    status,
    cta,
    align = "start",
    size = "display",
    titleAs = "h1",
    entrance,
    className,
    ...rest
  },
  ref,
) {
  const Title = titleAs;
  return (
    <section
      ref={ref}
      className={clsx(
        styles.root,
        alignClass[align],
        sizeClass[size],
        entrance != null ? entranceClass[entrance] : undefined,
        className,
      )}
      {...rest}
    >
      {status ? <div className={styles.status}>{status}</div> : null}
      <Title className={styles.title}>{title}</Title>
      <p className={clsx(styles.lede, "lede")}>{lede}</p>
      {cta ? <div className={styles.cta}>{cta}</div> : null}
    </section>
  );
});

Hero.displayName = "Hero";
