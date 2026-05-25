import type { Story } from "@ladle/react";
import { MoreHorizontal, Copy, Trash2, Edit, Share, Download, Star } from "lucide-react";
import { DropdownMenu, DropdownMenuBasic } from "./DropdownMenu";
import { Button } from "../Button";
import { IconButton } from "../IconButton";

export default { title: "Atoms / DropdownMenu" };

/* ─── Default ────────────────────────────────────────────── */

export const Default: Story = () => (
  <div style={{ padding: "4rem", display: "flex", justifyContent: "center" }}>
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onSelect={() => {}}>Edit</DropdownMenu.Item>
        <DropdownMenu.Item onSelect={() => {}}>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item tone="danger" onSelect={() => {}}>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
);

Default.storyName = "Default";

/* ─── WithIcons ──────────────────────────────────────────── */

export const WithIcons: Story = () => (
  <div style={{ padding: "4rem", display: "flex", justifyContent: "center" }}>
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">Options</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={<Edit size={16} aria-hidden="true" />} onSelect={() => {}}>
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item icon={<Copy size={16} aria-hidden="true" />} onSelect={() => {}}>
          Copy
        </DropdownMenu.Item>
        <DropdownMenu.Item icon={<Share size={16} aria-hidden="true" />} onSelect={() => {}}>
          Share
        </DropdownMenu.Item>
        <DropdownMenu.Item icon={<Download size={16} aria-hidden="true" />} onSelect={() => {}}>
          Download
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
  </div>
);

WithIcons.storyName = "With Icons";

/* ─── WithShortcuts ──────────────────────────────────────── */

export const WithShortcuts: Story = () => (
  <div style={{ padding: "4rem", display: "flex", justifyContent: "center" }}>
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">Edit menu</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content minWidth="200px">
        <DropdownMenu.Item
          icon={<Edit size={16} aria-hidden="true" />}
          shortcut="⌘E"
          onSelect={() => {}}
        >
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item
          icon={<Copy size={16} aria-hidden="true" />}
          shortcut="⌘C"
          onSelect={() => {}}
        >
          Copy
        </DropdownMenu.Item>
        <DropdownMenu.Item
          icon={<Star size={16} aria-hidden="true" />}
          shortcut="⌘S"
          onSelect={() => {}}
        >
          Favourite
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          icon={<Trash2 size={16} aria-hidden="true" />}
          shortcut="⌘⌫"
          tone="danger"
          onSelect={() => {}}
        >
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
);

WithShortcuts.storyName = "With Shortcuts";

/* ─── WithDisabledItems ──────────────────────────────────── */

export const WithDisabledItems: Story = () => (
  <div style={{ padding: "4rem", display: "flex", justifyContent: "center" }}>
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">Post actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={<Edit size={16} aria-hidden="true" />} onSelect={() => {}}>
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item
          icon={<Share size={16} aria-hidden="true" />}
          disabled
          onSelect={() => {}}
        >
          Share (unavailable)
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item tone="danger" onSelect={() => {}}>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
);

WithDisabledItems.storyName = "With Disabled Items";

/* ─── IconButtonTrigger ──────────────────────────────────── */

export const IconButtonTrigger: Story = () => (
  <div style={{ padding: "4rem", display: "flex", justifyContent: "center" }}>
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger asChild>
        <IconButton icon={MoreHorizontal} aria-label="More actions" variant="ghost" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item icon={<Edit size={16} aria-hidden="true" />} onSelect={() => {}}>
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item icon={<Copy size={16} aria-hidden="true" />} onSelect={() => {}}>
          Duplicate
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item tone="danger" onSelect={() => {}}>
          Remove
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
);

IconButtonTrigger.storyName = "IconButton Trigger (end-aligned)";

/* ─── BasicConvenience ───────────────────────────────────── */

export const BasicConvenience: Story = () => (
  <div style={{ padding: "4rem", display: "flex", justifyContent: "center" }}>
    <DropdownMenuBasic
      trigger={<Button variant="secondary">Quick actions</Button>}
      items={[
        { label: "Edit", icon: <Edit size={16} aria-hidden="true" />, onSelect: () => {} },
        { label: "Copy", icon: <Copy size={16} aria-hidden="true" />, onSelect: () => {} },
        {
          label: "Delete",
          tone: "danger",
          icon: <Trash2 size={16} aria-hidden="true" />,
          onSelect: () => {},
        },
      ]}
    />
  </div>
);

BasicConvenience.storyName = "DropdownMenuBasic (convenience)";
