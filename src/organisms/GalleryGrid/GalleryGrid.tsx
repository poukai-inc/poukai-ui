/**
 * GalleryGrid — responsive editorial photo grid with lightbox overlay.
 *
 * A Section-framed CSS grid of Portrait thumbnails where each item opens an
 * enlarged Dialog view on click/Enter/Space. Shared single Dialog instance
 * swaps content on open. Focus returns to the triggering thumbnail on close.
 *
 * @see meta/design/GalleryGrid.md
 */

import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type Ref,
} from "react";
import clsx from "clsx";
import { X } from "lucide-react";
import { Portrait } from "../../molecules/Portrait";
import { Section } from "../../molecules/Section";
import { Dialog } from "../Dialog";
import { IconButton } from "../../atoms/IconButton";
import styles from "./GalleryGrid.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GalleryGridColumns = 2 | 3 | 4;
export type GalleryGridGap = "default" | "tight";

export interface GalleryGridItemProps {
  /** Image URL passed to Portrait. */
  src: string;
  /** Required alt text (WCAG 1.1.1). */
  alt: string;
  /** Optional caption rendered below thumbnail and inside enlarged Dialog. */
  caption?: string;
}

export interface GalleryGridProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Optional Section heading rendered above the grid.
   * Omit for anonymous grids embedded in pre-titled sections.
   */
  heading?: string;
  /**
   * Number of columns in the CSS grid at full width.
   * Collapses to 1 at < 480 px and 2 at 480–767 px regardless of this prop.
   * @default 3
   */
  columns?: GalleryGridColumns;
  /**
   * Gap between grid cells.
   * - `"default"` — `--space-4`
   * - `"tight"` — `--space-2`
   * @default "default"
   */
  gap?: GalleryGridGap;
  /**
   * `GalleryGrid.Item` nodes only.
   * Each Item props object provides src, alt, and optional caption.
   */
  items: GalleryGridItemProps[];
}

// ---------------------------------------------------------------------------
// Column class map (CSS Modules camelCaseOnly)
// ---------------------------------------------------------------------------

const COLS_CLASS: Record<GalleryGridColumns, string> = {
  2: styles.cols2!,
  3: styles.cols3!,
  4: styles.cols4!,
};

// ---------------------------------------------------------------------------
// GalleryGrid
// ---------------------------------------------------------------------------

/**
 * Responsive grid of Portrait thumbnails with click-to-enlarge Dialog overlay.
 *
 * Each thumbnail is keyboard-accessible (`<button>` wrapper). Click or
 * Enter/Space opens a Dialog with the enlarged Portrait and optional caption.
 * Esc, backdrop-click, or the close IconButton dismiss the Dialog.
 * Focus returns to the triggering thumbnail on close.
 *
 * @example
 *   <GalleryGrid
 *     heading="Selected work"
 *     columns={3}
 *     items={[
 *       { src: "https://example.com/a.jpg", alt: "Mural on brick wall", caption: "Berlin, 2024" },
 *       { src: "https://example.com/b.jpg", alt: "Studio interior" },
 *     ]}
 *   />
 */
export const GalleryGrid = forwardRef<HTMLElement, GalleryGridProps>(function GalleryGrid(
  { heading, columns = 3, gap = "default", items, className, ...rest },
  ref,
) {
  const dialogTitleId = useId();

  // Shared dialog state — single overlay, content swapped on open.
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<GalleryGridItemProps | null>(null);

  // Refs to each thumbnail button so focus can be restored on close.
  const triggerRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const activeIndexRef = useRef<number>(-1);

  const handleOpen = useCallback((item: GalleryGridItemProps, index: number) => {
    setActiveItem(item);
    activeIndexRef.current = index;
    setOpen(true);
  }, []);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      // Restore focus to triggering thumbnail after Dialog fully closes.
      const idx = activeIndexRef.current;
      const trigger = triggerRefs.current.get(idx);
      if (trigger) {
        // Defer one frame so Radix has time to unmount the focus trap.
        requestAnimationFrame(() => trigger.focus());
      }
    }
  }, []);

  const gridClassName = clsx(styles.grid, COLS_CLASS[columns], gap === "tight" && styles.gapTight);

  const gridContent = (
    <div className={gridClassName} role="list">
      {items.map((item, index) => (
        <figure key={index} className={styles.item} role="listitem">
          <button
            ref={(el) => {
              if (el) {
                triggerRefs.current.set(index, el);
              } else {
                triggerRefs.current.delete(index);
              }
            }}
            type="button"
            className={styles.trigger}
            onClick={() => handleOpen(item, index)}
            aria-label={
              item.caption
                ? `View enlarged: ${item.alt} — ${item.caption}`
                : `View enlarged: ${item.alt}`
            }
          >
            <Portrait
              src={item.src}
              alt={item.alt}
              aspect="3:4"
              width={600}
              loading="lazy"
              className={styles.thumbnail}
            />
          </button>
          {item.caption !== undefined && (
            <figcaption className={styles.caption}>{item.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );

  return (
    <>
      <Section
        ref={ref as Ref<HTMLElement>}
        title={heading}
        className={clsx(styles.root, className)}
        {...rest}
      >
        {gridContent}
      </Section>

      <Dialog.Root open={open} onOpenChange={handleOpenChange} modal>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content className={styles.dialogContent} aria-labelledby={dialogTitleId}>
            {/* Visually hidden title for screen readers — required by Radix Dialog */}
            <Dialog.Title id={dialogTitleId} className={styles.visuallyHiddenTitle}>
              {activeItem?.caption ?? activeItem?.alt ?? "Enlarged image"}
            </Dialog.Title>

            <div className={styles.dialogHeader}>
              <Dialog.Close asChild>
                <IconButton
                  icon={X}
                  aria-label="Close"
                  variant="ghost"
                  size="sm"
                  className={styles.closeButton}
                />
              </Dialog.Close>
            </div>

            {activeItem !== null && (
              <div className={styles.dialogBody}>
                <Portrait
                  src={activeItem.src}
                  alt={activeItem.alt}
                  aspect="3:4"
                  width={900}
                  loading="eager"
                  className={styles.enlargedPortrait}
                />
                {activeItem.caption !== undefined && (
                  <p className={styles.dialogCaption}>{activeItem.caption}</p>
                )}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
});

GalleryGrid.displayName = "GalleryGrid";
