import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ComponentPropsWithoutRef,
} from "react";
import clsx from "clsx";
import styles from "./TableOfContents.module.css";

export interface TableOfContentsItem {
  /** The `id` attribute of the heading element this item links to. */
  id: string;
  /** Display label for the anchor. */
  label: string;
  /**
   * Heading depth.
   * - `1` (default) — H2-level section heading, full indent.
   * - `2` — H3-level sub-section, indented further at `--space-4`.
   */
  depth?: 1 | 2;
}

export interface TableOfContentsProps extends ComponentPropsWithoutRef<"nav"> {
  /** Anchor list. Each entry maps to a heading `id` on the page. */
  items: TableOfContentsItem[];
  /**
   * Optional label rendered above the list in the micro/meta register.
   * Omit on narrow contexts. Spec: rendered as `<p>`, not a heading element.
   */
  heading?: string;
  /**
   * Controlled active item id. When provided, overrides IntersectionObserver.
   */
  activeId?: string;
  /**
   * Escape hatch for controlled consumers. Called whenever the observer
   * detects a new active section.
   */
  onActiveChange?: (id: string) => void;
  /**
   * Pixel offset for IntersectionObserver `rootMargin` top — matches the
   * sticky header height so the active item fires at the correct scroll position.
   * Default: `0`.
   */
  offset?: number;
}

/**
 * TableOfContents — sticky anchor list with IntersectionObserver active-section
 * highlight.
 *
 * Anatomy:
 *   `<nav aria-label="Table of contents">` — named navigation landmark.
 *     Optional `<p>` heading in the micro/meta register ("On this page").
 *     `<ul>` of `<li>` + `<a href="#id">` anchors from the `items` prop.
 *
 * Active tracking:
 *   An internal IntersectionObserver watches all `[id]` targets listed in
 *   `items`. The topmost intersecting entry wins. When `activeId` is provided
 *   it overrides the observer (controlled mode).
 *
 * Sticky positioning:
 *   `position: sticky; top: var(--toc-offset, var(--space-8))`. Consumer sets
 *   `--toc-offset` on a parent to match their shell header height.
 *
 * @example Default (uncontrolled)
 *   <TableOfContents
 *     heading="On this page"
 *     items={[
 *       { id: "intro", label: "Introduction" },
 *       { id: "approach", label: "Approach" },
 *       { id: "results", label: "Results", depth: 2 },
 *     ]}
 *   />
 *
 * @example Controlled
 *   <TableOfContents
 *     items={sections}
 *     activeId={currentSection}
 *     onActiveChange={setCurrentSection}
 *   />
 */
export const TableOfContents = forwardRef<HTMLElement, TableOfContentsProps>(
  function TableOfContents(
    {
      items,
      heading,
      activeId: controlledActiveId,
      onActiveChange,
      offset = 0,
      className,
      ...rest
    },
    ref,
  ) {
    const [internalActiveId, setInternalActiveId] = useState<string | undefined>(undefined);

    const isControlled = controlledActiveId !== undefined;
    const activeId = isControlled ? controlledActiveId : internalActiveId;

    const onActiveChangeRef = useRef(onActiveChange);
    onActiveChangeRef.current = onActiveChange;

    const handleActiveChange = useCallback((id: string) => {
      setInternalActiveId(id);
      onActiveChangeRef.current?.(id);
    }, []);

    useEffect(() => {
      if (items.length === 0) return;

      const targets = items
        .map(({ id }) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

      if (targets.length === 0) return;

      // Track intersection ratio for each target to pick the topmost visible.
      const ratioMap = new Map<string, number>();

      const marginTop = offset > 0 ? `-${offset}px` : "0px";

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = entry.target.id;
            ratioMap.set(id, entry.intersectionRatio);
          });

          // Find the topmost intersecting entry by document order.
          let newActiveId: string | undefined;
          for (const { id } of items) {
            if ((ratioMap.get(id) ?? 0) > 0) {
              newActiveId = id;
              break;
            }
          }

          if (newActiveId !== undefined && !isControlled) {
            handleActiveChange(newActiveId);
          } else if (newActiveId !== undefined && isControlled) {
            onActiveChangeRef.current?.(newActiveId);
          }
        },
        {
          rootMargin: `${marginTop} 0px 0px 0px`,
          threshold: [0, 0.1, 0.5, 1.0],
        },
      );

      targets.forEach((el) => observer.observe(el));

      return () => {
        observer.disconnect();
      };
    }, [items, offset, isControlled, handleActiveChange]);

    return (
      <nav
        ref={ref}
        aria-label="Table of contents"
        className={clsx(styles.root, className)}
        {...rest}
      >
        {heading !== undefined && <p className={styles.heading}>{heading}</p>}
        <ul className={styles.list}>
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li
                key={item.id}
                className={clsx(styles.item, item.depth === 2 && styles.itemDepth2)}
              >
                <a
                  href={`#${item.id}`}
                  className={clsx(styles.link, isActive && styles.linkActive)}
                  aria-current={isActive ? "true" : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  },
);

TableOfContents.displayName = "TableOfContents";
