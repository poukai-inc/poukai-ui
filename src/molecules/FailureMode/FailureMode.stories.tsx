import type { Story, StoryDefault } from "@ladle/react";
import { FailureMode } from "./FailureMode";

export default {
  title: "Components / FailureMode",
} satisfies StoryDefault;

export const Playground: Story = () => (
  <div style={{ maxWidth: "56rem", padding: "var(--space-8)" }}>
    <FailureMode index={1} title="The chatbot-on-top-of-RAG plateau.">
      <p>
        Most teams stop here. The demo dazzles; the production loop never
        closes; quality degrades silently and nobody has the eval harness to
        see it.
      </p>
    </FailureMode>
  </div>
);

export const FiveInARow: Story = () => {
  const modes = [
    {
      title: "The chatbot-on-top-of-RAG plateau.",
      body: "The demo dazzles; the production loop never closes.",
    },
    {
      title: "Eval theatre.",
      body: "Vibes-based evaluation. Spreadsheets that nobody updates.",
    },
    {
      title: "The agent that ships nothing.",
      body: "Loops forever, calls every tool, returns plausible-sounding nonsense.",
    },
    {
      title: "Prompt brittleness.",
      body: "A single capitalisation change breaks the pipeline silently.",
    },
    {
      title: "Capability drift.",
      body: "The model gets updated, the system regresses, nobody notices for weeks.",
    },
  ];
  return (
    <div style={{ maxWidth: "56rem", padding: "var(--space-8)" }}>
      {modes.map((m, i) => (
        <FailureMode key={m.title} index={i + 1} title={m.title}>
          <p>{m.body}</p>
        </FailureMode>
      ))}
    </div>
  );
};

export const CustomIndexLabel: Story = () => (
  <div style={{ maxWidth: "56rem", padding: "var(--space-8)" }}>
    <FailureMode index={1} indexLabel="A1" title="Custom labels.">
      <p>
        Pass <code>indexLabel</code> to render <code>"A1"</code>,{" "}
        <code>"§ 1"</code>, or any custom format. <code>index</code> stays a
        number so consumers can keep ordering logic clean.
      </p>
    </FailureMode>
  </div>
);
