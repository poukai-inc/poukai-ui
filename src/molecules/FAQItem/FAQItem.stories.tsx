import type { Story } from "@ladle/react";
import { Accordion } from "../Accordion";
import { FAQItem } from "./FAQItem";

export default { title: "Molecules / FAQItem" };

/* ─── Default (single, collapsible) ─────────────────────────────── */

export const Default: Story = () => (
  <div style={{ maxWidth: "40rem", padding: "var(--space-8)" }}>
    <Accordion.Root type="single" collapsible defaultValue="q1">
      <FAQItem value="q1" question="What is Poukai?">
        <p>
          Poukai is a senior-only AI consulting practice that ships production systems end-to-end.
        </p>
      </FAQItem>
      <FAQItem value="q2" question="Who do you work with?">
        <p>
          We work alongside founders and platform teams to close the gap between pilot and
          production.
        </p>
      </FAQItem>
      <FAQItem value="q3" question="How do engagements work?">
        <p>Engagements are scoped, time-boxed, and focused on a specific production outcome.</p>
      </FAQItem>
    </Accordion.Root>
  </div>
);

/* ─── Multiple open at once ──────────────────────────────────────── */

export const Multiple: Story = () => (
  <div style={{ maxWidth: "40rem", padding: "var(--space-8)" }}>
    <Accordion.Root type="multiple" defaultValue={["m1", "m2"]}>
      <FAQItem value="m1" question="Do you take on long-term retainers?">
        <p>
          Yes — some engagements evolve into ongoing advisory relationships after the initial build
          phase.
        </p>
      </FAQItem>
      <FAQItem value="m2" question="What industries do you work in?">
        <p>
          Primarily B2B SaaS, fintech, and professional services — wherever production AI creates
          meaningful leverage on existing workflows.
        </p>
      </FAQItem>
      <FAQItem value="m3" question="Is there a minimum engagement size?">
        <p>We typically engage for a minimum of four weeks to ensure meaningful outcomes.</p>
      </FAQItem>
    </Accordion.Root>
  </div>
);

/* ─── Custom heading level ───────────────────────────────────────── */

export const HeadingLevel: Story = () => (
  <div style={{ maxWidth: "40rem", padding: "var(--space-8)" }}>
    <h2 style={{ marginBottom: "var(--space-4)" }}>FAQ</h2>
    <Accordion.Root type="single" collapsible>
      <FAQItem value="hl1" question="What does h3 look like?" questionAs="h3">
        <p>This question is rendered as an h3 — correct when under an h2 section heading.</p>
      </FAQItem>
      <FAQItem value="hl2" question="What about h4?" questionAs="h4">
        <p>h4 is available for deeper nesting contexts.</p>
      </FAQItem>
    </Accordion.Root>
  </div>
);

/* ─── Standalone (h2 question, no parent heading) ────────────────── */

export const Standalone: Story = () => (
  <div style={{ maxWidth: "40rem", padding: "var(--space-8)" }}>
    <Accordion.Root type="single" collapsible>
      <FAQItem value="s1" question="Is FAQItem accessible?" questionAs="h2">
        <p>
          Yes — Radix Accordion wires <code>aria-expanded</code>, <code>aria-controls</code>, and{" "}
          <code>role="region"</code> automatically. The question text is the trigger's accessible
          name.
        </p>
      </FAQItem>
    </Accordion.Root>
  </div>
);
