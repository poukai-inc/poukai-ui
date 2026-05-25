/**
 * ArticleLayout — single-column long-form reading template.
 *
 * TOKEN FALLBACK NOTE: The spec requires `--article-measure` for the `text`
 * column width (reading-comfort prose measure, canonically 65–75ch). No such
 * token exists in tokens.css today. Per orchestrator decision this file uses
 * a hardcoded fallback of `65ch` in the CSS module. This is a known follow-up:
 * once a `--article-measure` token is ratified and added to tokens.css the
 * fallback should be replaced with `var(--article-measure)`.
 *
 * See: meta/design/ArticleLayout.md §3 Open questions, and the changeset at
 * .changeset/organism-articlelayout.md.
 */
import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import clsx from "clsx";
import styles from "./ArticleLayout.module.css";

export interface ArticleLayoutProps extends HTMLAttributes<HTMLElement> {
  /**
   * Root element override.
   * - `"article"` (default) — semantic article landmark.
   * - `"div"` — use when `ArticleLayout` is nested inside an existing `<article>`
   *   to avoid invalid landmark nesting (e.g. inside `<DocsLayout>`).
   */
  as?: "article" | "div";

  /**
   * Header slot — rendered above the content grid, constrained to `text` column width.
   * Canonical value: `<ArticleHeader>`. Optional; when omitted no header slot is emitted.
   */
  header?: ReactNode;

  /**
   * Article body. Direct children land in the CSS grid. Children that carry no
   * explicit width positioning land in the `text` column (reading measure) by default.
   * Pass wide/bleed children inside a layout wrapper that applies the appropriate
   * grid-column utility class.
   */
  children: ReactNode;
}

/**
 * Single-column long-form reading template.
 *
 * Wraps content in a semantic `<article>` (or `<div>`) with a CSS grid that
 * exposes named width slots (`text`, `wide`, `bleed`) via CSS custom properties.
 * Direct children land in the `text` track (reading measure) by default.
 *
 * The `header` prop slots an `ArticleHeader` (or any ReactNode) above the
 * content grid — it is rendered outside the grid so no consumer-side
 * grid-column override is needed.
 *
 * TOKEN FALLBACK: The `text` column currently falls back to `65ch` because
 * `--article-measure` does not yet exist in tokens.css. Replace with
 * `var(--article-measure)` once that token is approved.
 *
 * @example Basic usage
 *   <ArticleLayout
 *     header={<ArticleHeader title="The case for AI fluency" />}
 *   >
 *     <Prose>
 *       <p>Long-form body copy…</p>
 *     </Prose>
 *   </ArticleLayout>
 *
 * @example Nested inside DocsLayout (avoid double article landmark)
 *   <ArticleLayout as="div" header={<ArticleHeader title="…" />}>
 *     <Prose>…</Prose>
 *   </ArticleLayout>
 */
export const ArticleLayout = forwardRef<HTMLElement, ArticleLayoutProps>(function ArticleLayout(
  { as: As = "article", header, children, className, ...rest },
  ref,
) {
  const inner = (
    <>
      {header != null && <div className={styles.header}>{header}</div>}
      <div className={styles.content}>{children}</div>
    </>
  );

  const rootClassName = clsx(styles.root, className);

  if (As === "div") {
    return (
      <div ref={ref as Ref<HTMLDivElement>} className={rootClassName} {...rest}>
        {inner}
      </div>
    );
  }

  return (
    <article ref={ref as Ref<HTMLElement>} className={rootClassName} {...rest}>
      {inner}
    </article>
  );
});

ArticleLayout.displayName = "ArticleLayout";
