import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import { Section } from "../../molecules/Section";
import styles from "./TeamGrid.module.css";

export interface TeamGridProps extends HTMLAttributes<HTMLElement> {
  /**
   * Section heading — e.g. `"The team"`. Required; a nameless team grid is
   * not a valid surface.
   */
  heading: string;
  /**
   * Optional micro-label above the heading, passed to Section.
   */
  eyebrow?: string;
  /**
   * Optional supporting sentence below the heading, passed to Section.
   */
  lede?: string;
  /**
   * Maximum column count at wide viewports.
   * - `3` (default) — rosters of 5+ people.
   * - `2` — small teams (2–4 people). Prevents a lone orphan in a 3-column grid.
   *
   * Below `--bp-md` (768px) the grid is always 1 column.
   * Between `--bp-md` and ~1024px it is always 2 columns regardless of this prop.
   */
  columns?: 2 | 3;
  /**
   * Section tone. Passed through to Section.
   * - `"default"` — transparent background.
   * - `"section"` — `--surface-section` recessed band for visual rhythm.
   */
  tone?: "default" | "section";
  /**
   * `TeamCard` instances. Count and layout are the consumer's responsibility.
   */
  children: ReactNode;
}

/**
 * TeamGrid — Section-framed responsive grid of TeamCard molecules.
 *
 * Presents an "about the team" surface: a group of portrait + name + role
 * cards with consistent column rhythm, shared spacing, and correct semantic
 * structure. Serves marketing pages, about pages, and any surface that
 * introduces the people behind a product.
 *
 * TeamGrid owns the Section wrapper (heading, optional eyebrow/lede, optional
 * band background) and the grid container. Individual `TeamCard` instances are
 * the consumer's responsibility — TeamGrid positions whatever is slotted.
 *
 * @example Default (3-column, 4 members)
 *   <TeamGrid heading="The team" eyebrow="Who we are">
 *     <TeamCard portrait={…} name="Arian Zargaran" role="Founder, Engineering" />
 *     <TeamCard portrait={…} name="Jane Doe" role="Design Lead" />
 *     <TeamCard portrait={…} name="John Smith" role="Engineering" />
 *     <TeamCard portrait={…} name="Sara Lee" role="Product" />
 *   </TeamGrid>
 *
 * @example Small team (2-column)
 *   <TeamGrid heading="The team" columns={2}>
 *     <TeamCard portrait={…} name="Arian Zargaran" role="Founder" />
 *     <TeamCard portrait={…} name="Jane Doe" role="Design" />
 *   </TeamGrid>
 *
 * @example Section tone for band rhythm
 *   <TeamGrid heading="The team" tone="section">
 *     …
 *   </TeamGrid>
 */
export const TeamGrid = forwardRef<HTMLElement, TeamGridProps>(function TeamGrid(
  { heading, eyebrow, lede, columns = 3, tone = "default", className, children, ...rest },
  ref,
) {
  return (
    <Section
      ref={ref}
      eyebrow={eyebrow}
      title={heading}
      lede={lede}
      className={clsx(styles.root, tone === "section" && styles.toneSection, className)}
      {...rest}
    >
      <div
        className={clsx(styles.grid, columns === 2 ? styles.columns2 : styles.columns3)}
        data-columns={columns}
      >
        {children}
      </div>
    </Section>
  );
});

TeamGrid.displayName = "TeamGrid";
