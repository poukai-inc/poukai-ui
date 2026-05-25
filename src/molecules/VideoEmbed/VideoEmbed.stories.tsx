import type { Story, StoryDefault } from "@ladle/react";
import { VideoEmbed } from "./VideoEmbed";
import { Caption } from "../Caption";

export default {
  title: "Components / VideoEmbed",
} satisfies StoryDefault;

/** Default — 16/9 YouTube embed with lazy loading.
 *  Verifies: aspect-ratio box, iframe with title, lazy loading default. */
export const Default: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "640px" }}
  >
    <VideoEmbed
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="Rick Astley — Never Gonna Give You Up"
    />
  </div>
);

/** FourThree — 4/3 aspect ratio for legacy format video.
 *  Verifies: ratioFourThree CSS class applied. */
export const FourThree: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "480px" }}
  >
    <VideoEmbed
      src="https://player.vimeo.com/video/148751763"
      title="Design system overview — 4:3 format"
      aspectRatio="4/3"
    />
  </div>
);

/** Square — 1/1 aspect ratio.
 *  Verifies: ratioOneOne CSS class applied. */
export const Square: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "400px" }}
  >
    <VideoEmbed
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="Square format video"
      aspectRatio="1/1"
    />
  </div>
);

/** CustomAspectRatio — free-form ratio string (e.g. 21/9 ultrawide).
 *  Verifies: inline style applied for non-preset ratios. */
export const CustomAspectRatio: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "720px" }}
  >
    <VideoEmbed
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="Ultrawide 21:9 cinematic format"
      aspectRatio="21/9"
    />
  </div>
);

/** Bordered — hairline border around ratio box, useful in docs.
 *  Verifies: bordered class applied. */
export const Bordered: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "640px" }}
  >
    <VideoEmbed
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="Bordered video embed"
      bordered
    />
  </div>
);

/** NotLazy — eager loading for above-fold embeds.
 *  Verifies: loading="eager" on iframe. */
export const NotLazy: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "640px" }}
  >
    <VideoEmbed
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="Above-fold hero video"
      lazy={false}
    />
  </div>
);

/** WithCaption — ratio box + Caption molecule below.
 *  Verifies: caption slot renders as figcaption sibling to ratio box. */
export const WithCaption: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "640px" }}
  >
    <VideoEmbed
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="Poukai platform walkthrough"
      caption={<Caption>Fig. 1 — Poukai platform walkthrough, recorded live Q4 2024.</Caption>}
    />
  </div>
);

/** AllVariants — design matrix: aspect ratios side by side.
 *  Verifies each preset renders correctly in one view. */
export const AllVariants: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)",
      maxWidth: "640px",
    }}
  >
    <VideoEmbed
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="16:9 format"
      caption={<Caption>16/9 — YouTube / Vimeo default.</Caption>}
    />
    <VideoEmbed
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="4:3 format"
      aspectRatio="4/3"
      caption={<Caption>4/3 — legacy broadcast format.</Caption>}
    />
    <VideoEmbed
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="1:1 square format"
      aspectRatio="1/1"
      bordered
      caption={<Caption>1/1 — square with bordered variant.</Caption>}
    />
  </div>
);
