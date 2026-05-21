import type { Story, StoryDefault } from "@ladle/react";
import { Kbd, type KbdProps } from "./Kbd";

export default {
  title: "Components / Kbd",
  args: { children: "K" },
  argTypes: {
    children: { control: { type: "text" } },
  },
} satisfies StoryDefault;

/** Controls-driven sandbox. */
export const Playground: Story<KbdProps> = (args) => <Kbd {...args} />;

/** Single-character key — verifies min-width square-ish silhouette. */
export const SingleKey: Story = () => <Kbd>K</Kbd>;

/** Symbol key with spelled-out `aria-label` — the recommended a11y pattern. */
export const SymbolKey: Story = () => <Kbd aria-label="Command">⌘</Kbd>;

/** Multi-character key — verifies a wider chip without padding distortion. */
export const WordKey: Story = () => <Kbd>Enter</Kbd>;

/** Multi-key combination — consumer composes side-by-side Kbd instances. */
export const Combination: Story = () => (
  <p
    style={{
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-body)",
      color: "var(--fg)",
    }}
  >
    Open the command menu with <Kbd aria-label="Command">⌘</Kbd> <Kbd>K</Kbd>.
  </p>
);

/** Kbd embedded inside body copy — verifies inline flow and proportional sizing. */
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
    Press <Kbd>Esc</Kbd> to dismiss the dialog. Press <Kbd aria-label="Command">⌘</Kbd> <Kbd>K</Kbd>{" "}
    to reopen it.
  </p>
);

/** Several common key variants stacked for visual review. */
export const AllVariants: Story = () => (
  <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
    <Kbd>A</Kbd>
    <Kbd>K</Kbd>
    <Kbd aria-label="Command">⌘</Kbd>
    <Kbd aria-label="Shift">⇧</Kbd>
    <Kbd aria-label="Option">⌥</Kbd>
    <Kbd>Enter</Kbd>
    <Kbd>Esc</Kbd>
    <Kbd>Tab</Kbd>
  </div>
);
