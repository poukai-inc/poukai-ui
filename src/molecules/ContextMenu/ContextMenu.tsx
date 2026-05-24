/**
 * ContextMenu — Radix-wrapped right-click / long-press menu.
 *
 * Compound API:
 *   ContextMenu.Root      — state owner, no DOM output
 *   ContextMenu.Trigger   — asChild wrapper, no visual output
 *   ContextMenu.Content   — floating panel, portal-rendered
 *   ContextMenu.Item      — action row (composes MenuItem molecule)
 *   ContextMenu.Separator — hairline rule
 *
 * @see meta/design/ContextMenu.md
 */

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as RadixContextMenu from "@radix-ui/react-context-menu";
import clsx from "clsx";
import { MenuItem, type MenuItemTone } from "../MenuItem";
import styles from "./ContextMenu.module.css";

/* ─── Root ──────────────────────────────────────────────────────────────── */

export interface ContextMenuRootProps {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled default open state. */
  defaultOpen?: boolean;
  /** Fired when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

const Root = ({ open, defaultOpen, onOpenChange, children }: ContextMenuRootProps) => {
  const props = {
    ...(open !== undefined && { open }),
    ...(defaultOpen !== undefined && { defaultOpen }),
    ...(onOpenChange !== undefined && { onOpenChange }),
  };
  return <RadixContextMenu.Root {...props}>{children}</RadixContextMenu.Root>;
};
Root.displayName = "ContextMenu.Root";

/* ─── Trigger ───────────────────────────────────────────────────────────── */

export interface ContextMenuTriggerProps extends ComponentPropsWithoutRef<"span"> {
  /**
   * Always true in DS usage — ContextMenu never adds a visible trigger element.
   * Consumer wraps their target region and ContextMenu forwards events to it.
   */
  asChild?: boolean;
}

const Trigger = forwardRef<HTMLSpanElement, ContextMenuTriggerProps>(function ContextMenuTrigger(
  { asChild, ...rest },
  ref,
) {
  if (asChild) {
    return <RadixContextMenu.Trigger ref={ref} asChild {...rest} />;
  }
  return <RadixContextMenu.Trigger ref={ref} {...rest} />;
});
Trigger.displayName = "ContextMenu.Trigger";

/* ─── Content ───────────────────────────────────────────────────────────── */

export interface ContextMenuContentProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Pixel gap between the pointer position and the panel edge.
   * @default 4
   */
  sideOffset?: number;
  /** Loop keyboard navigation from last → first and first → last item. */
  loop?: boolean;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: Event) => void;
  onFocusOutside?: (event: Event) => void;
  onInteractOutside?: (event: Event) => void;
  children: ReactNode;
}

const Content = forwardRef<HTMLDivElement, ContextMenuContentProps>(function ContextMenuContent(
  {
    className,
    sideOffset = 4,
    loop,
    onCloseAutoFocus,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    children,
    ...rest
  },
  ref,
) {
  const callbacks = {
    ...(onCloseAutoFocus !== undefined && { onCloseAutoFocus }),
    ...(onEscapeKeyDown !== undefined && { onEscapeKeyDown }),
    ...(onPointerDownOutside !== undefined && { onPointerDownOutside }),
    ...(onFocusOutside !== undefined && { onFocusOutside }),
    ...(onInteractOutside !== undefined && { onInteractOutside }),
  };
  return (
    <RadixContextMenu.Portal>
      <RadixContextMenu.Content
        ref={ref}
        alignOffset={sideOffset}
        {...(loop !== undefined && { loop })}
        className={clsx(styles.content, className)}
        {...callbacks}
        {...rest}
      >
        {children}
      </RadixContextMenu.Content>
    </RadixContextMenu.Portal>
  );
});
Content.displayName = "ContextMenu.Content";

/* ─── Item ──────────────────────────────────────────────────────────────── */

export interface ContextMenuItemProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  /** Leading icon slot. Consumer supplies icon with aria-hidden="true". */
  icon?: ReactNode;
  /** Trailing keyboard shortcut hint (display-only). */
  shortcut?: string;
  /**
   * Visual tone.
   * - `"default"`: --fg label color.
   * - `"danger"`: --danger label color for destructive actions.
   * @default "default"
   */
  tone?: MenuItemTone;
  /** Disabled — opacity 0.4, pointer-events none. Radix sets aria-disabled. */
  disabled?: boolean;
  /** Radix onSelect handler. */
  onSelect?: (event: Event) => void;
  /** Prevent closing menu on select (e.g. for checkboxes). */
  textValue?: string;
  children: ReactNode;
}

const Item = forwardRef<HTMLDivElement, ContextMenuItemProps>(function ContextMenuItem(
  {
    icon,
    shortcut,
    tone = "default",
    disabled = false,
    className,
    onSelect,
    textValue,
    children,
    ...rest
  },
  ref,
) {
  const itemCallbacks = {
    ...(onSelect !== undefined && { onSelect }),
    ...(textValue !== undefined && { textValue }),
  };
  return (
    <RadixContextMenu.Item disabled={disabled} {...itemCallbacks} asChild>
      <MenuItem
        ref={ref}
        tone={tone}
        disabled={disabled}
        {...(icon !== undefined && { icon })}
        {...(shortcut !== undefined && { shortcut })}
        {...(className !== undefined && { className })}
        {...rest}
      >
        {children}
      </MenuItem>
    </RadixContextMenu.Item>
  );
});
Item.displayName = "ContextMenu.Item";

/* ─── Separator ─────────────────────────────────────────────────────────── */

export type ContextMenuSeparatorProps = ComponentPropsWithoutRef<"div">;

const Separator = forwardRef<HTMLDivElement, ContextMenuSeparatorProps>(
  function ContextMenuSeparator({ className, ...rest }, ref) {
    return (
      <RadixContextMenu.Separator
        ref={ref}
        className={clsx(styles.separator, className)}
        {...rest}
      />
    );
  },
);
Separator.displayName = "ContextMenu.Separator";

/* ─── Namespace assembly ─────────────────────────────────────────────────── */

export const ContextMenu = {
  Root,
  Trigger,
  Content,
  Item,
  Separator,
};
