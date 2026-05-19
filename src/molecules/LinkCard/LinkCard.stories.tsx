import type { Story, StoryDefault } from "@ladle/react";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "../../atoms/Eyebrow";
import { LinkCard } from "./LinkCard";

export default {
  title: "Components / Cards / LinkCard",
} satisfies StoryDefault;

/** Default — full slots: eyebrow (string) + title + body + footer.
 *  Verifies: card surface (--surface), border (--hairline), --space-8 padding,
 *  gap stack (eyebrow → title → body → footer push). */
export const Default: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8)", maxWidth: "28rem" }}>
    <LinkCard
      href="/work/redesign"
      eyebrow="Design"
      title="Redesigning the onboarding flow"
      body="A three-month engagement that cut time-to-value by 40%. From research to shipped product."
      footer="Read more →"
    />
  </div>
);

/** TitleOnly — `title` only, no eyebrow / body / footer.
 *  Verifies the component renders without optional slots and padding reads
 *  correctly with minimal content. */
export const TitleOnly: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8)", maxWidth: "28rem" }}>
    <LinkCard href="/work/project" title="Minimal card — title only" />
  </div>
);

/** ExternalLink — external prop + ArrowUpRight icon + title + body.
 *  Verifies: target="_blank", rel="noopener noreferrer", visually-hidden
 *  "(opens in new tab)" in DOM, icon positioned top-right. */
export const ExternalLink: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8)", maxWidth: "28rem" }}>
    <LinkCard
      href="https://example.com/resource"
      external
      icon={<ArrowUpRight size={16} />}
      eyebrow="Resource"
      title="External resource"
      body="Opens in a new tab. The visually-hidden '(opens in new tab)' span is in the DOM for screen readers."
    />
  </div>
);

/** QuietVariant — variant="quiet" + full slots.
 *  Verifies: no border box, hairline rule top only, no radius, inline padding collapsed. */
export const QuietVariant: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8)", maxWidth: "28rem" }}>
    <LinkCard
      href="/posts/1"
      variant="quiet"
      eyebrow="Engineering"
      title="On shipping in small increments"
      body="Pilots fail because they are rehearsals. Ship the smallest real thing."
      footer="Jan 2026"
    />
  </div>
);

/** HoverState — default variant wrapped for visual inspection.
 *  Note: Ladle does not have a pseudo-states addon; inspect via browser DevTools
 *  by toggling :hover on the element. Expected: border-color → --accent. */
export const HoverState: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8)", maxWidth: "28rem" }}>
    <p
      style={{
        margin: "0 0 var(--space-4)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
      }}
    >
      Hover the card below — border shifts to --accent (#0071E3).
    </p>
    <LinkCard
      href="/work/project"
      eyebrow="Design"
      title="Hover state verification"
      body="Border-color transition: --hairline → --accent over --dur-mid (240ms) at --easing-link."
    />
  </div>
);

/** FocusState — default variant for focus-ring inspection.
 *  Tab to this card or use DevTools :focus-visible to verify: outline 2px solid
 *  --accent, offset 4px, border-radius --radius-3 matching the card shape. */
export const FocusState: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8)", maxWidth: "28rem" }}>
    <p
      style={{
        margin: "0 0 var(--space-4)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
      }}
    >
      Tab to or use DevTools :focus-visible on the card below.
    </p>
    <LinkCard
      href="/work/project"
      eyebrow="Accessibility"
      title="Focus ring verification"
      body="Outline: 2px solid --accent. Offset: 4px. Radius: --radius-3 (8px)."
    />
  </div>
);

/** AsChildRouterStub — asChild + plain `<a href="#">` as the child.
 *  Verifies: child element is root (no double-<a>), all card styles applied.
 *
 *  NESTED INTERACTIVITY CONSTRAINT: Do not put interactive elements (<button>,
 *  <a>) inside a LinkCard's content slots. The entire card surface is one click
 *  target — nested interactivity is a WCAG failure. asChild is the correct
 *  pattern for framework router Links (Next.js, Astro, React Router). */
export const AsChildRouterStub: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8)", maxWidth: "28rem" }}>
    <p
      style={{
        margin: "0 0 var(--space-4)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
      }}
    >
      The root element below is the child &lt;a&gt;, not an outer &lt;a&gt; wrapping it. Inspect the
      DOM to confirm no double-anchor nesting.
    </p>
    <LinkCard
      asChild
      eyebrow="Architecture"
      title="asChild router stub"
      body="In production: replace the stub <a> with Next.js <Link href='/work/case'> or equivalent."
    >
      <a href="#">{/* Slot receives all LinkCard styling; child <a> is the root */}</a>
    </LinkCard>
  </div>
);
