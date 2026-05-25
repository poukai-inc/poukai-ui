import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { CommandPalette } from "./CommandPalette";
import { Button } from "../../atoms/Button";
import { FileText, Settings, LayoutDashboard, Search, Star, Trash2 } from "lucide-react";

export default {
  title: "Organisms / CommandPalette",
} satisfies StoryDefault;

/* ─── Default ────────────────────────────────────────────────── */

export const Default: Story = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open palette (⌘K)
      </Button>

      <CommandPalette open={open} onOpenChange={setOpen}>
        <CommandPalette.Group heading="Pages">
          <CommandPalette.Item
            icon={<LayoutDashboard size={16} />}
            shortcut="⌘D"
            onSelect={() => setOpen(false)}
          >
            Dashboard
          </CommandPalette.Item>
          <CommandPalette.Item icon={<FileText size={16} />} onSelect={() => setOpen(false)}>
            Documents
          </CommandPalette.Item>
        </CommandPalette.Group>

        <CommandPalette.Group heading="Actions">
          <CommandPalette.Item
            icon={<Settings size={16} />}
            shortcut="⌘,"
            onSelect={() => setOpen(false)}
          >
            Open settings
          </CommandPalette.Item>
          <CommandPalette.Item icon={<Search size={16} />} onSelect={() => setOpen(false)}>
            Advanced search
          </CommandPalette.Item>
        </CommandPalette.Group>

        <CommandPalette.Empty>No results found.</CommandPalette.Empty>
      </CommandPalette>
    </div>
  );
};

/* ─── With many groups ───────────────────────────────────────── */

export const ManyGroups: Story = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open (many groups)
      </Button>

      <CommandPalette open={open} onOpenChange={setOpen} placeholder="Type to search…">
        <CommandPalette.Group heading="Recent">
          <CommandPalette.Item icon={<FileText size={16} />} onSelect={() => setOpen(false)}>
            Q4 Report
          </CommandPalette.Item>
          <CommandPalette.Item icon={<FileText size={16} />} onSelect={() => setOpen(false)}>
            Design Review Notes
          </CommandPalette.Item>
        </CommandPalette.Group>

        <CommandPalette.Group heading="Starred">
          <CommandPalette.Item icon={<Star size={16} />} onSelect={() => setOpen(false)}>
            Engineering Roadmap
          </CommandPalette.Item>
        </CommandPalette.Group>

        <CommandPalette.Group heading="Actions">
          <CommandPalette.Item
            icon={<Settings size={16} />}
            shortcut="⌘,"
            onSelect={() => setOpen(false)}
          >
            Settings
          </CommandPalette.Item>
          <CommandPalette.Item icon={<Trash2 size={16} />} onSelect={() => setOpen(false)}>
            Move to trash
          </CommandPalette.Item>
        </CommandPalette.Group>

        <CommandPalette.Empty>No results found.</CommandPalette.Empty>
      </CommandPalette>
    </div>
  );
};

/* ─── Empty state ────────────────────────────────────────────── */

export const EmptyState: Story = () => {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open (empty state)
      </Button>

      <CommandPalette open={open} onOpenChange={setOpen}>
        <CommandPalette.Empty>No results found for your search.</CommandPalette.Empty>
      </CommandPalette>
    </div>
  );
};

/* ─── No icons / no shortcuts ────────────────────────────────── */

export const Minimal: Story = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open (minimal)
      </Button>

      <CommandPalette open={open} onOpenChange={setOpen}>
        <CommandPalette.Group heading="Pages">
          <CommandPalette.Item onSelect={() => setOpen(false)}>Dashboard</CommandPalette.Item>
          <CommandPalette.Item onSelect={() => setOpen(false)}>Settings</CommandPalette.Item>
          <CommandPalette.Item onSelect={() => setOpen(false)}>Profile</CommandPalette.Item>
        </CommandPalette.Group>
        <CommandPalette.Empty>No results found.</CommandPalette.Empty>
      </CommandPalette>
    </div>
  );
};
