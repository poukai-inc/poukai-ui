/**
 * DropdownMenu — compound Radix-wrapped menu trigger + items.
 *
 * Compound API:
 *   DropdownMenu.Root      — context provider (Radix Root)
 *   DropdownMenu.Trigger   — the anchor element (asChild-capable)
 *   DropdownMenu.Content   — floating panel, portalled to <body>
 *   DropdownMenu.Item      — single action row (composes MenuItem)
 *   DropdownMenu.Separator — 1px hairline rule between groups
 *
 * Convenience:
 *   DropdownMenuBasic      — flattened declarative wrapper
 *
 * Built on @radix-ui/react-dropdown-menu for ARIA, keyboard nav,
 * portal rendering, and focus management.
 *
 * @see meta/design/DropdownMenu.md
 */

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
// Runtime destructuring avoids Playwright CT bundler collisions when the
// Radix namespace identifier would clash with our exported names.
import * as RadixDropdownMenuModule from "@radix-ui/react-dropdown-menu";

const {
  Root: RadixRoot,
  Trigger: RadixTrigger,
  Portal: RadixPortal,
  Content: RadixContent,
  Item: RadixItem,
  Separator: RadixSeparator,
} = RadixDropdownMenuModule;

import clsx from "clsx";
import { MenuItem } from "../../molecules/MenuItem";
import styles from "./DropdownMenu.module.css";

/* ─── Root ──────────────────────────────────────────────────────── */

export interface DropdownMenuRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Defaults to true. Non-modal menus are out of scope for this spec. */
  modal?: boolean;
  children: ReactNode;
}

const Root = (props: DropdownMenuRootProps) => <RadixRoot {...props} />;
Root.displayName = "DropdownMenu.Root";

/* ─── Trigger ───────────────────────────────────────────────────── */

export interface DropdownMenuTriggerProps extends ComponentPropsWithoutRef<"button"> {
  /** Render trigger as child component — delegates styling to child (e.g. IconButton). */
  asChild?: boolean;
}

const Trigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  function DropdownMenuTrigger({ asChild, ...rest }, ref) {
    if (asChild) {
      return <RadixTrigger ref={ref} asChild {...rest} />;
    }
    return <RadixTrigger ref={ref} {...rest} />;
  },
);
Trigger.displayName = "DropdownMenu.Trigger";

/* ─── Content ───────────────────────────────────────────────────── */

export interface DropdownMenuContentProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Radix align — `"start"` | `"center"` | `"end"`.
   * End-aligned for action menus anchored to a trailing icon button.
   * @default "start"
   */
  align?: "start" | "center" | "end";
  /**
   * Radix side — `"top"` | `"bottom"` | `"left"` | `"right"`.
   * Auto-flips when viewport edge is hit.
   * @default "bottom"
   */
  side?: "top" | "bottom" | "left" | "right";
  /**
   * Pixel gap between trigger and Content panel.
   * @default 4
   */
  sideOffset?: number;
  /**
   * Minimum width of the panel. Prevents undersized panels on short labels.
   * @default "160px"
   */
  minWidth?: string;
  /** Portal container. Defaults to document.body. */
  container?: HTMLElement | null;
  forceMount?: true;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: Event) => void;
  onInteractOutside?: (event: Event) => void;
}

const Content = forwardRef<HTMLDivElement, DropdownMenuContentProps>(function DropdownMenuContent(
  {
    align = "start",
    side = "bottom",
    sideOffset = 4,
    minWidth = "160px",
    container,
    forceMount,
    className,
    style,
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
    ...(onCloseAutoFocus !== undefined && { onCloseAutoFocus }),
    ...(onEscapeKeyDown !== undefined && { onEscapeKeyDown }),
    ...(onPointerDownOutside !== undefined && { onPointerDownOutside }),
    ...(onInteractOutside !== undefined && { onInteractOutside }),
  };

  const portal = forceMount ? (
    <RadixPortal container={container} forceMount>
      <RadixContent
        ref={ref}
        align={align}
        side={side}
        sideOffset={sideOffset}
        forceMount
        className={clsx(styles.content, className)}
        style={{ minWidth, ...style }}
        {...callbacks}
        {...rest}
      >
        {children}
      </RadixContent>
    </RadixPortal>
  ) : (
    <RadixPortal container={container}>
      <RadixContent
        ref={ref}
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={clsx(styles.content, className)}
        style={{ minWidth, ...style }}
        {...callbacks}
        {...rest}
      >
        {children}
      </RadixContent>
    </RadixPortal>
  );

  return portal;
});
Content.displayName = "DropdownMenu.Content";

