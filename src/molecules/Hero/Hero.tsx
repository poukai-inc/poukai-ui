import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Hero.module.css";

export type HeroAlign = "start" | "center";
export type HeroSize = "display" | "intimate";
export type HeroEntrance = "stagger";
export type HeroVariant = "default" | "no-title";

type HeroShared = Omit<ComponentPropsWithoutRef<"section">, "title"> & {
  /** Sub-headline / standfirst. Rendered inside a p.lede. */
  lede: ReactNode;
  /** Slot beneath the lede — typically a Button or anchor. */
  cta?: ReactNode;
  /** Horizontal alignment of the column. Defaults to start. */
  align?: HeroAlign;
  /**
   * Title font-size register. display (default) uses --fs-tagline (36-68 px).
   * intimate uses --fs-tagline-intimate (32-52 px) — quieter register.
   * In variant="no-title", size is silently accepted with no visual effect.
   */
  size?: HeroSize;
  /**
   * Opt-in CSS-only staggered entrance animation. When set to "stagger",
   * slots animate in with a staggered top-down rise (8–12px translateY + fade).
   * Zero JS, no IntersectionObserver.
   * Default (undefined) preserves static behavior — no regression for existing consumers.
   * Accessibility: animation is fully disabled under prefers-reduced-motion: reduce.
   */
  entrance?: HeroEntrance;
};

export type HeroDefaultProps = HeroShared & {
  variant?: "default" | undefined;
  /** The display headline — usually an h1 or plain text. Rendered inside an h1. */
  title: ReactNode;
  /** Render title inside a different element. Defaults to h1. */
  titleAs?: "h1" | "h2";
  /** Slot above the title — typically a StatusBadge. */
  status?: ReactNode;
  eyebrow?: never;
};

export type HeroNoTitleProps = HeroShared & {
  /**
   * Switch to no-title mode: renders eyebrow + lede only, no heading element.
   * Use only when the page's <h1> lives in body content. The consumer must
   * provide an <h1> elsewhere on the page.
   */
  variant: "no-title";
  /** Eyebrow label at --fs-micro, --fg-muted, uppercase. Renders above the lede. */
  eyebrow?: ReactNode;
  title?: never;
  titleAs?: never;
  status?: never;
};

/** Discriminated-union Hero props. Pass variant="no-title" for the heading-free doorway. */
export type HeroProps = HeroDefaultProps | HeroNoTitleProps;

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
 * Editorial hero block. Two modes:
 * - Default: Status / Title (h1) / Lede / CTA — the primary display moment per page.
 * - variant="no-title": Eyebrow / Lede / CTA — no heading emitted. Use only when
 *   the page's <h1> lives in body content below the doorway band.
 *
 * @example Default
 *   <Hero
 *     status={<StatusBadge>Taking conversations for Q3.</StatusBadge>}
 *     title={<>Technical consulting for teams shipping with <em>AI</em>.</>}
 *     lede="We work alongside founders and platform teams to close the gap between pilot and production."
 *     cta={<Button asChild><a href="mailto:hello@pouk.ai">hello@pouk.ai</a></Button>}
 *   />
 *
 * @example No-title (editorial doorway)
 *   <Hero variant="no-title" eyebrow="About" lede="One to two sentences setting up the page." />
 */
export const Hero = forwardRef<HTMLElement, HeroProps>(function Hero(
  {
    lede,
    cta,
    align = "start",
    size = "display",
    entrance,
    className,
    variant,
    title,
    titleAs = "h1",
    status,
    eyebrow,
    ...rest
  },
  ref,
) {
  if (variant === "no-title") {
    return (
      <section
        ref={ref}
        className={clsx(
          styles.root,
          styles.variantNoTitle,
          alignClass[align],
          entrance != null ? entranceClass[entrance] : undefined,
          className,
        )}
        {...rest}
      >
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <p className={clsx(styles.lede, "lede")}>{lede}</p>
        {cta ? <div className={styles.cta}>{cta}</div> : null}
      </section>
    );
  }

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
