/**
 * Tabs — compound subcomponents.
 *
 * Thin Radix re-exports with DS-styled CSS Modules applied. Each part:
 *   - forwardRef'd to its underlying DOM element
 *   - displayName set
 *   - clsx for className merge where applicable
 *   - ...rest spread to the root element
 *
 * Accessibility is fully delegated to @radix-ui/react-tabs:
 *   - role="tablist" / role="tab" / role="tabpanel" wired automatically
 *   - aria-selected, aria-controls, aria-labelledby wired automatically
 *   - Arrow key navigation (Left/Right for horizontal, Up/Down for vertical)
 *   - Home / End to jump to first / last tab
 *   - Focus management on activation
 *
 * Do NOT roll your own keyboard navigation — Radix handles it.
 *
 * @see meta/design/Tabs.md
 */

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import clsx from "clsx";
import styles from "./Tabs.module.css";

/* ─── Root ─────────────────────────────────────────────────────────────── */

export interface TabsRootProps extends Omit<ComponentPropsWithoutRef<"div">, "dir"> {
  /** Controlled active tab value. Pair with onValueChange. */
  value?: string;
  /** Uncontrolled default active tab value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Tab layout orientation. Default "horizontal". */
  orientation?: "horizontal" | "vertical";
  children: ReactNode;
}

const Root = forwardRef<HTMLDivElement, TabsRootProps>(function TabsRoot(
  { value, defaultValue, onValueChange, orientation = "horizontal", className, children, ...rest },
  ref,
) {
  const controlledProps = {
    ...(value !== undefined && { value }),
    ...(defaultValue !== undefined && { defaultValue }),
    ...(onValueChange !== undefined && { onValueChange }),
  };

  return (
    <RadixTabs.Root
      ref={ref}
      orientation={orientation}
      className={clsx(styles.root, className)}
      {...controlledProps}
      {...rest}
    >
      {children}
    </RadixTabs.Root>
  );
});
Root.displayName = "Tabs.Root";

/* ─── List ──────────────────────────────────────────────────────────────── */

export interface TabsListProps extends ComponentPropsWithoutRef<"div"> {
  /** When true, keyboard navigation will loop from last tab to first. Default true. */
  loop?: boolean;
}

const List = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, loop, ...rest },
  ref,
) {
  const listProps = {
    ...(loop !== undefined && { loop }),
  };

  return (
    <RadixTabs.List ref={ref} className={clsx(styles.list, className)} {...listProps} {...rest} />
  );
});
List.displayName = "Tabs.List";

/* ─── Trigger ───────────────────────────────────────────────────────────── */

export interface TabsTriggerProps extends ComponentPropsWithoutRef<"button"> {
  /** The value that identifies this trigger and its associated content panel. Required. */
  value: string;
}

const Trigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { value, className, ...rest },
  ref,
) {
  return (
    <RadixTabs.Trigger
      ref={ref}
      value={value}
      className={clsx(styles.trigger, className)}
      {...rest}
    />
  );
});
Trigger.displayName = "Tabs.Trigger";

/* ─── Content ───────────────────────────────────────────────────────────── */

export interface TabsContentProps extends ComponentPropsWithoutRef<"div"> {
  /** The value that identifies this content panel and its associated trigger. Required. */
  value: string;
}

const Content = forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { value, className, ...rest },
  ref,
) {
  return (
    <RadixTabs.Content
      ref={ref}
      value={value}
      className={clsx(styles.content, className)}
      {...rest}
    />
  );
});
Content.displayName = "Tabs.Content";

/* ─── Namespace assembly ─────────────────────────────────────────────────── */

export const Tabs = {
  Root,
  List,
  Trigger,
  Content,
};
