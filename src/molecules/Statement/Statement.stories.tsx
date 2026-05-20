import type { Story, StoryDefault } from "@ladle/react";
import { Statement } from "./Statement";

export default {
  title: "Components / Statement",
  args: {
    statement: "Custom AI builds. Automations. Advisory engagements.",
    supporting: "",
    hairline: false,
    as: "p" as const,
  },
  argTypes: {
    statement: {
      control: { type: "text" },
    },
    supporting: {
      control: { type: "text" },
    },
    hairline: {
      control: { type: "boolean" },
    },
    as: {
      options: ["p", "blockquote"] as const,
      control: { type: "radio" },
    },
  },
} satisfies StoryDefault;

export const Playground: Story<{
  statement: string;
  supporting: string;
  hairline: boolean;
  as: "p" | "blockquote";
}> = ({ statement, supporting, hairline, as: asProp }) => (
  <div style={{ maxWidth: "48rem", padding: "var(--space-8)" }}>
    <Statement
      statement={statement}
      supporting={supporting || undefined}
      hairline={hairline}
      as={asProp}
    />
  </div>
);

export const Minimal: Story = () => (
  <div style={{ maxWidth: "48rem", padding: "var(--space-8)" }}>
    <Statement statement="Custom AI builds. Automations. Advisory engagements." />
  </div>
);

export const WithSupporting: Story = () => (
  <div style={{ maxWidth: "48rem", padding: "var(--space-8)" }}>
    <Statement
      statement={
        <>
          Custom AI builds. <em>Automations.</em> Advisory engagements.
        </>
      }
      supporting={<>For teams who&rsquo;d rather ship than speculate.</>}
    />
  </div>
);

export const WithHairline: Story = () => (
  <div style={{ maxWidth: "48rem", padding: "var(--space-8)" }}>
    <Statement hairline statement="Custom AI builds. Automations. Advisory engagements." />
  </div>
);

export const FullVariant: Story = () => (
  <div style={{ maxWidth: "48rem", padding: "var(--space-8)" }}>
    <Statement
      hairline
      statement={
        <>
          Custom AI builds. <em>Automations.</em> Advisory engagements.
        </>
      }
      supporting={<>For teams who&rsquo;d rather ship than speculate.</>}
    />
  </div>
);

export const BlockquoteSemantics: Story = () => (
  <div style={{ maxWidth: "48rem", padding: "var(--space-8)" }}>
    <Statement
      as="blockquote"
      statement={
        <>
          Custom AI builds. <em>Automations.</em> Advisory engagements.
        </>
      }
      supporting={<>For teams who&rsquo;d rather ship than speculate.</>}
    />
  </div>
);
