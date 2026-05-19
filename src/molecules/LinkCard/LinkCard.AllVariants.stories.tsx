import type { Story, StoryDefault } from "@ladle/react";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "../../atoms/Eyebrow";
import { LinkCard } from "./LinkCard";

export default {
  title: "Components / Cards / LinkCard / All Variants",
} satisfies StoryDefault;

/** AllVariants — both variants side by side with full slots.
 *  The canonical design-matrix story. */
export const AllVariants: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-8)",
      maxWidth: "56rem",
    }}
  >
    <div>
      <p
        style={{
          margin: "0 0 var(--space-4)",
          fontSize: "var(--fs-meta)",
          color: "var(--fg-muted)",
        }}
      >
        variant="default"
      </p>
      <LinkCard
        href="/work/case"
        eyebrow="Design"
        title="Redesigning the onboarding flow"
        body="A three-month engagement that cut time-to-value by 40%."
        footer="Read more →"
      />
    </div>
    <div>
      <p
        style={{
          margin: "0 0 var(--space-4)",
          fontSize: "var(--fs-meta)",
          color: "var(--fg-muted)",
        }}
      >
        variant="quiet"
      </p>
      <LinkCard
        href="/posts/1"
        variant="quiet"
        eyebrow="Engineering"
        title="On shipping in small increments"
        body="Pilots fail because they are rehearsals."
        footer="Jan 2026"
      />
    </div>
  </div>
);

/** ThreeColumnGrid — three default LinkCards with varying body lengths.
 *  Verifies footer alignment: all footers reach the same baseline across a row.
 *  Uses CSS Grid align-items: stretch + height: 100% on cards. */
export const ThreeColumnGrid: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8)",
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "var(--space-6)",
        alignItems: "stretch",
      }}
    >
      <LinkCard
        href="/work/case-1"
        eyebrow="Design"
        title="Redesigning the onboarding flow"
        body="A three-month engagement that cut time-to-value by 40%. From research to shipped product in one quarter."
        footer="Read more →"
        style={{ height: "100%" }}
      />
      <LinkCard
        href="/work/case-2"
        eyebrow="Engineering"
        title="Rebuilding the data pipeline"
        body="Short body copy."
        footer="Read more →"
        style={{ height: "100%" }}
      />
      <LinkCard
        href="/work/case-3"
        eyebrow="AI"
        title="Production ML loop"
        body="Most teams stop at the demo. The demo dazzles; the production loop never closes. The instinct to run another sprint of staging instead of shipping to a single real customer is the most expensive mistake in the AI pilot cycle."
        footer="Read more →"
        style={{ height: "100%" }}
      />
    </div>
  </div>
);

/** QuietList — five quiet LinkCards stacked vertically.
 *  Verifies density rhythm: hairline dividers, block padding vertical intervals. */
export const QuietList: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8)",
      maxWidth: "36rem",
    }}
  >
    {[
      {
        href: "/posts/1",
        eyebrow: "Engineering",
        title: "Ship the smallest real thing",
        footer: "12 Jan 2026",
      },
      {
        href: "/posts/2",
        eyebrow: "Design",
        title: "Reducing cognitive load in dashboards",
        footer: "28 Feb 2026",
      },
      {
        href: "/posts/3",
        eyebrow: "AI",
        title: "The RAG plateau and how to get past it",
        footer: "5 Mar 2026",
      },
      {
        href: "/posts/4",
        eyebrow: "Process",
        title: "Why pilots fail in production",
        footer: "18 Mar 2026",
      },
      {
        href: "/posts/5",
        eyebrow: "Engineering",
        title: "Instrumentation as a first-class concern",
        footer: "2 Apr 2026",
      },
    ].map((item) => (
      <LinkCard key={item.href} variant="quiet" {...item} />
    ))}
  </div>
);

/** EyebrowNodeForm — ReactNode eyebrow pass-through.
 *  Verifies: ReactNode eyebrow renders as-is without a second Eyebrow wrapper. */
export const EyebrowNodeForm: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8)", maxWidth: "28rem" }}>
    <LinkCard
      href="/work/case"
      eyebrow={<Eyebrow variant="solid">Design</Eyebrow>}
      title="ReactNode eyebrow — solid variant"
      body="The eyebrow above is a ReactNode (<Eyebrow variant='solid'>) passed directly, not auto-wrapped."
    />
  </div>
);

/** TitleH2Override — titleAs="h2" + full slots.
 *  Verifies the title renders as <h2> for heading hierarchy contexts where
 *  no preceding <h2> exists. */
export const TitleH2Override: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8)", maxWidth: "28rem" }}>
    <p
      style={{
        margin: "0 0 var(--space-4)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
      }}
    >
      titleAs="h2" — inspect DOM to verify &lt;h2&gt; root for title.
    </p>
    <LinkCard
      href="/work/case"
      titleAs="h2"
      eyebrow="Context"
      title="This title renders as h2"
      body="Override for pages where no preceding h2 exists in the section."
      footer="Read more →"
    />
  </div>
);

/** ExternalWithIcon — external variant with ArrowUpRight for design review. */
export const ExternalWithIcon: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8)", maxWidth: "28rem" }}>
    <LinkCard
      href="https://anthropic.com"
      external
      icon={<ArrowUpRight size={16} />}
      eyebrow="External"
      title="Anthropic"
      body="Opens in a new tab. ArrowUpRight icon at top-right signals external destination."
      footer="anthropic.com"
    />
  </div>
);
