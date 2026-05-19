import type { Story, StoryDefault } from "@ladle/react";
import { Section } from "./Section";
import { Eyebrow } from "../../atoms/Eyebrow";

export default {
  title: "Components / Section (All Variants)",
} satisfies StoryDefault;

/** AllVariants — both size variants stacked with full slots (eyebrow + title + lede + children).
 *  Canonical design-matrix story. */
export const AllVariants: Story = () => (
  <div style={{ background: "var(--bg)" }}>
    <p
      style={{
        margin: 0,
        padding: "var(--space-2) var(--space-4)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
        borderBottom: "var(--hairline-w) solid var(--hairline)",
      }}
    >
      size="default"
    </p>
    <Section
      eyebrow="01 · Approach"
      title="The rules we ship by."
      lede="We work alongside founders and platform teams to close the gap between pilot and production."
    >
      <p style={{ margin: 0, color: "var(--fg)" }}>
        Section body content. No max-width applied by Section. Consumer controls layout.
      </p>
    </Section>

    <hr
      style={{
        margin: 0,
        border: "none",
        borderTop: "var(--hairline-w) solid var(--hairline)",
      }}
    />

    <p
      style={{
        margin: 0,
        padding: "var(--space-2) var(--space-4)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
        borderBottom: "var(--hairline-w) solid var(--hairline)",
      }}
    >
      size="tight"
    </p>
    <Section
      size="tight"
      eyebrow="01 · Approach"
      title="The rules we ship by."
      lede="We work alongside founders and platform teams to close the gap between pilot and production."
    >
      <p style={{ margin: 0, color: "var(--fg)" }}>
        Section body content. No max-width applied by Section. Consumer controls layout.
      </p>
    </Section>
  </div>
);

/** SectionToSectionRhythm — three Sections in sequence with varied content heights.
 *  Primary smoke test for the component's core raison d'etre. */
export const SectionToSectionRhythm: Story = () => (
  <div style={{ background: "var(--bg)" }}>
    <Section
      eyebrow="01 · Approach"
      title="The rules we ship by."
      lede="We work alongside founders and platform teams to close the gap between pilot and production."
    >
      <p style={{ margin: 0, color: "var(--fg)" }}>Short body — one paragraph.</p>
    </Section>

    <Section
      eyebrow="02 · Roles"
      title="What we build together."
      lede="Every engagement starts with the smallest real system that proves the loop works."
    >
      <p style={{ margin: 0, color: "var(--fg)" }}>
        Longer body with multiple paragraphs to stress the rhythm at varied content mass.
      </p>
      <p style={{ marginTop: "var(--space-4)", color: "var(--fg)" }}>
        Builder. Advisor. Embedded engineer. The role is the engagement model that makes the
        difference between a demo and a production system.
      </p>
      <p style={{ marginTop: "var(--space-4)", color: "var(--fg)" }}>
        A third paragraph to further increase content height and verify the section-to-section
        spacing reads as coherent vertical rhythm regardless of content mass.
      </p>
    </Section>

    <Section
      eyebrow="03 · Why it matters"
      title="The gap between pilot and production."
      lede="Most teams stop at the demo. The demo dazzles; the production loop never closes."
    />
  </div>
);

/** TitleH1Override — titleAs="h1" with full slots.
 *  Verifies the heading element is h1 and typography matches the page-top use case. */
export const TitleH1Override: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-4)" }}>
    <Section
      eyebrow={
        <Eyebrow numeral="01" variant="numbered">
          Approach
        </Eyebrow>
      }
      titleAs="h1"
      title="The rules we ship by."
      lede="Supporting copy — this is the h1 use case when Section sits at the top of a page without a Hero."
    >
      <p style={{ margin: 0, color: "var(--fg)" }}>Section body content.</p>
    </Section>
  </div>
);

/** NoTitleWarning — as="section" with no title prop.
 *  Verifies no heading element is emitted and axe-core does not error
 *  (unlabeled section degrades gracefully to a generic container). */
export const NoTitleWarning: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-4)" }}>
    <p
      style={{
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
        margin: "0 0 var(--space-4)",
      }}
    >
      Section with no title — no aria-labelledby, no heading emitted. The section element has no
      accessible name and is not exposed as a region landmark.
    </p>
    <Section lede="A lede without a title. The header block still renders because lede is present.">
      <p style={{ margin: 0, color: "var(--fg)" }}>Body content.</p>
    </Section>
  </div>
);
