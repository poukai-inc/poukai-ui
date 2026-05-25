/**
 * ToastItem — declarative compound Toast molecule.
 *
 * Compound API: ToastItem / ToastItem.Title / ToastItem.Description /
 *               ToastItem.Close / ToastItem.Action
 *
 * Wraps @radix-ui/react-toast primitives with DS tokens and tone variants.
 * Must be rendered inside a Radix <Toast.Provider> + <Toast.Viewport>.
 *
 * For the imperative API (queue management + auto-dismiss), use the
 * Toast organism: `import { ToastProvider, useToast } from "@poukai-inc/ui"`.
 *
 * @see meta/design/ToastItem.md
 */

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
// Runtime destructuring to avoid Playwright CT bundler identifier collisions
// (same pattern as the Toast organism and Popover molecule).
import * as RadixToastModule from "@radix-ui/react-toast";
const {
  Root: RadixToastRoot,
  Title: RadixToastTitle,
  Description: RadixToastDescription,
  Close: RadixToastClose,
  Action: RadixToastAction,
} = RadixToastModule;
import { X } from "lucide-react";
import clsx from "clsx";
import styles from "./ToastItem.module.css";

/* ─── Types ──────────────────────────────────────────────────── */

export type ToastItemTone = "info" | "success" | "warning" | "danger";

/* ─── Tone → Radix type mapping ─────────────────────────────── */

const TONE_RADIX_TYPE: Record<ToastItemTone, "background" | "foreground"> = {
  info: "background",
  success: "background",
  warning: "foreground",
  danger: "foreground",
};

// CSS modules `localsConvention: "camelCaseOnly"` strips dashed keys, so
// `styles["tone-info"]` is undefined. Map tone → camelCase class explicitly.
const TONE_CLASS: Record<ToastItemTone, string | undefined> = {
  info: styles.toneInfo,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
};

/* ─── Root ────────────────────────────────────────────────────── */

export interface ToastItemProps extends Omit<
  ComponentPropsWithoutRef<"li">,
  "onChange" | "onPause" | "onResume"
> {
  /** Visual + semantic tone. Default: "info". */
  tone?: ToastItemTone;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Callback when open state changes (used for dismissal). */
  onOpenChange?: (open: boolean) => void;
  /** Auto-dismiss duration in ms. Default: 5000. */
  duration?: number;
  className?: string;
  children: ReactNode;
}

const Root = forwardRef<HTMLLIElement, ToastItemProps>(function ToastItemRoot(
  { tone = "info", open, defaultOpen, onOpenChange, duration = 5000, className, children, ...rest },
  ref,
) {
  return (
    <RadixToastRoot
      ref={ref}
      type={TONE_RADIX_TYPE[tone]}
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
      duration={duration}
      className={clsx(styles.root, TONE_CLASS[tone], className)}
      {...rest}
    >
      <div className={styles.inner}>{children}</div>
    </RadixToastRoot>
  );
});
Root.displayName = "ToastItem";

/* ─── Title ───────────────────────────────────────────────────── */

export interface ToastItemTitleProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

const Title = forwardRef<HTMLDivElement, ToastItemTitleProps>(function ToastItemTitle(
  { className, children, ...rest },
  ref,
) {
  return (
    <RadixToastTitle ref={ref} className={clsx(styles.title, className)} {...rest}>
      {children}
    </RadixToastTitle>
  );
});
Title.displayName = "ToastItem.Title";

/* ─── Description ─────────────────────────────────────────────── */

export interface ToastItemDescriptionProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

const Description = forwardRef<HTMLDivElement, ToastItemDescriptionProps>(
  function ToastItemDescription({ className, children, ...rest }, ref) {
    return (
      <RadixToastDescription ref={ref} className={clsx(styles.description, className)} {...rest}>
        {children}
      </RadixToastDescription>
    );
  },
);
Description.displayName = "ToastItem.Description";

/* ─── Close ───────────────────────────────────────────────────── */

export interface ToastItemCloseProps extends ComponentPropsWithoutRef<"button"> {
  /** Accessible label for the close button. Default: "Close". */
  "aria-label"?: string;
}

const Close = forwardRef<HTMLButtonElement, ToastItemCloseProps>(function ToastItemClose(
  { className, "aria-label": ariaLabel = "Close", ...rest },
  ref,
) {
  return (
    <RadixToastClose
      ref={ref}
      aria-label={ariaLabel}
      className={clsx(styles.close, className)}
      {...rest}
    >
      <X size={14} aria-hidden="true" />
    </RadixToastClose>
  );
});
Close.displayName = "ToastItem.Close";

/* ─── Action ──────────────────────────────────────────────────── */

export interface ToastItemActionProps extends ComponentPropsWithoutRef<"button"> {
  /**
   * Required by Radix: accessible alternative text for screen readers
   * when the action button is not available in the visual viewport.
   */
  altText: string;
  children: ReactNode;
}

const Action = forwardRef<HTMLButtonElement, ToastItemActionProps>(function ToastItemAction(
  { altText, className, children, ...rest },
  ref,
) {
  return (
    <RadixToastAction
      ref={ref}
      altText={altText}
      className={clsx(styles.action, className)}
      {...rest}
    >
      {children}
    </RadixToastAction>
  );
});
Action.displayName = "ToastItem.Action";

/* ─── Compound export ─────────────────────────────────────────── */

export const ToastItem = Object.assign(Root, {
  Title,
  Description,
  Close,
  Action,
});
