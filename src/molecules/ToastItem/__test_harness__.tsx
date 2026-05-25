/**
 * Test harnesses for ToastItem.test.tsx.
 *
 * Playwright CT requires every mounted component to be defined outside
 * the test file. Inline test-file component definitions produce
 * "Component X cannot be mounted" errors at runtime.
 *
 * CT rule: NEVER destructure harness imports — one-per-line named imports only.
 * CT rule: `component` IS the root — do NOT wrap in extra elements inside mount().
 */

import * as RadixToastModule from "@radix-ui/react-toast";
const ToastProvider = RadixToastModule.Provider;
const ToastViewport = RadixToastModule.Viewport;
import { ToastItem } from "./ToastItem";

/**
 * Minimal scaffold — Provider + Viewport + one open ToastItem.
 * The `component` returned by mount() IS the ToastItem root (li).
 */
export function BasicToastItem({ tone }: { tone?: "info" | "success" | "warning" | "danger" }) {
  return (
    <ToastProvider>
      <ToastItem
        {...(tone !== undefined ? { tone } : {})}
        open
        duration={60000}
        data-testid="toast-root"
      >
        <ToastItem.Description>Body text.</ToastItem.Description>
        <ToastItem.Close />
      </ToastItem>
      <ToastViewport />
    </ToastProvider>
  );
}

/** ToastItem with a Title above the Description. */
export function ToastItemWithTitle() {
  return (
    <ToastProvider>
      <ToastItem open duration={60000} data-testid="toast-root">
        <ToastItem.Title data-testid="toast-title">Saved</ToastItem.Title>
        <ToastItem.Description data-testid="toast-description">
          Your changes have been saved.
        </ToastItem.Description>
        <ToastItem.Close />
      </ToastItem>
      <ToastViewport />
    </ToastProvider>
  );
}

/** ToastItem with a Close button — close button is testid-addressable. */
export function ToastItemWithClose() {
  return (
    <ToastProvider>
      <ToastItem open duration={60000} data-testid="toast-root">
        <ToastItem.Description>Close me.</ToastItem.Description>
        <ToastItem.Close data-testid="toast-close" />
      </ToastItem>
      <ToastViewport />
    </ToastProvider>
  );
}

/** ToastItem with an Action button. */
export function ToastItemWithAction() {
  return (
    <ToastProvider>
      <ToastItem open duration={60000} data-testid="toast-root">
        <ToastItem.Description>Something failed.</ToastItem.Description>
        <ToastItem.Action altText="Retry the operation" data-testid="toast-action">
          Retry
        </ToastItem.Action>
        <ToastItem.Close />
      </ToastItem>
      <ToastViewport />
    </ToastProvider>
  );
}

/** ToastItem with custom className on root. */
export function ToastItemWithClassName() {
  return (
    <ToastProvider>
      <ToastItem open duration={60000} className="custom-toast" data-testid="toast-root">
        <ToastItem.Description>Body.</ToastItem.Description>
        <ToastItem.Close />
      </ToastItem>
      <ToastViewport />
    </ToastProvider>
  );
}

/** A11y harness — open success toast with title + description + close. */
export function ToastItemA11yHarness() {
  return (
    <div style={{ padding: "var(--space-8)" }}>
      <ToastProvider>
        <ToastItem tone="success" open duration={60000}>
          <ToastItem.Title>Success</ToastItem.Title>
          <ToastItem.Description>Your changes have been saved.</ToastItem.Description>
          <ToastItem.Close />
        </ToastItem>
        <ToastViewport />
      </ToastProvider>
    </div>
  );
}
