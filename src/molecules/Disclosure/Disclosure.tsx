import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { Icon } from "../../atoms/Icon";
import styles from "./Disclosure.module.css";

export type DisclosureTone = "default" | "muted";

export interface DisclosureProps extends Omit<
  ComponentPropsWithoutRef<"details">,
  "open" | "onToggle"
> {
  /** Trigger label text. Required. */
  summary: string;
  /** Controlled open state. When omitted the component is uncontrolled. */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Controlled state callback. Receives the next open value. */
  onOpenChange?: (open: boolean) => void;
  /** Adds a top border — for use in list/divider contexts. */
  divider?: boolean;
  /**
   * `muted` applies `--fg-muted` to the summary label; used when Disclosure
   * must recede visually relative to surrounding content.
   */
  tone?: DisclosureTone;
  /** The revealed content region. Required. */
  children: ReactNode;
}

/**
 * Disclosure — single open/close toggle row.
 *
 * Wraps native `<details>` / `<summary>` for built-in keyboard and AT support
 * without any JavaScript state for the uncontrolled case. Pass `open` +
 * `onOpenChange` for controlled usage.
 *
 * @example
 *   <Disclosure summary="Show details">
 *     <p>Supplementary content revealed inline.</p>
 *   </Disclosure>
 */
export const Disclosure = forwardRef<HTMLDetailsElement, DisclosureProps>(function Disclosure(
  {
    summary,
    open,
    defaultOpen = false,
    onOpenChange,
    divider = false,
    tone = "default",
    className,
    children,
    ...rest
  },
  ref,
) {
  const isControlled = open !== undefined;

  function handleToggle(event: React.SyntheticEvent<HTMLDetailsElement>) {
    if (onOpenChange) {
      onOpenChange((event.currentTarget as HTMLDetailsElement).open);
    }
  }

  // For uncontrolled usage: pass the HTML `open` attribute when defaultOpen is
  // true. For controlled usage: pass the `open` prop directly. Native <details>
  // interprets the presence of the `open` attribute as the open state.
  const openProps = isControlled ? { open } : defaultOpen ? { open: true } : {};

  return (
    <details
      ref={ref}
      className={clsx(styles.root, divider && styles.divider, className)}
      {...openProps}
      onToggle={handleToggle}
      {...rest}
    >
      <summary className={clsx(styles.summary, tone === "muted" && styles.summaryMuted)}>
        <span className={styles.label}>{summary}</span>
        <Icon icon={ChevronDown} size="sm" className={clsx(styles.chevron)} decorative />
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
});

Disclosure.displayName = "Disclosure";
