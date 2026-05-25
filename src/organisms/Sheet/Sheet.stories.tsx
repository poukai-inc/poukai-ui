import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Sheet } from "./Sheet";
import { Button } from "../../atoms/Button";

export default {
  title: "Organisms / Sheet",
} satisfies StoryDefault;

/* ─── Default — right side ─────────────────────────────────── */

export const Default: Story = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open sheet (right)
      </Button>

      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Content side="right" size="md">
          <Sheet.Title>Settings</Sheet.Title>
          <Sheet.Description>Manage your account preferences.</Sheet.Description>
          <p style={{ margin: 0 }}>
            Panel content goes here. The sheet slides in from the right edge and traps focus until
            dismissed via Escape or the close button.
          </p>
          <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end" }}>
            <Sheet.Close asChild>
              <Button variant="ghost">Close</Button>
            </Sheet.Close>
          </div>
        </Sheet.Content>
      </Sheet.Root>
    </>
  );
};

/* ─── Left ─────────────────────────────────────────────────── */

export const Left: Story = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open sheet (left)
      </Button>

      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Content side="left" size="md">
          <Sheet.Title>Navigation</Sheet.Title>
          <Sheet.Description>Site navigation panel.</Sheet.Description>
          <nav>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
              }}
            >
              <li>
                <a href="/" style={{ color: "var(--fg)", textDecoration: "none" }}>
                  Home
                </a>
              </li>
              <li>
                <a href="/work" style={{ color: "var(--fg)", textDecoration: "none" }}>
                  Work
                </a>
              </li>
              <li>
                <a href="/about" style={{ color: "var(--fg)", textDecoration: "none" }}>
                  About
                </a>
              </li>
            </ul>
          </nav>
          <div style={{ marginTop: "auto" }}>
            <Sheet.Close asChild>
              <Button variant="ghost">Close</Button>
            </Sheet.Close>
          </div>
        </Sheet.Content>
      </Sheet.Root>
    </>
  );
};

/* ─── Top ──────────────────────────────────────────────────── */

export const Top: Story = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Open sheet (top)
      </Button>

      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Content side="top" size="sm">
          <Sheet.Title>Notification</Sheet.Title>
          <Sheet.Description>A panel that slides from the top edge.</Sheet.Description>
          <p style={{ margin: 0 }}>
            Top sheets work well for global banners, command palettes, or quick-access utilities.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Sheet.Close asChild>
              <Button variant="ghost">Dismiss</Button>
            </Sheet.Close>
          </div>
        </Sheet.Content>
      </Sheet.Root>
    </>
  );
};

/* ─── Bottom ───────────────────────────────────────────────── */

export const Bottom: Story = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open sheet (bottom)
      </Button>

      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Content side="bottom" size="md">
          <Sheet.Title>Actions</Sheet.Title>
          <Sheet.Description>Mobile-style action sheet from the bottom edge.</Sheet.Description>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <Button variant="primary">Confirm action</Button>
            <Sheet.Close asChild>
              <Button variant="ghost">Cancel</Button>
            </Sheet.Close>
          </div>
        </Sheet.Content>
      </Sheet.Root>
    </>
  );
};

/* ─── WithTrigger — uncontrolled compound API ──────────────── */

export const WithTrigger: Story = () => (
  <Sheet.Root>
    <Sheet.Trigger asChild>
      <Button variant="ghost">Open via Trigger</Button>
    </Sheet.Trigger>
    <Sheet.Content side="right" size="md">
      <Sheet.Title>Detail panel</Sheet.Title>
      <Sheet.Description>Opened via Sheet.Trigger asChild pattern.</Sheet.Description>
      <p style={{ margin: 0 }}>
        Using the compound trigger wires open state automatically without controlled props.
      </p>
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end" }}>
        <Sheet.Close asChild>
          <Button variant="ghost">Close</Button>
        </Sheet.Close>
      </div>
    </Sheet.Content>
  </Sheet.Root>
);
