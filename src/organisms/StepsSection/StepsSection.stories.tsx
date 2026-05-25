import type { Story, StoryDefault } from "@ladle/react";
import { StepsSection } from "./StepsSection";

export default {
  title: "Organisms / StepsSection",
} satisfies StoryDefault;

const HOW_IT_WORKS_STEPS = [
  {
    label: "Share context",
    body: "Tell us where you are and where you want to go.",
  },
  {
    label: "We map the gap",
    body: "Arian diagnoses the delta between current state and target.",
  },
  {
    label: "Ship together",
    body: "Embedded pair programming until the loop is closed.",
  },
];

export const Default: Story = () => (
  <StepsSection heading="How it works" steps={HOW_IT_WORKS_STEPS} />
);
Default.storyName = "Default — heading + steps";

export const HowItWorks: Story = () => (
  <StepsSection
    eyebrow="01 · Process"
    heading="How it works"
    lede="Three steps from first conversation to shipped product."
    steps={HOW_IT_WORKS_STEPS}
  />
);
HowItWorks.storyName = "How it works — 3-step marketing composition";

export const Tight: Story = () => (
  <StepsSection
    heading="Our process"
    lede="How we work with every client."
    steps={HOW_IT_WORKS_STEPS}
    size="tight"
  />
);
Tight.storyName = "Tight — dense page embed";

export const MinimalSteps: Story = () => (
  <StepsSection
    heading="Simple process"
    steps={[{ label: "Discover" }, { label: "Design" }, { label: "Deliver" }]}
  />
);
MinimalSteps.storyName = "Minimal — labels only, no body copy";
