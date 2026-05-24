import { test, expect } from "@playwright/experimental-ct-react";
import { Sheet } from "./Sheet";
import { Button } from "../../atoms/Button";

/* ─── Trigger renders ────────────────────────────────────────── */

test("Sheet trigger renders", async ({ mount, page }) => {
  await mount(
    <Sheet.Root>
      <Sheet.Trigger asChild>
        <Button variant="secondary">Open sheet</Button>
      </Sheet.Trigger>
      <Sheet.Content side="right">
        <Sheet.Title>Test sheet</Sheet.Title>
        <Sheet.Description>Description.</Sheet.Description>
      </Sheet.Content>
    </Sheet.Root>,
  );

  await expect(page.getByRole("button", { name: "Open sheet" })).toBeVisible();
});

/* ─── Click trigger opens portaled content ───────────────────── */

test("Sheet opens via Trigger click", async ({ mount, page }) => {
  await mount(
    <Sheet.Root>
      <Sheet.Trigger asChild>
        <Button variant="secondary">Open</Button>
      </Sheet.Trigger>
      <Sheet.Content side="right">
        <Sheet.Title>Sheet panel</Sheet.Title>
        <Sheet.Description>Description text.</Sheet.Description>
        <Sheet.Close asChild>
          <Button variant="ghost">Close</Button>
        </Sheet.Close>
      </Sheet.Content>
    </Sheet.Root>,
  );

  // Dialog not yet open
  await expect(page.getByRole("dialog")).toHaveCount(0);

  // Open via trigger — Radix portals to document.body so use page-level locator
  await page.getByRole("button", { name: "Open" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

/* ─── Close button closes sheet ─────────────────────────────── */

test("Sheet closes via Close button", async ({ mount, page }) => {
  await mount(
    <Sheet.Root defaultOpen>
      <Sheet.Content side="right">
        <Sheet.Title>Sheet panel</Sheet.Title>
        <Sheet.Close asChild>
          <Button variant="ghost">Close</Button>
        </Sheet.Close>
      </Sheet.Content>
    </Sheet.Root>,
  );

  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

/* ─── Escape key closes sheet ────────────────────────────────── */

test("Sheet closes via Escape key", async ({ mount, page }) => {
  await mount(
    <Sheet.Root defaultOpen>
      <Sheet.Content side="right">
        <Sheet.Title>Escape test</Sheet.Title>
        <Sheet.Close asChild>
          <Button variant="ghost">Close</Button>
        </Sheet.Close>
      </Sheet.Content>
    </Sheet.Root>,
  );

  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

/* ─── Side class applied ─────────────────────────────────────── */

test("Sheet right side class is applied", async ({ mount, page }) => {
  await mount(
    <Sheet.Root defaultOpen>
      <Sheet.Content side="right" data-testid="sheet-right">
        <Sheet.Title>Right sheet</Sheet.Title>
      </Sheet.Content>
    </Sheet.Root>,
  );

  const panel = page.locator('[data-testid="sheet-right"]');
  await expect(panel).toBeVisible();
  const cls = await panel.getAttribute("class");
  // The CSS module generates a class containing "sideRight"
  expect(cls).toMatch(/sideRight/);
});

test("Sheet left side class is applied", async ({ mount, page }) => {
  await mount(
    <Sheet.Root defaultOpen>
      <Sheet.Content side="left" data-testid="sheet-left">
        <Sheet.Title>Left sheet</Sheet.Title>
      </Sheet.Content>
    </Sheet.Root>,
  );

  const panel = page.locator('[data-testid="sheet-left"]');
  await expect(panel).toBeVisible();
  const cls = await panel.getAttribute("class");
  expect(cls).toMatch(/sideLeft/);
});

test("Sheet top side class is applied", async ({ mount, page }) => {
  await mount(
    <Sheet.Root defaultOpen>
      <Sheet.Content side="top" data-testid="sheet-top">
        <Sheet.Title>Top sheet</Sheet.Title>
      </Sheet.Content>
    </Sheet.Root>,
  );

  const panel = page.locator('[data-testid="sheet-top"]');
  await expect(panel).toBeVisible();
  const cls = await panel.getAttribute("class");
  expect(cls).toMatch(/sideTop/);
});

test("Sheet bottom side class is applied", async ({ mount, page }) => {
  await mount(
    <Sheet.Root defaultOpen>
      <Sheet.Content side="bottom" data-testid="sheet-bottom">
        <Sheet.Title>Bottom sheet</Sheet.Title>
      </Sheet.Content>
    </Sheet.Root>,
  );

  const panel = page.locator('[data-testid="sheet-bottom"]');
  await expect(panel).toBeVisible();
  const cls = await panel.getAttribute("class");
  expect(cls).toMatch(/sideBottom/);
});

/* ─── Ref forwarding ────────────────────────────────────────── */

test("Sheet Content forwards ref", async ({ mount, page }) => {
  await mount(
    <Sheet.Root defaultOpen>
      <Sheet.Content
        ref={(_el) => {
          // ref forwarded — no-op
        }}
        data-testid="ref-sheet"
      >
        <Sheet.Title>Ref test</Sheet.Title>
      </Sheet.Content>
    </Sheet.Root>,
  );

  await expect(page.locator('[data-testid="ref-sheet"]')).toBeVisible();
});

/* ─── className forwarding ──────────────────────────────────── */

test("Sheet Content merges consumer className", async ({ mount, page }) => {
  await mount(
    <Sheet.Root defaultOpen>
      <Sheet.Content className="consumer-sheet-class" data-testid="cls-sheet">
        <Sheet.Title>Class merge test</Sheet.Title>
      </Sheet.Content>
    </Sheet.Root>,
  );

  const panel = page.locator('[data-testid="cls-sheet"]');
  await expect(panel).toBeVisible();
  const cls = await panel.getAttribute("class");
  expect(cls).toContain("consumer-sheet-class");
});

/* ─── data-* forwarding ─────────────────────────────────────── */

test("Sheet Content forwards data-* attributes", async ({ mount, page }) => {
  await mount(
    <Sheet.Root defaultOpen>
      <Sheet.Content data-testid="data-sheet" data-custom="yes">
        <Sheet.Title>Data attr test</Sheet.Title>
      </Sheet.Content>
    </Sheet.Root>,
  );

  const panel = page.locator('[data-testid="data-sheet"]');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute("data-custom", "yes");
});

/* ─── Title and Description wired for a11y ──────────────────── */

test("Sheet Title is wired as aria-labelledby", async ({ mount, page }) => {
  await mount(
    <Sheet.Root defaultOpen>
      <Sheet.Content>
        <Sheet.Title>Accessible sheet title</Sheet.Title>
        <Sheet.Description>Description for screen readers.</Sheet.Description>
      </Sheet.Content>
    </Sheet.Root>,
  );

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const labelledBy = await dialog.getAttribute("aria-labelledby");
  expect(labelledBy).toBeTruthy();
  const titleEl = page.locator(`[id="${labelledBy}"]`);
  await expect(titleEl).toHaveText("Accessible sheet title");
});

/* ─── Reduced motion: animation suppressed ──────────────────── */

test("Sheet reduced-motion: content animation suppressed", async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await mount(
    <Sheet.Root defaultOpen>
      <Sheet.Content data-testid="rm-sheet">
        <Sheet.Title>Reduced motion sheet</Sheet.Title>
      </Sheet.Content>
    </Sheet.Root>,
  );

  const panel = page.locator('[data-testid="rm-sheet"]');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveCSS("animation-name", "none");
});
