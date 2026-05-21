/**
 * DialogBasic — convenience wrapper for the 90% case.
 *
 * Composes Dialog compound subcomponents into a single-panel dialog with:
 *   - A title (required, rendered as Dialog.Title)
 *   - An optional description (rendered as Dialog.Description in muted register)
 *   - Body content (children slot)
 *   - An optional footer action row (right-aligned, typically Cancel + Confirm)
 *   - A built-in X close button in the top-right of the title band
 *
 * Consumers who need full composition control use the Dialog compound API directly.
 *
 * @see meta/design/Dialog.md §9 DialogBasic
 */

import { forwardRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { Dialog } from "./Dialog";
import styles from "./Dialog.module.css";

export interface DialogBasicProps {
  /**
   * Controlled open state. Pair with onOpenChange.
   * Omit for uncontrolled behavior via Dialog.Trigger.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /**
   * Dialog title. Required. Rendered as Dialog.Title.
   * Radix warns (and screen readers fail) if this is absent.
   */
  title: string;

  /**
   * Optional description. Rendered as Dialog.Description in the muted register.
   * When provided, a hairline rule separates the title band from body content.
   */
  description?: string;

  /**
   * Body content. Slotted directly below the title band.
   * Accepts any ReactNode — form fields, paragraphs, lists.
   */
  children: ReactNode;

  /**
   * Optional footer action row. Rendered below body, right-aligned.
   * Typically one or two <Button> elements (Cancel + Confirm pattern).
   * When omitted, no footer row is rendered.
   */
  footer?: ReactNode;

  /**
   * Accessible label for the built-in close button (X icon). Default "Close".
   * Override for locale or context requirements.
   */
  closeLabel?: string;

  /**
   * className forwarded to Dialog.Content for layout overrides.
   * Standard escape hatch. Use sparingly.
   *
   * Note: variant="danger" for destructive confirmation actions is anticipated
   * in a future Button PR. Until then, use variant="primary" for confirm
   * buttons in destructive dialogs.
   */
  className?: string;
}

export const DialogBasic = forwardRef<HTMLDivElement, DialogBasicProps>(function DialogBasic(
  { open, onOpenChange, title, description, children, footer, closeLabel = "Close", className },
  ref,
) {
  const hasDescription = Boolean(description);

  // Build Root props without undefined values to satisfy exactOptionalPropertyTypes
  const rootProps = {
    ...(open !== undefined && { open }),
    ...(onOpenChange !== undefined && { onOpenChange }),
  };

  return (
    <Dialog.Root {...rootProps}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          ref={ref}
          className={className}
          data-has-description={hasDescription ? "true" : undefined}
        >
          {/* Title band: title + X close button */}
          <div className={styles.header}>
            <div className={styles.headerText}>
              <Dialog.Title>{title}</Dialog.Title>
              {hasDescription && <Dialog.Description>{description}</Dialog.Description>}
            </div>
            <Dialog.Close asChild>
              <button className={styles.closeButton} aria-label={closeLabel} type="button">
                <X size={16} aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {/* Hairline rule: visible only when description is present */}
          {hasDescription && <hr className={styles.divider} />}

          {/* Body slot */}
          <div className={styles.body}>{children}</div>

          {/* Footer action row */}
          {footer ? <div className={styles.footer}>{footer}</div> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

DialogBasic.displayName = "DialogBasic";
