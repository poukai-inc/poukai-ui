import type { Story, StoryDefault } from "@ladle/react";
import { ArticleLayout } from "./ArticleLayout";
import { Prose } from "../../atoms/Prose";

export default {
  title: "Organisms / ArticleLayout",
} satisfies StoryDefault;

const bodyText = (
  <>
    <h2>The case for AI fluency</h2>
    <p>
      Every leader navigating a software-intensive business needs a working model of how large
      language models behave — not to become a prompt engineer, but to ask sharp questions, evaluate
      vendor claims, and spot the failure modes before they ship.
    </p>
    <p>
      The gap between pilot and production is almost never a model problem. It is a systems problem:
      latency budgets, context windows, retrieval quality, eval harnesses, and the missing
      human-in-the-loop that everyone assumed was someone else&apos;s job.
    </p>
    <h2>What we do</h2>
    <p>
      We work alongside founders and platform teams on the hard second half — after the demo
      succeeds and before the feature lands in production. Scoped engagements. No retainers.
    </p>
    <ul>
      <li>Architecture review for LLM-backed features</li>
      <li>Eval harness design and failure-mode enumeration</li>
      <li>Latency and cost optimisation</li>
      <li>Team enablement and hands-on pairing</li>
    </ul>
  </>
);

export const Default: Story = () => (
  <ArticleLayout>
    <Prose>{bodyText}</Prose>
  </ArticleLayout>
);

export const WithHeader: Story = () => (
  <ArticleLayout
    header={
      <div>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--fs-meta)",
            margin: "0 0 0.5rem",
          }}
        >
          Engineering
        </p>
        <h1
          style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-h1)", margin: "0 0 1rem" }}
        >
          The case for AI fluency
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--fs-body-lg)",
            color: "var(--fg-muted)",
            margin: "0",
          }}
        >
          Why every leader needs a working model of how LLMs behave.
        </p>
      </div>
    }
  >
    <Prose>{bodyText}</Prose>
  </ArticleLayout>
);

export const AsDiv: Story = () => (
  <ArticleLayout as="div">
    <Prose>{bodyText}</Prose>
  </ArticleLayout>
);

export const CustomClassName: Story = () => (
  <ArticleLayout className="custom-article">
    <Prose>
      <p>Custom class forwarded to the root element.</p>
    </Prose>
  </ArticleLayout>
);
