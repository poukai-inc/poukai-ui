import { test, expect } from "@playwright/experimental-ct-react";
import { FullAudioPlayer } from "./__test_harness__";
import { MinimalAudioPlayer } from "./__test_harness__";
import { CaptionOnlyAudioPlayer } from "./__test_harness__";
import { CustomLabelAudioPlayer } from "./__test_harness__";
import { ClassNameAudioPlayer } from "./__test_harness__";
import { UnsafeHrefAudioPlayer } from "./__test_harness__";
import { HttpsHrefAudioPlayer } from "./__test_harness__";

/* ---------- Root element ---------- */

test("root element is <figure>", async ({ mount }) => {
  const component = await mount(<FullAudioPlayer />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("figure");
});

test("forwards data-testid to root <figure>", async ({ mount }) => {
  const component = await mount(<FullAudioPlayer />);
  await expect(component).toHaveAttribute("data-testid", "audio-root");
});

/* ---------- Audio element ---------- */

test("renders <audio> element with controls", async ({ mount }) => {
  const component = await mount(<FullAudioPlayer />);
  const audio = component.locator("audio");
  await expect(audio).toHaveCount(1);
  await expect(audio).toHaveAttribute("controls", "");
});

test("audio element has aria-label", async ({ mount }) => {
  const component = await mount(<FullAudioPlayer />);
  const audio = component.locator("audio");
  await expect(audio).toHaveAttribute("aria-label", "Episode 12 — Design systems");
});

test("audio element has correct src", async ({ mount }) => {
  const component = await mount(<FullAudioPlayer />);
  const audio = component.locator("audio");
  await expect(audio).toHaveAttribute("src", "https://www.w3schools.com/html/horse.ogg");
});

test("audio element has preload=metadata by default", async ({ mount }) => {
  const component = await mount(<FullAudioPlayer />);
  const audio = component.locator("audio");
  await expect(audio).toHaveAttribute("preload", "metadata");
});

/* ---------- Caption ---------- */

test("renders caption text when caption prop is provided", async ({ mount }) => {
  const component = await mount(<FullAudioPlayer />);
  await expect(component.getByText("Episode 12 — Design systems")).toBeVisible();
});

test("renders <figcaption> when caption is provided", async ({ mount }) => {
  const component = await mount(<CaptionOnlyAudioPlayer />);
  const figcaption = component.locator("figcaption");
  await expect(figcaption).toHaveCount(1);
  await expect(figcaption).toBeVisible();
});

test("omits figcaption when caption is undefined", async ({ mount }) => {
  const component = await mount(<MinimalAudioPlayer />);
  const figcaption = component.locator("figcaption");
  await expect(figcaption).toHaveCount(0);
});

/* ---------- Transcript link ---------- */

test("renders transcript link when transcriptHref is provided", async ({ mount }) => {
  const component = await mount(<FullAudioPlayer />);
  const link = component.locator("a");
  await expect(link).toHaveCount(1);
  await expect(link).toHaveAttribute("href", "/transcripts/ep-12");
});

test("transcript link has default label text", async ({ mount }) => {
  const component = await mount(<FullAudioPlayer />);
  const link = component.locator("a");
  await expect(link).toHaveText("Read transcript");
});

test("transcript link uses custom label when transcriptLabel provided", async ({ mount }) => {
  const component = await mount(<CustomLabelAudioPlayer />);
  const link = component.locator("a");
  await expect(link).toHaveText("View full transcript");
});

test("omits transcript link when transcriptHref is undefined", async ({ mount }) => {
  const component = await mount(<CaptionOnlyAudioPlayer />);
  const link = component.locator("a");
  await expect(link).toHaveCount(0);
});

test("omits transcript link when both caption and transcriptHref are absent", async ({ mount }) => {
  const component = await mount(<MinimalAudioPlayer />);
  const link = component.locator("a");
  await expect(link).toHaveCount(0);
});

/* ---------- transcriptHref scheme safety (#378) ---------- */

test("drops transcript link when transcriptHref uses a javascript: scheme", async ({ mount }) => {
  const component = await mount(<UnsafeHrefAudioPlayer />);
  const link = component.locator("a");
  await expect(link).toHaveCount(0);
});

test("renders transcript link for a safe https transcriptHref", async ({ mount }) => {
  const component = await mount(<HttpsHrefAudioPlayer />);
  const link = component.locator("a");
  await expect(link).toHaveCount(1);
  await expect(link).toHaveAttribute("href", "https://example.com/transcript");
});

/* ---------- DOM order ---------- */

test("audio element precedes transcript link in DOM order", async ({ mount }) => {
  const component = await mount(<FullAudioPlayer />);
  const audioIndex = await component
    .locator("audio")
    .evaluate((el) => Array.from(el.ownerDocument.querySelectorAll("*")).indexOf(el));
  const linkIndex = await component
    .locator("a")
    .evaluate((el) => Array.from(el.ownerDocument.querySelectorAll("*")).indexOf(el));
  expect(audioIndex).toBeLessThan(linkIndex);
});

/* ---------- className merge ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(<ClassNameAudioPlayer />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-player-class/);
});

/* ---------- Ref forwarding ---------- */

test("ref is forwarded to the <figure> root element", async ({ mount }) => {
  const component = await mount(<FullAudioPlayer />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("figure");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
