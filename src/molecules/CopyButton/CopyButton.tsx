import { forwardRef, useState, useRef, useEffect, type ComponentPropsWithoutRef } from "react";
import { Copy, Check } from "lucide-react";
import clsx from "clsx";
import { Icon } from "../../atoms/Icon";
import styles from "./CopyButton.module.css";

export type CopyButtonSize = "sm" | "md";

export interface CopyButtonProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "type" | "onCopy"
> {
  /** The string written to the clipboard when the button is activated. */
  value: string;
  /**
   * Visible label beside the icon. Pass `false` to render icon-only.
   *
   * @remarks When `label={false}` you **must** supply `aria-label` on the root
   * for screen-reader access. The DS cannot enforce this via types but omitting
   * it produces an inaccessible button.
   */
  label?: string | false;
  /** Label shown during the success state. */
  successLabel?: string;
  /** Milliseconds before reverting from success back to idle. */
  timeout?: number;
  /**
   * `sm` uses `--fs-meta` + `--icon-xs` (default — CopyButton is a secondary affordance).
   * `md` uses `--fs-body` + `--icon-sm`.
   */
  size?: CopyButtonSize;
  /** Fired after a successful clipboard write. Useful for analytics or toast coordination. */
  onCopy?: (value: string) => void;
  /** Called when `navigator.clipboard.writeText` rejects. Consumer decides how to surface errors. */
  onError?: (err: unknown) => void;
}

const sizeClass: Record<CopyButtonSize, string> = {
  sm: styles.sizeSm!,
  md: styles.sizeMd!,
};

/**
 * Copy-to-clipboard button with a transient success state.
 *
 * Composes into `CodeBlock` as the built-in copy control and stands alone
 * wherever a clipboard micro-interaction is needed.
 *
 * State machine: idle → success → (after `timeout` ms) → idle.
 *
 * @example
 *   <CopyButton value="npm install @poukai-inc/ui" />
 *   <CopyButton value={apiKey} label={false} aria-label="Copy API key" />
 */
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  {
    value,
    label = "Copy",
    successLabel = "Copied",
    timeout = 1500,
    size = "sm",
    onCopy,
    onError,
    className,
    disabled,
    onClick,
    ...rest
  },
  ref,
) {
  const [success, setSuccess] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear pending revert timer on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(e);

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        // Fallback: document.execCommand via a temporary textarea.
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (!ok) {
          throw new Error("execCommand copy failed");
        }
      }

      // Cancel any existing revert timer before restarting.
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }

      setSuccess(true);
      onCopy?.(value);

      timerRef.current = setTimeout(() => {
        setSuccess(false);
        timerRef.current = null;
      }, timeout);
    } catch (err) {
      onError?.(err);
    }
  }

  const iconSize = size === "sm" ? "xs" : "sm";

  return (
    <button
      ref={ref}
      type="button"
      className={clsx(styles.root, sizeClass[size], success && styles.success, className)}
      disabled={disabled}
      onClick={handleClick}
      {...rest}
    >
      <span className={styles.iconWrap} aria-hidden="true">
        {success ? (
          <Icon
            icon={Check}
            size={iconSize}
            {...(styles.iconCheck ? { className: styles.iconCheck } : {})}
          />
        ) : (
          <Icon
            icon={Copy}
            size={iconSize}
            {...(styles.iconCopy ? { className: styles.iconCopy } : {})}
          />
        )}
      </span>
      {label !== false && (
        <span className={styles.label} aria-live="polite">
          {success ? successLabel : label}
        </span>
      )}
    </button>
  );
});

CopyButton.displayName = "CopyButton";
