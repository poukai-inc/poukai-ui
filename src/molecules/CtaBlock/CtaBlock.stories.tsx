import type { Story } from "@ladle/react";
import { CtaBlock } from "./CtaBlock";
import { Button } from "../../atoms/Button";

export default {
  title: "Molecules/CtaBlock",
};

/* ---------- Default (stacked, start-aligned) ---------- */

export const Default: Story = () => (
  <div style={{ padding: "var(--space-8)", maxWidth: "var(--content-max)" }}>
    <CtaBlock
      heading="Ready to start?"
      body="We work with senior-only teams who'd rather ship than speculate."
      actions={<Button variant="primary">Get a demo</Button>}
    />
  </div>
);

/* ---------- Horizontal ---------- */

export const Horizontal: Story = () => (
  <div style={{ padding: "var(--space-8)", maxWidth: "var(--content-max)" }}>
    <CtaBlock
      orientation="horizontal"
      heading="Ready to start?"
      body="Senior-only teams. No hand-offs. Production from day one."
      actions={
        <>
          <Button variant="primary">Get a demo</Button>
          <Button variant="secondary">Learn more</Button>
        </>
      }
    />
  </div>
);

/* ---------- Stacked (explicit, center-aligned) ---------- */

export const Stacked: Story = () => (
  <div style={{ padding: "var(--space-8)", maxWidth: "var(--content-max)" }}>
    <CtaBlock
      orientation="stacked"
      align="center"
      heading="The smallest real deployment teaches more than six months of staging."
      body="For teams who'd rather build than brief."
      actions={
        <>
          <Button variant="primary">Start a project</Button>
          <Button variant="ghost">See our work</Button>
        </>
      }
    />
  </div>
);

/* ---------- End-of-section composition (no body) ---------- */

export const EndOfSection: Story = () => (
  <div
    style={{
      padding: "var(--space-12) var(--space-8)",
      maxWidth: "var(--content-max)",
      borderTop: "var(--hairline-w) solid var(--hairline)",
    }}
  >
    <CtaBlock
      heading="Interested in working together?"
      actions={
        <Button variant="primary" asChild>
          <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
        </Button>
      }
    />
  </div>
);
