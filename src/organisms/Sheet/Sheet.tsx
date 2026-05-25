/**
 * Sheet — side-anchored Dialog variant.
 *
 * Slides in from a viewport edge (right / left / top / bottom).
 * Built on @radix-ui/react-dialog (same dep as Dialog organism).
 * Compound API: Sheet.Root, Sheet.Trigger, Sheet.Content,
 *               Sheet.Title, Sheet.Description, Sheet.Close.
 *
 * @see meta/design/Sheet.md
 */

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import styles from "./Sheet.module.css";

/* ─── Types ─────────────────────────────────────────────────────────────── */

export type SheetSide = "right" | "left" | "top" | "bottom";
export type SheetSize = "sm" | "md" | "lg" | "full";

/* ─── Root ──────────────────────────────────────────────────────────────── */

export interface SheetRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  children: ReactNode;
}

const Root = (props: SheetRootProps) => <RadixDialog.Root {...props} />;
Root.displayName = "Sheet.Root";

/* ─── Trigger ───────────────────────────────────────────────────────────── */

export interface SheetTriggerProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
}

const Trigger = forwardRef<HTMLButtonElement, SheetTriggerProps>(function SheetTrigger(
  { asChild, ...rest },
  ref,
) {
  if (asChild) {
    return <RadixDialog.Trigger ref={ref} asChild {...rest} />;
  }
  return <RadixDialog.Trigger ref={ref} {...rest} />;
});
Trigger.displayName = "Sheet.Trigger";

/* ─── Content ───────────────────────────────────────────────────────────── */

// Import the Radix DismissableLayer event type for onPointerDownOutside
type RadixPointerDownOutsideEvent = Parameters<
  NonNullable<RadixDialog.DialogContentProps["onPointerDownOutside"]>
>[0];

export interface SheetContentProps extends ComponentPropsWithoutRef<"div"> {
  /** Which viewport edge the panel slides in from. Default: "right". */
  side?: SheetSide;
  /** Panel width (right/left) or height (top/bottom). Default: "md". */
  size?: SheetSize;
  forceMount?: true;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: RadixPointerDownOutsideEvent) => void;
  onInteractOutside?: (event: Event) => void;
}

const SIDE_CLASSES: Record<SheetSide, string | undefined> = {
  right: styles.sideRight,
  left: styles.sideLeft,
  top: styles.sideTop,
  bottom: styles.sideBottom,
};

const SIZE_CLASSES: Record<SheetSize, string | undefined> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  full: styles.sizeFull,
};

const Content = forwardRef<HTMLDivElement, SheetContentProps>(function SheetContent(
  {
    side = "right",
    size = "md",
    className,
    forceMount,
    onOpenAutoFocus,
    onCloseAutoFocus,
    onEscapeKeyDown,
    onPointerDownOutside,
    onInteractOutside,
    children,
    ...rest
  },
  ref,
) {
  const callbacks = {
    ...(onOpenAutoFocus !== undefined && { onOpenAutoFocus }),
    ...(onCloseAutoFocus !== undefined && { onCloseAutoFocus }),
    ...(onEscapeKeyDown !== undefined && { onEscapeKeyDown }),
    ...(onPointerDownOutside !== undefined && { onPointerDownOutside }),
    ...(onInteractOutside !== undefined && { onInteractOutside }),
  };

  const panelClass = clsx(styles.content, SIDE_CLASSES[side], SIZE_CLASSES[size], className);

  const inner = (
    <>
      <RadixDialog.Overlay className={styles.overlay} />
      <RadixDialog.Content ref={ref} className={panelClass} {...callbacks} {...rest}>
        {children}
      </RadixDialog.Content>
    </>
  );

  if (forceMount) {
    return <RadixDialog.Portal forceMount>{inner}</RadixDialog.Portal>;
  }
  return <RadixDialog.Portal>{inner}</RadixDialog.Portal>;
});
Content.displayName = "Sheet.Content";

/* ─── Title ─────────────────────────────────────────────────────────────── */

export interface SheetTitleProps extends ComponentPropsWithoutRef<"h2"> {
  asChild?: boolean;
}

const Title = forwardRef<HTMLHeadingElement, SheetTitleProps>(function SheetTitle(
  { asChild, className, ...rest },
  ref,
) {
  if (asChild) {
    return (
      <RadixDialog.Title ref={ref} asChild className={clsx(styles.title, className)} {...rest} />
    );
  }
  return <RadixDialog.Title ref={ref} className={clsx(styles.title, className)} {...rest} />;
});
Title.displayName = "Sheet.Title";

/* ─── Description ───────────────────────────────────────────────────────── */

export interface SheetDescriptionProps extends ComponentPropsWithoutRef<"p"> {
  asChild?: boolean;
}

const Description = forwardRef<HTMLParagraphElement, SheetDescriptionProps>(
  function SheetDescription({ asChild, className, ...rest }, ref) {
    if (asChild) {
      return (
        <RadixDialog.Description
          ref={ref}
          asChild
          className={clsx(styles.description, className)}
          {...rest}
        />
      );
    }
    return (
      <RadixDialog.Description
        ref={ref}
        className={clsx(styles.description, className)}
        {...rest}
      />
    );
  },
);
Description.displayName = "Sheet.Description";

/* ─── Close ─────────────────────────────────────────────────────────────── */

export interface SheetCloseProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
}

const Close = forwardRef<HTMLButtonElement, SheetCloseProps>(function SheetClose(
  { asChild, ...rest },
  ref,
) {
  if (asChild) {
    return <RadixDialog.Close ref={ref} asChild {...rest} />;
  }
  return <RadixDialog.Close ref={ref} {...rest} />;
});
Close.displayName = "Sheet.Close";

/* ─── Namespace assembly ────────────────────────────────────────────────── */

export const Sheet = {
  Root,
  Trigger,
  Content,
  Title,
  Description,
  Close,
};
