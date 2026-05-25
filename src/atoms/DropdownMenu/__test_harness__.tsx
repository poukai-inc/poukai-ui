/**
 * Test harnesses for DropdownMenu.test.tsx.
 *
 * Lives in its own module because Playwright CT requires every component
 * mounted (including children) to be defined outside the test file.
 * Inline test-file components produce "Component X cannot be mounted" errors.
 */

import { Edit, Trash2, Copy } from "lucide-react";
import { DropdownMenu, DropdownMenuBasic } from "./DropdownMenu";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { MoreHorizontal } from "lucide-react";

/** Default compound usage — trigger + items. */
export function DefaultHarness() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" data-testid="trigger">
          Actions
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item data-testid="item-edit" onSelect={() => {}}>
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item data-testid="item-duplicate" onSelect={() => {}}>
          Duplicate
        </DropdownMenu.Item>
        <DropdownMenu.Separator data-testid="separator" />
        <DropdownMenu.Item data-testid="item-delete" tone="danger" onSelect={() => {}}>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/** Pre-opened menu for content visibility checks. */
export function DefaultOpenHarness() {
  return (
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" data-testid="trigger">
          Actions
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item data-testid="item-edit" onSelect={() => {}}>
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Separator data-testid="separator" />
        <DropdownMenu.Item data-testid="item-delete" tone="danger" onSelect={() => {}}>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/** Menu with icons for icon slot tests. */
export function WithIconsHarness() {
  return (
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" data-testid="trigger">
          Options
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={<Edit size={16} aria-hidden="true" />} onSelect={() => {}}>
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item icon={<Copy size={16} aria-hidden="true" />} onSelect={() => {}}>
          Copy
        </DropdownMenu.Item>
        <DropdownMenu.Item
          icon={<Trash2 size={16} aria-hidden="true" />}
          tone="danger"
          onSelect={() => {}}
        >
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/** Menu with disabled item. */
export function WithDisabledHarness() {
  return (
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" data-testid="trigger">
          Actions
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item data-testid="item-active" onSelect={() => {}}>
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item data-testid="item-disabled" disabled onSelect={() => {}}>
          Share
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/** Menu with data-* and className forwarding tests. */
export function PropForwardingHarness() {
  return (
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" data-testid="trigger">
          Props
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content data-testid="content-panel" className="consumer-class">
        <DropdownMenu.Item data-testid="item-forward" data-custom="yes" onSelect={() => {}}>
          Item
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/** IconButton trigger for asChild tests. */
export function IconTriggerHarness() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton
          icon={MoreHorizontal}
          aria-label="More actions"
          variant="ghost"
          data-testid="icon-trigger"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item onSelect={() => {}}>Edit</DropdownMenu.Item>
        <DropdownMenu.Item tone="danger" onSelect={() => {}}>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/** DropdownMenuBasic convenience harness. */
export function BasicHarness() {
  return (
    <DropdownMenuBasic
      trigger={
        <Button variant="secondary" data-testid="basic-trigger">
          Quick actions
        </Button>
      }
      items={[
        { label: "Edit", onSelect: () => {} },
        { label: "Copy", onSelect: () => {} },
        { label: "Delete", tone: "danger", onSelect: () => {} },
      ]}
    />
  );
}

/** A11y harness — open by default so axe scans the live menu. */
export function A11yHarness() {
  return (
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={<Edit size={16} aria-hidden="true" />} onSelect={() => {}}>
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item icon={<Copy size={16} aria-hidden="true" />} onSelect={() => {}}>
          Copy
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          icon={<Trash2 size={16} aria-hidden="true" />}
          tone="danger"
          onSelect={() => {}}
        >
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
