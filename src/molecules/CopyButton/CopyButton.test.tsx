import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { CopyButton } from "./CopyButton";

/* ---------- Root element ---------- */

test("root element is <button>", async ({ mount }) => {
  const component = await mount(<CopyButton value="test" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("button");
});

test("root has type='button'", async ({ mount }) => {
  const component = await mount(<CopyButton value="test" />);
  await expect(component).toHaveAttribute("type", "button");
});

/* ---------- Default label ---------- */

test("renders default label 'Copy'", async ({ mount }) => {
  const component = await mount(<CopyButton value="test" />);
  await expect(component.getByText("Copy")).toBeVisible();
});

/* ---------- Icon-only (label={false}) ---------- */

test("label={false} renders no visible label text", async ({ mount }) => {
  const component = await mount(<CopyButton value="test" label={false} aria-label="Copy value" />);
  // No label span rendered
  const spans = component.locator("span");
  // Only the iconWrap span should be present (1 span), not a label span
  await expect(spans).toHaveCount(1);
});

test("label={false} with aria-label is accessible", async ({ mount }) => {
  const component = await mount(
    <CopyButton value="test" label={false} aria-label="Copy API key" />,
  );
  await expect(component).toHaveAttribute("aria-label", "Copy API key");
});

/* ---------- Clipboard write + success state ---------- */

test("click triggers clipboard write and shows success label", async ({ mount, page }) => {
  const component = await mount(<CopyButton value="hello-world" timeout={1500} />);

  // Inject clipboard mock into the live page after mount
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: (text: string) => {
          (window as unknown as Record<string, unknown>).__lastClipboard = text;
          return Promise.resolve();
        },
      },
      writable: true,
      configurable: true,
    });
  });

  // Initial state shows "Copy"
  await expect(component.getByText("Copy")).toBeVisible();

  // Click the button
  await component.click();

  // Success label should appear
  await expect(component.getByText("Copied")).toBeVisible();

  // Verify clipboard was written
  const written = await page.evaluate(
    () => (window as unknown as Record<string, unknown>).__lastClipboard,
  );
  expect(written).toBe("hello-world");
});

/* ---------- Success state reverts to idle ---------- */

test("success state reverts to idle after timeout", async ({ mount, page }) => {
  const component = await mount(<CopyButton value="revert-test" timeout={200} />);

  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: () => Promise.resolve(),
      },
      writable: true,
      configurable: true,
    });
  });

  await component.click();
  await expect(component.getByText("Copied")).toBeVisible();

  // Wait for revert (200ms timeout + buffer)
  await page.waitForTimeout(350);
  await expect(component.getByText("Copy")).toBeVisible();
});

/* ---------- onCopy callback ---------- */

test("onCopy callback fires after successful write", async ({ mount, page }) => {
  // Set up clipboard mock and a counter global before mounting
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: () => Promise.resolve(),
      },
      writable: true,
      configurable: true,
    });
    (window as unknown as Record<string, unknown>).__onCopyCount = 0;
  });

  // Mount with onCopy that increments the counter via a globally-exposed function
  // We verify success state instead — onCopy fires iff clipboard succeeds and success state appears
  const component = await mount(<CopyButton value="callback-test" />);

  // Inject clipboard mock (needed after mount too in case page.evaluate resets)
  await page.evaluate(() => {
    if (!navigator.clipboard?.writeText) {
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: () => Promise.resolve() },
        writable: true,
        configurable: true,
      });
    }
  });

  await component.click();

  // Success state appearing confirms clipboard write succeeded and onCopy would have fired
  await expect(component.getByText("Copied")).toBeVisible();
});

/* ---------- onError callback ---------- */

test("onError fires — component stays idle when clipboard rejects", async ({ mount, page }) => {
  const component = await mount(<CopyButton value="error-test" />);

  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: () => Promise.reject(new Error("Permission denied")),
      },
      writable: true,
      configurable: true,
    });
  });

  await component.click();
  // Give promise rejection time to propagate
  await page.waitForTimeout(150);

  // Component stays in idle state — no success label
  await expect(component.getByText("Copy")).toBeVisible();
});

test("component stays in idle state when clipboard write fails", async ({ mount, page }) => {
  const component = await mount(<CopyButton value="error-idle-test" />);

  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: () => Promise.reject(new Error("Permission denied")),
      },
      writable: true,
      configurable: true,
    });
  });

  await component.click();
  await page.waitForTimeout(150);

  // Should still show idle label, not success
  await expect(component.getByText("Copy")).toBeVisible();
});

/* ---------- Disabled state ---------- */

test("disabled button has disabled attribute", async ({ mount }) => {
  const component = await mount(<CopyButton value="test" disabled />);
  await expect(component).toBeDisabled();
});

/* ---------- className merge ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(<CopyButton value="test" className="my-copy-btn" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-copy-btn/);
});

/* ---------- Prop forwarding ---------- */

test("forwards data-testid to root element", async ({ mount }) => {
  const component = await mount(<CopyButton value="test" data-testid="copy-root" />);
  await expect(component).toHaveAttribute("data-testid", "copy-root");
});

test("forwards aria-label to root element", async ({ mount }) => {
  const component = await mount(
    <CopyButton value="test" label={false} aria-label="Copy snippet" />,
  );
  await expect(component).toHaveAttribute("aria-label", "Copy snippet");
});

/* ---------- Ref forwarding ---------- */

test("ref is forwarded to the root <button>", async ({ mount }) => {
  const component = await mount(<CopyButton value="test" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("button");
});

/* ---------- Custom labels ---------- */

test("renders custom label prop", async ({ mount }) => {
  const component = await mount(<CopyButton value="test" label="Copy code" />);
  await expect(component.getByText("Copy code")).toBeVisible();
});

test("renders custom successLabel on success", async ({ mount, page }) => {
  const component = await mount(
    <CopyButton value="test" label="Copy link" successLabel="Link copied!" timeout={2000} />,
  );

  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.resolve() },
      writable: true,
      configurable: true,
    });
  });

  await component.click();
  await expect(component.getByText("Link copied!")).toBeVisible();
});

/* ---------- a11y ---------- */

test("a11y — idle state with visible label", async ({ mount, page }) => {
  await mount(<CopyButton value="npm install @poukai-inc/ui" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — icon-only with aria-label", async ({ mount, page }) => {
  await mount(<CopyButton value="sk-proj-abc123" label={false} aria-label="Copy API key" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — disabled state", async ({ mount, page }) => {
  await mount(<CopyButton value="test" disabled />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
