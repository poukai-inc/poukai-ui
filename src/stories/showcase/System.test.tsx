import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";

import { All } from "./System.stories";

/**
 * a11y gate for the System / Reference story.
 *
 * The story mounts the full system reference — every section, every piece,
 * end-to-end. axe is run with isolated-mount best-practice rules suppressed
 * (matches the pattern in src/a11y.test.tsx — the story is a mount, not a
 * deployed document, so landmark-one-main / page-has-heading-one / region
 * would fire spuriously).
 *
 * `landmark-main-is-top-level` is also suppressed because SiteShellFull
 * (inside the Organisms section) renders a `<main>` element nested inside the
 * showcase's section landmark. In real use SiteShell IS the page chrome and
 * its `<main>` is top-level; here it's exhibited as one of many pieces.
 */

const AXE_ISOLATED_MOUNT_RULES = [
  "landmark-one-main",
  "page-has-heading-one",
  "region",
  "landmark-main-is-top-level",
] as const;

test("a11y — System / Reference story", async ({ mount, page }) => {
  await mount(<All />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules([...AXE_ISOLATED_MOUNT_RULES])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
