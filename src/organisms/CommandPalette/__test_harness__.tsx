/**
 * Test harnesses for CommandPalette.test.tsx.
 *
 * Lives in its own module because Playwright CT requires every component
 * mounted (including children of <Harness>) to be defined outside the test
 * file. Inline test-file components produce "cannot be mounted" errors.
 */

import { useState } from "react";
import { CommandPalette } from "./CommandPalette";
import { FileText, Settings } from "lucide-react";

/** Basic open palette with two groups and an empty slot. */
export function BasicOpenHarness() {
  return (
    <CommandPalette open={true} onOpenChange={() => {}}>
      <CommandPalette.Group heading="Pages">
        <CommandPalette.Item data-testid="item-dashboard" onSelect={() => {}}>
          Dashboard
        </CommandPalette.Item>
        <CommandPalette.Item icon={<FileText size={16} />} onSelect={() => {}}>
          Documents
        </CommandPalette.Item>
      </CommandPalette.Group>
      <CommandPalette.Group heading="Actions">
        <CommandPalette.Item icon={<Settings size={16} />} shortcut="⌘," onSelect={() => {}}>
          Settings
        </CommandPalette.Item>
      </CommandPalette.Group>
      <CommandPalette.Empty>No results found.</CommandPalette.Empty>
    </CommandPalette>
  );
}

/** Palette that starts closed; clicking the trigger opens it. */
export function ToggleHarness() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button data-testid="open-trigger" onClick={() => setOpen(true)}>
        Open palette
      </button>
      <CommandPalette open={open} onOpenChange={setOpen}>
        <CommandPalette.Group heading="Pages">
          <CommandPalette.Item onSelect={() => setOpen(false)}>Dashboard</CommandPalette.Item>
        </CommandPalette.Group>
        <CommandPalette.Empty>No results found.</CommandPalette.Empty>
      </CommandPalette>
    </div>
  );
}

/** Palette with an item whose onSelect closes the palette. */
export function SelectHarness() {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("");
  return (
    <div>
      <span data-testid="selected-value">{selected}</span>
      <CommandPalette open={open} onOpenChange={setOpen}>
        <CommandPalette.Group heading="Pages">
          <CommandPalette.Item
            onSelect={() => {
              setSelected("dashboard");
              setOpen(false);
            }}
          >
            Dashboard
          </CommandPalette.Item>
        </CommandPalette.Group>
        <CommandPalette.Empty>No results found.</CommandPalette.Empty>
      </CommandPalette>
    </div>
  );
}

/** Palette that is closed (for closed-state tests). */
export function ClosedHarness() {
  return (
    <CommandPalette open={false} onOpenChange={() => {}}>
      <CommandPalette.Group heading="Pages">
        <CommandPalette.Item onSelect={() => {}}>Dashboard</CommandPalette.Item>
      </CommandPalette.Group>
      <CommandPalette.Empty>No results found.</CommandPalette.Empty>
    </CommandPalette>
  );
}

/** Open palette with only the Empty slot visible (no items). */
export function EmptySlotHarness() {
  return (
    <CommandPalette open={true} onOpenChange={() => {}}>
      <CommandPalette.Empty>No results found.</CommandPalette.Empty>
    </CommandPalette>
  );
}

/** Open palette for a11y gate scan. */
export function A11yHarness() {
  return (
    <CommandPalette open={true} onOpenChange={() => {}}>
      <CommandPalette.Group heading="Pages">
        <CommandPalette.Item icon={<FileText size={16} />} onSelect={() => {}}>
          Dashboard
        </CommandPalette.Item>
        <CommandPalette.Item shortcut="⌘," onSelect={() => {}}>
          Settings
        </CommandPalette.Item>
      </CommandPalette.Group>
      <CommandPalette.Empty>No results found.</CommandPalette.Empty>
    </CommandPalette>
  );
}
