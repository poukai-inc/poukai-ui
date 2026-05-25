import { test, expect } from "@playwright/experimental-ct-react";
import { ArticleHeader } from "./ArticleHeader";
import { Byline } from "../../molecules/Byline";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const DefaultByline = (
  <Byline name="Arian Zargaran" role="Founder" publishedAt="2026-05-24" readTime="4 min read" />
);

const defaultProps = {
  eyebrow: "Engineering",
  title: "Why we build in the open.",
  lede: "A short summary of the article for readers skimming the page.",
  byline: DefaultByline,
};

// ---------------------------------------------------------------------------
// Rendering: slots
// ---------------------------------------------------------------------------

test("renders the eyebrow text", async ({ mount }) => {
  const component = await mount(<ArticleHeader {...defaultProps} />);
  await expect(component.getByText("Engineering")).toBeVisible();
});

test("renders the title as an h1", async ({ mount }) => {
  const component = await mount(<ArticleHeader {...defaultProps} />);
  const h1 = component.locator("h1");
  await expect(h1).toBeVisible();
  await expect(h1).toContainText("Why we build in the open.");
});

test("renders the lede text", async ({ mount }) => {
  const component = await mount(<ArticleHeader {...defaultProps} />);
  await expect(
    component.getByText("A short summary of the article for readers skimming the page."),
  ).toBeVisible();
});

test("renders the byline slot", async ({ mount }) => {
  const component = await mount(<ArticleHeader {...defaultProps} />);
  await expect(component.getByText("Arian Zargaran")).toBeVisible();
});

test("renders the share slot when provided", async ({ mount }) => {
  const component = await mount(
    <ArticleHeader {...defaultProps} share={<div data-testid="share-slot">Share this</div>} />,
  );
  await expect(component.locator("[data-testid='share-slot']")).toBeVisible();
  await expect(component.getByText("Share this")).toBeVisible();
});

test("does not render share slot when omitted", async ({ mount }) => {
  const component = await mount(<ArticleHeader {...defaultProps} />);
  await expect(component.locator("[data-testid='share-slot']")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Title accepts ReactNode (em for italic accent)
// ---------------------------------------------------------------------------

test("renders em-accented title", async ({ mount }) => {
  const component = await mount(
    <ArticleHeader
      {...defaultProps}
      title={
        <>
          Building with <em>AI</em>.
        </>
      }
    />,
  );
  const h1 = component.locator("h1");
  await expect(h1).toContainText("Building with AI.");
  await expect(h1.locator("em")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------

test("applies withDivider class when divider=true", async ({ mount }) => {
  const component = await mount(<ArticleHeader {...defaultProps} divider />);
  await expect(component).toHaveClass(/withDivider/);
});

test("does not apply withDivider class when divider=false", async ({ mount }) => {
  const component = await mount(<ArticleHeader {...defaultProps} divider={false} />);
  await expect(component).not.toHaveClass(/withDivider/);
});

test("does not apply withDivider class when divider is omitted", async ({ mount }) => {
  const component = await mount(<ArticleHeader {...defaultProps} />);
  await expect(component).not.toHaveClass(/withDivider/);
});

// ---------------------------------------------------------------------------
// Root element is header
// ---------------------------------------------------------------------------

test("root element is a header", async ({ mount }) => {
  const component = await mount(<ArticleHeader {...defaultProps} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("header");
});

// ---------------------------------------------------------------------------
// ref / className / data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(
    <ArticleHeader {...defaultProps} className="custom-article-header" />,
  );
  await expect(component).toHaveClass(/custom-article-header/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(<ArticleHeader {...defaultProps} data-testid="ah-root" />);
  await expect(component).toHaveAttribute("data-testid", "ah-root");
});

test("forwards aria-* attributes to root element", async ({ mount }) => {
  const component = await mount(<ArticleHeader {...defaultProps} aria-label="Article header" />);
  await expect(component).toHaveAttribute("aria-label", "Article header");
});
