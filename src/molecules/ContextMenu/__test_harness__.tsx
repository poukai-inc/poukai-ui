/**
 * Test harnesses for ContextMenu CT tests.
 *
 * Radix ContextMenu.Content is portal-rendered — Playwright must locate
 * it via page.locator(), not component.locator().
 *
 * Radix ContextMenu.Root has no `defaultOpen` prop; the menu is opened by
 * dispatching a native `contextmenu` event on the trigger. The harnesses
 * fire that event in a useEffect right after mount so tests can assert
 * structure without simulating a right-click per case.
 */
import { useEffect, useRef } from "react";
import { ContextMenu } from "./ContextMenu";

interface HarnessProps {
  disabled?: boolean;
  separator?: boolean;
  tone?: "default" | "danger";
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect?: (event: Event) => void;
  className?: string;
  dataTestId?: string;
}

function useAutoOpenContextMenu(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const evt = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
    });
    el.dispatchEvent(evt);
  }, [ref]);
}

export const DefaultHarness = ({
  disabled = false,
  separator = false,
  tone = "default",
  icon,
  shortcut,
  onSelect,
}: HarnessProps) => {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  useAutoOpenContextMenu(triggerRef);
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div
          ref={triggerRef}
          data-testid="trigger-zone"
          style={{ padding: "40px", border: "1px solid #ccc" }}
        >
          Right-click zone
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item
          tone={tone}
          disabled={disabled}
          {...(icon !== undefined && { icon })}
          {...(shortcut !== undefined && { shortcut })}
          {...(onSelect !== undefined && { onSelect })}
          data-testid="item-one"
        >
          Copy
        </ContextMenu.Item>
        {separator && <ContextMenu.Separator data-testid="separator" />}
        <ContextMenu.Item data-testid="item-two">Paste</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};

export const RefHarness = ({
  className,
  dataTestId,
}: {
  className?: string;
  dataTestId?: string;
}) => {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  useAutoOpenContextMenu(triggerRef);
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div ref={triggerRef} style={{ padding: "40px" }}>
          zone
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content className={className} data-testid={dataTestId}>
        <ContextMenu.Item>Copy</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
