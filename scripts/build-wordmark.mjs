#!/usr/bin/env node
/**
 * scripts/build-wordmark.mjs
 *
 * Regenerate `src/atoms/Wordmark/wordmark-geometry.ts` from
 * `brand/poukai-logo.svg`.
 *
 * The source SVG carries verbose per-path styling (stroke, fill colour,
 * dash array, opacity, miter limit, …) inherited from the design-tool
 * export. None of it survives — the parent `<svg>` in `Wordmark.tsx`
 * carries `fill="currentColor"` and zero stroke, and that is the contract.
 *
 * Only `d` and `transform` attributes are preserved on each `<path>`.
 *
 * Usage:
 *   pnpm build:wordmark
 *
 * Run whenever `brand/poukai-logo.svg` changes. The output is committed
 * (it's source code, not a build artifact) so consumers don't need to run
 * this themselves.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, "..");
const sourceSvg = resolve(pkgRoot, "brand/poukai-logo.svg");
const outFile = resolve(pkgRoot, "src/atoms/Wordmark/wordmark-geometry.ts");

const raw = await readFile(sourceSvg, "utf8");

const pathTagRegex = /<path\b[^>]*?\/?>/g;
const dRegex = /\bd="([^"]+)"/;
const transformRegex = /\btransform="([^"]+)"/;

const paths = [];
let m;
while ((m = pathTagRegex.exec(raw)) !== null) {
  const tag = m[0];
  const d = (tag.match(dRegex) || [])[1];
  const transform = (tag.match(transformRegex) || [])[1];
  if (d) paths.push({ d, transform });
}

if (paths.length === 0) {
  console.error("No <path d=…> elements found in", sourceSvg);
  process.exit(1);
}

const innerMarkup = paths
  .map((p) =>
    p.transform ? `<path d="${p.d}" transform="${p.transform}"/>` : `<path d="${p.d}"/>`,
  )
  .join("");

const out = `/**
 * Inlined Wordmark geometry.
 *
 * Auto-generated from \`brand/poukai-logo.svg\` by \`scripts/build-wordmark.mjs\`.
 * Do not hand-edit. To update: edit the source SVG and run \`pnpm build:wordmark\`.
 *
 * Verbose per-path styling (stroke, fill colours, dash arrays, opacity) was
 * stripped because the parent \`<svg>\` in \`Wordmark.tsx\` carries
 * \`fill="currentColor"\` and zero stroke. Only \`d\` + \`transform\` survive.
 *
 * Rendered via \`dangerouslySetInnerHTML\` — the string is static; React never
 * reconciles it.
 */
export const WORDMARK_INNER_SVG = ${JSON.stringify(innerMarkup)};

export const WORDMARK_VIEWBOX = "0 0 662 274";
`;

await writeFile(outFile, out, "utf8");

console.log(
  `Wrote ${outFile}\n  ${paths.length} paths, ${innerMarkup.length} chars inner markup, ${out.length} bytes output.`,
);
