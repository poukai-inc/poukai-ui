import type { Story, StoryDefault } from "@ladle/react";
import { Code, type CodeProps } from "./Code";

export default {
  title: "Components / Code",
  args: { children: "--accent" },
  argTypes: {
    children: { control: { type: "text" } },
  },
} satisfies StoryDefault;

/** Controls-driven sandbox. */
export const Playground: Story<CodeProps> = (args) => <Code {...args} />;

/** `<Code>` embedded inside body copy — verifies inline flow and proportional sizing. */
export const InProse: Story = () => (
  <p
    style={{
      maxWidth: "36rem",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-body)",
      color: "var(--fg)",
    }}
  >
    Override the <Code>--accent</Code> token to change the link color, then run{" "}
    <Code>pnpm build</Code> to regenerate the token bundle.
  </p>
);

/** `<Code>` inside larger headline-scale text — verifies `0.9em` scales with parent. */
export const InsideLargeText: Story = () => (
  <p
    style={{
      maxWidth: "36rem",
      fontFamily: "var(--font-serif)",
      fontSize: "var(--fs-pull)",
      lineHeight: 1.4,
      color: "var(--fg)",
    }}
  >
    Every page should call <Code>useTheme()</Code> exactly once.
  </p>
);

/** Several `<Code>` chips in one sentence — verifies spacing and no leading drift. */
export const MultipleInline: Story = () => (
  <p
    style={{
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-body)",
      color: "var(--fg)",
    }}
  >
    Run <Code>pnpm install</Code>, then <Code>pnpm dev</Code>, then open{" "}
    <Code>http://localhost:61000</Code> in your browser.
  </p>
);

/** A long import path inside a narrow container — verifies natural wrap behavior. */
export const LongLiteral: Story = () => (
  <div
    style={{
      maxWidth: "20rem",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-body)",
      color: "var(--fg)",
    }}
  >
    Import the helper from <Code>@poukai-inc/ui/molecules/Field/use-field-errors</Code> and call it
    inside your form provider.
  </div>
);
