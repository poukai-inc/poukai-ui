import { test, expect } from "@playwright/experimental-ct-react";
import { Image } from "./Image";

const PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

/* ---------- Render ---------- */

test("renders an <img> element", async ({ mount }) => {
  const component = await mount(<Image src={PIXEL} alt="Test image" width={400} height={300} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("img");
});

test("renders with src and alt attributes", async ({ mount }) => {
  const component = await mount(
    <Image src={PIXEL} alt="Descriptive alt text" width={400} height={300} />,
  );
  await expect(component).toHaveAttribute("src", PIXEL);
  await expect(component).toHaveAttribute("alt", "Descriptive alt text");
});

test("renders with decorative alt=''", async ({ mount }) => {
  const component = await mount(<Image src={PIXEL} alt="" width={800} height={300} />);
  await expect(component).toHaveAttribute("alt", "");
});

test("sets width and height HTML attributes", async ({ mount }) => {
  const component = await mount(<Image src={PIXEL} alt="16:9 image" width={1280} height={720} />);
  await expect(component).toHaveAttribute("width", "1280");
  await expect(component).toHaveAttribute("height", "720");
});

/* ---------- Ref forwarding ---------- */

test("forwards ref to the HTMLImageElement", async ({ mount }) => {
  let capturedRef: HTMLImageElement | null = null;

  const Harness = () => (
    <Image
      ref={(el) => {
        capturedRef = el;
      }}
      src={PIXEL}
      alt="Ref test"
      width={200}
      height={200}
    />
  );

  await mount(<Harness />);
  expect(capturedRef).not.toBeNull();
  expect((capturedRef as HTMLImageElement | null)?.tagName.toLowerCase()).toBe("img");
});

/* ---------- Defaults ---------- */

test("defaults loading to 'lazy'", async ({ mount }) => {
  const component = await mount(<Image src={PIXEL} alt="Lazy" width={400} height={300} />);
  await expect(component).toHaveAttribute("loading", "lazy");
});

test("defaults decoding to 'async'", async ({ mount }) => {
  const component = await mount(<Image src={PIXEL} alt="Async" width={400} height={300} />);
  await expect(component).toHaveAttribute("decoding", "async");
});

/* ---------- loading / decoding props ---------- */

test("sets loading='eager' when specified", async ({ mount }) => {
  const component = await mount(
    <Image src={PIXEL} alt="Eager image" width={400} height={300} loading="eager" />,
  );
  await expect(component).toHaveAttribute("loading", "eager");
});

test("sets decoding='sync' when specified", async ({ mount }) => {
  const component = await mount(
    <Image src={PIXEL} alt="Sync decode" width={400} height={300} decoding="sync" />,
  );
  await expect(component).toHaveAttribute("decoding", "sync");
});

/* ---------- aspect-ratio inline style ---------- */

test("applies aspect-ratio inline style from width/height props", async ({ mount }) => {
  const component = await mount(
    <Image src={PIXEL} alt="Aspect ratio test" width={1600} height={900} />,
  );
  await expect(component).toHaveCSS("aspect-ratio", "1600 / 900");
});

test("applies max-width: 100% inline style", async ({ mount }) => {
  const component = await mount(<Image src={PIXEL} alt="Max width" width={400} height={300} />);
  await expect(component).toHaveCSS("max-width", "100%");
});

/* ---------- radius ---------- */

test("radius='none' (default) applies the radius-none class", async ({ mount }) => {
  const component = await mount(<Image src={PIXEL} alt="None radius" width={200} height={200} />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/radius-none/);
});

test("radius='sm' applies the radius-sm class", async ({ mount }) => {
  const component = await mount(
    <Image src={PIXEL} alt="Sm radius" width={200} height={200} radius="sm" />,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/radius-sm/);
});

test("radius='md' applies the radius-md class", async ({ mount }) => {
  const component = await mount(
    <Image src={PIXEL} alt="Md radius" width={200} height={200} radius="md" />,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/radius-md/);
});

test("radius='lg' applies the radius-lg class", async ({ mount }) => {
  const component = await mount(
    <Image src={PIXEL} alt="Lg radius" width={200} height={200} radius="lg" />,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/radius-lg/);
});

/* ---------- fit ---------- */

test("omitting fit does not apply any fit-* class", async ({ mount }) => {
  const component = await mount(<Image src={PIXEL} alt="No fit" width={400} height={300} />);
  const className = await component.getAttribute("class");
  expect(className).not.toMatch(/fit-/);
});

test("fit='cover' applies the fit-cover class", async ({ mount }) => {
  const component = await mount(
    <Image src={PIXEL} alt="Cover fit" width={400} height={300} fit="cover" />,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/fit-cover/);
});

test("fit='contain' applies the fit-contain class", async ({ mount }) => {
  const component = await mount(
    <Image src={PIXEL} alt="Contain fit" width={400} height={300} fit="contain" />,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/fit-contain/);
});

/* ---------- className merge ---------- */

test("merges a consumer-provided className with internal classes", async ({ mount }) => {
  const component = await mount(
    <Image src={PIXEL} alt="Class merge" width={200} height={200} className="my-custom-class" />,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/radius-none/);
  expect(className).toMatch(/my-custom-class/);
});

/* ---------- style merge ---------- */

test("caller style is merged on top of base styles", async ({ mount }) => {
  const component = await mount(
    <Image src={PIXEL} alt="Style merge" width={400} height={300} style={{ maxWidth: "50%" }} />,
  );
  await expect(component).toHaveCSS("max-width", "50%");
});

/* ---------- Arbitrary prop forwarding ---------- */

test("forwards data-* and aria-* props to the root img", async ({ mount }) => {
  const component = await mount(
    <Image
      src={PIXEL}
      alt="Forward props"
      width={200}
      height={200}
      data-testid="my-image"
      aria-describedby="caption-1"
    />,
  );
  await expect(component).toHaveAttribute("data-testid", "my-image");
  await expect(component).toHaveAttribute("aria-describedby", "caption-1");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
