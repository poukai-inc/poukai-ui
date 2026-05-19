import type { Story, StoryDefault } from "@ladle/react";
import { Section } from "./Section";
import { Eyebrow } from "../../atoms/Eyebrow";

export default {
  title: "Components / Section",
} satisfies StoryDefault;

/** TitleOnly — bare minimum: single h2, no eyebrow, no lede, no children.
 *  Verifies the header block renders cleanly and block padding is present. */
export const TitleOnly: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-4)" }}>
    <Section title="The approach" />
  </div>
);

/** EyebrowTitleLede — string eyebrow (auto-wrapped in Eyebrow), title, string lede.
 *  Verifies string→Eyebrow wrapping, gap stack (8px / 16px), lede muted color. */
export const EyebrowTitleLede: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-4)" }}>
    <Section
      eyebrow="01 · Approach"
      title="The rules we ship by."
      lede="We work alongside founders and platform teams to close the gap between pilot and production."
    />
  </div>
);

/** FullComposition — ReactNode eyebrow pass-through, title, lede, children (lorem paragraph).
 *  Verifies ReactNode eyebrow renders as-is, header→children gap (48px), and that
 *  children inherit no Section styling. */
export const FullComposition: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-4)" }}>
    <Section
      eyebrow={
        <Eyebrow numeral="01" variant="numbered">
          Approach
        </Eyebrow>
      }
      title="The rules we ship by."
      lede="We work alongside founders and platform teams to close the gap between pilot and production."
    >
      <p style={{ margin: 0, color: "var(--fg)" }}>
        Pilots fail because they are rehearsals. The smallest real deployment teaches more than six
        months of staging. Ship early, instrument everything, iterate on signal.
      </p>
    </Section>
  </div>
);

/** TightVariant — both default and tight instances for direct comparison.
 *  Verifies reduced block padding (48px vs 64px). */
export const TightVariant: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-4)" }}>
    <div
      style={{
        outline: "1px dashed var(--hairline)",
        outlineOffset: "-1px",
        marginBottom: "var(--space-4)",
      }}
    >
      <p
        style={{
          margin: 0,
          padding: "var(--space-2) var(--space-4)",
          fontSize: "var(--fs-meta)",
          color: "var(--fg-muted)",
        }}
      >
        size="default" (64px padding)
      </p>
      <Section
        eyebrow="01 · Approach"
        title="The rules we ship by."
        lede="Supporting copy in the default register."
      />
    </div>
    <div style={{ outline: "1px dashed var(--hairline)", outlineOffset: "-1px" }}>
      <p
        style={{
          margin: 0,
          padding: "var(--space-2) var(--space-4)",
          fontSize: "var(--fs-meta)",
          color: "var(--fg-muted)",
        }}
      >
        size="tight" (48px padding)
      </p>
      <Section
        size="tight"
        eyebrow="01 · Approach"
        title="The rules we ship by."
        lede="Supporting copy in the tight register."
      />
    </div>
  </div>
);

/** PolymorphicArticle — as="article" root.
 *  Verifies the root element is article, SR landmark is article, styling identical. */
export const PolymorphicArticle: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-4)" }}>
    <Section
      as="article"
      title="Press mention"
      lede="An independently distributable content block rendered as article."
    >
      <p style={{ margin: 0, color: "var(--fg)" }}>
        Article body content that is independently distributable.
      </p>
    </Section>
  </div>
);

/** InsidePageComposition — three Sections stacked to verify section-to-section rhythm. */
export const InsidePageComposition: Story = () => (
  <div style={{ background: "var(--bg)" }}>
    <Section
      eyebrow="01 · Approach"
      title="The rules we ship by."
      lede="We work alongside founders and platform teams to close the gap between pilot and production."
    >
      <p style={{ margin: 0, color: "var(--fg)" }}>
        Pilots fail because they are rehearsals. Ship early, instrument everything, iterate on
        signal.
      </p>
    </Section>
    <Section
      eyebrow="02 · Roles"
      title="What we build together."
      lede="Every engagement starts with the smallest real system that proves the loop works."
    >
      <p style={{ margin: 0, color: "var(--fg)" }}>
        Builder. Advisor. Embedded engineer. The role is the engagement model.
      </p>
      <p style={{ marginTop: "var(--space-4)", color: "var(--fg)" }}>
        A second paragraph to add content mass and test rhythm at varied heights.
      </p>
    </Section>
    <Section
      eyebrow="03 · Why it matters"
      title="The gap between pilot and production."
      lede="Most teams stop at the demo. The demo dazzles; the production loop never closes."
    />
  </div>
);
