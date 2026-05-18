import { forwardRef, type ComponentPropsWithoutRef, type ReactNode, type Ref } from "react";
import clsx from "clsx";
import styles from "./Statement.module.css";

export interface StatementProps extends Omit<ComponentPropsWithoutRef<"div">, "as"> {
  /** Editorial statement. Rendered in a <p>. Not a heading. */
  statement: ReactNode;
  /** Optional supporting line. Rendered in a <p>, muted. */
  supporting?: ReactNode;
  /** Decorative 1px hairline above + --space-12 padding-top. */
  hairline?: boolean;
  /** Root element semantics. "p" = <div> (default); "blockquote" = <blockquote>. */
  as?: "p" | "blockquote";
}

export const Statement = forwardRef<HTMLDivElement, StatementProps>(function Statement(
  { statement, supporting, hairline = false, as: As = "p", className, ...rest },
  ref,
) {
  const rootClassName = clsx(styles.root, hairline && styles.hairline, className);
  const children = (
    <>
      <p className={styles.statement}>{statement}</p>
      {supporting && <p className={styles.supporting}>{supporting}</p>}
    </>
  );

  if (As === "blockquote") {
    return (
      <blockquote
        ref={ref as Ref<HTMLQuoteElement>}
        className={rootClassName}
        {...(rest as ComponentPropsWithoutRef<"blockquote">)}
      >
        {children}
      </blockquote>
    );
  }

  return (
    <div ref={ref} className={rootClassName} {...rest}>
      {children}
    </div>
  );
});

Statement.displayName = "Statement";
