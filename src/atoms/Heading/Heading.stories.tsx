import type { Story, StoryDefault } from "@ladle/react";
import { Heading, type HeadingLevel } from "./Heading";

const LEVELS: HeadingLevel[] = ["h1", "h2", "h3", "h4", "h5", "h6"];

export default {
  title: "Components / Heading",
  args: { as: "h2", size: "h2", children: "Why we build" },
  argTypes: {
    as: {
      options: LEVELS satisfies HeadingLevel[],
      control: { type: "radio" },
      defaultValue: "h2",
    },
    size: {
      options: LEVELS satisfies HeadingLevel[],
      control: { type: "radio" },
      defaultValue: "h2",
    },
  },
} satisfies StoryDefault;

/** Playground — toggle `as` and `size` independently. */
export const Playground: Story<{
  as: HeadingLevel;
  size: HeadingLevel;
  children: string;
}> = ({ as, size, children }) => (
  <Heading as={as} size={size}>
    {children}
  </Heading>
);

/**
 * Full ramp — each rung at its canonical visual rank. `as` mirrors `size`,
 * which is the common case.
 */
export const Ramp: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
    {LEVELS.map((level) => (
      <Heading key={level} as={level} size={level}>
        {level.toUpperCase()} — The platform for working agents.
      </Heading>
    ))}
  </div>
);

/**
 * Decoupled — `as` and `size` chosen independently. Verifies the central
 * promise of the atom: document outline ≠ visual rank.
 */
export const DecoupledAsAndSize: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <Heading as="h1" size="h2">
      H1 element, H2 visual rank — long-form page title
    </Heading>
    <Heading as="h3" size="h5">
      H3 element, H5 visual rank — card subheading
    </Heading>
    <Heading as="h2" size="h1">
      H2 element, H1 visual rank — section opener that wants display weight
    </Heading>
  </div>
);

/**
 * H1 with inline `<em>` — preserves the italic-serif inflection pattern that
 * the global `h1 em { font-style: italic }` rule provides. The atom inherits
 * the rule; consumers write `<em>` inside children.
 */
export const H1WithItalic: Story = () => (
  <Heading as="h1" size="h1">
    The platform for <em>working</em> agents.
  </Heading>
);

/**
 * Anchorable — H2 with an `id` for in-page anchor navigation. The rest spread
 * passes `id` straight through to the rendered heading element.
 */
export const Anchorable: Story = () => (
  <Heading as="h2" size="h2" id="why-we-build">
    Why we build
  </Heading>
);
