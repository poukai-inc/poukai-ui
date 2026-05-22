import type { Story, StoryDefault } from "@ladle/react";
import { Image, type ImageFit, type ImageRadius } from "./Image";

export default {
  title: "Components / Image",
} satisfies StoryDefault;

/* ---------- Aspect ratios ---------- */

export const Square: Story = () => (
  <Image
    src="https://picsum.photos/seed/poukai-sq/400/400"
    alt="Square placeholder — 1:1 aspect ratio"
    width={400}
    height={400}
    radius="md"
  />
);

export const Widescreen: Story = () => (
  <Image
    src="https://picsum.photos/seed/poukai-ws/1600/900"
    alt="Widescreen placeholder — 16:9 aspect ratio"
    width={1600}
    height={900}
    radius="md"
  />
);

export const FourByThree: Story = () => (
  <Image
    src="https://picsum.photos/seed/poukai-43/800/600"
    alt="Landscape placeholder — 4:3 aspect ratio"
    width={800}
    height={600}
    radius="md"
  />
);

/* ---------- Loading variants ---------- */

export const LoadingLazy: Story = () => (
  <Image
    src="https://picsum.photos/seed/poukai-lazy/800/450"
    alt="Lazy-loaded image — defers network request until near viewport"
    width={800}
    height={450}
    loading="lazy"
  />
);

export const LoadingEager: Story = () => (
  <Image
    src="https://picsum.photos/seed/poukai-eager/800/450"
    alt="Eagerly-loaded image — for above-the-fold LCP images"
    width={800}
    height={450}
    loading="eager"
  />
);

/* ---------- Radius variants ---------- */

export const RadiusScale: Story = () => {
  const radii: ImageRadius[] = ["none", "sm", "md", "lg"];
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--space-6)",
        alignItems: "flex-start",
      }}
    >
      {radii.map((r) => (
        <div key={r} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <Image
            src={`https://picsum.photos/seed/poukai-r-${r}/240/240`}
            alt={`Radius ${r} example`}
            width={240}
            height={240}
            radius={r}
            style={{ width: 160 }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-micro)",
              color: "var(--fg-muted)",
            }}
          >
            radius=&quot;{r}&quot;
          </span>
        </div>
      ))}
    </div>
  );
};

/* ---------- Fit variants ---------- */

export const FitVariants: Story = () => {
  const fits: ImageFit[] = ["cover", "contain", "fill", "none", "scale-down"];
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--space-6)",
        alignItems: "flex-start",
      }}
    >
      {fits.map((f) => (
        <div key={f} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <div
            style={{
              width: 160,
              height: 120,
              background: "var(--surface)",
              borderRadius: "var(--radius-2)",
              overflow: "hidden",
            }}
          >
            <Image
              src="https://picsum.photos/seed/poukai-fit/400/300"
              alt={`Object-fit: ${f} example`}
              width={400}
              height={300}
              fit={f}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-micro)",
              color: "var(--fg-muted)",
            }}
          >
            fit=&quot;{f}&quot;
          </span>
        </div>
      ))}
    </div>
  );
};

/* ---------- Decorative (alt="") ---------- */

export const Decorative: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <p
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
        margin: 0,
      }}
    >
      The image below is decorative (alt=&quot;&quot;). Screen readers skip it entirely.
    </p>
    <Image
      src="https://picsum.photos/seed/poukai-decorative/800/300"
      alt=""
      width={800}
      height={300}
      radius="lg"
    />
  </div>
);

/* ---------- Playground ---------- */

export const Playground: Story<{
  radius: ImageRadius;
  fit: ImageFit | "unset";
  loading: "lazy" | "eager";
}> = ({ radius, fit, loading }) => (
  <Image
    src="https://picsum.photos/seed/poukai-pg/800/450"
    alt="Playground image"
    width={800}
    height={450}
    radius={radius}
    fit={fit === "unset" ? undefined : fit}
    loading={loading}
    style={{ maxWidth: 480 }}
  />
);

Playground.args = {
  radius: "none",
  fit: "unset",
  loading: "lazy",
};

Playground.argTypes = {
  radius: {
    options: ["none", "sm", "md", "lg"] satisfies ImageRadius[],
    control: { type: "radio" },
  },
  fit: {
    options: ["unset", "cover", "contain", "fill", "none", "scale-down"] satisfies (
      | ImageFit
      | "unset"
    )[],
    control: { type: "select" },
  },
  loading: {
    options: ["lazy", "eager"],
    control: { type: "radio" },
  },
};
