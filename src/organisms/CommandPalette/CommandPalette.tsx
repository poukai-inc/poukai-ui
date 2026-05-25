/**
 * CommandPalette — cmdk-driven search + navigation overlay (⌘K).
 *
 * Composed from:
 *   - Dialog (organism) — focus trap, backdrop, portal, dismiss semantics
 *   - cmdk — fuzzy filtering, keyboard navigation loop, ARIA emission
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   // Wire ⌘K in consuming app:
 *   // useEffect(() => { const h = (e) => { if ((e.metaKey||e.ctrlKey)&&e.key==='k') setOpen(true); };
 *   //   window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, []);
 *
 *   <CommandPalette open={open} onOpenChange={setOpen}>
 *     <CommandPalette.Group heading="Pages">
 *       <CommandPalette.Item onSelect={() => navigate('/dashboard')}>Dashboard</CommandPalette.Item>
 *     </CommandPalette.Group>
 *     <CommandPalette.Empty>No results found.</CommandPalette.Empty>
 *   </CommandPalette>
 *
 * @see meta/design/CommandPalette.md
 */

import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import * as Cmdk from "cmdk";
import { Search } from "lucide-react";
import { Dialog } from "../Dialog/Dialog";
import { Kbd } from "../../atoms/Kbd";
import clsx from "clsx";
import styles from "./CommandPalette.module.css";

/* ─── Root ───────────────────────────────────────────────────── */

export interface CommandPaletteRootProps {
  /** Controlled open state. */
  open: boolean;
  /** Dismiss callback — close on Esc / backdrop click. */
  onOpenChange: (open: boolean) => void;
  /** Input placeholder text. */
  placeholder?: string;
  /**
   * CommandPalette.Group + CommandPalette.Item + CommandPalette.Empty nodes.
   */
  children: ReactNode;
}

const Root = forwardRef<HTMLDivElement, CommandPaletteRootProps>(function CommandPaletteRoot(
  { open, onOpenChange, placeholder = "Search…", children },
  ref,
) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content ref={ref} className={styles.content} aria-label="Command palette">
          {/* Visually-hidden title for screen readers via Radix Dialog */}
          <Cmdk.Command className={styles.command} label="Command palette">
            {/* Input row */}
            <div className={styles.inputRow}>
              <Search size={16} aria-hidden="true" className={styles.searchIcon} />
              <Cmdk.CommandInput placeholder={placeholder} className={styles.input} />
              <Kbd aria-hidden="true" className={styles.escHint}>
                Esc
              </Kbd>
            </div>

            {/* Divider */}
            <hr className={styles.divider} />

            {/* Results list */}
            <Cmdk.CommandList className={styles.list}>{children}</Cmdk.CommandList>

            {/* Footer hint row */}
            <hr className={styles.divider} />
            <div className={styles.footer} aria-hidden="true">
              <span className={styles.footerHint}>
                <Kbd className={styles.footerKbd}>↑↓</Kbd> Navigate
              </span>
              <span className={styles.footerHint}>
                <Kbd className={styles.footerKbd}>↵</Kbd> Select
              </span>
              <span className={styles.footerHint}>
                <Kbd className={styles.footerKbd}>Esc</Kbd> Close
              </span>
            </div>
          </Cmdk.Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});
Root.displayName = "CommandPalette";

/* ─── Input (re-export for consumers who want to place it manually) ─── */

export interface CommandPaletteInputProps extends ComponentPropsWithoutRef<
  typeof Cmdk.CommandInput
> {
  className?: string;
}

const Input = forwardRef<HTMLInputElement, CommandPaletteInputProps>(function CommandPaletteInput(
  { className, ...rest },
  ref,
) {
  return <Cmdk.CommandInput ref={ref} className={clsx(styles.input, className)} {...rest} />;
});
Input.displayName = "CommandPalette.Input";

/* ─── List ───────────────────────────────────────────────────── */

export interface CommandPaletteListProps {
  children: ReactNode;
  className?: string;
}

const List = forwardRef<HTMLDivElement, CommandPaletteListProps>(function CommandPaletteList(
  { children, className },
  ref,
) {
  return (
    <Cmdk.CommandList ref={ref} className={clsx(styles.list, className)}>
      {children}
    </Cmdk.CommandList>
  );
});
List.displayName = "CommandPalette.List";

/* ─── Group ──────────────────────────────────────────────────── */

export interface CommandPaletteGroupProps {
  /** Group heading label. */
  heading: string;
  children: ReactNode;
  className?: string;
}

const Group = forwardRef<HTMLDivElement, CommandPaletteGroupProps>(function CommandPaletteGroup(
  { heading, children, className },
  ref,
) {
  return (
    <Cmdk.CommandGroup ref={ref} heading={heading} className={clsx(styles.group, className)}>
      {children}
    </Cmdk.CommandGroup>
  );
});
Group.displayName = "CommandPalette.Group";

/* ─── Item ───────────────────────────────────────────────────── */

export interface CommandPaletteItemProps {
  /** Callback fired when the item is selected (Enter or click). */
  onSelect?: (value: string) => void;
  /** Optional leading icon element. */
  icon?: ReactNode;
  /** Optional trailing keyboard shortcut hint (e.g. "⌘→"). */
  shortcut?: string;
  children: ReactNode;
  className?: string;
  /** Value used for cmdk filtering. Defaults to children text content. */
  value?: string;
  /** Disable this item. */
  disabled?: boolean;
}

const Item = forwardRef<HTMLDivElement, CommandPaletteItemProps>(function CommandPaletteItem(
  { onSelect, icon, shortcut, children, className, value, disabled },
  ref,
) {
  const itemProps = {
    ...(onSelect !== undefined && { onSelect }),
    ...(value !== undefined && { value }),
    ...(disabled !== undefined && { disabled }),
  };

  return (
    <Cmdk.CommandItem ref={ref} className={clsx(styles.item, className)} {...itemProps}>
      {icon ? (
        <span className={styles.itemIcon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className={styles.itemLabel}>{children}</span>
      {shortcut ? (
        <Kbd aria-hidden="true" className={styles.itemShortcut}>
          {shortcut}
        </Kbd>
      ) : null}
    </Cmdk.CommandItem>
  );
});
Item.displayName = "CommandPalette.Item";

/* ─── Empty ──────────────────────────────────────────────────── */

export interface CommandPaletteEmptyProps {
  children: ReactNode;
  className?: string;
}

const Empty = forwardRef<HTMLDivElement, CommandPaletteEmptyProps>(function CommandPaletteEmpty(
  { children, className },
  ref,
) {
  return (
    <Cmdk.CommandEmpty ref={ref} className={clsx(styles.empty, className)}>
      {children}
    </Cmdk.CommandEmpty>
  );
});
Empty.displayName = "CommandPalette.Empty";

/* ─── Namespace assembly ─────────────────────────────────────── */

export const CommandPalette = Object.assign(Root, {
  Input,
  List,
  Group,
  Item,
  Empty,
});
