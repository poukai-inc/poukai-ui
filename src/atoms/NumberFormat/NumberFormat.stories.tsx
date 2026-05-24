import type { Story, StoryDefault } from "@ladle/react";
import { NumberFormat } from "./NumberFormat";

export default {
  title: "Atoms / NumberFormat",
} satisfies StoryDefault;

/** Standard notation — grouped integer. en-US locale. */
export const Standard: Story = () => (
  <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--fg)" }}>
    <NumberFormat value={1_234_567} locale="en-US" />
  </span>
);

/** Standard with explicit fraction digits. */
export const StandardDecimal: Story = () => (
  <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--fg)" }}>
    <NumberFormat
      value={3.14159}
      locale="en-US"
      minimumFractionDigits={2}
      maximumFractionDigits={2}
    />
  </span>
);

/** Compact short-scale notation. */
export const Compact: Story = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--fg)",
    }}
  >
    <NumberFormat value={4_500_000} notation="compact" locale="en-US" />
    <NumberFormat value={12_300} notation="compact" locale="en-US" />
    <NumberFormat value={850} notation="compact" locale="en-US" />
  </div>
);

/** Currency — USD, en-US locale. */
export const CurrencyUSD: Story = () => (
  <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--fg)" }}>
    <NumberFormat value={1_234.56} notation="currency" currency="USD" locale="en-US" />
  </span>
);

/** Currency — EUR, en-US vs de-DE (symbol position flips). */
export const CurrencyEUR: Story = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--fg)",
    }}
  >
    <span>
      en-US: <NumberFormat value={1_234.56} notation="currency" currency="EUR" locale="en-US" />
    </span>
    <span>
      de-DE: <NumberFormat value={1_234.56} notation="currency" currency="EUR" locale="de-DE" />
    </span>
  </div>
);

/** Currency — JPY (zero fractional digits by default). */
export const CurrencyJPY: Story = () => (
  <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--fg)" }}>
    <NumberFormat value={1_234} notation="currency" currency="JPY" locale="ja-JP" />
  </span>
);

/** Percent notation — pass the decimal fraction, not the integer. */
export const Percent: Story = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--fg)",
    }}
  >
    <NumberFormat value={0.42} notation="percent" locale="en-US" />
    <NumberFormat
      value={0.857}
      notation="percent"
      locale="en-US"
      minimumFractionDigits={1}
      maximumFractionDigits={1}
    />
  </div>
);

/** Custom locale — German grouping and decimal separators. */
export const CustomLocale: Story = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--fg)",
    }}
  >
    <span>
      en-US: <NumberFormat value={1_234_567.89} locale="en-US" />
    </span>
    <span>
      de-DE: <NumberFormat value={1_234_567.89} locale="de-DE" />
    </span>
  </div>
);

/** `as="dd"` inside a definition list — canonical pairing with a `<dt>` label. */
export const AsDd: Story = () => (
  <dl
    style={{
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--fg)",
      display: "grid",
      gridTemplateColumns: "max-content 1fr",
      gap: "var(--space-1) var(--space-4)",
    }}
  >
    <dt>Total users</dt>
    <NumberFormat as="dd" value={48_921} locale="en-US" />
    <dt>MRR</dt>
    <NumberFormat as="dd" value={12_750} notation="currency" currency="USD" locale="en-US" />
  </dl>
);

/** `maximumFractionDigits` clamping — 3.14159 capped at 2 decimal places. */
export const MaxFractionDigits: Story = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--fg)",
    }}
  >
    <span>
      max=0: <NumberFormat value={3.14159} locale="en-US" maximumFractionDigits={0} />
    </span>
    <span>
      max=2: <NumberFormat value={3.14159} locale="en-US" maximumFractionDigits={2} />
    </span>
    <span>
      max=4: <NumberFormat value={3.14159} locale="en-US" maximumFractionDigits={4} />
    </span>
  </div>
);
