import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Dialog } from "./Dialog";
import { DialogBasic } from "./DialogBasic";
import { Button } from "../../atoms/Button";

export default {
  title: "Organisms / Dialog",
} satisfies StoryDefault;

/* ─── Default — DialogBasic with all slots ─────────────────── */

export const Default: Story = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>

      <DialogBasic
        open={open}
        onOpenChange={setOpen}
        title="Join the waitlist"
        description="We'll reach out as soon as your spot is ready."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>
          Enter your details below to reserve your spot. Capacity is limited — we review
          applications on a rolling basis.
        </p>
      </DialogBasic>
    </>
  );
};

/* ─── NoDescription — title + body only, no hairline rule ──── */

export const NoDescription: Story = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open (no description)
      </Button>

      <DialogBasic
        open={open}
        onOpenChange={setOpen}
        title="Quick note"
        footer={
          <Button variant="primary" onClick={() => setOpen(false)}>
            Got it
          </Button>
        }
      >
        <p style={{ margin: 0 }}>
          The hairline rule between title and body is suppressed when no description is provided.
          The title flows directly into body content.
        </p>
      </DialogBasic>
    </>
  );
};

/* ─── NoFooter — close via X only ──────────────────────────── */

export const NoFooter: Story = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Open (no footer)
      </Button>

      <DialogBasic
        open={open}
        onOpenChange={setOpen}
        title="About pouk.ai"
        description="The infrastructure layer for AI operators."
      >
        <p style={{ margin: 0 }}>
          Founded in 2025, pouk.ai builds production AI systems end-to-end. The close button (X) in
          the top-right is the only dismiss affordance when no footer is provided.
        </p>
      </DialogBasic>
    </>
  );
};

/* ─── UncontrolledTrigger — compound API with Trigger ────────── */

export const UncontrolledTrigger: Story = () => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <Button variant="ghost">Learn more</Button>
    </Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content>
        <Dialog.Title>About pouk.ai</Dialog.Title>
        <Dialog.Description>
          pouk.ai gives operators access to enterprise-grade AI tooling.
        </Dialog.Description>
        <p style={{ marginTop: "var(--space-4)", marginBottom: 0 }}>
          Founded in 2025, pouk.ai builds the infrastructure layer for AI operators. Our design
          system reflects the same editorial restraint we bring to every product decision.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "var(--space-6)",
          }}
        >
          <Dialog.Close asChild>
            <Button variant="ghost">Close</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

/* ─── FormInDialog — form with fields, onOpenAutoFocus override ─ */

export const FormInDialog: Story = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open form
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              const first = document.getElementById("dialog-email");
              if (first) first.focus();
            }}
          >
            <Dialog.Title>Notification settings</Dialog.Title>
            <Dialog.Description>Manage how you receive updates from pouk.ai.</Dialog.Description>
            <form
              id="dialog-settings-form"
              style={{ marginTop: "var(--space-4)" }}
              onSubmit={(e) => {
                e.preventDefault();
                setOpen(false);
              }}
            >
              <div style={{ marginBottom: "var(--space-4)" }}>
                <label
                  htmlFor="dialog-email"
                  style={{
                    display: "block",
                    fontSize: "var(--fs-meta)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  Email address
                </label>
                <input
                  id="dialog-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  style={{
                    width: "100%",
                    padding: "var(--space-2) var(--space-3)",
                    border: "var(--hairline-w) solid var(--hairline)",
                    borderRadius: "var(--radius-2)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--fs-body)",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    fontSize: "var(--fs-meta)",
                  }}
                >
                  <input id="dialog-notify" type="checkbox" name="notify" defaultChecked />
                  Email notifications
                </label>
              </div>
            </form>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "var(--space-3)",
                marginTop: "var(--space-6)",
              }}
            >
              <Dialog.Close asChild>
                <Button variant="ghost">Cancel</Button>
              </Dialog.Close>
              <Button variant="primary" type="submit" form="dialog-settings-form">
                Save
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

/* ─── Confirmation — Cancel + Confirm (destructive intent) ──── */

export const Confirmation: Story = () => {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (deleted) {
    return (
      <p style={{ color: "var(--fg-muted)" }}>
        Project deleted.{" "}
        <button
          onClick={() => {
            setDeleted(false);
            setOpen(false);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--accent)",
          }}
        >
          Reset
        </button>
      </p>
    );
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Delete project
      </Button>

      <DialogBasic
        open={open}
        onOpenChange={setOpen}
        title="Delete this project?"
        description="This action cannot be undone. All data associated with the project will be permanently removed."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            {/*
             * Note: variant="primary" is used here for the destructive action.
             * A variant="danger" Button is anticipated in a future PR.
             * See meta/design/Dialog.md §13 and founder call #1.
             */}
            <Button
              variant="primary"
              onClick={() => {
                setDeleted(true);
                setOpen(false);
              }}
            >
              Delete project
            </Button>
          </>
        }
      >
        {null}
      </DialogBasic>
    </>
  );
};

/* ─── LongBody — scrollable body at max-height ───────────────── */

export const LongBody: Story = () => {
  const [open, setOpen] = useState(false);

  const loremParagraphs = Array.from({ length: 8 }, (_, i) => (
    <p key={i} style={{ marginBottom: "var(--space-4)" }}>
      Paragraph {i + 1}: pouk.ai builds production AI systems end-to-end for senior-only consulting
      practices. The design system reflects the same editorial restraint brought to every product
      decision — hairline rules, Apple-light palette, and typographic precision over decoration.
      Long-form content inside a dialog should scroll internally while the title band remains
      visible at the top of the panel.
    </p>
  ));

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open long content
      </Button>

      <DialogBasic
        open={open}
        onOpenChange={setOpen}
        title="Terms of service"
        description="Please read before continuing."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Decline
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Accept
            </Button>
          </>
        }
      >
        {loremParagraphs}
      </DialogBasic>
    </>
  );
};

/* ─── DialogBasicShowcase — all props demonstrated ───────────── */

export const DialogBasicShowcase: Story = () => {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ padding: "var(--space-8)" }}>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open DialogBasic
      </Button>

      <DialogBasic
        open={open}
        onOpenChange={setOpen}
        title="DialogBasic showcase"
        description="Optional description — triggers the hairline rule below the title band."
        closeLabel="Close dialog"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>
          This story demonstrates all DialogBasic props: title, description, children, footer, and
          closeLabel. The X button in the top-right uses the closeLabel as its aria-label.
        </p>
      </DialogBasic>
    </div>
  );
};
