import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import { LinkCard } from "../../molecules/LinkCard";
import styles from "./BlogPostCard.module.css";

export type BlogPostCardTone = "default" | "subtle";
export type BlogPostCardHeadingLevel = 2 | 3;

export interface BlogPostCardCover {
  src: string;
  alt: string;
}

export interface BlogPostCardProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  /** Destination URL forwarded to the LinkCard root anchor. */
  href: string;
  /** Post heading. Rendered as h2 by default; override with headingLevel. */
  title: string;
  /** Short excerpt. Capped to 3 lines via -webkit-line-clamp. */
  lede: string;
  /** Accepts a Byline instance. */
  byline: ReactNode;
  /** Accepts a TagList instance. Omitted when undefined. */
  tags?: ReactNode;
  /** Optional cover image rendered at 16:9 aspect ratio above the body. */
  cover?: BlogPostCardCover;
  /**
   * Heading level for the title element.
   * - 2 (default) — top-level card heading.
   * - 3 — when BlogList carries its own section h2.
   */
  headingLevel?: BlogPostCardHeadingLevel;
  /**
   * Visual tone.
   * - "default" — surface background + hairline border.
   * - "subtle" — transparent background + hairline border for banded contexts.
   */
  tone?: BlogPostCardTone;
}

/**
 * Index-card preview unit for a single blog post.
 *
 * Composes LinkCard as the full-surface anchor root and arranges an optional
 * cover thumbnail, a linked title, a lede excerpt, a Byline slot, and an
 * optional TagList slot.
 *
 * One tab stop per card — the LinkCard root anchor. Do not nest interactive
 * elements inside the card.
 *
 * @example Default (text only)
 *   <BlogPostCard
 *     href="/blog/shipping-with-ai"
 *     title="Shipping with AI"
 *     lede="How we closed the gap between pilot and production."
 *     byline={<Byline name="Arian Zargaran" publishedAt="2024-06-01" readTime="5 min read" />}
 *     tags={<TagList><Tag>AI</Tag><Tag>Engineering</Tag></TagList>}
 *   />
 *
 * @example With cover image
 *   <BlogPostCard
 *     href="/blog/design-systems"
 *     title="Design Systems at Scale"
 *     lede="What we learned building a token-first component library."
 *     byline={<Byline name="Arian Zargaran" publishedAt="2024-04-15" />}
 *     cover={{ src: "/images/ds-cover.jpg", alt: "Design system diagram" }}
 *   />
 */
export const BlogPostCard = forwardRef<HTMLAnchorElement, BlogPostCardProps>(function BlogPostCard(
  {
    href,
    title,
    lede,
    byline,
    tags,
    cover,
    headingLevel = 2,
    tone = "default",
    className,
    ...rest
  },
  ref,
) {
  const TitleTag = `h${headingLevel}` as "h2" | "h3";

  return (
    <LinkCard
      ref={ref}
      href={href}
      title={<TitleTag className={styles.title}>{title}</TitleTag>}
      titleAs="h3"
      variant={tone === "subtle" ? "quiet" : "default"}
      className={clsx(styles.root, tone === "subtle" && styles.toneSubtle, className)}
      body={
        <div className={styles.body}>
          <p className={styles.lede}>{lede}</p>
          <div className={styles.meta} aria-hidden="true">
            <div className={styles.bylineSlot}>{byline}</div>
            {tags !== undefined && <div className={styles.tagsSlot}>{tags}</div>}
          </div>
        </div>
      }
      footer={undefined}
      {...rest}
    >
      {cover !== undefined && (
        <div className={styles.coverSlot}>
          <img
            src={cover.src}
            alt={cover.alt}
            className={styles.coverImg}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
    </LinkCard>
  );
});

BlogPostCard.displayName = "BlogPostCard";
