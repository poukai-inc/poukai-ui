import type { Story } from "@ladle/react";
import { Accordion } from "./Accordion";

export default { title: "Molecules / Accordion" };

/* ─── Default (single, collapsible) ─────────────────────────────── */

export const Default: Story = () => (
  <div style={{ maxWidth: "40rem", padding: "var(--space-8)" }}>
    <Accordion.Root type="single" collapsible defaultValue="item-1">
      <Accordion.Item value="item-1">
        <Accordion.Trigger>What is Poukai?</Accordion.Trigger>
        <Accordion.Content>
          <p>
            Poukai is a senior-only AI consulting practice that ships production systems end-to-end.
          </p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Who do you work with?</Accordion.Trigger>
        <Accordion.Content>
          <p>
            We work alongside founders and platform teams to close the gap between pilot and
            production.
          </p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>How do engagements work?</Accordion.Trigger>
        <Accordion.Content>
          <p>Engagements are scoped, time-boxed, and focused on a specific production outcome.</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </div>
);

/* ─── Multiple ───────────────────────────────────────────────────── */

export const Multiple: Story = () => (
  <div style={{ maxWidth: "40rem", padding: "var(--space-8)" }}>
    <Accordion.Root type="multiple" defaultValue={["item-a", "item-b"]}>
      <Accordion.Item value="item-a">
        <Accordion.Trigger>Build</Accordion.Trigger>
        <Accordion.Content>
          <p>Custom AI pipelines, evaluation suites, and production-grade integrations.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-b">
        <Accordion.Trigger>Automate</Accordion.Trigger>
        <Accordion.Content>
          <p>Workflow automation that closes the loop between data, model, and action.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-c">
        <Accordion.Trigger>Advise</Accordion.Trigger>
        <Accordion.Content>
          <p>Advisory engagements for teams navigating model selection, safety, and scale.</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </div>
);

/* ─── With default value ─────────────────────────────────────────── */

export const WithDefaultValue: Story = () => (
  <div style={{ maxWidth: "40rem", padding: "var(--space-8)" }}>
    <Accordion.Root type="single" collapsible defaultValue="faq-2">
      <Accordion.Item value="faq-1">
        <Accordion.Trigger>Do you take on long-term retainers?</Accordion.Trigger>
        <Accordion.Content>
          <p>
            Yes — some engagements evolve into ongoing advisory relationships after the initial
            build phase.
          </p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="faq-2">
        <Accordion.Trigger>What industries do you work in?</Accordion.Trigger>
        <Accordion.Content>
          <p>
            Primarily B2B SaaS, fintech, and professional services — wherever production AI creates
            meaningful leverage on existing workflows.
          </p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="faq-3" disabled>
        <Accordion.Trigger>Is this item disabled?</Accordion.Trigger>
        <Accordion.Content>
          <p>This content is not reachable because the item is disabled.</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </div>
);

/* ─── Tinted tone ────────────────────────────────────────────────── */

export const Tinted: Story = () => (
  <div style={{ maxWidth: "40rem", padding: "var(--space-8)" }}>
    <Accordion.Root type="single" collapsible tone="tinted" defaultValue="t-1">
      <Accordion.Item value="t-1">
        <Accordion.Trigger>Tinted content panel</Accordion.Trigger>
        <Accordion.Content>
          <p>
            The content panel uses <code>--surface</code> for increased separation from the page
            canvas.
          </p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="t-2">
        <Accordion.Trigger>Another tinted item</Accordion.Trigger>
        <Accordion.Content>
          <p>All content panels inherit the tone set on Root.</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </div>
);
