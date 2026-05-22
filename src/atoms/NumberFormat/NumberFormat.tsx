import { forwardRef, type ComponentPropsWithoutRef, type Ref } from "react";

export type NumberFormatNotation = "standard" | "compact" | "currency" | "percent";
export type NumberFormatAs = "span" | "div" | "dd";

export interface NumberFormatProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  /**
   * The number to format. `NaN` and `±Infinity` are allowed — `Intl` handles
   * them deterministically (NaN → "NaN", Infinity → "∞", -Infinity → "-∞").
   */
  value: number;
  /**
   * Controls the `Intl.NumberFormat` style and notation.
   * - `"standard"` (default) — locale-grouped digits: `1,234,567`
   * - `"compact"` — short-scale notation: `1.2M`, `4.5K`
   * - `"currency"` — locale currency symbol + grouping. Requires `currency` prop.
   * - `"percent"` — multiplies value × 100 and appends percent sign: `0.42` → `42%`
   */
  notation?: NumberFormatNotation;
  /**
   * ISO 4217 currency code (e.g. `"USD"`, `"EUR"`, `"JPY"`).
   * Required when `notation="currency"`. Intl throws a `RangeError` if absent.
   * Ignored for all other notations.
   */
  currency?: string;
  /**
   * BCP-47 locale tag(s), e.g. `"en-US"`, `"de-DE"`, `["en-GB","en"]`.
   * When omitted, the Intl runtime default is used.
   *
   * **SSR note**: omitting `locale` may produce a hydration mismatch when the
   * server and browser use different system locales. Pass `locale` explicitly
   * for any i18n-aware surface.
   */
  locale?: string | string[];
  /**
   * Minimum number of fraction digits. Passed directly to `Intl.NumberFormat`.
   * When omitted, Intl's notation-appropriate default applies.
   */
  minimumFractionDigits?: number;
  /**
   * Maximum number of fraction digits. Passed directly to `Intl.NumberFormat`.
   * When omitted, Intl's notation-appropriate default applies.
   */
  maximumFractionDigits?: number;
  /**
   * Root element. Defaults to `"span"`.
   * Closed union — no heading elements, no interactive elements.
   */
  as?: NumberFormatAs;
}

function buildIntlOptions(
  notation: NumberFormatNotation,
  currency: string | undefined,
  minimumFractionDigits: number | undefined,
  maximumFractionDigits: number | undefined,
): Intl.NumberFormatOptions {
  const options: Intl.NumberFormatOptions = {};

  if (minimumFractionDigits !== undefined) {
    options.minimumFractionDigits = minimumFractionDigits;
  }
  if (maximumFractionDigits !== undefined) {
    options.maximumFractionDigits = maximumFractionDigits;
  }

  switch (notation) {
    case "compact":
      options.notation = "compact";
      break;
    case "currency":
      options.style = "currency";
      options.currency = currency;
      break;
    case "percent":
      options.style = "percent";
      break;
    // "standard" is the Intl default — no extra options needed
  }

  return options;
}

/**
 * Canonical number-formatting atom. Renders a `number` value as a
 * locale-correct string via native `Intl.NumberFormat`. Emits no CSS of its
 * own — inherits all typographic context from its parent.
 *
 * Output is always identical to:
 * `new Intl.NumberFormat(locale, options).format(value)`
 *
 * @example
 *   <NumberFormat value={1_234_567} locale="en-US" />
 *   // → "1,234,567"
 *
 *   <NumberFormat value={4_500_000} notation="compact" locale="en-US" />
 *   // → "4.5M"
 *
 *   <NumberFormat value={1_234.56} notation="currency" currency="USD" locale="en-US" />
 *   // → "$1,234.56"
 *
 *   <NumberFormat value={0.42} notation="percent" locale="en-US" />
 *   // → "42%"
 *
 *   <dl>
 *     <dt>Total users</dt>
 *     <NumberFormat as="dd" value={48_921} locale="en-US" />
 *   </dl>
 */
export const NumberFormat = forwardRef<HTMLElement, NumberFormatProps>(function NumberFormat(
  {
    value,
    notation = "standard",
    currency,
    locale,
    minimumFractionDigits,
    maximumFractionDigits,
    as: As = "span",
    className,
    ...rest
  },
  ref,
) {
  const options = buildIntlOptions(
    notation,
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  );

  const formatted = new Intl.NumberFormat(locale, options).format(value);

  switch (As) {
    case "div":
      return (
        <div
          ref={ref as Ref<HTMLDivElement>}
          className={className}
          {...(rest as ComponentPropsWithoutRef<"div">)}
        >
          {formatted}
        </div>
      );
    case "dd":
      return (
        <dd
          ref={ref as Ref<HTMLElement>}
          className={className}
          {...(rest as ComponentPropsWithoutRef<"dd">)}
        >
          {formatted}
        </dd>
      );
    default:
      return (
        <span
          ref={ref as Ref<HTMLSpanElement>}
          className={className}
          {...(rest as ComponentPropsWithoutRef<"span">)}
        >
          {formatted}
        </span>
      );
  }
});

NumberFormat.displayName = "NumberFormat";
