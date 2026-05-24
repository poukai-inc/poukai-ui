import type { Story, StoryDefault } from "@ladle/react";
import { Figure } from "./Figure";

export default {
  title: "Components / Figure",
} satisfies StoryDefault;

/** Default — img with shorthand caption prop. */
export const Default: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "600px" }}
  >
    <Figure caption="Photographer: Jane Doe">
      <img
        src="https://placehold.co/600x400/e5e5ea/6e6e73?text=Image"
        alt="A placeholder image demonstrating the Figure molecule"
        style={{ width: "100%", display: "block" }}
      />
    </Figure>
  </div>
);

/** WithPortrait — using a native img in portrait orientation. */
export const WithPortrait: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "400px" }}
  >
    <Figure caption="Portrait of a team member, 2024.">
      <img
        src="https://placehold.co/400x500/e5e5ea/6e6e73?text=Portrait"
        alt="A placeholder portrait image"
        style={{ width: "100%", display: "block" }}
      />
    </Figure>
  </div>
);

/** NoCaption — figure without a caption is semantically valid. */
export const NoCaption: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "600px" }}
  >
    <Figure>
      <img
        src="https://placehold.co/600x400/e5e5ea/6e6e73?text=No+Caption"
        alt="A decorative-adjacent image with no caption needed here"
        style={{ width: "100%", display: "block" }}
      />
    </Figure>
  </div>
);

/** AlignCenter — caption centered beneath the image. */
export const AlignCenter: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "600px" }}
  >
    <Figure align="center" caption="Figure 1. Deployment cycle comparison across three teams.">
      <img
        src="https://placehold.co/600x400/e5e5ea/6e6e73?text=Centered"
        alt="A chart showing deployment cycle comparison"
        style={{ width: "100%", display: "block" }}
      />
    </Figure>
  </div>
);

/** CompoundCaption — using Figure.Caption sub-component for richer caption. */
export const CompoundCaption: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "600px" }}
  >
    <Figure>
      <img
        src="https://placehold.co/600x400/e5e5ea/6e6e73?text=Compound"
        alt="Image with a compound caption"
        style={{ width: "100%", display: "block" }}
      />
      <Figure.Caption>
        Photo by <em>Jane Doe</em>, 2024.
      </Figure.Caption>
    </Figure>
  </div>
);
