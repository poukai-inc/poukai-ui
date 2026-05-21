import type { Story, StoryDefault } from "@ladle/react";
import { Prose, type ProseWidth } from "./Prose";

export default {
  title: "Components / Prose",
  args: { width: "reading" },
  argTypes: {
    width: {
      options: ["full", "reading"] satisfies ProseWidth[],
      control: { type: "radio" },
      defaultValue: "reading",
    },
  },
} satisfies StoryDefault;

/**
 * Playground — feed a representative mix of HTML primitives and toggle
 * the `width` prop between `full` and `reading` to see the column
 * constraint apply.
 */
export const Playground: Story<{ width: ProseWidth }> = ({ width }) => (
  <Prose width={width}>
    <h1>The case for AI fluency</h1>
    <p className="lede">
      A working model is the only durable competitive advantage. Tools change quarterly; fluency
      compounds.
    </p>
    <p>
      Most leaders treat AI as a procurement problem — pick the vendor, sign the contract, schedule
      the rollout. That framing misreads what is actually changing. The constraint is no longer
      access to capability; it is the rate at which an organization can absorb new capability into
      the way decisions get made.
    </p>
    <h2>What changes first</h2>
    <p>
      The first surfaces to change are the ones with the highest <em>question-to-decision</em>{" "}
      ratio: legal review, design critique, code review, customer correspondence. These are surfaces
      where a single human spends most of their time evaluating other humans&rsquo; work.
    </p>
    <h3>A working list</h3>
    <ul>
      <li>Legal review of inbound contracts</li>
      <li>Design critique on early-stage product surfaces</li>
      <li>Code review on internal-tool changes</li>
      <li>First-draft customer correspondence</li>
    </ul>
    <h3>How to start</h3>
    <ol>
      <li>Pick the single surface with the highest review burden.</li>
      <li>Instrument the current decision rate — questions in, decisions out.</li>
      <li>Introduce AI assistance for the first read; keep human sign-off.</li>
      <li>Measure the decision rate after eight weeks.</li>
    </ol>
    <blockquote>
      The constraint is not capability. It is the rate at which an organization can absorb new
      capability into the way decisions get made.
      <cite>Pouk AI, internal memo (2026-05-12)</cite>
    </blockquote>
    <h4>Concrete example</h4>
    <p>
      Consider a typical contract review path. Inline code like <code>npm install</code> or a
      reference such as <kbd>⌘ K</kbd> for a command palette belongs in mixed prose — Prose styles
      it correctly without the consumer authoring spans.
    </p>
    <pre>
      <code>{`async function review(contract) {
  const flags = await classify(contract);
  return flags.filter((f) => f.severity >= "yellow");
}`}</code>
    </pre>
    <hr />
    <h5>Reference table</h5>
    <table>
      <thead>
        <tr>
          <th>Surface</th>
          <th>Review burden</th>
          <th>AI fit</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Contracts</td>
          <td>High</td>
          <td>Yes</td>
        </tr>
        <tr>
          <td>Design crits</td>
          <td>Medium</td>
          <td>Partial</td>
        </tr>
        <tr>
          <td>Strategy memos</td>
          <td>Low</td>
          <td>No</td>
        </tr>
      </tbody>
    </table>
    <h6>filed under · adoption playbook</h6>
  </Prose>
);

/**
 * AsArticle — Prose composed onto a semantic `<article>` element via
 * Radix Slot. Standalone editorial pages should always use this pattern.
 */
export const AsArticle: Story = () => (
  <Prose width="reading" asChild>
    <article>
      <h1>An editorial body</h1>
      <p className="lede">A single Prose root, composed onto an article element.</p>
      <p>Everything below inherits the canonical type contract.</p>
    </article>
  </Prose>
);

/**
 * WidthFull — Prose without a column constraint. Used when the parent
 * layout (Section, page chrome) already owns column width.
 */
export const WidthFull: Story = () => (
  <Prose width="full">
    <h2>Full-width body flow</h2>
    <p>
      Prose with <code>width=&quot;full&quot;</code> inherits its column from the parent. Compose it
      inside a Section that owns the column ceiling.
    </p>
    <p>Use this variant when Prose is one of several blocks inside a page-level layout.</p>
  </Prose>
);

/**
 * HeadingRhythm — visual reference for the heading lead-in cadence.
 * Every heading rung (`h1`–`h6`) shows the spacing rule it triggers.
 */
export const HeadingRhythm: Story = () => (
  <Prose width="reading">
    <p>A short paragraph above the heading ladder.</p>
    <h1>H1 — page-level title</h1>
    <p>Paragraph below h1 — tight transition.</p>
    <h2>H2 — section title (serif)</h2>
    <p>Paragraph below h2 — tight transition.</p>
    <h3>H3 — subsection title (sans)</h3>
    <p>Paragraph below h3.</p>
    <h4>H4 — body-rung lead-in</h4>
    <p>Paragraph below h4.</p>
    <h5>H5 — meta-rung lead-in</h5>
    <p>Paragraph below h5.</p>
    <h6>H6 — micro tracked uppercase</h6>
    <p>Paragraph below h6.</p>
  </Prose>
);

/**
 * BlocksAndQuotes — block-element rhythm reference (blockquote, pre,
 * figure, hr, table).
 */
export const BlocksAndQuotes: Story = () => (
  <Prose width="reading">
    <p>Lead-in paragraph above a blockquote.</p>
    <blockquote>
      Make the decision the speed at which it deserves to be made.
      <cite>— Pouk principle</cite>
    </blockquote>
    <p>Paragraph between two block elements.</p>
    <pre>
      <code>{`const x = 1;
const y = 2;
console.log(x + y);`}</code>
    </pre>
    <hr />
    <p>Paragraph below a rule.</p>
  </Prose>
);
