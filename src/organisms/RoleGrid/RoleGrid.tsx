import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import { Section } from "../../molecules/Section";
import styles from "./RoleGrid.module.css";

export type RoleGridColumns = 2 | 3 | 4;
export type RoleGridSurface = "default" | "section";

export interface RoleGridProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  /** Section heading; names the audience group — e.g. "Who it's for". */
  heading: string;
  /** Optional eyebrow label above the heading; passed through to Section. */
  eyebrow?: string;
  /**
   * Band background variant.
   * - `"default"` — inherits page background via Section.
   * - `"section"` — applies `--surface-section` band via Section's surface prop (not yet a Section prop; forwarded as data attribute for CSS targeting).
   */
  surface?: RoleGridSurface;
  /**
   * Max column count at `--bp-md` and above.
   * Below `--bp-md` always 1 column.
   * Defaults to `3`.
   */
  columns?: RoleGridColumns;
  /** The `RoleCard` instances. */
  children: ReactNode;
}

const COLUMNS_CLASS: Record<RoleGridColumns, string> = {
  2: styles.columns2 ?? "",
  3: styles.columns3 ?? "",
  4: styles.columns4 ?? "",
};

/**
 * Section-framed organism that arranges `RoleCard` molecules into a responsive grid.
 *
 * Handles the "who this is for" / "teams we serve" pattern on marketing surfaces.
 * The grid owns column count and responsive collapse; card content is left to `RoleCard`.
 *
 * @example
 *   <RoleGrid heading="Who it's for" eyebrow="Roles" columns={3}>
 *     <RoleCard eyebrow="Role 01" title="Builder" body="Ships production systems." />
 *     <RoleCard eyebrow="Role 02" title="Operator" body="Manages running systems." />
 *     <RoleCard eyebrow="Role 03" title="Strategist" body="Shapes AI direction." />
 *   </RoleGrid>
 */
export const RoleGrid = forwardRef<HTMLElement, RoleGridProps>(function RoleGrid(
  { heading, eyebrow, surface = "default", columns = 3, children, className, ...rest },
  ref,
) {
  return (
    <Section
      ref={ref}
      eyebrow={eyebrow}
      title={heading}
      className={clsx(styles.root, surface === "section" && styles.surfaceSection, className)}
      {...rest}
    >
      <div className={clsx(styles.grid, COLUMNS_CLASS[columns])}>{children}</div>
    </Section>
  );
});

RoleGrid.displayName = "RoleGrid";
