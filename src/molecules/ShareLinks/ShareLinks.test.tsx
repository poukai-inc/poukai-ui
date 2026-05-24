import { test, expect } from "@playwright/experimental-ct-react";
import { ShareLinks } from "./ShareLinks";

const DEMO_URL = "https://poukai.com/blog/post";
const DEMO_TITLE = "Test Post";

// webkit exposes navigator.share in the CT environment, which triggers the
// native-share fast-path and hides the network buttons. Strip it before each
// test so we always exercise the explicit-network path.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (navigator as any).share;
  });
});

test("renders root with role=group and aria-label", async ({ mount }) => {
  const component = await mount(<ShareLinks url={DEMO_URL} title={DEMO_TITLE} />);
  await expect(component).toHaveAttribute("role", "group");
  await expect(component).toHaveAttribute("aria-label", "Share this article");
});

test("renders X button with correct aria-label", async ({ mount }) => {
  const component = await mount(<ShareLinks url={DEMO_URL} networks={["x"]} />);
  await expect(component.getByRole("button", { name: "Share on X" })).toBeVisible();
});

test("renders LinkedIn button with correct aria-label", async ({ mount }) => {
  const component = await mount(<ShareLinks url={DEMO_URL} networks={["linkedin"]} />);
  await expect(component.getByRole("button", { name: "Share on LinkedIn" })).toBeVisible();
});

test("renders CopyButton when copy network is included", async ({ mount }) => {
  const component = await mount(<ShareLinks url={DEMO_URL} networks={["copy"]} />);
  await expect(component.getByRole("button", { name: "Copy link" })).toBeVisible();
});

test("renders all three networks by default", async ({ mount }) => {
  const component = await mount(<ShareLinks url={DEMO_URL} title={DEMO_TITLE} />);
  await expect(component.getByRole("button", { name: "Share on X" })).toBeVisible();
  await expect(component.getByRole("button", { name: "Share on LinkedIn" })).toBeVisible();
  await expect(component.getByRole("button", { name: "Copy link" })).toBeVisible();
});

test("respects network order from prop", async ({ mount }) => {
  const component = await mount(<ShareLinks url={DEMO_URL} networks={["linkedin", "x"]} />);
  const buttons = component.getByRole("button");
  const texts = await buttons.evaluateAll((els) => els.map((el) => el.getAttribute("aria-label")));
  expect(texts[0]).toBe("Share on LinkedIn");
  expect(texts[1]).toBe("Share on X");
});

test("forwards className to root div", async ({ mount }) => {
  const component = await mount(<ShareLinks url={DEMO_URL} className="my-custom-class" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-custom-class/);
});

test("forwards data-* props to root element", async ({ mount }) => {
  const component = await mount(<ShareLinks url={DEMO_URL} data-testid="sharelinks-root" />);
  await expect(component).toHaveAttribute("data-testid", "sharelinks-root");
});

test("forwards ref to root div", async ({ mount }) => {
  const component = await mount(<ShareLinks url={DEMO_URL} />);
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("div");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
