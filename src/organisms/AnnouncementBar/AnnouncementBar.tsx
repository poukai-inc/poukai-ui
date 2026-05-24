import {
  forwardRef,
  useEffect,
  useState,
  useCallback,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import clsx from "clsx";
import { IconButton } from "../../atoms/IconButton";
import styles from "./AnnouncementBar.module.css";

export type AnnouncementBarTone = "warm" | "neutral" | "success" | "danger" | "warning";

export interface AnnouncementBarProps extends Omit<ComponentPropsWithoutRef<"div">, "id"> {
  /**
   * localStorage key for dismissal persistence. Required so each bar is
   * independently dismissable.
   */
  id: string;
  /** Visual + semantic tone. Defaults to "warm". */
  tone?: AnnouncementBarTone;
  /**
   * When false, no dismiss button is rendered and no localStorage entry is
   * written. Useful for mandatory maintenance notices.
   */
  dismissable?: boolean;
  /** Optional slot for a link or ghost button. Positioned inline after the message. */
  action?: ReactNode;
  /** The announcement copy. Short: one sentence target. */
  children: ReactNode;
  /** Optional callback fired after dismissal. */
  onDismiss?: () => void;
}

const LS_PREFIX = "poukai-announcement-dismissed:";

const toneClass: Record<AnnouncementBarTone, string> = {
  warm: styles.toneWarm!,
  neutral: styles.toneNeutral!,
  success: styles.toneSuccess!,
  danger: styles.toneDanger!,
  warning: styles.toneWarning!,
};

/**
 * AnnouncementBar — page-top full-width dismissable banner.
 *
 * Renders above the Header organism for product announcements, maintenance
 * notices, and time-sensitive promotions. Dismissal state is persisted via
 * localStorage keyed by `id`. SSR-safe: renders visible by default; hides
 * post-hydration only if already dismissed.
 *
 * @example
 *   <AnnouncementBar id="launch-2026-q2" tone="warm" action={<a href="/blog">Read more</a>}>
 *     We're launching Phase 2 — new components, new primitives.
 *   </AnnouncementBar>
 */
export const AnnouncementBar = forwardRef<HTMLDivElement, AnnouncementBarProps>(
  function AnnouncementBar(
    { id, tone = "warm", dismissable = true, action, children, onDismiss, className, ...rest },
    ref,
  ) {
    // SSR-safe: start visible, then read localStorage post-hydration.
    const [dismissed, setDismissed] = useState(false);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
      if (!dismissable) return;
      try {
        const stored = localStorage.getItem(`${LS_PREFIX}${id}`);
        if (stored === "1") setDismissed(true);
      } catch {
        // localStorage unavailable (private browsing, SSR, etc.)
      }
    }, [id, dismissable]);

    const handleDismiss = useCallback(() => {
      setExiting(true);
      try {
        localStorage.setItem(`${LS_PREFIX}${id}`, "1");
      } catch {
        // Graceful degradation
      }
    }, [id]);

    const handleTransitionEnd = useCallback(() => {
      if (exiting) {
        setDismissed(true);
        onDismiss?.();
      }
    }, [exiting, onDismiss]);

    if (dismissed) return null;

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Announcement"
        className={clsx(styles.root, toneClass[tone], exiting && styles.exiting, className)}
        data-tone={tone}
        onTransitionEnd={handleTransitionEnd}
        {...rest}
      >
        <div className={styles.inner}>
          <div className={styles.content}>
            <span className={styles.message}>{children}</span>
            {action !== undefined && <span className={styles.action}>{action}</span>}
          </div>
          {dismissable && (
            <IconButton
              icon={X}
              aria-label="Dismiss announcement"
              variant="ghost"
              size="sm"
              className={styles.dismiss}
              onClick={handleDismiss}
            />
          )}
        </div>
      </div>
    );
  },
);

AnnouncementBar.displayName = "AnnouncementBar";
