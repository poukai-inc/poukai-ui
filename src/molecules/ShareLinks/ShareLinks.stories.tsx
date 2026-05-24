import type { Story, StoryDefault } from "@ladle/react";
import { ShareLinks } from "./ShareLinks";

export default {
  title: "Molecules / ShareLinks",
} satisfies StoryDefault;

const DEMO_URL = "https://poukai.com/blog/building-design-systems";
const DEMO_TITLE = "Building Design Systems at Speed";

export const Default: Story = () => <ShareLinks url={DEMO_URL} title={DEMO_TITLE} />;

export const XOnly: Story = () => <ShareLinks url={DEMO_URL} title={DEMO_TITLE} networks={["x"]} />;

export const WithCopy: Story = () => (
  <ShareLinks url={DEMO_URL} title={DEMO_TITLE} networks={["x", "copy"]} />
);

export const LinkedInAndCopy: Story = () => (
  <ShareLinks url={DEMO_URL} title={DEMO_TITLE} networks={["linkedin", "copy"]} />
);

export const SmallSize: Story = () => <ShareLinks url={DEMO_URL} title={DEMO_TITLE} size="sm" />;

/** End-of-article composition — typical editorial footer placement. */
export const EndOfArticle: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 640 }}>
    <p style={{ margin: 0, color: "var(--fg-muted)", fontSize: "var(--fs-meta)" }}>
      Found this useful? Share it.
    </p>
    <ShareLinks url={DEMO_URL} title={DEMO_TITLE} size="sm" />
  </div>
);
