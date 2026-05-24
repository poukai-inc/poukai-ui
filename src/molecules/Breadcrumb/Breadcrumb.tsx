import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Breadcrumb.module.css";

/* ---------- BreadcrumbItem sub-component ---------- */

export interface BreadcrumbItemProps {
  /** When present, renders the item as an `<a>` link. Omit for the current item. */
  href?: string;
  /** Marks this item as the current page. Renders plain text; adds aria-current="page". */
  current?: boolean;
  /** Item label. */
  children: ReactNode;
}

const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(function BreadcrumbItem(
  { href, current = false, children },
  ref,
) {
  return (
    <li ref={ref} className={styles.item} {...(current ? { "aria-current": "page" } : {})}>
      {current || !href ? (
        <span className={styles.current}>{children}</span>
      ) : (
        <a href={href} className={styles.link}>
          {children}
        </a>
      )}
    </li>
  );
});

BreadcrumbItem.displayName = "Breadcrumb.Item";

/* ---------- BreadcrumbItem data shape for items prop ---------- */

export interface BreadcrumbItemData {
  href?: string;
  label: ReactNode;
  current?: boolean;
}

/* ---------- Breadcrumb root ---------- */

export interface BreadcrumbProps extends Omit<ComponentPropsWithoutRef<"nav">, "children"> {
  /**
   * Data-driven path. Mutually exclusive with compound `children`.
   * Current item: set `current: true` on the last entry (no `href` needed).
   */
  items?: BreadcrumbItemData[];
  /**
   * Compound `<Breadcrumb.Item>` nodes. Preferred for dynamic labels.
   * Mutually exclusive with `items`.
   */
  children?: ReactNode;
  /**
   * Separator rendered between items.
   * Default is `›` (a visually distinct right-pointing chevron).
   */
  separator?: ReactNode;
}

/**
 * Breadcrumb — hierarchical location trail molecule.
 *
 * Anatomy: `<nav aria-label="Breadcrumb">` → `<ol>` → `<li>` items with
 * `<a>` ancestor links and plain-text current item.
 *
 * Two usage patterns:
 *   (a) Compound: `<Breadcrumb><Breadcrumb.Item href="…">…</Breadcrumb.Item></Breadcrumb>`
 *   (b) Data-driven: `<Breadcrumb items={[{ href, label }, { label, current: true }]} />`
 *
 * A11y:
 *   - `<nav aria-label="Breadcrumb">` exposes a distinct navigation landmark.
 *   - `<ol>` conveys ordered hierarchy to screen readers.
 *   - Current item: `aria-current="page"`.
 *   - Separators: `aria-hidden="true"` so they are not read as content.
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, children, separator = "›", className, ...rest },
  ref,
) {
  const renderItems = () => {
    if (items && items.length > 0) {
      return items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isCurrent = item.current ?? isLast;
        const itemProps = isCurrent ? {} : item.href ? { href: item.href } : {};
        return (
          <BreadcrumbItem key={index} {...itemProps} current={isCurrent}>
            {item.label}
          </BreadcrumbItem>
        );
      });
    }
    return children;
  };

  const renderedItems = renderItems();
  const itemArray = Array.isArray(renderedItems) ? renderedItems : [renderedItems];

  const withSeparators = itemArray.reduce<ReactNode[]>((acc, item, index) => {
    acc.push(item);
    if (index < itemArray.length - 1) {
      acc.push(
        <li key={`sep-${index}`} className={styles.separator} aria-hidden="true">
          {separator}
        </li>,
      );
    }
    return acc;
  }, []);

  return (
    <nav ref={ref} aria-label="Breadcrumb" className={clsx(styles.root, className)} {...rest}>
      <ol className={styles.list}>{withSeparators}</ol>
    </nav>
  );
});

Breadcrumb.displayName = "Breadcrumb";

// Attach sub-component
(Breadcrumb as typeof Breadcrumb & { Item: typeof BreadcrumbItem }).Item = BreadcrumbItem;

export { BreadcrumbItem };
