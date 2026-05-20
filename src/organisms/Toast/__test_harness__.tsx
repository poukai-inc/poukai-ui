import { useEffect, useRef, type ReactNode } from "react";
import { ToastProvider, useToast } from "./Toast";
import { Button } from "../../atoms/Button";

/**
 * Test harnesses for Toast.test.tsx.
 *
 * Lives in its own module because Playwright CT requires every component
 * mounted (including the children of `<Harness>`) to be defined outside
 * the test file. Inline test-file components produce
 * "Component X cannot be mounted" errors at runtime.
 */

export function Harness({
  defaultDuration,
  max,
  position,
  closeLabel,
  children,
}: {
  defaultDuration?: number;
  max?: number;
  position?: "top-right" | "bottom-right" | "top-center" | "bottom-center";
  closeLabel?: string;
  children: ReactNode;
}) {
  return (
    <ToastProvider
      defaultDuration={defaultDuration ?? 60000}
      max={max ?? 4}
      position={position ?? "bottom-right"}
      {...(closeLabel !== undefined ? { closeLabel } : {})}
    >
      {children}
    </ToastProvider>
  );
}

/** Renders a button that calls show() with the configured payload. */
export function ShowTrigger({
  tone,
  title,
  body,
  duration,
  action,
  onShow,
}: {
  tone?: "info" | "success" | "warning" | "danger";
  title?: string;
  body?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
  onShow?: (id: string) => void;
}) {
  const { show } = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() => {
        const id = show({
          body: body ?? "Test toast body",
          ...(tone !== undefined ? { tone } : {}),
          ...(title !== undefined ? { title } : {}),
          ...(duration !== undefined ? { duration } : {}),
          ...(action !== undefined ? { action } : {}),
        });
        onShow?.(id);
      }}
    >
      Show toast
    </Button>
  );
}

/** Renders a button that dismisses a pre-captured id (reads id at click time). */
export function DismissController({ getCapturedId }: { getCapturedId: () => string }) {
  const { dismiss } = useToast();
  return (
    <Button variant="ghost" onClick={() => dismiss(getCapturedId())}>
      Dismiss captured
    </Button>
  );
}

/**
 * A11y gate harness — calls show() once on mount so the toast is visible
 * during the axe scan without user interaction. Lives here (not inline in
 * a11y.test.tsx) because Playwright CT forbids inline mounted components.
 */
export function ToastA11yHarness({ tone }: { tone: "info" | "success" | "warning" | "danger" }) {
  const { show } = useToast();
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    show({
      tone,
      ...(tone === "danger" ? { title: "Error" } : {}),
      ...(tone === "warning" ? { title: "Warning" } : {}),
      body: `A11y gate: ${tone} toast.`,
      duration: 60000,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/** Three buttons that each enqueue a distinct toast (for max-cap tests). */
export function MultiShow() {
  const { show } = useToast();
  return (
    <div>
      <Button
        variant="secondary"
        data-testid="show-a"
        onClick={() => show({ body: "Toast A", duration: 60000 })}
      >
        A
      </Button>
      <Button
        variant="secondary"
        data-testid="show-b"
        onClick={() => show({ body: "Toast B", duration: 60000 })}
      >
        B
      </Button>
      <Button
        variant="secondary"
        data-testid="show-c"
        onClick={() => show({ body: "Toast C", duration: 60000 })}
      >
        C
      </Button>
    </div>
  );
}
