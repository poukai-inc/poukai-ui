import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

export type TimeFormat = "absolute" | "relative" | "long" | "time-only";

export interface TimeProps extends Omit<ComponentPropsWithoutRef<"time">, "dateTime"> {
  dateTime: string | Date;
  format?: TimeFormat;
  locale?: string;
  children?: ReactNode;
}

const RELATIVE_THRESHOLDS = [
  { unit: "year" as const, seconds: 345 * 86400 },
  { unit: "month" as const, seconds: 28 * 86400 },
  { unit: "week" as const, seconds: 7 * 86400 },
  { unit: "day" as const, seconds: 86400 },
  { unit: "hour" as const, seconds: 3600 },
  { unit: "minute" as const, seconds: 60 },
] as const;

function formatLabel(isoString: string, format: TimeFormat, locale: string): string {
  const date = new Date(isoString);

  if (format === "relative") {
    const nowMs = Date.now();
    const diffSeconds = (date.getTime() - nowMs) / 1000;
    const absDiff = Math.abs(diffSeconds);

    if (absDiff < 60) {
      return "just now";
    }

    for (const { unit, seconds } of RELATIVE_THRESHOLDS) {
      if (absDiff >= seconds) {
        const value = Math.round(diffSeconds / seconds);
        return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(value, unit);
      }
    }

    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
      Math.round(diffSeconds / 60),
      "minute",
    );
  }

  if (format === "absolute") {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  if (format === "long") {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
    }).format(date);
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export const Time = forwardRef<HTMLTimeElement, TimeProps>(function Time(
  { dateTime, format = "absolute", locale, children, ...rest },
  ref,
) {
  const isoString = typeof dateTime === "string" ? dateTime : dateTime.toISOString();
  const resolvedLocale =
    locale ?? (typeof navigator !== "undefined" ? navigator.language : "en-US");
  const label = children !== undefined ? children : formatLabel(isoString, format, resolvedLocale);

  return (
    <time ref={ref} dateTime={isoString} {...rest}>
      {label}
    </time>
  );
});

Time.displayName = "Time";
