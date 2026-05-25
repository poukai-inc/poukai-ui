import { test, expect } from "@playwright/experimental-ct-react";
import { VideoEmbed } from "./VideoEmbed";

/* ── Rendering ───────────────────────────────────────────────────── */

test("renders root as <figure>", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed src="https://www.youtube.com/embed/test" title="Test video" />,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("figure");
});

test("renders iframe with correct src", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed src="https://www.youtube.com/embed/abc123" title="Test video" />,
  );
  const iframe = component.locator("iframe");
  await expect(iframe).toHaveAttribute("src", "https://www.youtube.com/embed/abc123");
});

test("renders iframe with correct title", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed src="https://www.youtube.com/embed/abc123" title="My video title" />,
  );
  const iframe = component.locator("iframe");
  await expect(iframe).toHaveAttribute("title", "My video title");
});

/* ── Lazy loading ────────────────────────────────────────────────── */

test("sets loading=lazy by default", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed src="https://www.youtube.com/embed/test" title="Lazy video" />,
  );
  const iframe = component.locator("iframe");
  await expect(iframe).toHaveAttribute("loading", "lazy");
});

test("sets loading=eager when lazy=false", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed src="https://www.youtube.com/embed/test" title="Eager video" lazy={false} />,
  );
  const iframe = component.locator("iframe");
  await expect(iframe).toHaveAttribute("loading", "eager");
});

/* ── aspectRatio ─────────────────────────────────────────────────── */

test("applies preset class for 16/9 by default", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed src="https://www.youtube.com/embed/test" title="16/9 video" />,
  );
  const ratioBox = component.locator("div").first();
  const cls = await ratioBox.getAttribute("class");
  expect(cls).toMatch(/ratioSixteenNine/);
});

test("applies preset class for 4/3", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed src="https://www.youtube.com/embed/test" title="4/3 video" aspectRatio="4/3" />,
  );
  const ratioBox = component.locator("div").first();
  const cls = await ratioBox.getAttribute("class");
  expect(cls).toMatch(/ratioFourThree/);
});

test("applies preset class for 1/1", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed src="https://www.youtube.com/embed/test" title="Square video" aspectRatio="1/1" />,
  );
  const ratioBox = component.locator("div").first();
  const cls = await ratioBox.getAttribute("class");
  expect(cls).toMatch(/ratioOneOne/);
});

test("applies inline style for custom aspect ratio", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed
      src="https://www.youtube.com/embed/test"
      title="Ultrawide video"
      aspectRatio="21/9"
    />,
  );
  const ratioBox = component.locator("div").first();
  const style = await ratioBox.getAttribute("style");
  expect(style).toMatch(/aspect-ratio:\s*21\/9/);
});

/* ── bordered ────────────────────────────────────────────────────── */

test("does not apply bordered class by default", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed src="https://www.youtube.com/embed/test" title="No border" />,
  );
  const ratioBox = component.locator("div").first();
  const cls = await ratioBox.getAttribute("class");
  expect(cls).not.toMatch(/bordered/);
});

test("applies bordered class when bordered=true", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed src="https://www.youtube.com/embed/test" title="Bordered" bordered />,
  );
  const ratioBox = component.locator("div").first();
  const cls = await ratioBox.getAttribute("class");
  expect(cls).toMatch(/bordered/);
});

/* ── caption slot ────────────────────────────────────────────────── */

test("renders caption when provided", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed
      src="https://www.youtube.com/embed/test"
      title="Captioned video"
      caption={<figcaption>Fig. 1 — test caption.</figcaption>}
    />,
  );
  await expect(component.getByText("Fig. 1 — test caption.")).toBeVisible();
});

test("does not render caption slot when caption not provided", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed src="https://www.youtube.com/embed/test" title="No caption" />,
  );
  // No captionSlot div should exist
  const captionSlotCount = await component.locator("figcaption").count();
  expect(captionSlotCount).toBe(0);
});

/* ── allow attribute ─────────────────────────────────────────────── */

test("sets allow attribute on iframe", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed src="https://www.youtube.com/embed/test" title="Allow test" />,
  );
  const iframe = component.locator("iframe");
  const allow = await iframe.getAttribute("allow");
  expect(allow).toContain("autoplay");
  expect(allow).toContain("picture-in-picture");
});

/* ── className forwarding ────────────────────────────────────────── */

test("merges consumer className with root class", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed
      src="https://www.youtube.com/embed/test"
      title="Custom class"
      className="my-custom"
    />,
  );
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/my-custom/);
  expect(cls).toMatch(/root/);
});

/* ── data-* forwarding ───────────────────────────────────────────── */

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed
      src="https://www.youtube.com/embed/test"
      title="Data attr test"
      data-testid="ve-root"
    />,
  );
  await expect(component).toHaveAttribute("data-testid", "ve-root");
});

/* ── ref forwarding ──────────────────────────────────────────────── */

test("forwards ref to root figure element", async ({ mount }) => {
  const component = await mount(
    <VideoEmbed src="https://www.youtube.com/embed/test" title="Ref test" />,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("figure");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
