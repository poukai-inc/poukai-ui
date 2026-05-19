/**
 * Dialog — compound subcomponents.
 *
 * Thin Radix re-exports with DS-styled CSS Modules applied. Each part:
 *   - forwardRef'd to its underlying DOM element
 *   - displayName set
 *   - clsx for className merge where applicable
 *   - ...rest spread to the root element
 *
 * @see meta/design/Dialog.md
 */

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import styles from "./Dialog.module.css";

/* ─── Root ─────────────────────────────────────────────────────────────── */

export interface DialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Always true in DS usage. Non-modal dialogs are excluded from this spec.
   * See meta/design/Dialog.md §8.
   */
  modal?: boolean;
  children: ReactNode;
}

const Root = (props: DialogRootProps) => <RadixDialog.Root {...props} />;
Root.displayName = "Dialog.Root";

/* ─── Trigger ───────────────────────────────────────────────────────────── */

export interface DialogTriggerProps extends ComponentPropsWithoutRef<"button"> {
  /** Render the trigger as a child component (e.g. `<Button>`). */
  asChild?: boolean;
}

const Trigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(function DialogTrigger(
  { asChild, ...rest },
  ref,
) {
  // Spread asChild conditionally to avoid passing undefined with exactOptionalPropertyTypes
  if (asChild) {
    return <RadixDialog.Trigger ref={ref} asChild {...rest} />;
  }
  return <RadixDialog.Trigger ref={ref} {...rest} />;
});
Trigger.displayName = "Dialog.Trigger";

/* ─── Portal ────────────────────────────────────────────────────────────── */

export interface DialogPortalProps {
  /**
   * Target DOM container for the portal. Defaults to `document.body`.
   * SSR / Next.js strict-mode consumers can pass a specific DOM node
   * (e.g. `<div id="portal-root">`) to avoid hydration mismatches.
   * No code-level handling is required in the DS — Radix accepts the prop
   * directly and mounts content into the provided container.
   */
  container?: HTMLElement | null;
  forceMount?: true;
  children: ReactNode;
}

const Portal = ({ container, forceMount, children }: DialogPortalProps) => {
  if (forceMount) {
    return (
      <RadixDialog.Portal container={container} forceMount>
        {children}
      </RadixDialog.Portal>
    );
  }
  return <RadixDialog.Portal container={container}>{children}</RadixDialog.Portal>;
};
Portal.displayName = "Dialog.Portal";

/* ─── Overlay ───────────────────────────────────────────────────────────── */

export interface DialogOverlayProps extends ComponentPropsWithoutRef<"div"> {
  forceMount?: true;
}

const Overlay = forwardRef<HTMLDivElement, DialogOverlayProps>(function DialogOverlay(
  { className, forceMount, ...rest },
  ref,
) {
  if (forceMount) {
    return (
      <RadixDialog.Overlay
        ref={ref}
        forceMount
        className={clsx(styles.overlay, className)}
        {...rest}
      />
    );
  }
  return <RadixDialog.Overlay ref={ref} className={clsx(styles.overlay, className)} {...rest} />;
});
Overlay.displayName = "Dialog.Overlay";

/* ─── Content ───────────────────────────────────────────────────────────── */

// Import the Radix DismissableLayer event type for onPointerDownOutside
type RadixPointerDownOutsideEvent = Parameters<
  NonNullable<RadixDialog.DialogContentProps["onPointerDownOutside"]>
>[0];

export interface DialogContentProps extends ComponentPropsWithoutRef<"div"> {
  forceMount?: true;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: RadixPointerDownOutsideEvent) => void;
  onInteractOutside?: (event: Event) => void;
}

const Content = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  {
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

  if (forceMount) {
    return (
      <RadixDialog.Content
        ref={ref}
        forceMount
        className={clsx(styles.content, className)}
        {...callbacks}
        {...rest}
      >
        {children}
      </RadixDialog.Content>
    );
  }
  return (
    <RadixDialog.Content
      ref={ref}
      className={clsx(styles.content, className)}
      {...callbacks}
      {...rest}
    >
      {children}
    </RadixDialog.Content>
  );
});
Content.displayName = "Dialog.Content";

/* ─── Title ─────────────────────────────────────────────────────────────── */

export interface DialogTitleProps extends ComponentPropsWithoutRef<"h2"> {
  /** Render as a custom heading element. */
  asChild?: boolean;
}

const Title = forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle(
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
Title.displayName = "Dialog.Title";

/* ─── Description ───────────────────────────────────────────────────────── */

export interface DialogDescriptionProps extends ComponentPropsWithoutRef<"p"> {
  asChild?: boolean;
}

const Description = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  function DialogDescription({ asChild, className, ...rest }, ref) {
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
Description.displayName = "Dialog.Description";

/* ─── Close ─────────────────────────────────────────────────────────────── */

export interface DialogCloseProps extends ComponentPropsWithoutRef<"button"> {
  /** Render the close trigger as a child component (e.g. `<Button>`). */
  asChild?: boolean;
}

const Close = forwardRef<HTMLButtonElement, DialogCloseProps>(function DialogClose(
  { asChild, ...rest },
  ref,
) {
  if (asChild) {
    return <RadixDialog.Close ref={ref} asChild {...rest} />;
  }
  return <RadixDialog.Close ref={ref} {...rest} />;
});
Close.displayName = "Dialog.Close";

/* ─── Namespace assembly ─────────────────────────────────────────────────── */

export const Dialog = {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Close,
};
