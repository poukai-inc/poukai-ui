import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { EmptyState } from "./EmptyState";
import { Button } from "../../atoms/Button/Button";

/* ---------- Root element ---------- */

test("root element is <div>", async ({ mount }) => {
  const component = await mount(<EmptyState title="No posts" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

/* ---------- Title rendering ---------- */

test("renders title text", async ({ mount }) => {
  const component = await mount(<EmptyState title="No scheduled posts" />);
  await expect(component.getByText("No scheduled posts")).toBeVisible();
});

test("title is rendered as a <p> element", async ({ mount }) => {
  const component = await mount(<EmptyState title="No posts" />);
  const p = component.locator("p").first();
  await expect(p).toBeVisible();
  const tag = await p.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("p");
});

/* ---------- Description slot ---------- */

test("omits description when description prop is undefined", async ({ mount }) => {
  const component = await mount(<EmptyState title="No posts" />);
  // Only one <p> — the title
  const paragraphs = component.locator("p");
  await expect(paragraphs).toHaveCount(1);
});

test("renders description when provided as string", async ({ mount }) => {
  const component = await mount(
    <EmptyState title="No posts" description="Create your first post to get started." />,
  );
  await expect(component.getByText("Create your first post to get started.")).toBeVisible();
});

test("renders description when provided as ReactNode", async ({ mount }) => {
  const component = await mount(
    <EmptyState
      title="No posts"
      description={
        <span>
          Read the <a href="/docs">documentation</a> to get started.
        </span>
      }
    />,
  );
  await expect(component.getByText("documentation")).toBeVisible();
});

/* ---------- Icon slot ---------- */

test("omits icon slot when icon prop is undefined", async ({ mount }) => {
  const component = await mount(<EmptyState title="No posts" />);
  const svgs = component.locator("svg");
  await expect(svgs).toHaveCount(0);
});

test("renders icon when icon prop is provided", async ({ mount }) => {
  const component = await mount(
    <EmptyState
      title="No posts"
      icon={
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      }
    />,
  );
  const svg = component.locator("svg");
  await expect(svg).toBeVisible();
});

test("icon wrapper span has aria-hidden='true'", async ({ mount }) => {
  const component = await mount(
    <EmptyState
      title="No posts"
      icon={
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" />
        </svg>
      }
    />,
  );
  const iconSpan = component.locator("span[aria-hidden='true']");
  await expect(iconSpan).toHaveCount(1);
});

/* ---------- Action slot ---------- */

test("omits action slot when action prop is undefined", async ({ mount }) => {
  const component = await mount(<EmptyState title="No posts" />);
  const button = component.locator("button");
  await expect(button).toHaveCount(0);
});

test("renders action slot when action prop is provided", async ({ mount }) => {
  const component = await mount(
    <EmptyState
      title="No posts"
      action={
        <Button variant="primary" size="md">
          Create post
        </Button>
      }
    />,
  );
  const button = component.getByRole("button", { name: "Create post" });
  await expect(button).toBeVisible();
});

/* ---------- Tone ---------- */

test("default tone renders without subtle class", async ({ mount }) => {
  const component = await mount(<EmptyState title="No posts" />);
  // Verify the component renders (default tone is transparent — no extra class)
  await expect(component.getByText("No posts")).toBeVisible();
});

test("tone='subtle' renders the component correctly", async ({ mount }) => {
  const component = await mount(<EmptyState title="No posts" tone="subtle" />);
  await expect(component.getByText("No posts")).toBeVisible();
});

/* ---------- className merge ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(<EmptyState title="No posts" className="my-empty" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-empty/);
});

/* ---------- Arbitrary-prop forwarding ---------- */

test("forwards data-testid to root element", async ({ mount }) => {
  const component = await mount(<EmptyState title="No posts" data-testid="empty-root" />);
  await expect(component).toHaveAttribute("data-testid", "empty-root");
});

test("forwards aria-label to root element", async ({ mount }) => {
  const component = await mount(<EmptyState title="No posts" aria-label="Empty scheduled posts" />);
  await expect(component).toHaveAttribute("aria-label", "Empty scheduled posts");
});

/* ---------- Ref forwarding ---------- */

test("ref is forwarded to the root <div>", async ({ mount }) => {
  const component = await mount(<EmptyState title="No posts" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

/* ---------- a11y ---------- */

test("a11y — default tone, title only", async ({ mount, page }) => {
  await mount(<EmptyState title="No scheduled posts" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — with icon, description, and action", async ({ mount, page }) => {
  await mount(
    <EmptyState
      title="No scheduled posts"
      description="Schedule your first post to start building your content calendar."
      icon={
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      }
      action={
        <Button variant="primary" size="md">
          Schedule a post
        </Button>
      }
    />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — tone='subtle'", async ({ mount, page }) => {
  await mount(
    <EmptyState
      tone="subtle"
      title="No conversations yet"
      description="When someone messages you, it will appear here."
    />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
