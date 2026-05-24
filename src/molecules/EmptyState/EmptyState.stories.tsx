import type { Story, StoryDefault } from "@ladle/react";
import { EmptyState } from "./EmptyState";
import { Button } from "../../atoms/Button/Button";

export default {
  title: "Components / EmptyState",
} satisfies StoryDefault;

/** Default — title only, transparent background.
 *  Verifies: centered column, --fs-body weight-500 title, --fg text, --space-16 padding. */
export const Default: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-4)" }}>
    <EmptyState title="No scheduled posts" />
  </div>
);

/** WithIcon — decorative lucide-style icon above the title.
 *  Verifies: icon slot renders above title, aria-hidden wrapper, --fg-muted icon color,
 *  --space-3 gap between icon and title. */
export const WithIcon: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-4)" }}>
    <EmptyState
      title="No scheduled posts"
      description="You haven't scheduled anything yet. Create your first post to get started."
      icon={
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      }
    />
  </div>
);

/** WithAction — title + description + Button CTA.
 *  Verifies: action slot renders below description, --space-6 gap, Button composes cleanly. */
export const WithAction: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-4)" }}>
    <EmptyState
      title="No scheduled posts"
      description="Schedule your first post to start building your content calendar."
      action={
        <Button variant="primary" size="md">
          Schedule a post
        </Button>
      }
    />
  </div>
);

/** TableEmptyState — table-empty-state composition with icon + action.
 *  Verifies: full anatomy composing together in a realistic table-empty context. */
export const TableEmptyState: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-4)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-3)",
    }}
  >
    <EmptyState
      title="No approvals pending"
      description="All posts have been reviewed. New submissions will appear here."
      icon={
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      }
      action={
        <Button variant="ghost" size="sm">
          View all posts
        </Button>
      }
    />
  </div>
);

/** Subtle — tone="subtle" with --surface fill and --radius-3 border-radius.
 *  Verifies: subtle tone applies background and radius tokens correctly. */
export const Subtle: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-4)" }}>
    <EmptyState
      tone="subtle"
      title="No conversations yet"
      description="When someone messages you, it will appear here."
      icon={
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      }
      action={
        <Button variant="primary" size="md">
          Start a conversation
        </Button>
      }
    />
  </div>
);
