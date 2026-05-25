/**
 * Test harness wrappers for FAQItem CT tests.
 * Playwright CT forbids inline component definitions in test files.
 */
import { Accordion } from "../Accordion";
import { FAQItem } from "./FAQItem";

/* ─── Basic FAQ list ─────────────────────────────────────────────── */

export function BasicFAQ() {
  return (
    <Accordion.Root type="single" collapsible>
      <FAQItem value="q1" question="What is Poukai?">
        <p data-testid="answer-q1">A senior-only AI consulting practice.</p>
      </FAQItem>
      <FAQItem value="q2" question="Who do you work with?">
        <p data-testid="answer-q2">Founders and platform teams.</p>
      </FAQItem>
    </Accordion.Root>
  );
}

/* ─── Default open ───────────────────────────────────────────────── */

export function FAQDefaultOpen() {
  return (
    <Accordion.Root type="single" collapsible defaultValue="open-q">
      <FAQItem value="open-q" question="Open by default">
        <p data-testid="default-open-answer">This answer is visible on mount.</p>
      </FAQItem>
      <FAQItem value="closed-q" question="Closed by default">
        <p data-testid="default-closed-answer">This answer is hidden on mount.</p>
      </FAQItem>
    </Accordion.Root>
  );
}

/* ─── Multiple open ──────────────────────────────────────────────── */

export function MultipleOpenFAQ() {
  return (
    <Accordion.Root type="multiple" defaultValue={["ma", "mb"]}>
      <FAQItem value="ma" question="Alpha question">
        <p data-testid="answer-ma">Alpha answer.</p>
      </FAQItem>
      <FAQItem value="mb" question="Beta question">
        <p data-testid="answer-mb">Beta answer.</p>
      </FAQItem>
    </Accordion.Root>
  );
}

/* ─── Custom heading level ───────────────────────────────────────── */

export function FAQWithH2() {
  return (
    <Accordion.Root type="single" collapsible>
      <FAQItem value="h2q" question="H2 question" questionAs="h2">
        <p>Answer under h2 question.</p>
      </FAQItem>
    </Accordion.Root>
  );
}

export function FAQWithH4() {
  return (
    <Accordion.Root type="single" collapsible>
      <FAQItem value="h4q" question="H4 question" questionAs="h4">
        <p>Answer under h4 question.</p>
      </FAQItem>
    </Accordion.Root>
  );
}

/* ─── className / data-* forwarding ─────────────────────────────── */

export function ForwardingFAQItem() {
  return (
    <Accordion.Root type="single" collapsible>
      <FAQItem
        value="fwd"
        question="Forward props question"
        className="custom-faqitem"
        data-testid="faq-item-root"
      >
        <p>Forwarded content.</p>
      </FAQItem>
    </Accordion.Root>
  );
}
