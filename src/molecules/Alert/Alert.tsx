import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import {
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import { Icon } from "../../atoms/Icon";
import styles from "./Alert.module.css";

export type AlertVariant = "info" | "success" | "warn" | "error" | "note";

export interface AlertProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Semantic register of the alert.
   * Maps to a distinct surface color, icon, and ARIA live-region role.
   * - `info`    → polite live region (role="status"), accent-blue icon
   * - `success` → polite live region (role="status"), green icon
   * - `warn`    → polite live region (role="status"), amber icon
   * - `error`   → assertive live region (role="alert"), red icon
   * - `note`    → static landmark (role="note"), muted icon
   * @default "info"
   */
  variant?: AlertVariant;
  /**
   * Optional scannable label rendered above body copy.
   * Rendered as <strong> — not a heading; Alert is not a section landmark.
   */
  title?: string;
  /**
   * Body copy. Required. Typically a string or short inline prose.
   * ReactNode is accepted to support inline <strong>, <em>, <a>.
   */
  children: ReactNode;
  /**
   * Override the default leading icon. Pass null to suppress the icon entirely.
   * When omitted, a default lucide-react icon is chosen per variant.
   */
  icon?: ReactNode | null;
}

const VARIANT_ICON: Record<AlertVariant, LucideIcon> = {
  info: Info,
  success: CheckCircle,
  warn: AlertTriangle,
  error: XCircle,
  note: StickyNote,
};

const VARIANT_ROLE: Record<AlertVariant, string> = {
  info: "status",
  success: "status",
  warn: "status",
  error: "alert",
  note: "note",
};

/**
 * Alert — inline semantic banner with five variants.
 *
 * Carries an explicit ARIA live-region role per variant so assistive
 * technology announces content without requiring focus. Use only in
 * block context (not inside a <p>).
 *
 * @example
 *   <Alert variant="error" title="Submission failed">
 *     Please fix the highlighted fields and try again.
 *   </Alert>
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = "info", title, children, icon, className, ...rest },
  ref,
) {
  const role = VARIANT_ROLE[variant];

  // icon prop:
  //   undefined  → render default variant icon
  //   null       → suppress icon entirely
  //   ReactNode  → render consumer-supplied icon
  const iconSlot =
    icon === null ? null : icon !== undefined ? (
      <span className={styles.iconSlot} aria-hidden="true">
        {icon}
      </span>
    ) : (
      <span className={styles.iconSlot}>
        <Icon icon={VARIANT_ICON[variant]} size="sm" decorative />
      </span>
    );

  return (
    <div ref={ref} role={role} className={clsx(styles.root, styles[variant], className)} {...rest}>
      {iconSlot}
      <div className={styles.content}>
        {title !== undefined && <strong className={styles.title}>{title}</strong>}
        <p className={styles.body}>{children}</p>
      </div>
    </div>
  );
});

Alert.displayName = "Alert";
