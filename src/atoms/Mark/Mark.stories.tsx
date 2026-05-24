import type { Story, StoryDefault } from "@ladle/react";
import { Mark, type MarkProps } from "./Mark";

export default {
  title: "Atoms / Mark",
  args: { children: "six months of staging" },
  argTypes: {
    children: { control: { type: "text" } },
  },
} satisfies StoryDefault;

/** Controls-driven sandbox. */
export const Default: Story<MarkProps> = (args) => <Mark {...args} />;

/** Mark embedded inside a long-form Prose-style body — verifies inheritance,
 *  editorial fit, and that the chip reads as a selected-prose run rather
 *  than a foreign sticker. */
export const InsideProse: Story = () => (
  <div
    style={{
      maxWidth: "36rem",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-body-relaxed)",
      color: "var(--fg)",
    }}
  >
    <p>
      The smallest real deployment teaches more than <Mark>six months of staging</Mark>. Most teams
      stop short of that because the demo dazzles and the production loop never closes.
    </p>
    <p>
      Ship the smallest real thing, then iterate. The work is in the <Mark>feedback loop</Mark>, not
      the prototype.
    </p>
  </div>
);

/** Mark inside a narrow paragraph that forces the highlight to wrap across
 *  a line break — verifies `box-decoration-break: clone` tiling. */
export const InsideParagraph: Story = () => (
  <p
    style={{
      maxWidth: "20rem",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-body)",
      color: "var(--fg)",
    }}
  >
    Pilots fail because they are rehearsals —{" "}
    <Mark>the smallest real deployment teaches more than six months of staging</Mark>, and that is
    where the work lives.
  </p>
);
