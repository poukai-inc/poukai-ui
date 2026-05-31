/**
 * ProgressBar CT tests.
 *
 * Covers: role/aria semantics, determinate value rendering, indeterminate mode,
 * out-of-range clamping, tone/size data-attributes, className/ref forwarding.
 */
import { test, expect } from "@playwright/experimental-ct-react";
import { ProgressBar } from "./ProgressBar";

/* ---------- Role / ARIA semantics ---------- */

test("renders with role='progressbar'", async ({ mount }) => {
  const component = await mount(<ProgressBar value={50} aria-label="Loading" />);
  await expect(component).toHaveAttribute("role", "progressbar");
});

test("aria-valuemin is always 0", async ({ mount }) => {
  const component = await mount(<ProgressBar value={50} aria-label="Loading" />);
  await expect(component).toHaveAttribute("aria-valuemin", "0");
});

test("aria-valuemax is always 100", async ({ mount }) => {
  const component = await mount(<ProgressBar value={50} aria-label="Loading" />);
  await expect(component).toHaveAttribute("aria-valuemax", "100");
});

test("determinate: aria-valuenow reflects the value prop", async ({ mount }) => {
  const component = await mount(<ProgressBar value={42} aria-label="Upload progress" />);
  await expect(component).toHaveAttribute("aria-valuenow", "42");
});

test("determinate value=0: aria-valuenow is '0'", async ({ mount }) => {
  const component = await mount(<ProgressBar value={0} aria-label="Loading" />);
  await expect(component).toHaveAttribute("aria-valuenow", "0");
});

test("determinate value=100: aria-valuenow is '100'", async ({ mount }) => {
  const component = await mount(<ProgressBar value={100} aria-label="Loading" />);
  await expect(component).toHaveAttribute("aria-valuenow", "100");
});

/* ---------- Indeterminate mode ---------- */

test("indeterminate: omitting value results in no aria-valuenow attribute", async ({ mount }) => {
  const component = await mount(<ProgressBar aria-label="Generating" />);
  const valuenow = await component.getAttribute("aria-valuenow");
  expect(valuenow).toBeNull();
});

test("indeterminate: aria-valuemin and aria-valuemax are still present", async ({ mount }) => {
  const component = await mount(<ProgressBar aria-label="Generating" />);
  await expect(component).toHaveAttribute("aria-valuemin", "0");
  await expect(component).toHaveAttribute("aria-valuemax", "100");
});

/* ---------- Out-of-range clamping ---------- */

test("value below 0 is clamped to 0 in aria-valuenow", async ({ mount }) => {
  const component = await mount(<ProgressBar value={-10} aria-label="Clamped" />);
  await expect(component).toHaveAttribute("aria-valuenow", "0");
});

test("value above 100 is clamped to 100 in aria-valuenow", async ({ mount }) => {
  const component = await mount(<ProgressBar value={150} aria-label="Clamped" />);
  await expect(component).toHaveAttribute("aria-valuenow", "100");
});

/* ---------- aria-label / aria-labelledby ---------- */

test("aria-label is forwarded to the root element", async ({ mount }) => {
  const component = await mount(<ProgressBar value={60} aria-label="Uploading report.pdf" />);
  await expect(component).toHaveAttribute("aria-label", "Uploading report.pdf");
});

test("aria-labelledby is forwarded to the root element", async ({ mount }) => {
  const component = await mount(
    <div>
      <p id="pb-test-label">Uploading</p>
      <ProgressBar value={60} aria-labelledby="pb-test-label" />
    </div>,
  );
  const pb = component.locator("[role='progressbar']");
  await expect(pb).toHaveAttribute("aria-labelledby", "pb-test-label");
});

/* ---------- data-size / data-tone ---------- */

test("size='md' sets data-size='md' on root (default)", async ({ mount }) => {
  const component = await mount(<ProgressBar value={50} aria-label="Loading" />);
  await expect(component).toHaveAttribute("data-size", "md");
});

test("size='sm' sets data-size='sm' on root", async ({ mount }) => {
  const component = await mount(<ProgressBar value={50} size="sm" aria-label="Loading" />);
  await expect(component).toHaveAttribute("data-size", "sm");
});

test("tone='default' sets data-tone='default' on root (default)", async ({ mount }) => {
  const component = await mount(<ProgressBar value={50} aria-label="Loading" />);
  await expect(component).toHaveAttribute("data-tone", "default");
});

test("tone='success' sets data-tone='success' on root", async ({ mount }) => {
  const component = await mount(<ProgressBar value={100} tone="success" aria-label="Done" />);
  await expect(component).toHaveAttribute("data-tone", "success");
});

test("tone='warning' sets data-tone='warning' on root", async ({ mount }) => {
  const component = await mount(<ProgressBar value={75} tone="warning" aria-label="Warning" />);
  await expect(component).toHaveAttribute("data-tone", "warning");
});

test("tone='danger' sets data-tone='danger' on root", async ({ mount }) => {
  const component = await mount(<ProgressBar value={20} tone="danger" aria-label="Error" />);
  await expect(component).toHaveAttribute("data-tone", "danger");
});

/* ---------- className / ref forwarding ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(
    <ProgressBar value={50} aria-label="Loading" className="my-progress" />,
  );
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/my-progress/);
});

test("ref is forwarded to the root <div>", async ({ mount }) => {
  const component = await mount(<ProgressBar value={50} aria-label="Loading" data-testid="pb" />);
  await expect(component).toHaveAttribute("data-testid", "pb");
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test("forwards data-* props to the root element", async ({ mount }) => {
  const component = await mount(
    <ProgressBar value={50} aria-label="Loading" data-testid="pb-root" />,
  );
  await expect(component).toHaveAttribute("data-testid", "pb-root");
});
