import type { Story, StoryDefault } from "@ladle/react";
import { Statement } from "./Statement";

export default {
  title: "Components / Statement",
} satisfies StoryDefault;

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
