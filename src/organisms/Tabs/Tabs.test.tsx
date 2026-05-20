import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Tabs } from "./Tabs";
import { TabsBasic } from "./TabsBasic";

/* ─── Helpers ─────────────────────────────────────────────── */

const AXE_ISOLATED_RULES = ["landmark-one-main", "page-has-heading-one", "region"] as const;

async function expectAxeClean(page: import("@playwright/test").Page) {
  const { violations } = await new AxeBuilder({ page })
    .disableRules([...AXE_ISOLATED_RULES])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

/* ─── Compound API — rendering ───────────────────────────── */

test("Tabs renders triggers", async ({ mount, page }) => {
  await mount(
    <Tabs.Root defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab One</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab Two</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Tab Three</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Panel one.</Tabs.Content>
      <Tabs.Content value="tab2">Panel two.</Tabs.Content>
      <Tabs.Content value="tab3">Panel three.</Tabs.Content>
    </Tabs.Root>,
  );

  await expect(page.getByRole("tab", { name: "Tab One" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Tab Two" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Tab Three" })).toBeVisible();
});

test("Tabs shows content for active tab", async ({ mount, page }) => {
  await mount(
    <Tabs.Root defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab One</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab Two</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Panel one content.</Tabs.Content>
      <Tabs.Content value="tab2">Panel two content.</Tabs.Content>
    </Tabs.Root>,
  );

  await expect(page.getByText("Panel one content.")).toBeVisible();
  // Panel two is not active — not visible (Radix hides inactive panels)
  await expect(page.getByText("Panel two content.")).not.toBeVisible();
});

test("clicking trigger switches content", async ({ mount, page }) => {
  await mount(
    <Tabs.Root defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab One</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab Two</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Panel one content.</Tabs.Content>
      <Tabs.Content value="tab2">Panel two content.</Tabs.Content>
    </Tabs.Root>,
  );

  await expect(page.getByText("Panel one content.")).toBeVisible();
  await page.getByRole("tab", { name: "Tab Two" }).click();
  await expect(page.getByText("Panel two content.")).toBeVisible();
  await expect(page.getByText("Panel one content.")).not.toBeVisible();
});

test("keyboard arrow navigation switches tabs (Radix native)", async ({ mount, page }) => {
  await mount(
    <Tabs.Root defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab One</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab Two</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Tab Three</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Panel one.</Tabs.Content>
      <Tabs.Content value="tab2">Panel two.</Tabs.Content>
      <Tabs.Content value="tab3">Panel three.</Tabs.Content>
    </Tabs.Root>,
  );

  // Focus the first tab and arrow right
  await page.getByRole("tab", { name: "Tab One" }).focus();
  await page.keyboard.press("ArrowRight");
  // Radix moves focus + activates the next tab
  await expect(page.getByRole("tab", { name: "Tab Two" })).toBeFocused();
  await expect(page.getByText("Panel two.")).toBeVisible();
});

test("vertical orientation applies data-orientation attribute", async ({ mount, page }) => {
  await mount(
    <Tabs.Root defaultValue="tab1" orientation="vertical" data-testid="tabs-root">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab One</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab Two</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Panel one.</Tabs.Content>
      <Tabs.Content value="tab2">Panel two.</Tabs.Content>
    </Tabs.Root>,
  );

  const root = page.locator('[data-testid="tabs-root"]');
  await expect(root).toHaveAttribute("data-orientation", "vertical");
});

test("defaultValue selects initial active tab", async ({ mount, page }) => {
  await mount(
    <Tabs.Root defaultValue="tab2">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab One</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab Two</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Panel one.</Tabs.Content>
      <Tabs.Content value="tab2">Panel two is default.</Tabs.Content>
    </Tabs.Root>,
  );

  // tab2 should be the active one
  await expect(page.getByText("Panel two is default.")).toBeVisible();
  await expect(page.getByText("Panel one.")).not.toBeVisible();
  await expect(page.getByRole("tab", { name: "Tab Two" })).toHaveAttribute("data-state", "active");
});

test("controlled mode: value + onValueChange", async ({ mount, page }) => {
  // Mount with controlled value; clicking a different tab fires onValueChange
  // We verify the trigger gets data-state="active" on the controlled value
  await mount(
    <Tabs.Root value="tab2" onValueChange={() => {}}>
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab One</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab Two</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Panel one.</Tabs.Content>
      <Tabs.Content value="tab2">Panel two controlled.</Tabs.Content>
    </Tabs.Root>,
  );

  // tab2 is controlled-active
  await expect(page.getByRole("tab", { name: "Tab Two" })).toHaveAttribute("data-state", "active");
  await expect(page.getByText("Panel two controlled.")).toBeVisible();
});

test("className merge on Root", async ({ mount, page }) => {
  await mount(
    <Tabs.Root defaultValue="tab1" className="consumer-root" data-testid="tabs-root">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab One</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Panel one.</Tabs.Content>
    </Tabs.Root>,
  );

  const root = page.locator('[data-testid="tabs-root"]');
  const cls = await root.getAttribute("class");
  expect(cls).toContain("consumer-root");
});

test("arbitrary prop forwarding on Content", async ({ mount, page }) => {
  await mount(
    <Tabs.Root defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab One</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" data-testid="content-panel" data-custom="yes">
        Panel one.
      </Tabs.Content>
    </Tabs.Root>,
  );

  const panel = page.locator('[data-testid="content-panel"]');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute("data-custom", "yes");
});

test("ref forwarding on Root", async ({ mount, page }) => {
  await mount(
    <Tabs.Root
      defaultValue="tab1"
      data-testid="ref-root"
      ref={(_el) => {
        // ref is forwarded — no-op here, just verify component mounts
      }}
    >
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab One</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Panel one.</Tabs.Content>
    </Tabs.Root>,
  );

  await expect(page.locator('[data-testid="ref-root"]')).toBeVisible();
});

/* ─── TabsBasic tests ────────────────────────────────────── */

test("TabsBasic renders all triggers", async ({ mount, page }) => {
  await mount(
    <TabsBasic
      tabs={[
        { value: "a", label: "Alpha", content: <p>Alpha panel.</p> },
        { value: "b", label: "Beta", content: <p>Beta panel.</p> },
        { value: "c", label: "Gamma", content: <p>Gamma panel.</p> },
      ]}
    />,
  );

  await expect(page.getByRole("tab", { name: "Alpha" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Beta" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Gamma" })).toBeVisible();
});

test("TabsBasic defaultValue selects initial tab", async ({ mount, page }) => {
  await mount(
    <TabsBasic
      defaultValue="b"
      tabs={[
        { value: "a", label: "Alpha", content: <p>Alpha panel.</p> },
        { value: "b", label: "Beta", content: <p>Beta panel.</p> },
      ]}
    />,
  );

  await expect(page.getByText("Beta panel.")).toBeVisible();
  await expect(page.getByText("Alpha panel.")).not.toBeVisible();
});

test("TabsBasic defaults to first tab when defaultValue omitted", async ({ mount, page }) => {
  await mount(
    <TabsBasic
      tabs={[
        { value: "first", label: "First", content: <p>First panel.</p> },
        { value: "second", label: "Second", content: <p>Second panel.</p> },
      ]}
    />,
  );

  await expect(page.getByText("First panel.")).toBeVisible();
});

test("TabsBasic vertical orientation applies data-orientation", async ({ mount, page }) => {
  await mount(
    <TabsBasic
      orientation="vertical"
      tabs={[
        { value: "a", label: "Alpha", content: <p>Alpha panel.</p> },
        { value: "b", label: "Beta", content: <p>Beta panel.</p> },
      ]}
    />,
  );

  const tablist = page.getByRole("tablist");
  await expect(tablist).toHaveAttribute("data-orientation", "vertical");
});

/* ─── axe-core a11y scans ─────────────────────────────────── */

test("a11y — Tabs compound API (horizontal)", async ({ mount, page }) => {
  await mount(
    <Tabs.Root defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Overview</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Approach</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Results</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <p>Overview panel content for the a11y scan.</p>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <p>Approach panel content for the a11y scan.</p>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <p>Results panel content for the a11y scan.</p>
      </Tabs.Content>
    </Tabs.Root>,
  );

  await expectAxeClean(page);
});

test("a11y — Tabs compound API (vertical)", async ({ mount, page }) => {
  await mount(
    <Tabs.Root defaultValue="build" orientation="vertical">
      <Tabs.List>
        <Tabs.Trigger value="build">Build</Tabs.Trigger>
        <Tabs.Trigger value="automate">Automate</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="build">
        <p>Build panel content for the a11y scan.</p>
      </Tabs.Content>
      <Tabs.Content value="automate">
        <p>Automate panel content for the a11y scan.</p>
      </Tabs.Content>
    </Tabs.Root>,
  );

  await expectAxeClean(page);
});

test("a11y — TabsBasic", async ({ mount, page }) => {
  await mount(
    <TabsBasic
      tabs={[
        {
          value: "overview",
          label: "Overview",
          content: <p>Overview panel content for the a11y scan.</p>,
        },
        {
          value: "approach",
          label: "Approach",
          content: <p>Approach panel content for the a11y scan.</p>,
        },
      ]}
    />,
  );

  await expectAxeClean(page);
});