/* ─── Item ──────────────────────────────────────────────────────── */

export interface DropdownMenuItemProps {
  /** The visible label. */
  children: ReactNode;
  /** Visual register. @default "default" */
  tone?: "default" | "danger";
  /** Disables the item — skipped in keyboard nav, aria-disabled set by Radix. */
  disabled?: boolean;
  /** Called on pointer click or keyboard Enter/Space. */
  onSelect?: (event: Event) => void;
  /** Optional leading icon slot (lucide-react icon, 16px). */
  icon?: ReactNode;
  /** Optional trailing shortcut string rendered at --fg-muted. */
  shortcut?: string;
  className?: string;
  /** Additional data-* or aria-* props forwarded to the Radix item. */
  [key: `data-${string}`]: string | undefined;
}

const Item = forwardRef<HTMLDivElement, DropdownMenuItemProps>(function DropdownMenuItem(
  { children, tone = "default", disabled = false, onSelect, icon, shortcut, className, ...rest },
  ref,
) {
  const itemCallbacks = {
    ...(onSelect !== undefined && { onSelect }),
  };

  return (
    <RadixItem
      ref={ref}
      disabled={disabled}
      className={clsx(styles.item, className)}
      {...itemCallbacks}
      {...rest}
    >
      <MenuItem
        tone={tone}
        disabled={disabled}
        {...(icon !== undefined && { icon })}
        {...(shortcut !== undefined && { shortcut })}
      >
        {children}
      </MenuItem>
    </RadixItem>
  );
});
Item.displayName = "DropdownMenu.Item";

/* ─── Separator ─────────────────────────────────────────────────── */

export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<"div">;

const Separator = forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  function DropdownMenuSeparator({ className, ...rest }, ref) {
    return <RadixSeparator ref={ref} className={clsx(styles.separator, className)} {...rest} />;
  },
);
Separator.displayName = "DropdownMenu.Separator";

/* ─── Namespace assembly ────────────────────────────────────────── */

export const DropdownMenu = {
  Root,
  Trigger,
  Content,
  Item,
  Separator,
};

/* ─── DropdownMenuBasic (convenience wrapper) ───────────────────── */

export interface DropdownMenuBasicItem {
  /** Display label for the item. */
  label: string;
  /** Called when the item is selected. */
  onSelect?: (event: Event) => void;
  /** Visual register. @default "default" */
  tone?: "default" | "danger";
  /** Disabled state. @default false */
  disabled?: boolean;
  /** Optional leading icon slot. */
  icon?: ReactNode;
  /** Optional trailing shortcut hint string. */
  shortcut?: string;
}

export interface DropdownMenuBasicProps {
  /** ReactNode for the trigger slot. */
  trigger: ReactNode;
  /** Array of item descriptors. */
  items: DropdownMenuBasicItem[];
  /**
   * Forwarded to Content's align prop.
   * @default "start"
   */
  align?: "start" | "center" | "end";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * DropdownMenuBasic — convenience wrapper.
 *
 * Flattens the common trigger + items pattern into a single declarative
 * prop set. For full control over Content, Item, or Separator, use the
 * compound API (`DropdownMenu.Root` etc.) directly.
 *
 * @example
 *   <DropdownMenuBasic
 *     trigger={<IconButton icon={MoreHorizontal} aria-label="More actions" variant="ghost" />}
 *     items={[
 *       { label: "Edit", onSelect: handleEdit },
 *       { label: "Delete", tone: "danger", onSelect: handleDelete },
 *     ]}
 *   />
 */
export function DropdownMenuBasic({
  trigger,
  items,
  align = "start",
  open,
  defaultOpen,
  onOpenChange,
}: DropdownMenuBasicProps): JSX.Element {
  const rootProps = {
    ...(open !== undefined && { open }),
    ...(defaultOpen !== undefined && { defaultOpen }),
    ...(onOpenChange !== undefined && { onOpenChange }),
  };

  return (
    <DropdownMenu.Root {...rootProps}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Content align={align}>
        {items.map((item, idx) => (
          <DropdownMenu.Item
            key={idx}
            {...(item.tone !== undefined && { tone: item.tone })}
            {...(item.disabled !== undefined && { disabled: item.disabled })}
            {...(item.onSelect !== undefined && { onSelect: item.onSelect })}
            {...(item.icon !== undefined && { icon: item.icon })}
            {...(item.shortcut !== undefined && { shortcut: item.shortcut })}
          >
            {item.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

DropdownMenuBasic.displayName = "DropdownMenuBasic";
