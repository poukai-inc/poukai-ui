import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Kbd.module.css";

export interface KbdProps extends ComponentPropsWithoutRef<"kbd"> {
  /**
   * The key content. Typically a single character (`"K"`), a symbol
   * (`"⌘"`), or a short token (`"Enter"`, `"Esc"`).
   *
   * For symbol keys whose visual glyph does not announce well in screen
   * readers, pass a spelled-out name via `aria-label`:
   *
   * @example
   *   <Kbd aria-label="Command">⌘</Kbd>
   *
   * Required.
   */
  children: ReactNode;
}

/**
 * Keyboard-key glyph — a compact chip that represents a physical key
 * (`⌘`, `K`, `Enter`, `Esc`). Used inline in onboarding copy, command-menu
 * shortcut hints, help text, and menu rows.
 *
 * Root is always `<kbd>` (non-polymorphic). Non-interactive — no hover,
 * focus, or active states. Multi-key combinations are composed by the
 * consumer as side-by-side `<Kbd>` instances.
 *
 * @example
 *   <p>Open the command menu with <Kbd aria-label="Command">⌘</Kbd> <Kbd>K</Kbd>.</p>
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, children, ...rest },
  ref,
) {
  return (
    <kbd ref={ref} className={clsx(styles.root, className)} {...rest}>
      {children}
    </kbd>
  );
});

Kbd.displayName = "Kbd";
