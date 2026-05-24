/**
 * Popover — anchored, dismissible floating-content primitive.
 *
 * Wraps `@radix-ui/react-popover` with DS tokens.
 * Compound API: Popover.Root / Popover.Trigger / Popover.Content / Popover.Close
 * Portal rendering via Popover.Portal — never clipped by overflow:hidden ancestors.
 *
 * @see meta/design/Popover.md
 */

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
// Runtime destructuring to avoid Playwright CT bundler identifier collisions.
import * as RadixPopoverModule from "@radix-ui/react-popover";
const {
  Root: RadixPopoverRoot,
  Trigger: RadixPopoverTrigger,
  Portal: RadixPopoverPortal,
  Content: RadixPopoverContent,
  Arrow: RadixPopoverArrow,
  Close: RadixPopoverClose,
} = RadixPopoverModule;
import clsx from "clsx";
import styles from "./Popover.module.css";

/* ─── Root ────────────────────────────────────────────────────── */

export interface PopoverRootProps {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. Default: false. */
  defaultOpen?: boolean;
  /** State change callback. */
  onOpenChange?: (open: boolean) => void;
  /**
   * When true, blocks pointer interaction outside the panel (Dialog posture).
   * Default: false.
   */
  modal?: boolean;
  children: ReactNode;
}

const Root = (props: PopoverRootProps) => <RadixPopoverRoot {...props} />;
Root.displayName = "Popover.Root";

/* ─── Trigger ─────────────────────────────────────────────────── */

export interface PopoverTriggerProps extends ComponentPropsWithoutRef<"button"> {
  /**
   * Render the trigger as a child component (e.g. `<Button>`),
   * merging props without a wrapping element.
   */
  asChild?: boolean;
}

const Trigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(function PopoverTrigger(
  { asChild, ...rest },
  ref,
) {
  if (asChild) {
    return <RadixPopoverTrigger ref={ref} asChild {...rest} />;
  }
  return <RadixPopoverTrigger ref={ref} {...rest} />;
});
Trigger.displayName = "Popover.Trigger";

/* ─── Portal ──────────────────────────────────────────────────── */

export interface PopoverPortalProps {
  /** Target DOM container. Defaults to document.body. */
  container?: HTMLElement | null;
  forceMount?: true;
  children: ReactNode;
}

const Portal = ({ container, forceMount, children }: PopoverPortalProps) => {
  if (forceMount) {
    return (
      <RadixPopoverPortal container={container} forceMount>
        {children}
      </RadixPopoverPortal>
    );
  }
  return <RadixPopoverPortal container={container}>{children}</RadixPopoverPortal>;
};
Portal.displayName = "Popover.Portal";

/* ─── Content ─────────────────────────────────────────────────── */

type RadixPointerDownOutsideEvent = Parameters<
  NonNullable<RadixPopoverModule.PopoverContentProps["onPointerDownOutside"]>
>[0];

export interface PopoverContentProps extends ComponentPropsWithoutRef<"div"> {
  /** Preferred placement side. Default: "bottom". Radix auto-flips on viewport edge. */
  side?: "top" | "right" | "bottom" | "left";
  /** Alignment along the cross axis. Default: "center". */
  align?: "start" | "center" | "end";
  /** Gap between trigger and panel in px. Default: 8 (matches --space-2). */
  sideOffset?: number;
  /** Render caret arrow. Default: false. */
  arrow?: boolean;
  forceMount?: true;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: RadixPointerDownOutsideEvent) => void;
  onInteractOutside?: (event: Event) => void;
}

const Content = forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  {
    className,
    children,
    side = "bottom",
    align = "center",
    sideOffset = 8,
    arrow = false,
    forceMount,
    onOpenAutoFocus,
    onCloseAutoFocus,
    onEscapeKeyDown,
    onPointerDownOutside,
    onInteractOutside,
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

  const content = (
    <RadixPopoverContent
      ref={ref}
      side={side}
      align={align}
      sideOffset={sideOffset}
      className={clsx(styles.content, className)}
      {...callbacks}
      {...rest}
    >
      {arrow && <RadixPopoverArrow className={styles.arrow} aria-hidden="true" />}
      {children}
    </RadixPopoverContent>
  );

  if (forceMount) {
    return <RadixPopoverPortal forceMount>{content}</RadixPopoverPortal>;
  }

  return <RadixPopoverPortal>{content}</RadixPopoverPortal>;
});
Content.displayName = "Popover.Content";

/* ─── Close ───────────────────────────────────────────────────── */

export interface PopoverCloseProps extends ComponentPropsWithoutRef<"button"> {
  /** Render the close trigger as a child component (e.g. `<Button>`). */
  asChild?: boolean;
}

const Close = forwardRef<HTMLButtonElement, PopoverCloseProps>(function PopoverClose(
  { asChild, ...rest },
  ref,
) {
  if (asChild) {
    return <RadixPopoverClose ref={ref} asChild {...rest} />;
  }
  return <RadixPopoverClose ref={ref} {...rest} />;
});
Close.displayName = "Popover.Close";

/* ─── Namespace assembly ──────────────────────────────────────── */

export const Popover = {
  Root,
  Trigger,
  Portal,
  Content,
  Close,
};
