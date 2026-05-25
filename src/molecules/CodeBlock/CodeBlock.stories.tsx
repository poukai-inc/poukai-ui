import type { Story, StoryDefault } from "@ladle/react";
import { CodeBlock } from "./CodeBlock";

export default {
  title: "Molecules / CodeBlock",
} satisfies StoryDefault;

const TSX_SAMPLE = `import { CodeBlock } from "@poukai-inc/ui";

export function Example() {
  return (
    <CodeBlock language="tsx">
      {\`const x = 1;\`}
    </CodeBlock>
  );
}`;

const BASH_SAMPLE = `pnpm install
pnpm typecheck
pnpm test`;

const LONG_LINE_SAMPLE = `const result = await someVeryLongFunctionNameThatExceedsTheContainerWidth({ param1: "value1", param2: "value2", param3: "value3" });`;

/** Default — no language label, copy button visible.
 *  Verifies: <figure> root, <pre><code> pane, --surface background,
 *  --hairline border, --radius-3 corner, copy button present. */
export const Default: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: 640 }}>
    <CodeBlock>{`const x = 1;`}</CodeBlock>
  </div>
);

/** WithLanguage — language label rendered in header bar, leading end.
 *  Verifies: language label visible, --font-mono, --fs-micro, --fg-muted. */
export const WithLanguage: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: 640 }}>
    <CodeBlock language="tsx">{TSX_SAMPLE}</CodeBlock>
  </div>
);

/** WithCopy — copy button in header, no language label.
 *  Verifies: copy button is tab-reachable, aria-label="Copy" at rest. */
export const WithCopy: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: 640 }}>
    <CodeBlock>{BASH_SAMPLE}</CodeBlock>
  </div>
);

/** NoCopy — hideCopy=true suppresses the CopyButton.
 *  No language prop either, so the header bar is absent entirely.
 *  Verifies: no <button> in the DOM, no header bar rendered. */
export const NoCopy: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: 640 }}>
    <CodeBlock hideCopy>{`const decorative = true;`}</CodeBlock>
  </div>
);

/** NoCopyWithLanguage — language label shown but copy suppressed.
 *  Header bar renders because language is present. */
export const NoCopyWithLanguage: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: 640 }}>
    <CodeBlock language="bash" hideCopy>
      {BASH_SAMPLE}
    </CodeBlock>
  </div>
);

/** LongContent — single long line that triggers horizontal scroll.
 *  Verifies: overflow-x scroll on <pre>, no text wrap. */
export const LongContent: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: 480 }}>
    <CodeBlock language="ts">{LONG_LINE_SAMPLE}</CodeBlock>
  </div>
);

/** WithCaption — figcaption rendered below the code pane.
 *  Verifies: <figcaption> present, --font-sans, --fs-micro, --fg-muted,
 *  border-top hairline separating pane from caption. */
export const WithCaption: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: 640 }}>
    <CodeBlock language="tsx" caption="src/components/Example.tsx">
      {TSX_SAMPLE}
    </CodeBlock>
  </div>
);

/** FullAnatomy — all slots: language label + copy + caption.
 *  Design-reference story for visual review. */
export const FullAnatomy: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: 640 }}>
    <CodeBlock language="tsx" caption="src/components/Example.tsx">
      {TSX_SAMPLE}
    </CodeBlock>
  </div>
);
