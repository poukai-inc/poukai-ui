import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import { BlogPostCard, type BlogPostCardProps } from "../BlogPostCard";
import styles from "./BlogList.module.css";

export type { BlogPostCardProps };

export type BlogListSize = "default" | "tight";

export interface BlogListProps extends Omit<ComponentPropsWithoutRef<"section">, "aria-label"> {
  /**
   * Data for each post card. BlogList maps each entry to
   * `<li><BlogPostCard … /></li>` in DOM order.
   */
  posts: BlogPostCardProps[];
  /**
   * Slot for a `<Pagination>` instance. Only rendered when populated.
   * The slot is wrapped in a `<footer>` with a hairline top-border to
   * visually separate it from the card list.
   */
  pagination?: ReactNode;
  /**
   * Block padding variant.
   * - `"default"` — `--space-16` (64 px) top + bottom.
   * - `"tight"` — `--space-12` (48 px) top + bottom.
   */
  size?: BlogListSize;
  /**
   * Names the region landmark. Override for category / tag pages.
   * @default "Blog posts"
   */
  "aria-label"?: string;
}

/**
 * BlogList — blog index organism.
 *
 * Renders a vertical sequence of `BlogPostCard` previews inside a semantic
 * `<ul>` / `<li>` structure. An optional `pagination` slot is rendered below
 * the list in a `<footer>` with a hairline separator.
 *
 * The root `<section>` is a named region landmark (default `"Blog posts"`).
 * Screen readers can jump directly to the list via landmark navigation.
 *
 * **Do not render BlogList with zero posts.** Gate on `posts.length > 0` and
 * render `<EmptyState>` for the zero-data case.
 *
 * @example Default
 *   <BlogList posts={posts} />
 *
 * @example With pagination
 *   <BlogList
 *     posts={posts}
 *     pagination={<Pagination … />}
 *   />
 *
 * @example Category page
 *   <BlogList
 *     posts={posts}
 *     aria-label="Posts tagged design"
 *   />
 */
export const BlogList = forwardRef<HTMLElement, BlogListProps>(function BlogList(
  {
    posts,
    pagination,
    size = "default",
    "aria-label": ariaLabel = "Blog posts",
    className,
    ...rest
  },
  ref,
) {
  return (
    <section
      ref={ref}
      aria-label={ariaLabel}
      className={clsx(styles.root, size === "tight" && styles.sizeTight, className)}
      {...rest}
    >
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles -- role="list" restores list semantics in Safari/VoiceOver when list-style:none is set (spec §6) */}
      <ul role="list" className={styles.list}>
        {posts.map((post, index) => (
          <li key={post.href ?? index} className={styles.item}>
            <BlogPostCard {...post} />
          </li>
        ))}
      </ul>
      {pagination != null ? (
        <footer data-slot="pagination" className={styles.paginationRow}>
          {pagination}
        </footer>
      ) : null}
    </section>
  );
});

BlogList.displayName = "BlogList";
