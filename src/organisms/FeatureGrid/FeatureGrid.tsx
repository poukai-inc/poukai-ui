import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import { Section } from "../../molecules/Section";
import styles from "./FeatureGrid.module.css";

export interface FeatureGridProps extends HTMLAttributes<HTMLElement> {
  /**
   * Optional section heading. Forwarded to `Section` as `title`.
   * Omit for anonymous grid blocks embedded inside another Section.
   */
  heading?: string;
  /**
   * Optional eyebrow label above the heading.
   * Forwarded to `Section` as `eyebrow`.
   */
  eyebrow?: string | ReactNode;
  /**
   * Optional supporting copy below the heading.
   * Forwarded to `Section` as `lede`.
   */
  lede?: string | ReactNode;
  /**
   * Maximum column count at widest viewport.
   * - `3` (default) — standard feature grid; `minmax(16rem, 1fr)`.
   * - `2` — wider cards for dense copy; `minmax(20rem, 1fr)`.
   * `1` column is always the mobile fallback via `auto-fit`.
   */
  columns?: 2 | 3;
  /**
   * Block padding variant — forwarded to `Section`.
   * - `"default"` — `--space-16` top + bottom.
   * - `"tight"` — `--space-12` top + bottom, for dense in-product surfaces.
   */
  size?: "default" | "tight";
  /**
   * Grid content — idiomatic usage is one or more `<FeatureCard>` instances.
   * Any count is supported; `auto-fit` fills available columns.
   */
  children: ReactNode;
}

/**
 * Organism that frames a responsive grid of `FeatureCard` molecules inside a
 * `Section` wrapper. Owns the heading slot, 1→2→3-column grid layout, and gap
 * rhythm between cards.
 *
 * Use on marketing landing pages and feature-overview surfaces where a set of
 * benefit or capability cards must be presented in a scannable, evenly-spaced
 * grid with an optional section heading.
 *
 * @example Standard three-column grid
 *   <FeatureGrid heading="What you get" eyebrow="Platform" lede="Supporting copy.">
 *     <FeatureCard title="Ship faster" body="…" />
 *     <FeatureCard title="Scale reliably" body="…" />
 *     <FeatureCard title="Observe everything" body="…" />
 *   </FeatureGrid>
 *
 * @example Two-column grid for wider cards
 *   <FeatureGrid columns={2} heading="Capabilities">
 *     <FeatureCard title="Enterprise SSO" body="…" />
 *     <FeatureCard title="Audit logs" body="…" />
 *   </FeatureGrid>
 *
 * @example Anonymous grid (no heading) embedded inside another Section
 *   <FeatureGrid>
 *     <FeatureCard title="…" body="…" />
 *   </FeatureGrid>
 */
export const FeatureGrid = forwardRef<HTMLElement, FeatureGridProps>(function FeatureGrid(
  { heading, eyebrow, lede, columns = 3, size = "default", className, children, ...rest },
  ref,
) {
  const gridClassName = clsx(styles.grid, columns === 2 ? styles.colsTwo : styles.colsThree);

  return (
    <Section
      ref={ref}
      title={heading}
      eyebrow={eyebrow}
      lede={lede}
      size={size}
      className={className}
      {...rest}
    >
      <div className={gridClassName}>{children}</div>
    </Section>
  );
});

FeatureGrid.displayName = "FeatureGrid";
