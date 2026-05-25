import type { Story, StoryDefault } from "@ladle/react";
import { PrincipleList } from "./PrincipleList";
import { Principle } from "../../molecules/Principle";

export default {
  title: "Organisms / PrincipleList",
} satisfies StoryDefault;

export const Default: Story = () => (
  <div style={{ maxWidth: "56rem", padding: "var(--space-8)" }}>
    <PrincipleList eyebrow="01 · Approach" heading="The rules we ship by.">
      <Principle numeral="i." title="Ship the smallest real thing.">
        <p>
          Pilots fail because they&apos;re rehearsals. Production is the only proving ground — find
          the smallest piece of the workflow that can run for real, and run it for real.
        </p>
      </Principle>
      <Principle numeral="ii." title="Senior, end-to-end, no handoff theatre.">
        <p>
          Every engagement is one or two senior engineers from intake through cutover. No PMs
          translating, no juniors carrying.
        </p>
      </Principle>
    </PrincipleList>
  </div>
);

export const FiveItems: Story = () => (
  <div style={{ maxWidth: "56rem", padding: "var(--space-8)" }}>
    <PrincipleList
      eyebrow="01 · Approach"
      heading="Five principles that define how we work."
      lede="These aren't aspirations — they're the constraints we've found make AI work land."
    >
      <Principle numeral="i." title="Ship the smallest real thing.">
        <p>Production is the only proving ground.</p>
      </Principle>
      <Principle numeral="ii." title="Senior, end-to-end, no handoff theatre.">
        <p>No PMs translating, no juniors carrying.</p>
      </Principle>
      <Principle numeral="iii." title="Evaluation is part of the system.">
        <p>If you can&apos;t measure the quality of an AI output, you can&apos;t ship it.</p>
      </Principle>
      <Principle numeral="iv." title="Own the boring parts.">
        <p>Data pipelines, auth, infra — the unsexy plumbing is where AI projects die.</p>
      </Principle>
      <Principle numeral="v." title="Cutover is the goal.">
        <p>Every engagement ends with a trained internal team, not a dependency on us.</p>
      </Principle>
    </PrincipleList>
  </div>
);

export const OurPrinciplesPage: Story = () => (
  <div style={{ maxWidth: "56rem", padding: "var(--space-8)" }}>
    <PrincipleList
      eyebrow="Principles"
      heading="Our principles."
      lede="The rules we return to when a decision is hard."
      size="default"
    >
      <Principle numeral="i." title="Ship the smallest real thing.">
        <p>
          Pilots fail because they&apos;re rehearsals. Production is the only proving ground — find
          the smallest piece of the workflow that can run for real, and run it for real.
        </p>
      </Principle>
      <Principle numeral="ii." title="Senior, end-to-end, no handoff theatre.">
        <p>
          Every engagement is one or two senior engineers from intake through cutover. No PMs
          translating, no juniors carrying.
        </p>
      </Principle>
      <Principle numeral="iii." title="Evaluation is part of the system.">
        <p>
          If you can&apos;t measure the quality of an AI output, you can&apos;t ship it. Evals are
          infrastructure, not analytics.
        </p>
      </Principle>
    </PrincipleList>
  </div>
);
