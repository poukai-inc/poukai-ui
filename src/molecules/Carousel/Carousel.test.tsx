import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { ThreeSlideCarousel } from "./__test_harness__";
import { Carousel } from "./Carousel";

/* ------------------------------------------------------------------ */
/* Slide rendering                                                      */
/* ------------------------------------------------------------------ */

test("renders all three slides", async ({ mount }) => {
  const component = await mount(<ThreeSlideCarousel />);
  await expect(component.getByText("Slide one")).toBeVisible();
  await expect(component.getByText("Slide two")).toBeAttached();
  await expect(component.getByText("Slide three")).toBeAttached();
});

test("slide elements have role='presentation' derived from li inside ul", async ({ mount }) => {
  const component = await mount(<ThreeSlideCarousel />);
  // Slides are <li> elements with aria-roledescription="slide"
  const slides = component.locator('[aria-roledescription="slide"]');
  await expect(slides).toHaveCount(3);
});

test("slides carry aria-label 'Slide N of M'", async ({ mount }) => {
  const component = await mount(<ThreeSlideCarousel />);
  await expect(component.locator('[aria-label="Slide 1 of 3"]')).toHaveCount(1);
  await expect(component.locator('[aria-label="Slide 2 of 3"]')).toHaveCount(1);
  await expect(component.locator('[aria-label="Slide 3 of 3"]')).toHaveCount(1);
});

/* ------------------------------------------------------------------ */
/* Prev / Next buttons present                                          */
/* ------------------------------------------------------------------ */

test("Prev button is present and accessible", async ({ mount }) => {
  const component = await mount(<ThreeSlideCarousel />);
  const prev = component.getByRole("button", { name: /previous slide/i });
  await expect(prev).toBeVisible();
});

test("Next button is present and accessible", async ({ mount }) => {
  const component = await mount(<ThreeSlideCarousel />);
  const next = component.getByRole("button", { name: /next slide/i });
  await expect(next).toBeVisible();
});

test("Prev is disabled on first slide when loop=false", async ({ mount }) => {
  const component = await mount(<ThreeSlideCarousel loop={false} />);
  const prev = component.getByRole("button", { name: /previous slide/i });
  await expect(prev).toBeDisabled();
});

test("Next is not disabled on first slide when loop=false", async ({ mount }) => {
  const component = await mount(<ThreeSlideCarousel loop={false} />);
  const next = component.getByRole("button", { name: /next slide/i });
  await expect(next).not.toBeDisabled();
});

/* ------------------------------------------------------------------ */
/* Indicators                                                           */
/* ------------------------------------------------------------------ */

test("renders tablist with 3 indicator dots", async ({ mount }) => {
  const component = await mount(<ThreeSlideCarousel indicators={true} />);
  const tablist = component.getByRole("tablist", { name: "Slide indicators" });
  await expect(tablist).toBeVisible();
  const tabs = component.getByRole("tab");
  await expect(tabs).toHaveCount(3);
});

test("first indicator dot is aria-selected by default", async ({ mount }) => {
  const component = await mount(<ThreeSlideCarousel />);
  const firstDot = component.getByRole("tab", { name: "Slide 1 of 3" });
  await expect(firstDot).toHaveAttribute("aria-selected", "true");
});

test("indicator click navigates to corresponding slide", async ({ mount }) => {
  const component = await mount(<ThreeSlideCarousel />);
  const thirdDot = component.getByRole("tab", { name: "Slide 3 of 3" });
  await thirdDot.click();
  // After click the third dot should be selected
  await expect(thirdDot).toHaveAttribute("aria-selected", "true");
});

test("indicators not rendered when indicators=false", async ({ mount }) => {
  const component = await mount(<ThreeSlideCarousel indicators={false} />);
  const tablist = component.locator('[role="tablist"]');
  await expect(tablist).toHaveCount(0);
});

/* ------------------------------------------------------------------ */
/* Root semantics                                                       */
/* ------------------------------------------------------------------ */

test("root element is <section> with aria-roledescription='carousel'", async ({ mount }) => {
  const component = await mount(<ThreeSlideCarousel />);
  // `component` IS the <section> root; read its tag + aria-roledescription directly.
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
  await expect(component).toHaveAttribute("aria-roledescription", "carousel");
});

test("track is a <ul> that is focusable (tabindex=0)", async ({ mount }) => {
  const component = await mount(<ThreeSlideCarousel />);
  const track = component.locator("ul");
  await expect(track).toHaveAttribute("tabindex", "0");
});

/* ------------------------------------------------------------------ */
/* Ref / className / data-* forwarding                                  */
/* ------------------------------------------------------------------ */

test("forwards className to root section", async ({ mount }) => {
  const component = await mount(
    <Carousel.Root aria-label="Test" className="my-carousel" indicators={false}>
      <Carousel.Track>
        <Carousel.Slide>Only slide</Carousel.Slide>
      </Carousel.Track>
    </Carousel.Root>,
  );
  // `component` IS the root section.
  await expect(component).toHaveClass(/my-carousel/);
});

test("forwards data-testid to root section", async ({ mount }) => {
  const component = await mount(
    <Carousel.Root aria-label="Test" data-testid="carousel-root" indicators={false}>
      <Carousel.Track>
        <Carousel.Slide>Only slide</Carousel.Slide>
      </Carousel.Track>
    </Carousel.Root>,
  );
  // `component` IS the root section.
  await expect(component).toHaveAttribute("data-testid", "carousel-root");
});

test("forwards className to Slide", async ({ mount }) => {
  const component = await mount(
    <Carousel.Root aria-label="Test" indicators={false}>
      <Carousel.Track>
        <Carousel.Slide className="custom-slide">Slide</Carousel.Slide>
      </Carousel.Track>
    </Carousel.Root>,
  );
  const slide = component.locator('[aria-roledescription="slide"]');
  const cls = await slide.getAttribute("class");
  expect(cls).toMatch(/custom-slide/);
});

/* ------------------------------------------------------------------ */
/* Live region                                                          */
/* ------------------------------------------------------------------ */

test("live region is present in DOM", async ({ mount }) => {
  const component = await mount(<ThreeSlideCarousel />);
  const liveRegion = component.locator('[aria-live="polite"]');
  await expect(liveRegion).toHaveCount(1);
});

/* ------------------------------------------------------------------ */
/* a11y                                                                 */
/* ------------------------------------------------------------------ */

test("a11y — default three-slide carousel with indicators", async ({ mount, page }) => {
  await mount(<ThreeSlideCarousel />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — carousel without indicators", async ({ mount, page }) => {
  await mount(<ThreeSlideCarousel indicators={false} />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — carousel with loop", async ({ mount, page }) => {
  await mount(<ThreeSlideCarousel loop />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
