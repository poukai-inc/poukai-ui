import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import clsx from "clsx";
import { Hero, type HeroSize, type HeroEntrance } from "../../molecules/Hero";
import styles from "./HeroSection.module.css";

export interface HeroSectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Root element. Controls landmark semantics.
   * - `"section"` (default) — region landmark, named by the Hero h1.
   * - `"article"` — independently distributable content.
   * - `"div"` — no landmark semantics (avoid for a page hero band).
   */
  as?: "section" | "article" | "div";
  /**
   * The page `<h1>` content. Required — HeroSection is the sole h1 moment on a page.
   * Forwarded to the Hero molecule.
   */
  title: ReactNode;
  /**
   * Slot above the title — typically a `<StatusBadge>`.
   * Forwarded to Hero.
   */
  status?: ReactNode;
  /**
   * Supporting copy below the title. Forwarded to Hero.
   */
  lede?: ReactNode;
  /**
   * CTA slot beneath the lede — typically a `<Button>` or anchor.
   * Forwarded to Hero.
   */
  cta?: ReactNode;
  /**
   * Optional media column. Accepts `<Portrait>` or any ReactNode.
   * When provided, a two-column grid is rendered at `md+` (≥ 768px);
   * below that breakpoint the media stacks below the text column in DOM order.
   * When absent the text column expands to full width.
   */
  media?: ReactNode;
  /**
   * Title font-size register forwarded to `Hero`.
   * - `"display"` (default) — `--fs-tagline` (36–68 px).
   * - `"intimate"` — `--fs-tagline-intimate` (32–52 px), quieter register.
   */
  size?: HeroSize;
  /**
   * CSS-only staggered entrance animation. Forwarded to `Hero`.
   * When `"stagger"`, Hero fires a four-slot stagger on page load.
   * Default (undefined) is static — no animation.
   */
  entrance?: HeroEntrance;
  /**
   * Block padding variant.
   * - `"default"` — `--space-16` (64px) top + bottom.
   * - `"tight"` — `--space-12` (48px) top + bottom.
   *
   * Named `sectionSize` to avoid collision with Hero's `size` prop.
   */
  sectionSize?: "default" | "tight";
}

/**
 * Marketing-page primary hero band.
 *
 * Composes a `Hero` molecule (title, status, lede, CTA) inside a landmark
 * `<section>` with an optional media column. Two-column layout at `md+`
 * (≥ 768px) — text left, media right. Single stacked column below.
 *
 * The root `<section>` is a region landmark named via `aria-labelledby`
 * pointing at the text column wrapper (which contains the Hero `<h1>`).
 * One `<h1>` per page — do not place a second HeroSection on any page.
 *
 * @example Default (no media)
 *   <HeroSection
 *     status={<StatusBadge>Taking conversations for Q3.</StatusBadge>}
 *     title={<>Technical consulting for teams shipping with <em>AI</em>.</>}
 *     lede="We work alongside founders and platform teams."
 *     cta={<Button asChild><a href="mailto:hello@pouk.ai">hello@pouk.ai</a></Button>}
 *   />
 *
 * @example With media
 *   <HeroSection
 *     title="Technical consulting for teams."
 *     lede="Close the gap between pilot and production."
 *     media={<Portrait src="…" alt="Founder headshot" aspect="3:4" width={1800} />}
 *   />
 */
export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(function HeroSection(
  {
    as: As = "section",
    title,
    status,
    lede,
    cta,
    media,
    size = "display",
    entrance,
    sectionSize = "default",
    className,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  // The text column carries the id so the root landmark can reference it via
  // aria-labelledby. The ARIA spec permits referencing any element — the
  // accessible name computation traverses the referenced subtree (which
  // includes the <h1>) to derive the label.
  const textColId = `${generatedId}-text`;

  const rootClassName = clsx(
    styles.root,
    sectionSize === "tight" && styles.sectionSizeTight,
    className,
  );

  const heroProps = {
    title,
    titleAs: "h1" as const,
    ...(status !== undefined && { status }),
    lede: lede ?? "",
    ...(cta !== undefined && { cta }),
    size,
    ...(entrance !== undefined && { entrance }),
    className: styles.heroInner,
  };

  const heroNode = <Hero {...heroProps} />;

  const inner =
    media != null ? (
      <div className={styles.grid}>
        <div id={textColId} className={styles.textCol}>
          {heroNode}
        </div>
        <div className={styles.mediaCol}>{media}</div>
      </div>
    ) : (
      <div id={textColId} className={styles.textColSolo}>
        {heroNode}
      </div>
    );

  const body = <div className={styles.container}>{inner}</div>;

  if (As === "article") {
    return (
      <article
        ref={ref as Ref<HTMLElement>}
        className={rootClassName}
        aria-labelledby={textColId}
        {...(rest as ComponentPropsWithoutRef<"article">)}
      >
        {body}
      </article>
    );
  }

  if (As === "div") {
    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        className={rootClassName}
        {...(rest as ComponentPropsWithoutRef<"div">)}
      >
        {body}
      </div>
    );
  }

  // Default: "section"
  return (
    <section
      ref={ref as Ref<HTMLElement>}
      className={rootClassName}
      aria-labelledby={textColId}
      {...(rest as ComponentPropsWithoutRef<"section">)}
    >
      {body}
    </section>
  );
});

HeroSection.displayName = "HeroSection";
