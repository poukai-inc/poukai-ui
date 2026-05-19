import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import clsx from "clsx";
import { Eyebrow } from "../../atoms/Eyebrow";
import styles from "./FeatureCard.module.css";

export interface FeatureCardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Root element override. Default `"article"` — correct for a self-contained
   * feature tile. Use `"li"` inside a `<ul>` feature list; `"section"` when
   * region landmark semantics are required; `"div"` when landmark semantics
   * would be noise.
   */
  as?: "article" | "section" | "div" | "li";
  /**
   * Optional decorative icon. Rendered inside an `aria-hidden` wrapper span.
   * FeatureCard sets `color: currentColor` on the wrapper; sizing (24px or 32px
   * from lucide-react) is the consumer's responsibility.
   */
  icon?: ReactNode;
  /**
   * Optional category label above the title. String → auto-wrapped in
   * `<Eyebrow variant="muted">`. ReactNode → rendered as-is (no double-wrap).
   */
  eyebrow?: string | ReactNode;
  /**
   * Feature name — required. Rendered as the element named by `titleAs`.
   * The global h3 bottom margin is zeroed inside FeatureCard's flex scope.
   */
  title: ReactNode;
  /**
   * Heading element for the title. Default `"h3"` — correct for a tile grid
   * under a `<Section>` (h2) on a page with a `<Hero>` (h1).
   * `"h1"` is intentionally excluded — a feature tile is never a page heading.
   */
  titleAs?: "h2" | "h3" | "h4";
  /**
   * Feature description — required. String → wrapped in `<p style="margin:0">`.
   * ReactNode → rendered as-is. The global `p` bottom margin must not compound
   * inside the flex column, so string bodies always get `margin: 0`.
   */
  body: ReactNode;
  /**
   * Optional footer slot. Accepts any ReactNode. Rendered inside a wrapper div
   * with default `color: var(--fg-muted)` and `font-size: var(--fs-meta)`.
   * When absent, no element is emitted and no gap is created.
   *
   * Footer flex alignment note (spec Q3, option B — composition guidance):
   * FeatureCard is content-height and carries no internal flex spacer. When a
   * grid of FeatureCards needs aligned footers across rows, the consumer applies:
   *   - `align-items: stretch` on the grid container
   *   - `height: 100%` on the FeatureCard root (via className)
   *   - `display: flex; flex-direction: column` on the root
   *   - `margin-top: auto` on the footer wrapper element in their surface CSS
   * This keeps the component simple; the spacer belongs in compositions that
   * explicitly want footer alignment, not in the component by default.
   */
  footer?: ReactNode;
  /**
   * Visual containment variant.
   * - `"default"` — transparent background, no border, no radius. Content tiles
   *   on the page canvas; whitespace is the separator.
   * - `"bordered"` — `--surface` background, `1px solid --hairline` border,
   *   `--radius-3` corners. Explicit tile containment for denser grids or surfaces
   *   where transparency would read incorrectly.
   */
  variant?: "default" | "bordered";
}

/** Elements where `aria-labelledby` is meaningful (landmark roles). */
const LANDMARK_ELEMENTS = new Set(["article", "section"]);

/**
 * Feature tile molecule — canonical primitive for capability and service grids.
 *
 * Presents a single feature as a bounded content object: optional icon, optional
 * eyebrow, required title, required body, optional footer.
 *
 * Use FeatureCard when items are peers (not a numbered sequence) and none of the
 * tiles are navigational destinations. For an interactive tile, use `<LinkCard>`.
 * For a sequenced editorial tile, use `<Principle>` or `<FailureMode>`.
 *
 * @example Default — icon + title + body
 *   <FeatureCard
 *     icon={<Zap aria-hidden size={24} />}
 *     title="Ship faster"
 *     body="From prototype to production in days, not months."
 *   />
 *
 * @example Bordered — with eyebrow + footer
 *   <FeatureCard
 *     variant="bordered"
 *     eyebrow="Platform"
 *     title="Observability"
 *     body="Every inference logged, traced, and alertable."
 *     footer={<a href="/docs/observability">Learn more →</a>}
 *   />
 *
 * @example Semantic list (as="li" inside <ul>)
 *   <ul style={{ listStyle: "none", padding: 0 }}>
 *     <FeatureCard as="li" title="…" body="…" />
 *   </ul>
 */
export const FeatureCard = forwardRef<HTMLElement, FeatureCardProps>(function FeatureCard(
  {
    as: As = "article",
    icon,
    eyebrow,
    title,
    titleAs = "h3",
    body,
    footer,
    variant = "default",
    className,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;

  const isLandmark = LANDMARK_ELEMENTS.has(As);
  const labelledBy = isLandmark ? titleId : undefined;

  const rootClassName = clsx(
    styles.root,
    variant === "bordered" && styles.variantBordered,
    className,
  );

  const TitleTag = titleAs;

  const eyebrowNode =
    eyebrow === undefined ? null : typeof eyebrow === "string" ? (
      <Eyebrow variant="muted">{eyebrow}</Eyebrow>
    ) : (
      eyebrow
    );

  const bodyNode = typeof body === "string" ? <p className={styles.body}>{body}</p> : body;

  const content = (
    <>
      {icon !== undefined && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {eyebrowNode !== null && <div className={styles.eyebrowSlot}>{eyebrowNode}</div>}
      <TitleTag id={titleId} className={styles.title}>
        {title}
      </TitleTag>
      <div className={styles.bodySlot}>{bodyNode}</div>
      {footer !== undefined && <div className={styles.footer}>{footer}</div>}
    </>
  );

  // Per-branch cast pattern (same as Section/Eyebrow) — satisfies TypeScript
  // without a single unsafe cast while keeping identical runtime behaviour.
  if (As === "section") {
    return (
      <section
        ref={ref as Ref<HTMLElement>}
        className={rootClassName}
        aria-labelledby={labelledBy}
        {...(rest as ComponentPropsWithoutRef<"section">)}
      >
        {content}
      </section>
    );
  }

  if (As === "div") {
    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        className={rootClassName}
        {...(rest as ComponentPropsWithoutRef<"div">)}
      >
        {content}
      </div>
    );
  }

  if (As === "li") {
    return (
      <li
        ref={ref as Ref<HTMLLIElement>}
        className={rootClassName}
        {...(rest as ComponentPropsWithoutRef<"li">)}
      >
        {content}
      </li>
    );
  }

  // Default: "article"
  return (
    <article
      ref={ref as Ref<HTMLElement>}
      className={rootClassName}
      aria-labelledby={labelledBy}
      {...(rest as ComponentPropsWithoutRef<"article">)}
    >
      {content}
    </article>
  );
});

FeatureCard.displayName = "FeatureCard";
