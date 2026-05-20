import type { Story, StoryDefault } from "@ladle/react";
import { ToastProvider, useToast } from "./Toast";
import { Button } from "../../atoms/Button";

export default {
  title: "Components / Toast",
} satisfies StoryDefault;

/* ─── Helper: trigger button wired to useToast ──────────────── */

function ToastTrigger({
  label,
  tone,
  title,
  body,
  action,
  duration,
}: {
  label: string;
  tone?: "info" | "success" | "warning" | "danger";
  title?: string;
  body: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
}) {
  const { show } = useToast();
  return (
    <Button variant="secondary" onClick={() => show({ tone, title, body, action, duration })}>
      {label}
    </Button>
  );
}

/* ─── Default / Playground ──────────────────────────────────── */

export const Default: Story = () => (
  <ToastProvider position="bottom-right">
    <ToastTrigger label="Show info toast" tone="info" body="Your changes have been saved." />
  </ToastProvider>
);

/* ─── All four tones ────────────────────────────────────────── */

export const AllTones: Story = () => (
  <ToastProvider position="bottom-right">
    <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
      <ToastTrigger label="Info" tone="info" body="Session will expire in 15 minutes." />
      <ToastTrigger label="Success" tone="success" body="Deployment complete. Changes are live." />
      <ToastTrigger label="Warning" tone="warning" body="API key expires in 3 days." />
      <ToastTrigger label="Danger" tone="danger" body="Deployment failed. Check the logs." />
    </div>
  </ToastProvider>
);

/* ─── With action ───────────────────────────────────────────── */

export const WithAction: Story = () => (
  <ToastProvider position="bottom-right">
    <ToastTrigger
      label="Show with action"
      tone="info"
      body="New version available."
      action={{ label: "Update now", onClick: () => alert("Update triggered") }}
    />
  </ToastProvider>
);

/* ─── With title + body ─────────────────────────────────────── */

export const WithTitleAndBody: Story = () => (
  <ToastProvider position="bottom-right">
    <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
      <ToastTrigger
        label="Info with title"
        tone="info"
        title="Session expiring"
        body="Your session will expire in 15 minutes. Save your work."
      />
      <ToastTrigger
        label="Success with title"
        tone="success"
        title="Deployment complete"
        body="Changes are live on production."
      />
      <ToastTrigger
        label="Danger with title"
        tone="danger"
        title="Deployment failed"
        body="An error occurred while deploying. Check the logs for details."
      />
    </div>
  </ToastProvider>
);

/* ─── Multiple stacked (3 at once) ──────────────────────────── */

function MultiTrigger() {
  const { show } = useToast();
  const showAll = () => {
    show({ tone: "info", body: "Info: changes saved." });
    show({ tone: "success", title: "Deployed", body: "Production is live." });
    show({ tone: "warning", body: "API key expires soon." });
  };
  return (
    <Button variant="primary" onClick={showAll}>
      Show 3 toasts
    </Button>
  );
}

export const MultipleStacked: Story = () => (
  <ToastProvider position="bottom-right">
    <MultiTrigger />
  </ToastProvider>
);

/* ─── Top-center position ───────────────────────────────────── */

export const TopCenter: Story = () => (
  <ToastProvider position="top-center">
    <ToastTrigger
      label="Show top-center toast"
      tone="success"
      body="Profile updated successfully."
    />
  </ToastProvider>
);

/* ─── Bottom-center position ────────────────────────────────── */

export const BottomCenter: Story = () => (
  <ToastProvider position="bottom-center">
    <ToastTrigger
      label="Show bottom-center toast"
      tone="info"
      body="Your settings have been saved."
    />
  </ToastProvider>
);

/* ─── Top-right position ────────────────────────────────────── */

export const TopRight: Story = () => (
  <ToastProvider position="top-right">
    <ToastTrigger label="Show top-right toast" tone="warning" body="Quota at 80% capacity." />
  </ToastProvider>
);

/* ─── Short duration (1.5s) ─────────────────────────────────── */

export const ShortDuration: Story = () => (
  <ToastProvider position="bottom-right" defaultDuration={1500}>
    <ToastTrigger
      label="Show (auto-dismisses in 1.5s)"
      tone="info"
      body="This toast dismisses quickly."
    />
  </ToastProvider>
);

/* ─── Max cap enforced ──────────────────────────────────────── */

function MaxCapTrigger() {
  const { show } = useToast();
  let count = 0;
  const showFive = () => {
    for (let i = 0; i < 5; i++) {
      count++;
      show({
        tone: "info",
        body: `Toast #${count} — only 4 max visible`,
        duration: 8000,
      });
    }
  };
  return (
    <Button variant="secondary" onClick={showFive}>
      Show 5 (max=4, oldest dropped)
    </Button>
  );
}

export const MaxCapEnforced: Story = () => (
  <ToastProvider position="bottom-right" max={4} defaultDuration={8000}>
    <MaxCapTrigger />
  </ToastProvider>
);
