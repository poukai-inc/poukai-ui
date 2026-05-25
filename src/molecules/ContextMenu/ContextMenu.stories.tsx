import type { Story, StoryDefault } from "@ladle/react";
import { ContextMenu } from "./ContextMenu";

export default {
  title: "Molecules / ContextMenu",
} satisfies StoryDefault;

/* ------------------------------------------------------------------ */
/* Shared inline SVG icons (no lucide-react dependency in stories)      */
/* ------------------------------------------------------------------ */

const CopyIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CutIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="6" cy="20" r="2" />
    <circle cx="6" cy="4" r="2" />
    <line x1="8.12" y1="5.17" x2="19" y2="16" />
    <line x1="8.12" y1="18.83" x2="19" y2="8" />
    <line x1="19" y1="8" x2="19" y2="16" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Helper: visible trigger zone                                         */
/* ------------------------------------------------------------------ */

const TriggerZone = ({ label = "Right-click here" }: { label?: string }) => (
  <div
    style={{
      padding: "var(--space-6) var(--space-4)",
      border: "var(--hairline-w) dashed var(--hairline)",
      borderRadius: "var(--radius-3)",
      color: "var(--fg-muted)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-meta)",
      userSelect: "none",
      cursor: "context-menu",
      textAlign: "center",
    }}
  >
    {label}
  </div>
);

/* ------------------------------------------------------------------ */
/* Default — minimal: three items, no icons                             */
/* ------------------------------------------------------------------ */

/**
 * Default — three plain menu items.
 * Right-click the dashed zone to open.
 */
export const Default: Story = () => (
  <div style={{ padding: "var(--space-8)", width: "360px" }}>
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <TriggerZone />
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item shortcut="⌘C">Copy</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘X">Cut</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘V" disabled>
          Paste
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  </div>
);

/* ------------------------------------------------------------------ */
/* WithIcons — icon slot on every item                                  */
/* ------------------------------------------------------------------ */

/**
 * WithIcons — leading icon on every row.
 * Verifies: icon slot renders before label, inherits currentColor via danger tone.
 */
export const WithIcons: Story = () => (
  <div style={{ padding: "var(--space-8)", width: "360px" }}>
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <TriggerZone label="Right-click for icon menu" />
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item icon={<CopyIcon />} shortcut="⌘C">
          Copy
        </ContextMenu.Item>
        <ContextMenu.Item icon={<CutIcon />} shortcut="⌘X">
          Cut
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item icon={<TrashIcon />} tone="danger">
          Delete
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  </div>
);

/* ------------------------------------------------------------------ */
/* OnRow — composition on a table-row-like surface                      */
/* ------------------------------------------------------------------ */

/**
 * OnRow — ContextMenu wrapping a simulated table row.
 * Demonstrates the canonical data-table composition pattern.
 */
export const OnRow: Story = () => (
  <div style={{ padding: "var(--space-8)", width: "480px" }}>
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
            padding: "var(--space-3) var(--space-4)",
            background: "var(--bg-elevated)",
            border: "var(--hairline-w) solid var(--hairline)",
            borderRadius: "var(--radius-3)",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--fs-meta)",
            color: "var(--fg)",
            cursor: "context-menu",
          }}
        >
          <span style={{ flex: 1 }}>Q2 Strategy Brief.pdf</span>
          <span style={{ color: "var(--fg-muted)" }}>2.4 MB</span>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item shortcut="⌘O">Open</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘D">Duplicate</ContextMenu.Item>
        <ContextMenu.Item>Rename</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item tone="danger">Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  </div>
);
