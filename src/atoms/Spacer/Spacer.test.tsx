import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Spacer, type SpacerProps } from "./Spacer";

const ALL_SIZES: NonNullable<SpacerProps["size"]>[] = ["1", "2", "3", "4", "6", "8", "10"];
const SPACE_PX: Record<string, number> = {
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "6": 24,
  "8": 32,
  "10": 40,
};

/* ---------- Defaults ---------- */

test("renders without children", async ({ mount }) => {
  const component = await mount(<Spacer size="4" />);
  await expect(component).toBeVisible();
});

test("default root element is div", async ({ mount }) => {
  const component = await mount(<Spacer size="4" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test("always sets aria-hidden=true (default div)", async ({ mount }) => {
  const component = await mount(<Spacer size="4" />);
  await expect(component).toHaveAttribute("aria-hidden", "true");
});

test("always sets aria-hidden=true (as=span)", async ({ mount }) => {
  const component = await mount(<Spacer as="span" size="4" />);
  await expect(component).toHaveAttribute("aria-hidden", "true");
});

test("consumer aria-hidden override is ignored — atom always announces decorative", async ({
  mount,
}) => {
  const component = await mount(
    // @ts-expect-error — aria-hidden is intentionally omitted from the public prop surface.
    <Spacer size="4" aria-hidden="false" />,
  );
  await expect(component).toHaveAttribute("aria-hidden", "true");
});

/* ---------- as ---------- */

test("as=span renders a span element", async ({ mount }) => {
  const component = await mount(<Spacer as="span" size="4" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("span");
});

test("as=div explicit renders a div element", async ({ mount }) => {
  const component = await mount(<Spacer as="div" size="4" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

/* ---------- size × block axis ---------- */

for (const size of ALL_SIZES) {
  test(`size=${size} (block) renders height of var(--space-${size}) (${SPACE_PX[size]}px)`, async ({
    mount,
  }) => {
    const component = await mount(<Spacer size={size} data-testid={`block-${size}`} />);
    const dims = await component.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { height: style.height, width: style.width, display: style.display };
    });
    expect(parseFloat(dims.height)).toBeCloseTo(SPACE_PX[size], 1);
    expect(dims.display).toBe("block");
  });
}

/* ---------- size × inline axis ---------- */

for (const size of ALL_SIZES) {
  test(`size=${size} (inline) renders width of var(--space-${size}) (${SPACE_PX[size]}px)`, async ({
    mount,
  }) => {
    const component = await mount(
      <Spacer as="span" axis="inline" size={size} data-testid={`inline-${size}`} />,
    );
    const dims = await component.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { height: style.height, width: style.width, display: style.display };
    });
    expect(parseFloat(dims.width)).toBeCloseTo(SPACE_PX[size], 1);
    expect(dims.display).toBe("inline-block");
  });
}

/* ---------- axis defaults ---------- */

test("axis defaults to block", async ({ mount }) => {
  const component = await mount(<Spacer size="4" />);
  const display = await component.evaluate((el) => window.getComputedStyle(el).display);
  expect(display).toBe("block");
});

test("axis=inline applies inline-block display", async ({ mount }) => {
  const component = await mount(<Spacer as="span" axis="inline" size="4" />);
  const display = await component.evaluate((el) => window.getComputedStyle(el).display);
  expect(display).toBe("inline-block");
});

/* ---------- className merge ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(<Spacer size="4" className="custom-gap" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-gap/);
  expect(className).toMatch(/size4Block/);
});

/* ---------- ref forwarding ---------- */

test("forwards ref to div element", async ({ mount }) => {
  const component = await mount(<Spacer size="4" data-testid="ref-div" />);
  await expect(component).toHaveAttribute("data-testid", "ref-div");
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test("forwards ref to span element", async ({ mount }) => {
  const component = await mount(<Spacer as="span" size="4" data-testid="ref-span" />);
  await expect(component).toHaveAttribute("data-testid", "ref-span");
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("span");
});

/* ---------- ...rest forwarding ---------- */

test("forwards data-* props to root element", async ({ mount }) => {
  const component = await mount(<Spacer size="4" data-testid="rest" data-section="prose" />);
  await expect(component).toHaveAttribute("data-testid", "rest");
  await expect(component).toHaveAttribute("data-section", "prose");
});

/* ---------- axe a11y ---------- */

test("a11y — default (div, block)", async ({ mount, page }) => {
  await mount(
    <div>
      <p>Above</p>
      <Spacer size="4" />
      <p>Below</p>
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — inline span between inline content", async ({ mount, page }) => {
  await mount(
    <p>
      Left
      <Spacer as="span" axis="inline" size="3" />
      Right
    </p>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

/* a11y gate also covered in src/a11y.test.tsx (central gate). */
