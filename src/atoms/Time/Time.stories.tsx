import type { Story, StoryDefault } from "@ladle/react";
import { Time, type TimeFormat } from "./Time";

export default {
  title: "Atoms / Time",
} satisfies StoryDefault;

// Fixed ISO anchor used across deterministic stories.
const ANCHOR = "2026-05-21T14:30:00.000Z";

/** Absolute format — the default. Short month, day, year via Intl.DateTimeFormat. */
export const Absolute: Story = () => (
  <p>
    Published: <Time dateTime={ANCHOR} format="absolute" locale="en-US" />
  </p>
);

/** Relative format — computed from Date.now() at render time. */
export const Relative: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
    <p>
      Just now:{" "}
      <Time
        dateTime={new Date(Date.now() - 20 * 1000).toISOString()}
        format="relative"
        locale="en-US"
      />
    </p>
    <p>
      3 hours ago:{" "}
      <Time
        dateTime={new Date(Date.now() - 3 * 3600 * 1000).toISOString()}
        format="relative"
        locale="en-US"
      />
    </p>
    <p>
      8 days ago:{" "}
      <Time
        dateTime={new Date(Date.now() - 8 * 86400 * 1000).toISOString()}
        format="relative"
        locale="en-US"
      />
    </p>
    <p>
      2 years ago:{" "}
      <Time
        dateTime={new Date(Date.now() - 2 * 365 * 86400 * 1000).toISOString()}
        format="relative"
        locale="en-US"
      />
    </p>
  </div>
);

/** Long format — month + year only. */
export const Long: Story = () => (
  <p>
    Issue: <Time dateTime={ANCHOR} format="long" locale="en-US" />
  </p>
);

/** Time-only format — hour and minute. */
export const TimeOnly: Story = () => (
  <p>
    Starts at: <Time dateTime={ANCHOR} format="time-only" locale="en-US" />
  </p>
);

/** Children override — replaces the computed label; datetime attribute still carries the ISO string. */
export const ChildrenOverride: Story = () => (
  <p>
    Posted{" "}
    <Time dateTime={ANCHOR} format="absolute" locale="en-US">
      last Wednesday
    </Time>{" "}
    — check the datetime attribute in the DOM.
  </p>
);

/** All four format modes in a single matrix. */
export const Matrix: Story = () => (
  <table style={{ borderCollapse: "collapse", fontFamily: "var(--font-sans)" }}>
    <thead>
      <tr>
        <th
          style={{
            textAlign: "left",
            padding: "var(--space-2) var(--space-4)",
            borderBottom: "1px solid var(--hairline)",
            color: "var(--fg-muted)",
            fontWeight: 500,
          }}
        >
          Format
        </th>
        <th
          style={{
            textAlign: "left",
            padding: "var(--space-2) var(--space-4)",
            borderBottom: "1px solid var(--hairline)",
            color: "var(--fg-muted)",
            fontWeight: 500,
          }}
        >
          Output (en-US)
        </th>
      </tr>
    </thead>
    <tbody>
      {(["absolute", "relative", "long", "time-only"] as TimeFormat[]).map((fmt) => (
        <tr key={fmt}>
          <td style={{ padding: "var(--space-2) var(--space-4)", color: "var(--fg-muted)" }}>
            <code>{fmt}</code>
          </td>
          <td style={{ padding: "var(--space-2) var(--space-4)" }}>
            <Time
              dateTime={
                fmt === "relative" ? new Date(Date.now() - 3 * 3600 * 1000).toISOString() : ANCHOR
              }
              format={fmt}
              locale="en-US"
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

/** Locale comparison — same timestamp, three locales. */
export const LocaleComparison: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
    {(["en-US", "fr-FR", "de-DE"] as const).map((locale) => (
      <p key={locale} style={{ margin: 0 }}>
        <span style={{ color: "var(--fg-muted)", minWidth: "4rem", display: "inline-block" }}>
          {locale}:
        </span>{" "}
        <Time dateTime={ANCHOR} format="absolute" locale={locale} />
      </p>
    ))}
  </div>
);
