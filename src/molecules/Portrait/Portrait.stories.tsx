import type { Story, StoryDefault } from "@ladle/react";
import { Portrait } from "./Portrait";

export default {
  title: "Components / Portrait",
} satisfies StoryDefault;

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
