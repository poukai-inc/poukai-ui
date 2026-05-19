import type { Story, StoryDefault } from "@ladle/react";
import { Pull } from "../Pull/Pull";
import { Quote } from "./Quote";

export default {
  title: "Components / Quote",
} satisfies StoryDefault;

/** Default — full Quote: quote body, name, role, and avatar (img).
 *  Verifies: <figure> root, <blockquote> inside, <figcaption> with attribution row,
 *  hairline rule above figcaption, all token values, flex layout. */
export const Default: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Quote
      quote="We went from weeks to hours. The tooling handled what we used to staff an entire team for."
      name="Sarah Chen"
      role="VP Engineering, Meridian Labs"
      avatar={
        <img
          src="https://picsum.photos/seed/sarah-chen/40/40"
          alt=""
          width={40}
          height={40}
          style={{ borderRadius: "50%", display: "block" }}
        />
      }
    />
  </div>
);

/** NoAvatar — quote, name, role; no avatar slot.
 *  Verifies: attribution row without avatar, name+role column layout,
 *  gap collapses correctly when avatarSlot wrapper is absent. */
export const NoAvatar: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Quote
      quote="The accuracy improvements were immediate and measurable. We rolled it out to the full team within a week."
      name="James Okonkwo"
      role="Head of Data, Fieldwork AI"
    />
  </div>
);

/** NoRole — quote, name, avatar; no role.
 *  Verifies: role element is not rendered; name-only attribution row is correct. */
export const NoRole: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Quote
      quote="Exactly what we needed. Nothing we didn't."
      name="Priya Mehta"
      avatar={
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "var(--fs-meta)",
            color: "var(--fg-muted)",
          }}
        >
          PM
        </div>
      }
    />
  </div>
);

/** NameOnly — quote and name only; no role, no avatar.
 *  Verifies: minimal attribution — name alone in figcaption. */
export const NameOnly: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Quote quote="The feedback loop closed in days, not quarters." name="Tomás Rivera" />
  </div>
);

/** WithInitials — avatar slot using a <div> with initials (no <img>).
 *  Verifies: slot accepts arbitrary ReactNode; no DS-level avatar constraint. */
export const WithInitials: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Quote
      quote="We had tried three other vendors. This was the first one that actually shipped."
      name="Dana Kim"
      role="CTO, Apex Systems"
      avatar={
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "var(--fs-meta)",
            fontFamily: "var(--font-sans)",
            color: "var(--fg-muted)",
            flexShrink: 0,
          }}
        >
          DK
        </div>
      }
    />
  </div>
);

/** LongQuote — a 3–4 sentence body (~60 words).
 *  Verifies: max-width: var(--hero-max) constrains the block at wide viewports;
 *  line-height: 1.45 reads correctly at full measure; attribution row does not wrap. */
export const LongQuote: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Quote
      quote="Before we engaged, our pipeline was running at 40% accuracy on edge-case extraction. Within the first sprint we were at 78%. By the end of the engagement we hit 91%. I've never seen a team move that fast without cutting corners on the quality of the underlying work."
      name="Aisha Brennan"
      role="Director of AI Strategy, Northgate Group"
      avatar={
        <img
          src="https://picsum.photos/seed/aisha-brennan/40/40"
          alt=""
          width={40}
          height={40}
          style={{ borderRadius: "50%", display: "block" }}
        />
      }
    />
  </div>
);

/** InlineEmphasis — quote contains <em> inline.
 *  Verifies: inline ReactNode renders correctly inside <blockquote>;
 *  no layout shift; italic em reads within the roman body. */
export const InlineEmphasis: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Quote
      quote={
        <>
          We went from <em>weeks</em> to hours. The tooling handled what we used to staff an entire
          team for.
        </>
      }
      name="Sarah Chen"
      role="VP Engineering, Meridian Labs"
    />
  </div>
);

/** AllVariants — four Quotes stacked: full, no avatar, no role, name only.
 *  Design-matrix story. */
export const AllVariants: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Quote
      quote="We went from weeks to hours. The tooling handled what we used to staff an entire team for."
      name="Sarah Chen"
      role="VP Engineering, Meridian Labs"
      avatar={
        <img
          src="https://picsum.photos/seed/sarah-chen/40/40"
          alt=""
          width={40}
          height={40}
          style={{ borderRadius: "50%", display: "block" }}
        />
      }
    />
    <Quote
      quote="The accuracy improvements were immediate and measurable. We rolled it out to the full team within a week."
      name="James Okonkwo"
      role="Head of Data, Fieldwork AI"
    />
    <Quote
      quote="Exactly what we needed. Nothing we didn't."
      name="Priya Mehta"
      avatar={
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "var(--fs-meta)",
            color: "var(--fg-muted)",
          }}
        >
          PM
        </div>
      }
    />
    <Quote quote="The feedback loop closed in days, not quarters." name="Tomás Rivera" />
  </div>
);

/** InSectionRhythm — prose paragraphs + Quote + more prose.
 *  Verifies margin-block: --space-8 reads correctly and Quote does not
 *  disrupt the prose column. */
export const InSectionRhythm: Story = () => (
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
    <Quote
      quote="We went from weeks to hours. The tooling handled what we used to staff an entire team for."
      name="Sarah Chen"
      role="VP Engineering, Meridian Labs"
    />
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

/** AlongsidePull — a Pull followed by a Quote.
 *  Verifies they are visually distinct at a glance: serif italic vs. sans roman,
 *  left rule vs. hairline top-border, editorial vs. testimonial register. */
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
    <Quote
      quote="We went from weeks to hours. The tooling handled what we used to staff an entire team for."
      name="Sarah Chen"
      role="VP Engineering, Meridian Labs"
      avatar={
        <img
          src="https://picsum.photos/seed/sarah-chen/40/40"
          alt=""
          width={40}
          height={40}
          style={{ borderRadius: "50%", display: "block" }}
        />
      }
    />
  </div>
);
