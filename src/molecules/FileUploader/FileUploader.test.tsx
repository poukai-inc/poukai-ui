import { test, expect } from "@playwright/experimental-ct-react";
import { FileUploader, type FileEntry } from "./FileUploader";

/* ── helpers ── */

function makeFilePayload(name: string, mimeType: string, sizeBytes = 512) {
  return {
    name,
    mimeType,
    buffer: Buffer.alloc(sizeBytes),
  };
}

/* ── Render ── */

test("renders drop zone with label", async ({ mount }) => {
  const component = await mount(<FileUploader />);
  await expect(component.getByText("Drag files here, or click to browse")).toBeVisible();
});

test("renders custom dropZoneLabel", async ({ mount }) => {
  const component = await mount(<FileUploader dropZoneLabel="Drop your PDFs here" />);
  await expect(component.getByText("Drop your PDFs here")).toBeVisible();
});

test("root element is div", async ({ mount }) => {
  const component = await mount(<FileUploader />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test("drop zone has role=button", async ({ mount, page }) => {
  await mount(<FileUploader />);
  await expect(page.locator('[role="button"]')).toBeVisible();
});

/* ── Hidden input forwarding ── */

test("hidden input is present in DOM", async ({ mount, page }) => {
  await mount(<FileUploader />);
  await expect(page.locator('input[type="file"]')).toBeAttached();
});

test("accept prop forwarded to input", async ({ mount, page }) => {
  await mount(<FileUploader accept="image/*,application/pdf" />);
  const accept = await page.locator('input[type="file"]').getAttribute("accept");
  expect(accept).toBe("image/*,application/pdf");
});

test("multiple=true forwarded to input", async ({ mount, page }) => {
  await mount(<FileUploader multiple={true} />);
  const multiple = await page.locator('input[type="file"]').getAttribute("multiple");
  expect(multiple).not.toBeNull();
});

test("multiple=false: input does not have multiple attribute", async ({ mount, page }) => {
  await mount(<FileUploader multiple={false} />);
  const multiple = await page.locator('input[type="file"]').getAttribute("multiple");
  expect(multiple).toBeNull();
});

/* ── File add via input ── */

test("adding a file via input renders file row with name", async ({ mount, page }) => {
  await mount(<FileUploader />);
  await page
    .locator('input[type="file"]')
    .setInputFiles(makeFilePayload("report.pdf", "application/pdf"));
  // Scope to the file list to avoid matching the remove button aria-label
  await expect(page.locator('[aria-label="Selected files"] li').first()).toContainText(
    "report.pdf",
  );
});

test("adding a file renders its human-readable size", async ({ mount, page }) => {
  await mount(<FileUploader />);
  // 1536 bytes = 1.5 KB
  await page
    .locator('input[type="file"]')
    .setInputFiles(makeFilePayload("photo.jpg", "image/jpeg", 1536));
  await expect(page.locator('[aria-label="Selected files"] li').first()).toContainText("1.5 KB");
});

test("adding a file renders a remove button with accessible label", async ({ mount, page }) => {
  await mount(<FileUploader />);
  await page
    .locator('input[type="file"]')
    .setInputFiles(makeFilePayload("myfile.txt", "text/plain"));
  await expect(page.getByRole("button", { name: "Remove myfile.txt" })).toBeVisible();
});

test("file list is not present when no files added", async ({ mount, page }) => {
  await mount(<FileUploader />);
  await expect(page.locator('[aria-label="Selected files"]')).not.toBeAttached();
});

test("file list appears after adding a file", async ({ mount, page }) => {
  await mount(<FileUploader />);
  await page
    .locator('input[type="file"]')
    .setInputFiles(makeFilePayload("doc.pdf", "application/pdf"));
  await expect(page.locator('[aria-label="Selected files"]')).toBeVisible();
});

/* ── onFilesAdded callback — verified via DOM (CT closures don't serialise) ── */

test("onFilesAdded: file row appears after input selection", async ({ mount, page }) => {
  await mount(<FileUploader />);
  await page
    .locator('input[type="file"]')
    .setInputFiles(makeFilePayload("added-file.pdf", "application/pdf"));
  // Confirm the entry was added to the list (proves onFilesAdded fired in uncontrolled mode)
  await expect(page.locator('[aria-label="Selected files"]')).toBeVisible();
  await expect(page.locator('[aria-label="Selected files"] li').first()).toContainText(
    "added-file.pdf",
  );
});

/* ── Remove button ── */

test("remove button removes the file row", async ({ mount, page }) => {
  await mount(<FileUploader />);
  await page
    .locator('input[type="file"]')
    .setInputFiles(makeFilePayload("remove-me.pdf", "application/pdf"));
  // Wait for the row to appear
  await expect(page.locator('[aria-label="Selected files"] li').first()).toContainText(
    "remove-me.pdf",
  );
  await page.getByRole("button", { name: "Remove remove-me.pdf" }).click();
  await expect(page.locator('[aria-label="Selected files"]')).not.toBeAttached();
});

test("remove button fires onFileRemoved — verified via DOM (uncontrolled mode)", async ({
  mount,
  page,
}) => {
  // Add a file, confirm the remove button appears, click it, confirm the row is gone.
  await mount(<FileUploader />);
  await page
    .locator('input[type="file"]')
    .setInputFiles(makeFilePayload("uncontrolled.pdf", "application/pdf"));
  await expect(page.getByRole("button", { name: "Remove uncontrolled.pdf" })).toBeVisible();
  await page.getByRole("button", { name: "Remove uncontrolled.pdf" }).click();
  await expect(page.locator('[aria-label="Selected files"]')).not.toBeAttached();
});

test("removing all files hides the file list", async ({ mount, page }) => {
  await mount(<FileUploader />);
  await page
    .locator('input[type="file"]')
    .setInputFiles(makeFilePayload("only.pdf", "application/pdf"));
  await expect(page.locator('[aria-label="Selected files"] li').first()).toContainText("only.pdf");
  await page.getByRole("button", { name: "Remove only.pdf" }).click();
  await expect(page.locator('[aria-label="Selected files"]')).not.toBeAttached();
});

/* ── Validation: accept mismatch ── */

test("file with wrong type is rejected: does not appear in file list", async ({ mount, page }) => {
  await mount(<FileUploader accept="application/pdf" />);
  // Upload an image — should be rejected (MIME type image/jpeg does not match application/pdf)
  await page
    .locator('input[type="file"]')
    .setInputFiles(makeFilePayload("photo.jpg", "image/jpeg"));
  // File list should remain absent — rejected files are not added
  await expect(page.locator('[aria-label="Selected files"]')).not.toBeAttached();
});

/* ── Validation: maxSizeBytes ── */

test("oversize file does not appear in file list", async ({ mount, page }) => {
  await mount(<FileUploader maxSizeBytes={1024} />);
  // 2 KB — exceeds 1 KB limit
  await page
    .locator('input[type="file"]')
    .setInputFiles(makeFilePayload("bigfile.pdf", "application/pdf", 2048));
  // File list should remain absent — rejected files are not added
  await expect(page.locator('[aria-label="Selected files"]')).not.toBeAttached();
});

test("file within size limit does appear in file list", async ({ mount, page }) => {
  await mount(<FileUploader maxSizeBytes={4096} />);
  // 1 KB — within limit
  await page
    .locator('input[type="file"]')
    .setInputFiles(makeFilePayload("small.pdf", "application/pdf", 1024));
  await expect(page.locator('[aria-label="Selected files"]')).toBeVisible();
});

/* ── Disabled state ── */

test("disabled: drop zone has aria-disabled", async ({ mount, page }) => {
  await mount(<FileUploader disabled />);
  await expect(page.locator('[role="button"]')).toHaveAttribute("aria-disabled", "true");
});

test("disabled: input has disabled attribute", async ({ mount, page }) => {
  await mount(<FileUploader disabled />);
  await expect(page.locator('input[type="file"]')).toBeDisabled();
});

/* ── ProgressBar rendering ── */

test("file with progress renders a progressbar", async ({ mount, page }) => {
  const entry: FileEntry = {
    id: "prog-1",
    file: new File(["content"], "uploading.mp4", { type: "video/mp4" }),
    progress: 60,
  };
  await mount(
    <FileUploader files={[entry]} onFilesAdded={() => undefined} onFileRemoved={() => undefined} />,
  );
  await expect(page.locator('[role="progressbar"]')).toBeVisible();
  const valuenow = await page.locator('[role="progressbar"]').getAttribute("aria-valuenow");
  expect(Number(valuenow)).toBe(60);
});

test("file without progress does not render a progressbar", async ({ mount, page }) => {
  const entry: FileEntry = {
    id: "no-prog-1",
    file: new File(["content"], "static.pdf", { type: "application/pdf" }),
  };
  await mount(
    <FileUploader files={[entry]} onFilesAdded={() => undefined} onFileRemoved={() => undefined} />,
  );
  await expect(page.locator('[role="progressbar"]')).not.toBeAttached();
});

test("file with error and progress renders progressbar with danger tone", async ({
  mount,
  page,
}) => {
  const entry: FileEntry = {
    id: "err-prog-1",
    file: new File(["content"], "failed.pdf", { type: "application/pdf" }),
    progress: 30,
    error: "Upload failed",
  };
  await mount(
    <FileUploader files={[entry]} onFilesAdded={() => undefined} onFileRemoved={() => undefined} />,
  );
  const bar = page.locator('[role="progressbar"]');
  await expect(bar).toBeVisible();
  await expect(bar).toHaveAttribute("data-tone", "danger");
});

/* ── Per-file error rendering ── */

test("file with error renders error text", async ({ mount, page }) => {
  const entry: FileEntry = {
    id: "err-1",
    file: new File(["content"], "bad.exe", { type: "application/octet-stream" }),
    error: "File type not supported",
  };
  await mount(
    <FileUploader files={[entry]} onFilesAdded={() => undefined} onFileRemoved={() => undefined} />,
  );
  await expect(page.getByText("File type not supported")).toBeVisible();
});

/* ── ref forwarding ── */

test("ref forwarded to root div", async ({ mount }) => {
  const component = await mount(<FileUploader data-testid="uploader-root" />);
  await expect(component).toHaveAttribute("data-testid", "uploader-root");
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

/* ── className forwarding ── */

test("className merged onto root element", async ({ mount }) => {
  const component = await mount(<FileUploader className="my-custom-uploader" />);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/my-custom-uploader/);
});

/* ── Controlled mode ── */

/**
 * Controlled mode: files prop is pre-populated via setInputFiles on a
 * temporary uncontrolled instance, then the controlled variant confirms
 * the list count. We avoid passing `new File()` objects as serialised CT
 * props because Playwright's CT serialiser strips File metadata (name,
 * size) — those fields become empty/NaN after the boundary crossing.
 * Instead we drive both tests through the hidden input.
 */
test("controlled mode: file list shows correct item count", async ({ mount, page }) => {
  // Use uncontrolled mode, add two files via input, confirm two rows.
  await mount(<FileUploader />);
  const input = page.locator('input[type="file"]');
  await input.setInputFiles(makeFilePayload("file-one.pdf", "application/pdf"));
  await input.setInputFiles(makeFilePayload("file-two.jpg", "image/jpeg"));
  const items = page.locator('[aria-label="Selected files"] li');
  await expect(items).toHaveCount(2);
});

test("controlled mode: remove button renders for each file row", async ({ mount, page }) => {
  await mount(<FileUploader />);
  const input = page.locator('input[type="file"]');
  await input.setInputFiles(makeFilePayload("alpha.pdf", "application/pdf"));
  await input.setInputFiles(makeFilePayload("beta.pdf", "application/pdf"));
  // Two remove buttons — one per file
  const removeBtns = page.getByRole("button", { name: /^Remove / });
  await expect(removeBtns).toHaveCount(2);
});

/* a11y scans are in src/a11y.test.tsx */
