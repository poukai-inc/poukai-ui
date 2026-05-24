import type { Story, StoryDefault } from "@ladle/react";
import { Logo, type LogoTone, type LogoSize } from "./Logo";

export default {
  title: "Atoms / Logo",
} satisfies StoryDefault;

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'%3E%3Crect width='200' height='80' rx='4' fill='%23000'/%3E%3Ctext x='100' y='48' font-size='24' text-anchor='middle' fill='%23fff' font-family='sans-serif'%3ELogo%3C/text%3E%3C/svg%3E";

const sizes: LogoSize[] = ["sm", "md", "lg"];

/* ---------- Tone: Color ---------- */

export const ToneColor: Story = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-8)",
      flexWrap: "wrap",
    }}
  >
    {sizes.map((size) => (
      <div key={size} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <Logo src={PLACEHOLDER} alt="Acme Corp" tone="color" size={size} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-micro)",
            color: "var(--fg-muted)",
          }}
        >
          size=&quot;{size}&quot;
        </span>
      </div>
    ))}
  </div>
);

/* ---------- Tone: Mono ---------- */

export const ToneMono: Story = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-8)",
      flexWrap: "wrap",
    }}
  >
    {sizes.map((size) => (
      <div key={size} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <Logo src={PLACEHOLDER} alt="Acme Corp" tone="mono" size={size} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-micro)",
            color: "var(--fg-muted)",
          }}
        >
          size=&quot;{size}&quot;
        </span>
      </div>
    ))}
  </div>
);

/* ---------- Tone: Muted (hover to reveal) ---------- */

export const ToneMuted: Story = () => (
  /* Hover each logo to see it reveal to full opacity */
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-8)",
      flexWrap: "wrap",
    }}
  >
    {sizes.map((size) => (
      <div key={size} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <Logo src={PLACEHOLDER} alt="Acme Corp" tone="muted" size={size} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-micro)",
            color: "var(--fg-muted)",
          }}
        >
          size=&quot;{size}&quot;
        </span>
      </div>
    ))}
  </div>
);

/* ---------- Size scale ---------- */

export const SizeScale: Story = () => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      gap: "var(--space-8)",
      flexWrap: "wrap",
    }}
  >
    {sizes.map((size) => (
      <div key={size} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <Logo src={PLACEHOLDER} alt="Acme Corp" size={size} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-micro)",
            color: "var(--fg-muted)",
          }}
        >
          {size === "sm" ? "24px" : size === "md" ? "32px" : "40px"}
        </span>
      </div>
    ))}
  </div>
);

/* ---------- Hover demo ---------- */

export const HoverDemo: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <p
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
        margin: 0,
      }}
    >
      Hover the logo below to reveal it from muted opacity (0.55 → 1).
    </p>
    <Logo src={PLACEHOLDER} alt="Acme Corp" tone="muted" size="lg" />
  </div>
);

/* ---------- Playground ---------- */

export const Playground: Story<{
  tone: LogoTone;
  size: LogoSize;
}> = ({ tone, size }) => <Logo src={PLACEHOLDER} alt="Acme Corp" tone={tone} size={size} />;

Playground.args = {
  tone: "mono",
  size: "md",
};

Playground.argTypes = {
  tone: {
    options: ["color", "mono", "muted"] satisfies LogoTone[],
    control: { type: "radio" },
  },
  size: {
    options: ["sm", "md", "lg"] satisfies LogoSize[],
    control: { type: "radio" },
  },
};
