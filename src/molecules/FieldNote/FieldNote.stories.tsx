import type { Story, StoryDefault } from "@ladle/react";
import { Pull } from "../Pull/Pull";
import { FieldNote } from "./FieldNote";

export default {
  title: "Components / FieldNote",
} satisfies StoryDefault;

/** Default — body text only, no label.
 *  Verifies: <aside> root, <p class="body"> inside, 1px left rule,
 *  --space-3 inset, --space-6 margin-block, --fs-body size, --fg color. */
export const Default: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <FieldNote>
      In 2024 we ran the same prompt across three model families and saw consistent degradation
      after context exceeded 16k tokens.
    </FieldNote>
  </div>
);

/** WithLabel — label="Note" + body.
 *  Verifies: label element rendered above body, --fs-meta size,
 *  --fg-muted color, uppercase + tracked, --space-1 gap between label and body. */
export const WithLabel: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <FieldNote label="Note">
      In 2024 we ran the same prompt across three model families and saw consistent degradation
      after context exceeded 16k tokens.
    </FieldNote>
  </div>
);

/** CustomLabel — label="Caveat" — verifies label renders the provided string without modification. */
export const CustomLabel: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <FieldNote label="Caveat">
      These numbers reflect Q4 2023 benchmarks. The 2024 evals are in progress and results may
      differ.
    </FieldNote>
  </div>
);

/** WithInlineLink — body containing an <a href>.
 *  Verifies: link inherits global two-layer underline; focus ring renders
 *  on :focus-visible; no visual regression from global <a> rule inside <aside>. */
export const WithInlineLink: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <FieldNote label="Note">
      The latency figures come from our <a href="/methodology">public methodology doc</a>, updated
      monthly.
    </FieldNote>
  </div>
);

/** LongBody — a two-sentence body (~35 words).
 *  Verifies: max-width: var(--hero-max) constrains the block at wide viewports;
 *  line-height: 1.55 renders correctly at full measure. */
export const LongBody: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <FieldNote label="Data point">
      Most teams stop at the demo. The demo dazzles; the production loop never closes. The instinct
      to run another sprint of staging instead of shipping to a single real customer is the most
      expensive mistake in the AI pilot cycle.
    </FieldNote>
  </div>
);

/** AllVariants — three instances stacked: no label, label="Note", label="Aside" with inline link.
 *  Design-matrix story. */
export const AllVariants: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <FieldNote>
      In 2024 we ran the same prompt across three model families and saw consistent degradation
      after context exceeded 16k tokens.
    </FieldNote>
    <FieldNote label="Note">
      These numbers reflect Q4 2023 benchmarks. The 2024 evals are in progress and results may
      differ.
    </FieldNote>
    <FieldNote label="Aside">
      The latency figures come from our <a href="/methodology">public methodology doc</a>, updated
      monthly.
    </FieldNote>
  </div>
);

/** InProseRhythm — two prose paragraphs above FieldNote, two below.
 *  Verifies margin-block: --space-6 reads as natural breathing room in the article
 *  column without over-separating FieldNote from its context.
 *  Primary prose-fit test. */
export const InProseRhythm: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      maxWidth: "var(--hero-max)",
    }}
  >
    <p>
      Pilots fail because they are rehearsals. Every staging environment is a model of production,
      not production itself. The signal you need lives in real usage — in the edge cases users
      actually hit, in the latency of real infrastructure, in the behavior of real data.
    </p>
    <p>
      The team that spends three months hardening a demo is trading signal for comfort. They know
      the demo well. They do not know the product.
    </p>
    <FieldNote label="Note">
      In 2024 we ran the same prompt across three model families and saw consistent degradation
      after context exceeded 16k tokens.
    </FieldNote>
    <p>
      Ship the smallest real system. Instrument everything. Iterate on signal. This is not a
      philosophy — it is the only method that closes the loop.
    </p>
    <p>
      The gap between pilot and production is not a technical problem. It is a decision problem.
      Every week spent in staging is a week of not knowing what you are actually building.
    </p>
  </div>
);

/** AlongsidePull — a Pull followed by a FieldNote.
 *  Verifies the two components are visually distinct at a glance:
 *  3px vs 1px rule, 20–26px vs 17–19px type, serif-italic vs sans-roman. */
export const AlongsidePull: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      maxWidth: "var(--hero-max)",
    }}
  >
    <p>
      The signal you need lives in real usage — in the edge cases users actually hit, in the latency
      of real infrastructure, in the behavior of real data.
    </p>
    <Pull attribution="— from §3, Engineering culture">
      The smallest real deployment teaches more than six months of staging.
    </Pull>
    <p>Ship the smallest real system. Instrument everything. Iterate on signal.</p>
    <FieldNote label="Data point">
      In 2024 we ran the same prompt across three model families and saw consistent degradation
      after context exceeded 16k tokens.
    </FieldNote>
  </div>
);
