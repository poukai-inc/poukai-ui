import type { Story, StoryDefault } from "@ladle/react";
import { Portrait, type AspectRatio } from "./Portrait";

export default {
  title: "Components / Portrait",
  args: {
    src: "https://picsum.photos/seed/portrait/1800/2400",
    alt: "Arian Becker, founder of Poukai — headshot in natural light",
    aspect: "3:4" as AspectRatio,
    width: 1800,
    loading: "eager" as const,
    fetchPriority: "high" as const,
  },
  argTypes: {
    src: {
      control: { type: "text" },
    },
    alt: {
      control: { type: "text" },
    },
    aspect: {
      options: ["1:1", "3:4", "4:3", "16:9", "9:16"] satisfies AspectRatio[],
      control: { type: "select" },
    },
    width: {
      control: { type: "number" },
    },
    loading: {
      options: ["eager", "lazy"] as const,
      control: { type: "radio" },
    },
    fetchPriority: {
      options: ["high", "auto", "low"] as const,
      control: { type: "radio" },
    },
  },
} satisfies StoryDefault;

export const Playground: Story<{
  src: string;
  alt: string;
  aspect: AspectRatio;
  width: number;
  loading: "eager" | "lazy";
  fetchPriority: "high" | "auto" | "low";
}> = ({ src, alt, aspect, width, loading, fetchPriority }) => (
  <div style={{ maxWidth: "30rem" }}>
    <Portrait
      src={src}
      alt={alt}
      aspect={aspect}
      width={width}
      loading={loading}
      fetchPriority={fetchPriority}
    />
  </div>
);

export const EagerAboveFold: Story = () => (
  <div style={{ maxWidth: "30rem" }}>
    <Portrait
      src="https://picsum.photos/seed/portrait/1800/2400"
      alt="Arian Becker, founder of Poukai — headshot in natural light"
      aspect="3:4"
      width={1800}
      loading="eager"
      fetchPriority="high"
    />
  </div>
);

export const LazyBelowFold: Story = () => (
  <div style={{ maxWidth: "20rem" }}>
    <Portrait
      src="https://picsum.photos/seed/portrait2/800/800"
      alt="Team member portrait"
      aspect="1:1"
      width={800}
      loading="lazy"
    />
  </div>
);

export const SquareGrid: Story = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "1rem",
      maxWidth: "48rem",
    }}
  >
    <Portrait
      src="https://picsum.photos/seed/team1/800/800"
      alt="Team member one"
      aspect="1:1"
      width={800}
    />
    <Portrait
      src="https://picsum.photos/seed/team2/800/800"
      alt="Team member two"
      aspect="1:1"
      width={800}
    />
    <Portrait
      src="https://picsum.photos/seed/team3/800/800"
      alt="Team member three"
      aspect="1:1"
      width={800}
    />
  </div>
);
