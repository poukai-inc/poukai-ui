/**
 * Toast — imperative notification organism.
 *
 * Architecture:
 *   ToastProvider  — context provider; manages queue; renders portal viewport.
 *   useToast()     — imperative hook: { show, dismiss }.
 *   ToastPayload   — payload type for show().
 *
 * Built on @radix-ui/react-toast for ARIA, focus, swipe-to-dismiss,
 * and prefers-reduced-motion support. Rendered toast UI is composed
 * via the ToastItem molecule — single source of truth for tone tokens,
 * close button, and a11y wiring.
 *
 * @see meta/design/Toast.md
 */

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
// Runtime destructuring instead of static named imports to avoid a
// Playwright CT bundler issue where `ToastProvider` would collide with
// Radix's internal identifier of the same name when the test wrapper
// hoists imports. Keeps Radix primitives out of the static module scope.
import * as RadixToastModule from "@radix-ui/react-toast";
const { Provider: RadixToastProvider, Viewport: RadixToastViewport } = RadixToastModule;
import clsx from "clsx";
import { ToastItem } from "../../molecules/ToastItem";
import styles from "./Toast.module.css";

/* ─── Types ──────────────────────────────────────────────────── */

export type ToastTone = "info" | "success" | "warning" | "danger";

export interface ToastPayload {
  /** Visual + semantic tone. Defaults to "info". */
  tone?: ToastTone;
  /** Optional title rendered in weight 500 above the body. */
  title?: string;
  /** Required body copy. */
  body: string;
  /** Auto-dismiss duration in ms. Overrides ToastProvider defaultDuration. */
  duration?: number;
  /** Optional inline action button. */
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastEntry {
  id: string;
  payload: ToastPayload;
}

interface ToastContextValue {
  /**
   * Show a toast. Returns the generated id.
   * Enforces the provider's `max` cap — oldest toast is dropped if exceeded.
   */
  show: (payload: ToastPayload) => string;
  /** Imperatively dismiss a toast by id. */
  dismiss: (id: string) => void;
}

/* ─── Context ────────────────────────────────────────────────── */

const ToastContext = createContext<ToastContextValue | null>(null);

/* ─── useToast ───────────────────────────────────────────────── */

/**
 * Returns `{ show, dismiss }` to imperatively trigger and remove toasts.
 * Must be called inside a `<ToastProvider>`.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}

/* ─── ToastProvider ──────────────────────────────────────────── */

export interface ToastProviderProps {
  children: ReactNode;
  /** Default auto-dismiss duration in ms. Default: 5000. */
  defaultDuration?: number;
  /** Maximum number of simultaneous toasts. Oldest is dropped if exceeded. Default: 4. */
  max?: number;
  /** Viewport position. Default: "bottom-right". */
  position?: "top-right" | "bottom-right" | "top-center" | "bottom-center";
  /** Accessible label for the close button on each toast. Default: "Close". */
  closeLabel?: string;
}

/**
 * ToastProvider — wrap the app root with this once.
 * Renders the Radix toast viewport as a portal to document.body.
 *
 * NOTE: declared as `PoukaiToastProvider` and re-exported as `ToastProvider`
 * to avoid a name collision in the Vite-bundled test scope —
 * `@radix-ui/react-toast` internally declares its own `ToastProvider`
 * identifier (the namespace import does not always sandbox it under
 * Radix's namespace once esbuild flattens the bundle).
 */
function PoukaiToastProvider({
  children,
  defaultDuration = 5000,
  max = 4,
  position = "bottom-right",
  closeLabel = "Close",
}: ToastProviderProps): JSX.Element {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const show = useCallback(
    (payload: ToastPayload): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => {
        const next = [...prev, { id, payload }];
        // Enforce max: drop oldest entries beyond the cap
        return next.length > max ? next.slice(next.length - max) : next;
      });
      return id;
    },
    [max],
  );

  const dismiss = useCallback((id: string): void => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      <RadixToastProvider>
        {children}
        <RadixToastViewport
          className={clsx(styles.viewport, styles[`position-${position}`])}
          data-position={position}
        />
        {toasts.map(({ id, payload }) => {
          const tone: ToastTone = payload.tone ?? "info";
          const duration = payload.duration ?? defaultDuration;

          return (
            <ToastItem
              key={id}
              tone={tone}
              duration={duration}
              data-tone={tone}
              onOpenChange={(open) => {
                if (!open) dismiss(id);
              }}
            >
              <div className={styles.textBlock}>
                {payload.title !== undefined && <ToastItem.Title>{payload.title}</ToastItem.Title>}
                <ToastItem.Description>{payload.body}</ToastItem.Description>
              </div>

              <div className={styles.controls}>
                {payload.action !== undefined && (
                  <ToastItem.Action altText={payload.action.label} onClick={payload.action.onClick}>
                    {payload.action.label}
                  </ToastItem.Action>
                )}

                <ToastItem.Close aria-label={closeLabel} />
              </div>
            </ToastItem>
          );
        })}
      </RadixToastProvider>
    </ToastContext.Provider>
  );
}

PoukaiToastProvider.displayName = "ToastProvider";

export { PoukaiToastProvider as ToastProvider };
