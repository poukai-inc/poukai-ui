import type { Story } from "@ladle/react";
import { Wordmark } from "./Wordmark";

export default {
  title: "Brand / Wordmark",
};

export const Default: Story = () => <Wordmark height={80} />;

export const Small: Story = () => <Wordmark height={32} />;

export const Inverted: Story = () => (
  <div style={{ background: "var(--fg)", padding: "var(--space-12)", color: "var(--bg)" }}>
    <Wordmark height={64} />
  </div>
);

export const ScaledRow: Story = () => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-8)" }}>
    {[24, 40, 64, 96].map((h) => (
      <Wordmark key={h} height={h} />
    ))}
  </div>
);
