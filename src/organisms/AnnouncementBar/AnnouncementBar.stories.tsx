import type { Story, StoryDefault } from "@ladle/react";
import { AnnouncementBar } from "./AnnouncementBar";
import { Button } from "../../atoms/Button";

export default {
  title: "Organisms / AnnouncementBar",
} satisfies StoryDefault;

/* ─── Default (warm tone) ─────────────────────────────────── */

export const Default: Story = () => (
  <AnnouncementBar id="story-default" tone="warm">
    We&apos;re launching Phase 2 — new components, new primitives.
  </AnnouncementBar>
);

/* ─── With action ─────────────────────────────────────────── */

export const WithAction: Story = () => (
  <AnnouncementBar
    id="story-with-action"
    tone="warm"
    action={
      <Button variant="ghost" size="sm" asChild>
        <a href="/blog">Read more</a>
      </Button>
    }
  >
    Phase 2 is now live — new organisms, dark mode, and more.
  </AnnouncementBar>
);

/* ─── Neutral tone ────────────────────────────────────────── */

export const Neutral: Story = () => (
  <AnnouncementBar id="story-neutral" tone="neutral">
    Scheduled maintenance on Sunday at 02:00 UTC. Expect 10 minutes of downtime.
  </AnnouncementBar>
);

/* ─── Success tone ────────────────────────────────────────── */

export const Success: Story = () => (
  <AnnouncementBar id="story-success" tone="success">
    Deployment complete. All services are running normally.
  </AnnouncementBar>
);

/* ─── Danger tone ─────────────────────────────────────────── */

export const Danger: Story = () => (
  <AnnouncementBar id="story-danger" tone="danger">
    Service degradation detected. Our team is investigating.
  </AnnouncementBar>
);

/* ─── Warning tone ────────────────────────────────────────── */

export const Warning: Story = () => (
  <AnnouncementBar id="story-warning" tone="warning">
    Your API key expires in 3 days. Rotate it to avoid interruptions.
  </AnnouncementBar>
);

/* ─── Non-dismissable ─────────────────────────────────────── */

export const NonDismissable: Story = () => (
  <AnnouncementBar id="story-mandatory" tone="danger" dismissable={false}>
    Critical maintenance in progress. Read-only mode is active.
  </AnnouncementBar>
);

/* ─── All tones ───────────────────────────────────────────── */

export const AllTones: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
    <AnnouncementBar id="story-all-warm" tone="warm">
      warm — launch announcement copy.
    </AnnouncementBar>
    <AnnouncementBar id="story-all-neutral" tone="neutral">
      neutral — maintenance or informational copy.
    </AnnouncementBar>
    <AnnouncementBar id="story-all-success" tone="success">
      success — deployment complete or positive feedback.
    </AnnouncementBar>
    <AnnouncementBar id="story-all-danger" tone="danger">
      danger — service outage or error state.
    </AnnouncementBar>
    <AnnouncementBar id="story-all-warning" tone="warning">
      warning — API key or quota approaching limit.
    </AnnouncementBar>
  </div>
);
