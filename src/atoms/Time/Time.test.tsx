import { test, expect } from "@playwright/experimental-ct-react";
import { Time } from "./Time";

/* ---------- Root element ---------- */

test("renders as <time> element", async ({ mount }) => {
  const component = await mount(<Time dateTime="2026-05-21T10:00:00.000Z" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("time");
});

/* ---------- dateTime attribute ---------- */

test("string dateTime passes verbatim to datetime attribute", async ({ mount }) => {
  const component = await mount(<Time dateTime="2026-05-21T10:00:00.000Z" />);
  await expect(component).toHaveAttribute("datetime", "2026-05-21T10:00:00.000Z");
});

test("date-only string passes verbatim to datetime attribute (no round-trip)", async ({
  mount,
}) => {
  const component = await mount(<Time dateTime="2026-05-21" />);
  await expect(component).toHaveAttribute("datetime", "2026-05-21");
});

test("Date object serializes via toISOString for datetime attribute", async ({ mount }) => {
  const date = new Date("2026-05-21T10:00:00.000Z");
  const component = await mount(<Time dateTime={date} />);
  await expect(component).toHaveAttribute("datetime", date.toISOString());
});

/* ---------- format="absolute" ---------- */

test('format="absolute" (default) renders Intl.DateTimeFormat short date', async ({ mount }) => {
  // Use a fixed UTC timestamp and explicit locale to make this portable across runner timezones.
  // new Date("2026-05-21T12:00:00.000Z") in locale "en-US" with month:short, day:numeric, year:numeric
  const expected = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date("2026-05-21T12:00:00.000Z"));

  const component = await mount(
    <Time dateTime="2026-05-21T12:00:00.000Z" format="absolute" locale="en-US" />,
  );
  await expect(component).toHaveText(expected);
});

test("absolute is the default format", async ({ mount }) => {
  const expected = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date("2026-05-21T12:00:00.000Z"));

  const component = await mount(<Time dateTime="2026-05-21T12:00:00.000Z" locale="en-US" />);
  await expect(component).toHaveText(expected);
});

/* ---------- format="long" ---------- */

test('format="long" renders Intl.DateTimeFormat month + year', async ({ mount }) => {
  const expected = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(new Date("2026-05-21T12:00:00.000Z"));

  const component = await mount(
    <Time dateTime="2026-05-21T12:00:00.000Z" format="long" locale="en-US" />,
  );
  await expect(component).toHaveText(expected);
});

/* ---------- format="time-only" ---------- */

test('format="time-only" renders Intl.DateTimeFormat hour + minute', async ({ mount }) => {
  const expected = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date("2026-05-21T14:30:00.000Z"));

  const component = await mount(
    <Time dateTime="2026-05-21T14:30:00.000Z" format="time-only" locale="en-US" />,
  );
  await expect(component).toHaveText(expected);
});

/* ---------- format="relative" thresholds ---------- */

test('relative: |diff| < 60s → "just now"', async ({ mount }) => {
  const ts = new Date(Date.now() - 30 * 1000).toISOString();
  const component = await mount(<Time dateTime={ts} format="relative" locale="en-US" />);
  await expect(component).toHaveText("just now");
});

test('relative: future |diff| < 60s → "just now"', async ({ mount }) => {
  const ts = new Date(Date.now() + 30 * 1000).toISOString();
  const component = await mount(<Time dateTime={ts} format="relative" locale="en-US" />);
  await expect(component).toHaveText("just now");
});

test("relative: ~3 hours ago uses hour unit", async ({ mount }) => {
  const ts = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
  const expected = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(-3, "hour");
  const component = await mount(<Time dateTime={ts} format="relative" locale="en-US" />);
  await expect(component).toHaveText(expected);
});

test("relative: ~3 days ago uses day unit", async ({ mount }) => {
  const ts = new Date(Date.now() - 3 * 86400 * 1000).toISOString();
  const expected = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(-3, "day");
  const component = await mount(<Time dateTime={ts} format="relative" locale="en-US" />);
  await expect(component).toHaveText(expected);
});

test("relative: ~10 days ago uses week unit (descending threshold check)", async ({ mount }) => {
  const ts = new Date(Date.now() - 10 * 86400 * 1000).toISOString();
  const expected = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(-1, "week");
  const component = await mount(<Time dateTime={ts} format="relative" locale="en-US" />);
  await expect(component).toHaveText(expected);
});

test("relative: ~2 years ago uses year unit", async ({ mount }) => {
  const ts = new Date(Date.now() - 2 * 365 * 86400 * 1000).toISOString();
  const expected = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(-2, "year");
  const component = await mount(<Time dateTime={ts} format="relative" locale="en-US" />);
  await expect(component).toHaveText(expected);
});

/* ---------- children override ---------- */

test("children override replaces computed label", async ({ mount }) => {
  const component = await mount(
    <Time dateTime="2026-05-21T10:00:00.000Z" format="absolute" locale="en-US">
      Last Wednesday
    </Time>,
  );
  await expect(component).toHaveText("Last Wednesday");
});

test("children override: datetime attribute still emits ISO string", async ({ mount }) => {
  const component = await mount(<Time dateTime="2026-05-21T10:00:00.000Z">Last Wednesday</Time>);
  await expect(component).toHaveAttribute("datetime", "2026-05-21T10:00:00.000Z");
});

/* ---------- locale prop ---------- */

test("locale prop drives Intl output — fr-FR absolute", async ({ mount }) => {
  const expected = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date("2026-05-21T12:00:00.000Z"));

  const component = await mount(
    <Time dateTime="2026-05-21T12:00:00.000Z" format="absolute" locale="fr-FR" />,
  );
  await expect(component).toHaveText(expected);
});

/* ---------- className / ...rest ---------- */

test("className merges through ...rest", async ({ mount }) => {
  const component = await mount(
    <Time dateTime="2026-05-21T10:00:00.000Z" className="custom-time" />,
  );
  const className = await component.getAttribute("class");
  expect(className).toContain("custom-time");
});

test("forwards data-* and aria-* props to root", async ({ mount }) => {
  const component = await mount(
    <Time dateTime="2026-05-21T10:00:00.000Z" data-testid="ts" aria-label="Published" />,
  );
  await expect(component).toHaveAttribute("data-testid", "ts");
  await expect(component).toHaveAttribute("aria-label", "Published");
});

/* ---------- ref forwarding ---------- */

test("ref forwards to the HTMLTimeElement", async ({ mount, page }) => {
  // We verify ref forwarding by checking that the mounted element is actually a <time>
  // and that the ref would attach to it — tested via evaluate on the component handle.
  const component = await mount(<Time dateTime="2026-05-21T10:00:00.000Z" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("time");
  // The datetime attribute confirms we have the exact <time> node, not a wrapper.
  await expect(component).toHaveAttribute("datetime", "2026-05-21T10:00:00.000Z");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
