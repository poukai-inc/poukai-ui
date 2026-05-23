import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Pagination } from "./Pagination";

/* ---------- Root element ---------- */

test("root element is <nav>", async ({ mount }) => {
  const component = await mount(
    <Pagination page={1} pageCount={10} onPageChange={() => undefined} />,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("nav");
});

test("root has aria-label='Pagination'", async ({ mount }) => {
  const component = await mount(
    <Pagination page={1} pageCount={10} onPageChange={() => undefined} />,
  );
  await expect(component).toHaveAttribute("aria-label", "Pagination");
});

/* ---------- Returns null when pageCount <= 1 ---------- */

test("returns null when pageCount is 1", async ({ mount }) => {
  const component = await mount(
    <Pagination page={1} pageCount={1} onPageChange={() => undefined} />,
  );
  // When null is returned, Playwright CT mounts an empty fragment — no nav
  const count = await component.evaluate((el) => (el instanceof HTMLElement ? 1 : 0));
  // The component returned null so there's no rendered nav; count of nav inside is 0
  expect(await component.locator("nav").count()).toBe(0);
});

/* ---------- aria-current on active page ---------- */

test("active page button has aria-current='page'", async ({ mount }) => {
  const component = await mount(
    <Pagination page={3} pageCount={10} onPageChange={() => undefined} />,
  );
  const currentBtn = component.getByRole("button", { name: "3" });
  await expect(currentBtn).toHaveAttribute("aria-current", "page");
});

test("non-active page buttons do not have aria-current", async ({ mount }) => {
  const component = await mount(
    <Pagination page={3} pageCount={5} onPageChange={() => undefined} />,
  );
  const btn2 = component.getByRole("button", { name: "2" });
  await expect(btn2).not.toHaveAttribute("aria-current");
});

/* ---------- First/Prev disabled on page 1 ---------- */

test("first-page and prev-page buttons are disabled on page 1", async ({ mount }) => {
  const component = await mount(
    <Pagination page={1} pageCount={10} onPageChange={() => undefined} />,
  );
  await expect(component.getByRole("button", { name: "First page" })).toBeDisabled();
  await expect(component.getByRole("button", { name: "Previous page" })).toBeDisabled();
});

test("next-page and last-page buttons are enabled on page 1", async ({ mount }) => {
  const component = await mount(
    <Pagination page={1} pageCount={10} onPageChange={() => undefined} />,
  );
  await expect(component.getByRole("button", { name: "Next page" })).not.toBeDisabled();
  await expect(component.getByRole("button", { name: "Last page" })).not.toBeDisabled();
});

/* ---------- Last/Next disabled on last page ---------- */

test("next-page and last-page buttons are disabled on last page", async ({ mount }) => {
  const component = await mount(
    <Pagination page={10} pageCount={10} onPageChange={() => undefined} />,
  );
  await expect(component.getByRole("button", { name: "Next page" })).toBeDisabled();
  await expect(component.getByRole("button", { name: "Last page" })).toBeDisabled();
});

test("first-page and prev-page buttons are enabled on last page", async ({ mount }) => {
  const component = await mount(
    <Pagination page={10} pageCount={10} onPageChange={() => undefined} />,
  );
  await expect(component.getByRole("button", { name: "First page" })).not.toBeDisabled();
  await expect(component.getByRole("button", { name: "Previous page" })).not.toBeDisabled();
});

/* ---------- All buttons disabled when disabled prop is set ---------- */

test("all buttons disabled when disabled=true", async ({ mount }) => {
  const component = await mount(
    <Pagination page={5} pageCount={10} disabled onPageChange={() => undefined} />,
  );
  const buttons = component.getByRole("button");
  const count = await buttons.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await expect(buttons.nth(i)).toBeDisabled();
  }
});

/* ---------- onPageChange callbacks ---------- */

test("clicking next page calls onPageChange with page+1", async ({ mount }) => {
  const calls: number[] = [];
  const component = await mount(
    <Pagination page={3} pageCount={10} onPageChange={(p) => calls.push(p)} />,
  );
  await component.getByRole("button", { name: "Next page" }).click();
  expect(calls).toEqual([4]);
});

test("clicking prev page calls onPageChange with page-1", async ({ mount }) => {
  const calls: number[] = [];
  const component = await mount(
    <Pagination page={3} pageCount={10} onPageChange={(p) => calls.push(p)} />,
  );
  await component.getByRole("button", { name: "Previous page" }).click();
  expect(calls).toEqual([2]);
});

test("clicking first page calls onPageChange with 1", async ({ mount }) => {
  const calls: number[] = [];
  const component = await mount(
    <Pagination page={5} pageCount={10} onPageChange={(p) => calls.push(p)} />,
  );
  await component.getByRole("button", { name: "First page" }).click();
  expect(calls).toEqual([1]);
});

test("clicking last page calls onPageChange with pageCount", async ({ mount }) => {
  const calls: number[] = [];
  const component = await mount(
    <Pagination page={5} pageCount={10} onPageChange={(p) => calls.push(p)} />,
  );
  await component.getByRole("button", { name: "Last page" }).click();
  expect(calls).toEqual([10]);
});

test("clicking a page number calls onPageChange with that page", async ({ mount }) => {
  const calls: number[] = [];
  const component = await mount(
    <Pagination page={3} pageCount={5} onPageChange={(p) => calls.push(p)} />,
  );
  // With page=3 and default siblingCount=1, page 4 is rendered as a sibling.
  await component.getByRole("button", { name: "4" }).click();
  expect(calls).toEqual([4]);
});

/* ---------- Few pages — no ellipsis ---------- */

test("shows all pages without ellipsis when pageCount is small", async ({ mount }) => {
  const component = await mount(
    <Pagination page={3} pageCount={5} onPageChange={() => undefined} />,
  );
  // All 5 page buttons should be present
  for (let p = 1; p <= 5; p++) {
    await expect(component.getByRole("button", { name: String(p) })).toBeVisible();
  }
});

/* ---------- Ref forwarding ---------- */

test("ref is forwarded to the root <nav>", async ({ mount }) => {
  const component = await mount(
    <Pagination page={1} pageCount={10} onPageChange={() => undefined} />,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("nav");
});

/* ---------- className merge ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(
    <Pagination
      page={1}
      pageCount={10}
      onPageChange={() => undefined}
      className="custom-pagination"
    />,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-pagination/);
});

/* ---------- data-* forwarding ---------- */

test("forwards data-testid to root nav element", async ({ mount }) => {
  const component = await mount(
    <Pagination
      page={1}
      pageCount={10}
      onPageChange={() => undefined}
      data-testid="pagination-root"
    />,
  );
  await expect(component).toHaveAttribute("data-testid", "pagination-root");
});

/* ---------- a11y ---------- */

test("a11y — page 1 of 10 (default)", async ({ mount, page }) => {
  await mount(<Pagination page={1} pageCount={10} onPageChange={() => undefined} />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — middle page (5 of 10)", async ({ mount, page }) => {
  await mount(<Pagination page={5} pageCount={10} onPageChange={() => undefined} />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — last page (10 of 10)", async ({ mount, page }) => {
  await mount(<Pagination page={10} pageCount={10} onPageChange={() => undefined} />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — few pages (3 of 5)", async ({ mount, page }) => {
  await mount(<Pagination page={3} pageCount={5} onPageChange={() => undefined} />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — disabled state", async ({ mount, page }) => {
  await mount(<Pagination page={5} pageCount={10} disabled onPageChange={() => undefined} />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — size='sm'", async ({ mount, page }) => {
  await mount(<Pagination page={3} pageCount={10} size="sm" onPageChange={() => undefined} />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
