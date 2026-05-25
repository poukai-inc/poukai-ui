import type { Story, StoryDefault } from "@ladle/react";
import { FAQSection } from "./FAQSection";
import { FAQItem } from "../../molecules/FAQItem";

export default {
  title: "Organisms / FAQSection",
} satisfies StoryDefault;

/* ─── Default (single, collapsible) ─────────────────────────────── */

export const Default: Story = () => (
  <FAQSection eyebrow="FAQ" title="Frequently asked questions">
    <FAQItem value="q1" question="What is Poukai?">
      <p>
        Poukai is a senior-only AI consulting practice that ships production systems end-to-end.
      </p>
    </FAQItem>
    <FAQItem value="q2" question="Who do you work with?">
      <p>
        We work alongside founders and platform teams to close the gap between pilot and production.
      </p>
    </FAQItem>
    <FAQItem value="q3" question="How do engagements work?">
      <p>Engagements are scoped, time-boxed, and focused on a specific production outcome.</p>
    </FAQItem>
  </FAQSection>
);

/* ─── With lede ──────────────────────────────────────────────────── */

export const WithLede: Story = () => (
  <FAQSection
    eyebrow="FAQ"
    title="Frequently asked questions"
    lede="Everything you need to know about working with Poukai."
  >
    <FAQItem value="q1" question="What is Poukai?">
      <p>
        Poukai is a senior-only AI consulting practice that ships production systems end-to-end.
      </p>
    </FAQItem>
    <FAQItem value="q2" question="Who do you work with?">
      <p>
        We work alongside founders and platform teams to close the gap between pilot and production.
      </p>
    </FAQItem>
  </FAQSection>
);

/* ─── Default open ───────────────────────────────────────────────── */

export const DefaultOpen: Story = () => (
  <FAQSection title="Frequently asked questions" defaultValue="q1">
    <FAQItem value="q1" question="What is Poukai?">
      <p>
        Poukai is a senior-only AI consulting practice that ships production systems end-to-end.
      </p>
    </FAQItem>
    <FAQItem value="q2" question="Who do you work with?">
      <p>
        We work alongside founders and platform teams to close the gap between pilot and production.
      </p>
    </FAQItem>
  </FAQSection>
);

/* ─── Multiple open ──────────────────────────────────────────────── */

export const Multiple: Story = () => (
  <FAQSection title="Frequently asked questions" type="multiple" defaultValue={["q1", "q2"]}>
    <FAQItem value="q1" question="Do you take on long-term retainers?">
      <p>
        Yes — some engagements evolve into ongoing advisory relationships after the initial build
        phase.
      </p>
    </FAQItem>
    <FAQItem value="q2" question="What industries do you work in?">
      <p>
        Primarily B2B SaaS, fintech, and professional services — wherever production AI creates
        meaningful leverage on existing workflows.
      </p>
    </FAQItem>
    <FAQItem value="q3" question="Is there a minimum engagement size?">
      <p>We typically engage for a minimum of four weeks to ensure meaningful outcomes.</p>
    </FAQItem>
  </FAQSection>
);

/* ─── Tight size ─────────────────────────────────────────────────── */

export const Tight: Story = () => (
  <FAQSection eyebrow="FAQ" title="Frequently asked questions" size="tight">
    <FAQItem value="q1" question="What is Poukai?">
      <p>A senior-only AI consulting practice.</p>
    </FAQItem>
    <FAQItem value="q2" question="Who do you work with?">
      <p>Founders and platform teams.</p>
    </FAQItem>
  </FAQSection>
);

/* ─── No eyebrow ─────────────────────────────────────────────────── */

export const NoEyebrow: Story = () => (
  <FAQSection title="Questions & answers">
    <FAQItem value="q1" question="What is Poukai?">
      <p>A senior-only AI consulting practice.</p>
    </FAQItem>
    <FAQItem value="q2" question="Who do you work with?">
      <p>Founders and platform teams.</p>
    </FAQItem>
  </FAQSection>
);
