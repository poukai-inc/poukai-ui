import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import clsx from "clsx";
import styles from "./Figure.module.css";

/* ---------- Figure.Caption sub-component ---------- */

export interface FigureCaptionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

const FigureCaption = forwardRef<HTMLElement, FigureCaptionProps>(function FigureCaption(
  { children, className, ...rest },
  ref,
) {
  return (
    <figcaption ref={ref as Ref<HTMLElement>} className={clsx(styles.caption, className)} {...rest}>
      {children}
    </figcaption>
  );
});

FigureCaption.displayName = "Figure.Caption";

/* ---------- Figure root ---------- */

export interface FigureProps extends HTMLAttributes<HTMLElement> {
  /**
   * Media content occupying the figure slot. Required.
   * Accepts Portrait, img, CodeBlock, or any block-level media node.
   */
  children: ReactNode;
  /**
   * Shorthand caption — rendered inside a <figcaption>.
   * Omit when no caption is needed (semantically valid but uncommon).
   */
  caption?: ReactNode;
  /**
   * Caption text-alignment.
   * - `"start"` (default) — inline editorial register.
   * - `"center"` — standalone figure moments.
   */
  align?: "start" | "center";
}

interface FigureComponent extends React.ForwardRefExoticComponent<
  FigureProps & React.RefAttributes<HTMLElement>
> {
  Caption: typeof FigureCaption;
}

const FigureBase = forwardRef<HTMLElement, FigureProps>(function Figure(
  { children, caption, align = "start", className, ...rest },
  ref,
) {
  return (
    <figure
      ref={ref as Ref<HTMLElement>}
      className={clsx(styles.root, align === "center" && styles.alignCenter, className)}
      {...rest}
    >
      {children}
      {caption !== undefined && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
});

FigureBase.displayName = "Figure";

export const Figure = FigureBase as FigureComponent;
Figure.Caption = FigureCaption;

export { FigureCaption };
