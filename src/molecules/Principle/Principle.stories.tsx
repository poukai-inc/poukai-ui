import type { Story, StoryDefault } from "@ladle/react";
import { Principle } from "./Principle";

export default {
  title: "Components / Principle",
} satisfies StoryDefault;

export const Playground: Story = () => (
  <div style={{ maxWidth: "56rem", padding: "var(--space-8)" }}>
    <Principle numeral="i." title="Ship the smallest real thing.">
      <p>
        Pilots fail because they're rehearsals. Production is the only proving ground — find the
        smallest piece of the workflow that can run for real, and run it for real.
      </p>
    </Principle>
  </div>
);

export const ThreeInARow: Story = () => {
  const principles = [
    {
      numeral: "i.",
      title: "Ship the smallest real thing.",
      body: "Pilots fail because they're rehearsals. Production is the only proving ground.",
    },
    {
      numeral: "ii.",
      title: "Senior, end-to-end, no handoff theatre.",
      body: "Every engagement is one or two senior engineers from intake through cutover. No PMs translating, no juniors carrying.",
    },
    {
      numeral: "iii.",
      title: "Evaluation is part of the system.",
      body: "If you can't measure the quality of an AI output, you can't ship it. Evals are infrastructure, not analytics.",
    },
  ];
  return (
    <div style={{ maxWidth: "56rem", padding: "var(--space-8)" }}>
      {principles.map((p) => (
        <Principle key={p.numeral} numeral={p.numeral} title={p.title}>
          <p>{p.body}</p>
        </Principle>
      ))}
    </div>
  );
};

export const WithListBody: Story = () => (
  <div style={{ maxWidth: "56rem", padding: "var(--space-8)" }}>
    <Principle numeral="iv." title="What we won't take on.">
      <p>Some engagements aren't a fit. Common ones:</p>
      <ul>
        <li>Pure strategy decks without an implementation path.</li>
        <li>Chatbot-on-top-of-RAG with no eval plan.</li>
        <li>Team augmentation where we'd be reporting to a PM.</li>
      </ul>
    </Principle>
  </div>
);

export const ArabicNumerals: Story = () => (
  <div style={{ maxWidth: "56rem", padding: "var(--space-8)" }}>
    <Principle numeral="01." title="Free-form numerals.">
      <p>
        The <code>numeral</code> prop is free-form — pass <code>"i."</code>, <code>"01."</code>,{" "}
        <code>"§ 1"</code>, whatever the surface calls for.
      </p>
    </Principle>
    <Principle numeral="02." title="No prop explosion.">
      <p>One string keeps the API tiny and the surface flexible.</p>
    </Principle>
  </div>
);
