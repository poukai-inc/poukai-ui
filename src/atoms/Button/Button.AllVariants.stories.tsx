import type { Story, StoryDefault } from "@ladle/react";
import { Button, type ButtonVariant, type ButtonSize } from "./Button";

export default {
  title: "Components / Button",
} satisfies StoryDefault;

const variants: ButtonVariant[] = ["primary", "secondary", "ghost"];
const sizes: ButtonSize[] = ["sm", "md", "lg"];

/**
 * Every variant × size combination on one canvas.
 * Use this as the canonical visual regression reference for Button.
 */
export const AllVariants: Story = () => (
  <div
    style={{
      padding: "var(--space-8)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)",
    }}
  >
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th
            style={{
              textAlign: "left",
              padding: "var(--space-2) var(--space-4) var(--space-4) 0",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-micro)",
              color: "var(--fg-muted)",
              fontWeight: 400,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            variant / size
          </th>
          {sizes.map((s) => (
            <th
              key={s}
              style={{
                textAlign: "center",
                padding: "var(--space-2) var(--space-4) var(--space-4)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--fs-micro)",
                color: "var(--fg-muted)",
                fontWeight: 400,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              {s}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {variants.map((v) => (
          <tr key={v}>
            <td
              style={{
                padding: "var(--space-3) var(--space-4) var(--space-3) 0",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--fs-micro)",
                color: "var(--fg-muted)",
                whiteSpace: "nowrap",
              }}
            >
              {v}
            </td>
            {sizes.map((s) => (
              <td key={s} style={{ padding: "var(--space-3) var(--space-4)", textAlign: "center" }}>
                <Button variant={v} size={s}>
                  Get in touch
                </Button>
              </td>
            ))}
          </tr>
        ))}
        {/* Disabled row */}
        <tr>
          <td
            style={{
              padding: "var(--space-3) var(--space-4) var(--space-3) 0",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-micro)",
              color: "var(--fg-muted)",
            }}
          >
            disabled
          </td>
          {sizes.map((s) => (
            <td key={s} style={{ padding: "var(--space-3) var(--space-4)", textAlign: "center" }}>
              <Button size={s} disabled>
                Get in touch
              </Button>
            </td>
          ))}
        </tr>
      </tbody>
    </table>

    {/* asChild / link variant */}
    <div>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-micro)",
          color: "var(--fg-muted)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          marginBottom: "var(--space-3)",
        }}
      >
        asChild (rendered as &lt;a&gt;)
      </p>
      <div
        style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "center" }}
      >
        {variants.map((v) => (
          <Button key={v} variant={v} asChild>
            <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
          </Button>
        ))}
      </div>
    </div>
  </div>
);
