import type { Story, StoryDefault } from "@ladle/react";
import { MenuItem } from "./MenuItem";

export default {
  title: "Molecules / MenuItem",
} satisfies StoryDefault;

/** Default — label only, no icon, no shortcut.
 *  Verifies: flex row renders, --fg text, --fs-meta, --lh-meta, --font-sans,
 *  --space-2 padding-block, --space-3 padding-inline, --radius-2 on hover surface. */
export const Default: Story = () => (
  <div
    style={{
      background: "var(--bg-elevated)",
      padding: "var(--space-2)",
      borderRadius: "var(--radius-3)",
      width: "220px",
    }}
  >
    <MenuItem>Copy</MenuItem>
  </div>
);

/** WithIcon — leading icon slot at --icon-sm (16px).
 *  Verifies: icon renders before label, icon slot is flex-shrink: 0,
 *  gap between icon and label is --space-2. */
export const WithIcon: Story = () => (
  <div
    style={{
      background: "var(--bg-elevated)",
      padding: "var(--space-2)",
      borderRadius: "var(--radius-3)",
      width: "220px",
    }}
  >
    <MenuItem
      icon={
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
      }
    >
      Copy
    </MenuItem>
  </div>
);

/** WithShortcut — trailing Kbd shortcut, no icon.
 *  Verifies: Kbd renders far-right via flex spacer, shortcut uses --fg-muted,
 *  aria-hidden="true" on the Kbd so screen readers skip it. */
export const WithShortcut: Story = () => (
  <div
    style={{
      background: "var(--bg-elevated)",
      padding: "var(--space-2)",
      borderRadius: "var(--radius-3)",
      width: "220px",
    }}
  >
    <MenuItem shortcut="⌘C">Copy</MenuItem>
  </div>
);

/** WithIconAndShortcut — full anatomy: leading icon + label + trailing Kbd.
 *  Verifies: all three slots compose correctly, label takes flex: 1 between
 *  icon and shortcut, row height is single-line. */
export const WithIconAndShortcut: Story = () => (
  <div
    style={{
      background: "var(--bg-elevated)",
      padding: "var(--space-2)",
      borderRadius: "var(--radius-3)",
      width: "220px",
    }}
  >
    <MenuItem
      shortcut="⌘C"
      icon={
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
      }
    >
      Copy
    </MenuItem>
  </div>
);

/** DangerTone — destructive action row using tone="danger".
 *  Verifies: label color shifts to --danger, icon inherits the danger color
 *  via currentColor. */
export const DangerTone: Story = () => (
  <div
    style={{
      background: "var(--bg-elevated)",
      padding: "var(--space-2)",
      borderRadius: "var(--radius-3)",
      width: "220px",
    }}
  >
    <MenuItem
      tone="danger"
      icon={
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
      }
    >
      Delete post
    </MenuItem>
  </div>
);

/** Disabled — opacity 0.4, pointer-events none.
 *  Verifies: row is visible but visually de-emphasised; Radix host carries
 *  aria-disabled; MenuItem does not duplicate it. */
export const Disabled: Story = () => (
  <div
    style={{
      background: "var(--bg-elevated)",
      padding: "var(--space-2)",
      borderRadius: "var(--radius-3)",
      width: "220px",
    }}
  >
    <MenuItem disabled>Paste</MenuItem>
  </div>
);

/** MenuStack — realistic panel with multiple rows.
 *  Verifies: rows stack cleanly inside an elevated panel surface,
 *  spacing rhythm holds, hover state is visible in isolation. */
export const MenuStack: Story = () => (
  <div
    style={{
      background: "var(--bg-elevated)",
      padding: "var(--space-2)",
      borderRadius: "var(--radius-3)",
      width: "220px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <MenuItem
      shortcut="⌘C"
      icon={
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
      }
    >
      Copy
    </MenuItem>
    <MenuItem shortcut="⌘X">Cut</MenuItem>
    <MenuItem shortcut="⌘V" disabled>
      Paste
    </MenuItem>
    <MenuItem tone="danger">Delete post</MenuItem>
  </div>
);
