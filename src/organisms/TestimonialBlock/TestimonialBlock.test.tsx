import { test, expect } from "@playwright/experimental-ct-react";
import { TestimonialBlock } from "./TestimonialBlock";
import { Byline } from "../../molecules/Byline";
import { Portrait } from "../../molecules/Portrait";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const defaultProps = {
  quote: "Changed how our team ships.",
  byline: <Byline name="Jane Doe" role="Head of Design, Acme" />,
};

// ---------------------------------------------------------------------------
// Rendering: Quote + Byline
// ---------------------------------------------------------------------------

test("renders quote text", async ({ mount }) => {
  const component = await mount(<TestimonialBlock {...defaultProps} />);
  await expect(component.locator("blockquote")).toBeVisible();
  await expect(component.locator("blockquote")).toContainText("Changed how our team ships.");
});

test("renders byline name", async ({ mount }) => {
  const component = await mount(<TestimonialBlock {...defaultProps} />);
  await expect(component.getByText("Jane Doe")).toBeVisible();
});

test("renders byline role when provided", async ({ mount }) => {
  const component = await mount(<TestimonialBlock {...defaultProps} />);
  await expect(component.getByText("Head of Design, Acme")).toBeVisible();
});

test("renders as a section element", async ({ mount }) => {
  const component = await mount(<TestimonialBlock {...defaultProps} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

// ---------------------------------------------------------------------------
// Rendering: Portrait slot
// ---------------------------------------------------------------------------

test("renders portrait when provided", async ({ mount }) => {
  const component = await mount(
    <TestimonialBlock
      {...defaultProps}
      portrait={
        <Portrait
          src="https://picsum.photos/seed/test-portrait/120/120"
          alt="Jane Doe headshot"
          aspect="1:1"
          width={120}
        />
      }
    />,
  );
  const img = component.locator("img");
  await expect(img).toBeVisible();
});

test("does not render portrait slot when portrait is omitted", async ({ mount }) => {
  const component = await mount(<TestimonialBlock {...defaultProps} />);
  await expect(component.locator("img")).toHaveCount(0);
});

test("portrait slot is present in the DOM when portrait is provided", async ({ mount }) => {
  const component = await mount(
    <TestimonialBlock
      {...defaultProps}
      portrait={<div data-testid="portrait-slot">Portrait</div>}
    />,
  );
  await expect(component.locator("[data-testid='portrait-slot']")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Orientation
// ---------------------------------------------------------------------------

test("applies orientationHorizontal class when orientation=horizontal", async ({ mount }) => {
  const component = await mount(<TestimonialBlock {...defaultProps} orientation="horizontal" />);
  await expect(component).toHaveClass(/orientationHorizontal/);
});

test("does not apply orientationHorizontal class when orientation=stacked", async ({ mount }) => {
  const component = await mount(<TestimonialBlock {...defaultProps} orientation="stacked" />);
  await expect(component).not.toHaveClass(/orientationHorizontal/);
});

test("defaults to stacked orientation", async ({ mount }) => {
  const component = await mount(<TestimonialBlock {...defaultProps} />);
  await expect(component).not.toHaveClass(/orientationHorizontal/);
});

// ---------------------------------------------------------------------------
// Alignment
// ---------------------------------------------------------------------------

test("applies alignStart class when align=start", async ({ mount }) => {
  const component = await mount(<TestimonialBlock {...defaultProps} align="start" />);
  await expect(component).toHaveClass(/alignStart/);
});

test("does not apply alignStart class when align=center", async ({ mount }) => {
  const component = await mount(<TestimonialBlock {...defaultProps} align="center" />);
  await expect(component).not.toHaveClass(/alignStart/);
});

test("defaults to center alignment", async ({ mount }) => {
  const component = await mount(<TestimonialBlock {...defaultProps} />);
  await expect(component).not.toHaveClass(/alignStart/);
});

// ---------------------------------------------------------------------------
// In horizontal layout, portrait is placed in the byline row
// ---------------------------------------------------------------------------

test("in horizontal orientation, portrait appears in bylineRow alongside byline", async ({
  mount,
}) => {
  const component = await mount(
    <TestimonialBlock
      {...defaultProps}
      orientation="horizontal"
      portrait={<div data-testid="horiz-portrait">Portrait</div>}
    />,
  );
  const bylineRow = component.locator("[class*='bylineRow']");
  await expect(bylineRow).toBeVisible();
  await expect(bylineRow.locator("[data-testid='horiz-portrait']")).toBeVisible();
});

// ---------------------------------------------------------------------------
// ReactNode quote slot (with emphasis)
// ---------------------------------------------------------------------------

test("renders ReactNode quote with emphasis", async ({ mount }) => {
  const component = await mount(
    <TestimonialBlock
      quote={
        <>
          Changed with <em>great speed</em>.
        </>
      }
      byline={<Byline name="Jane Doe" role="Head of Design" />}
    />,
  );
  await expect(component.locator("em")).toBeVisible();
  await expect(component.locator("em")).toContainText("great speed");
});

// ---------------------------------------------------------------------------
// ref / className / data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(
    <TestimonialBlock {...defaultProps} className="custom-testimonial" />,
  );
  await expect(component).toHaveClass(/custom-testimonial/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(<TestimonialBlock {...defaultProps} data-testid="tb-root" />);
  await expect(component).toHaveAttribute("data-testid", "tb-root");
});

test("forwards aria-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <TestimonialBlock {...defaultProps} aria-label="Customer testimonial" />,
  );
  await expect(component).toHaveAttribute("aria-label", "Customer testimonial");
});
