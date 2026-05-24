import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import { Kbd } from "../../atoms/Kbd";
import styles from "./MenuItem.module.css";

export type MenuItemTone = "default" | "danger";

export interface MenuItemProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * The visible label. Plain string expected; ReactNode for occasional
   * <strong> emphasis. Required.
   */
  children: ReactNode;
  /**
   * Optional leading icon slot. Consumer supplies a lucide-react icon at
   * size={16} with aria-hidden="true". The icon is always decorative; the
   * label text carries the accessible name.
   */
  icon?: ReactNode;
  /**
   * Optional keyboard shortcut hint rendered as <Kbd>. Display-only — not a
   * functional key binding. Rendered with aria-hidden="true" so screen
   * readers read only the label.
   */
  shortcut?: string;
  /**
   * Visual register.
   * - `"default"` (default): --fg label color.
   * - `"danger"`: --danger label color for destructive actions.
   */
  tone?: MenuItemTone;
  /**
   * When true: opacity 0.4, pointer-events none. Radix propagates
   * aria-disabled on the host element; MenuItem does not duplicate it.
   */
  disabled?: boolean;
}

/**
 * MenuItem — individual row primitive composed inside DropdownMenu and
 * ContextMenu wrappers.
 *
 * Renders a flex row with an optional leading icon slot, a label, and an
 * optional trailing Kbd shortcut hint. Owns the visual shape of a menu row
 * only — keyboard navigation, focus management, ARIA roles, and portal
 * behaviour are entirely delegated to the parent Radix menu wrapper.
 *
 * Do NOT use outside a Radix menu wrapper (DropdownMenu / ContextMenu).
 * Do NOT nest interactive elements (<Button>, <a>) inside MenuItem.
 *
 * @example
 *   <MenuItem icon={<Copy size={16} aria-hidden="true" />} shortcut="⌘C">
 *     Copy
 *   </MenuItem>
 */
export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(function MenuItem(
  { children, icon, shortcut, tone = "default", disabled = false, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx(
        styles.root,
        tone === "danger" && styles.danger,
        disabled && styles.disabled,
        className,
      )}
      {...rest}
    >
      {icon !== undefined && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
      {shortcut !== undefined && (
        <Kbd className={styles.shortcut} aria-hidden="true">
          {shortcut}
        </Kbd>
      )}
    </div>
  );
});

MenuItem.displayName = "MenuItem";
