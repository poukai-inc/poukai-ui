import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import { Eyebrow } from "../../atoms/Eyebrow";
import { Heading } from "../../atoms/Heading";
import { Text } from "../../atoms/Text";
import styles from "./ArticleHeader.module.css";

export interface ArticleHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Required. Category label above the title — e.g. "Engineering", "Design".
   * Rendered as a `<p>` eyebrow in muted color, uppercase, tracked.
   */
  eyebrow: string;
  /**
   * Required. Article title rendered as `<h1>`.
   * Accepts `ReactNode` so `<em>` spans produce serif-italic accent.
   */
  title: ReactNode;
  /**
   * Required. 1–3 sentence article summary; rendered at `--fs-body` in `--fg-muted`.
   */
  lede: string;
  /**
   * Required slot. Accepts `<Byline>` molecule — author, role, date, read time.
   */
  byline: ReactNode;
  /**
   * Optional slot. Accepts `<ShareLinks>` molecule.
   * Omit on pages that do not surface social sharing.
   */
  share?: ReactNode;
  /**
   * When `true`, renders a `--hairline` rule below the block before body prose.
   * Default: `false`.
   */
  divider?: boolean;
}

/**
 * Canonical top-of-article block for long-form surfaces.
 *
 * Composes: eyebrow label → `<h1>` title → lede paragraph → Byline row
 * → optional ShareLinks row → optional hairline divider.
 *
 * The root element is `<header>` inside an `<article>` — per the spec,
 * `<header>` scoped within sectioning content is an article-level landmark,
 * not a page-level `<header>`.
 *
 * One `<h1>` per page rule applies; `ArticleLayout` (or the consuming page)
 * must wrap this component in `<article>`.
 *
 * @example Blog post usage
 *   <article>
 *     <ArticleHeader
 *       eyebrow="Engineering"
 *       title={<>Why we build with <em>AI</em>.</>}
 *       lede="A short summary of the article for readers skimming the page."
 *       byline={<Byline name="Arian Zargaran" role="Founder" publishedAt="2026-05-24" readTime="4 min read" />}
 *       share={<div>share links here</div>}
 *       divider
 *     />
 *     <p>Body copy starts here…</p>
 *   </article>
 */
export const ArticleHeader = forwardRef<HTMLElement, ArticleHeaderProps>(function ArticleHeader(
  { eyebrow, title, lede, byline, share, divider = false, className, ...rest },
  ref,
) {
  return (
    <header
      ref={ref}
      className={clsx(styles.root, divider && styles.withDivider, className)}
      {...rest}
    >
      <Eyebrow as="p" variant="muted" className={styles.eyebrow}>
        {eyebrow}
      </Eyebrow>
      <Heading as="h1" size="h1" className={styles.title}>
        {title}
      </Heading>
      <Text size="lede" tone="muted" className={styles.lede}>
        {lede}
      </Text>
      <div className={styles.bylineRow}>{byline}</div>
      {share != null ? <div className={styles.shareRow}>{share}</div> : null}
    </header>
  );
});

ArticleHeader.displayName = "ArticleHeader";
