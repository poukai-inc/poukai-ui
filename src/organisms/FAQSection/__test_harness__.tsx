/**
 * Test harness wrappers for FAQSection CT tests.
 * Playwright CT forbids inline component definitions in test files.
 */
import { FAQSection } from "./FAQSection";
import { FAQItem } from "../../molecules/FAQItem";

/* ─── Basic FAQ section ──────────────────────────────────────────── */

export function BasicFAQSection() {
  return (
    <FAQSection eyebrow="FAQ" title="Frequently asked questions">
      <FAQItem value="q1" question="What is Poukai?">
        <p data-testid="answer-q1">A senior-only AI consulting practice.</p>
      </FAQItem>
      <FAQItem value="q2" question="Who do you work with?">
        <p data-testid="answer-q2">Founders and platform teams.</p>
      </FAQItem>
    </FAQSection>
  );
}

/* ─── With lede ──────────────────────────────────────────────────── */

export function FAQSectionWithLede() {
  return (
    <FAQSection title="Frequently asked questions" lede="Everything you need to know.">
      <FAQItem value="q1" question="What is Poukai?">
        <p data-testid="answer-lede-q1">A senior-only AI consulting practice.</p>
      </FAQItem>
    </FAQSection>
  );
}

/* ─── Default open ───────────────────────────────────────────────── */

export function FAQSectionDefaultOpen() {
  return (
    <FAQSection title="Frequently asked questions" defaultValue="open-q">
      <FAQItem value="open-q" question="Open by default">
        <p data-testid="default-open-answer">This answer is visible on mount.</p>
      </FAQItem>
      <FAQItem value="closed-q" question="Closed by default">
        <p data-testid="default-closed-answer">This answer is hidden on mount.</p>
      </FAQItem>
    </FAQSection>
  );
}

/* ─── Multiple type ──────────────────────────────────────────────── */

export function FAQSectionMultiple() {
  return (
    <FAQSection title="FAQ" type="multiple" defaultValue={["ma", "mb"]}>
      <FAQItem value="ma" question="Alpha question">
        <p data-testid="answer-ma">Alpha answer.</p>
      </FAQItem>
      <FAQItem value="mb" question="Beta question">
        <p data-testid="answer-mb">Beta answer.</p>
      </FAQItem>
    </FAQSection>
  );
}

/* ─── Tight size ─────────────────────────────────────────────────── */

export function FAQSectionTight() {
  return (
    <FAQSection title="FAQ" size="tight">
      <FAQItem value="q1" question="Tight question">
        <p>Tight answer.</p>
      </FAQItem>
    </FAQSection>
  );
}

/* ─── className / data-* forwarding ─────────────────────────────── */

export function ForwardingFAQSection() {
  return (
    <FAQSection title="FAQ" className="custom-faqsection" data-testid="faqsection-root">
      <FAQItem value="q1" question="Forward props question">
        <p>Forwarded content.</p>
      </FAQItem>
    </FAQSection>
  );
}
