#!/usr/bin/env node
/**
 * scripts/scaffold-component.mjs
 *
 * Generates the full new-atom/molecule/organism boilerplate per the
 * CLAUDE.md "New atom checklist" — 5 source files + 8 ledger updates.
 *
 *   pnpm scaffold:component <layer> <Name> [options]
 *
 *   <layer>   atom | molecule | organism
 *   <Name>    PascalCase, must not already exist
 *
 *   --force              overwrite existing files
 *   --dry-run            print planned writes, no filesystem changes
 *   --skip-design-spec   skip creating meta/design/<Name>.md stub
 *   --skip-changeset     skip creating .changeset entry
 *
 * Generated artifacts (per checklist in CLAUDE.md):
 *
 *   src/<layer>s/<Name>/<Name>.tsx           — forwardRef + displayName
 *   src/<layer>s/<Name>/<Name>.module.css    — root rule using tokens
 *   src/<layer>s/<Name>/<Name>.stories.tsx   — Ladle Default story
 *   src/<layer>s/<Name>/<Name>.test.tsx      — Playwright CT smoke test
 *   src/<layer>s/<Name>/index.ts             — barrel re-export
 *
 * Mutations (append-only, idempotent — skip if marker already present):
 *
 *   src/<layer>s.ts              — append named export
 *   src/index.ts                 — append under matching layer comment
 *   src/a11y.test.tsx            — append import + a11y test case
 *   vite.config.ts               — append entry to build.lib.entry
 *   package.json                 — add exports subpath entry
 *   meta/llms-full.txt           — append `### <Name>` doc stub
 *   .changeset/scaffold-<name>.md (unless --skip-changeset)
 *   meta/design/<Name>.md         (unless --skip-design-spec)
 *
 * Exit codes:
 *   0   success
 *   1   validation error (bad args, name collision without --force)
 *   2   unexpected I/O error
 */

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, "..");

/* ─── CLI parsing ────────────────────────────────────────────── */

const args = process.argv.slice(2);
const flags = {
  force: false,
  dryRun: false,
  skipDesignSpec: false,
  skipChangeset: false,
};
const positional = [];

for (const arg of args) {
  if (arg === "--force") flags.force = true;
  else if (arg === "--dry-run") flags.dryRun = true;
  else if (arg === "--skip-design-spec") flags.skipDesignSpec = true;
  else if (arg === "--skip-changeset") flags.skipChangeset = true;
  else if (arg.startsWith("--")) die(`unknown flag: ${arg}`);
  else positional.push(arg);
}

if (positional.length !== 2) {
  die(
    "usage: pnpm scaffold:component <atom|molecule|organism> <Name> [--force] [--dry-run] [--skip-design-spec] [--skip-changeset]",
  );
}

const [layerArg, name] = positional;
const layerSingular = layerArg.toLowerCase();
if (!["atom", "molecule", "organism"].includes(layerSingular)) {
  die(`<layer> must be one of: atom, molecule, organism (got "${layerArg}")`);
}
const layer = `${layerSingular}s`; // "atoms" | "molecules" | "organisms"

if (!/^[A-Z][A-Za-z0-9]+$/.test(name)) {
  die(`<Name> must be PascalCase (got "${name}")`);
}

/* ─── Helpers ────────────────────────────────────────────────── */

function die(msg) {
  console.error(`scaffold-component: ${msg}`);
  process.exit(1);
}

function rel(p) {
  return relative(pkgRoot, p);
}

const plannedWrites = [];
const plannedAppends = [];

async function planWrite(path, contents) {
  const exists = existsSync(path);
  if (exists && !flags.force) {
    die(`file already exists: ${rel(path)} (use --force to overwrite)`);
  }
  plannedWrites.push({ path, contents, exists });
}

async function planAppend(path, contents, marker) {
  if (!existsSync(path)) die(`expected file missing: ${rel(path)}`);
  const current = await readFile(path, "utf8");
  if (marker && current.includes(marker)) {
    // Already inserted — skip silently for idempotency.
    return;
  }
  plannedAppends.push({ path, contents, marker, mode: "append" });
}

async function planInsert(path, anchor, contents, marker, { after = true } = {}) {
  if (!existsSync(path)) die(`expected file missing: ${rel(path)}`);
  const current = await readFile(path, "utf8");
  if (marker && current.includes(marker)) return;
  if (!current.includes(anchor)) {
    die(`anchor not found in ${rel(path)}: ${JSON.stringify(anchor.slice(0, 80))}`);
  }
  plannedAppends.push({ path, anchor, contents, marker, mode: after ? "after" : "before" });
}

async function planJsonPatch(path, patch) {
  if (!existsSync(path)) die(`expected file missing: ${rel(path)}`);
  plannedAppends.push({ path, jsonPatch: patch, mode: "json" });
}

/* ─── Paths ──────────────────────────────────────────────────── */

const componentDir = resolve(pkgRoot, "src", layer, name);
const tsxPath = resolve(componentDir, `${name}.tsx`);
const cssPath = resolve(componentDir, `${name}.module.css`);
const storiesPath = resolve(componentDir, `${name}.stories.tsx`);
const testPath = resolve(componentDir, `${name}.test.tsx`);
const indexPath = resolve(componentDir, "index.ts");

const layerBarrel = resolve(pkgRoot, "src", `${layer}.ts`);
const rootIndex = resolve(pkgRoot, "src", "index.ts");
const a11yTest = resolve(pkgRoot, "src", "a11y.test.tsx");
const viteConfig = resolve(pkgRoot, "vite.config.ts");
const packageJson = resolve(pkgRoot, "package.json");
const llmsFull = resolve(pkgRoot, "meta", "llms-full.txt");
const designSpec = resolve(pkgRoot, "meta", "design", `${name}.md`);
const changesetFile = resolve(pkgRoot, ".changeset", `scaffold-${name.toLowerCase()}.md`);

/* ─── File templates ─────────────────────────────────────────── */

const tsxTemplate = `import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./${name}.module.css";

export interface ${name}Props extends ComponentPropsWithoutRef<"div"> {
  /** Slot content. */
  children?: ReactNode;
}

/**
 * ${name} — scaffolded ${layerSingular}.
 *
 * TODO: replace this placeholder with the real implementation per
 * meta/design/${name}.md. The scaffold ships a non-interactive
 * \`<div>\` wrapper to keep the build + a11y gates green from day one.
 */
export const ${name} = forwardRef<HTMLDivElement, ${name}Props>(function ${name}(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={clsx(styles.root, className)} {...rest}>
      {children}
    </div>
  );
});

${name}.displayName = "${name}";
`;

const cssTemplate = `/* ============================================================
   ${name} — scaffolded ${layerSingular}
   ============================================================ */

.root {
  font-family: var(--font-sans);
  color: var(--fg);
}
`;

const storiesTemplate = `import type { Story, StoryDefault } from "@ladle/react";
import { ${name} } from "./${name}";

export default {
  title: "Components / ${name}",
} satisfies StoryDefault;

export const Default: Story = () => <${name}>${name} placeholder</${name}>;
`;

const testTemplate = `import { test, expect } from "@playwright/experimental-ct-react";
import { ${name} } from "./${name}";

test("renders children", async ({ mount }) => {
  const component = await mount(<${name}>Hello</${name}>);
  await expect(component.getByText("Hello")).toBeVisible();
});

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(<${name} className="custom">Hi</${name}>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom/);
  expect(className).toMatch(/root/);
});

test("forwards data-* props to the root element", async ({ mount }) => {
  const component = await mount(<${name} data-testid="scaffold-target">Hi</${name}>);
  await expect(component).toHaveAttribute("data-testid", "scaffold-target");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
`;

const indexTemplate = `export { ${name}, type ${name}Props } from "./${name}";
`;

const llmsBlock = `\n### ${name}\n\nTODO — replace this scaffold stub with the brand contract for \`${name}\`. See meta/design/${name}.md for the design spec.\n`;

const designStubTemplate = `# ${name}

**Status:** Draft (scaffolded — not yet approved by poukai-design).

## Intent

TODO — describe the single job this ${layerSingular} performs.

## Anatomy

TODO — list the constituent atoms / slots.

## Tokens

TODO — enumerate tokens consumed.

## Variants

TODO.

## A11y

TODO.

## Anti-patterns

TODO.
`;

const changesetTemplate = `---
"@poukai-inc/ui": minor
---

feat(${layerSingular}): scaffold ${name} (placeholder — implementation pending)
`;

/* ─── Plan: new files ────────────────────────────────────────── */

await planWrite(tsxPath, tsxTemplate);
await planWrite(cssPath, cssTemplate);
await planWrite(storiesPath, storiesTemplate);
await planWrite(testPath, testTemplate);
await planWrite(indexPath, indexTemplate);

if (!flags.skipDesignSpec) {
  if (!existsSync(designSpec) || flags.force) {
    plannedWrites.push({
      path: designSpec,
      contents: designStubTemplate,
      exists: existsSync(designSpec),
    });
  }
}

if (!flags.skipChangeset) {
  if (!existsSync(changesetFile) || flags.force) {
    plannedWrites.push({
      path: changesetFile,
      contents: changesetTemplate,
      exists: existsSync(changesetFile),
    });
  }
}

/* ─── Plan: append to barrels + ledgers ──────────────────────── */

const barrelExport = `export { ${name}, type ${name}Props } from "./${layer}/${name}";\n`;
const barrelMarker = `from "./${layer}/${name}"`;

await planAppend(layerBarrel, barrelExport, barrelMarker);

/* src/index.ts — insert under `/* ---------- <layer> ---------- */ ` block.
   The comment line itself is the anchor; the block continues until the next
   `; /* ---------- ` comment or EOF. We append after the LAST export line
   that already lives in that block. */
{
  const current = await readFile(rootIndex, "utf8");
  if (!current.includes(barrelMarker)) {
    const layerHeader = `/* ---------- ${layer} ---------- */`;
    const headerIdx = current.indexOf(layerHeader);
    if (headerIdx === -1) die(`anchor not found in src/index.ts: ${layerHeader}`);

    // Locate the start of the next layer block (or EOF).
    const nextHeaderRe = /\/\* -{2,} (atoms|molecules|organisms) -{2,} \*\//g;
    nextHeaderRe.lastIndex = headerIdx + layerHeader.length;
    const nextMatch = nextHeaderRe.exec(current);
    const blockEnd = nextMatch ? nextMatch.index : current.length;

    // Insert right before blockEnd, after a single trailing newline.
    plannedAppends.push({
      path: rootIndex,
      contents: barrelExport,
      marker: barrelMarker,
      mode: "splice",
      spliceAt: blockEnd,
    });
  }
}

/* src/a11y.test.tsx — add import + test case. */
{
  const a11yImport = `import { ${name} } from "./${layer}/${name}";\n`;
  const a11yTestBlock = `\ntest("a11y — ${name}", async ({ mount, page }) => {\n  await mount(<${name}>${name}</${name}>);\n  await expectAxeClean(page);\n});\n`;

  const current = await readFile(a11yTest, "utf8");
  const importMarker = `from "./${layer}/${name}"`;
  if (!current.includes(importMarker)) {
    // Insert import after the last existing `from "./${layer}/...` import.
    const importRe = new RegExp(`^import \\{[^}]+\\} from "\\./${layer}/[^"]+";\\n`, "gm");
    let lastEnd = -1;
    let m;
    while ((m = importRe.exec(current)) !== null) {
      lastEnd = m.index + m[0].length;
    }
    if (lastEnd === -1) {
      // No prior imports for this layer — fall back to appending after the
      // last top-of-file import line of any layer.
      const anyImportRe = /^import [^\n]+;\n/gm;
      while ((m = anyImportRe.exec(current)) !== null) {
        lastEnd = m.index + m[0].length;
      }
      if (lastEnd === -1) die("no import lines found in src/a11y.test.tsx");
    }
    plannedAppends.push({
      path: a11yTest,
      contents: a11yImport,
      marker: importMarker,
      mode: "splice",
      spliceAt: lastEnd,
    });
  }

  const testMarker = `a11y — ${name}"`;
  if (!current.includes(testMarker)) {
    plannedAppends.push({
      path: a11yTest,
      contents: a11yTestBlock,
      marker: testMarker,
      mode: "append",
    });
  }
}

/* vite.config.ts — insert into build.lib.entry. */
{
  const viteEntry = `              "${layer}/${name}": resolve(__dirname, "src/${layer}/${name}/index.ts"),\n`;
  const viteMarker = `"${layer}/${name}": resolve`;
  const current = await readFile(viteConfig, "utf8");
  if (!current.includes(viteMarker)) {
    // Find LAST `"<layer>/...": resolve(...)` line for this layer block.
    const layerRe = new RegExp(
      `^ +"${layer}/[^"]+": resolve\\(__dirname, "src/${layer}/[^"]+/index\\.ts"\\),\\n`,
      "gm",
    );
    let lastEnd = -1;
    let m;
    while ((m = layerRe.exec(current)) !== null) {
      lastEnd = m.index + m[0].length;
    }
    if (lastEnd === -1) die(`no existing ${layer}/* entries in vite.config.ts`);
    plannedAppends.push({
      path: viteConfig,
      contents: viteEntry,
      marker: viteMarker,
      mode: "splice",
      spliceAt: lastEnd,
    });
  }
}

/* package.json — add exports subpath. */
await planJsonPatch(packageJson, (json) => {
  const key = `./${layer}/${name}`;
  if (json.exports?.[key]) return json; // idempotent
  // Insert preserving order: add key right after the last existing
  // `./${layer}/...` key for this layer. JS objects preserve insertion
  // order; we rebuild the exports object in the desired order.
  const oldExports = json.exports ?? {};
  const newExports = {};
  let inserted = false;
  let lastLayerKey = null;
  for (const k of Object.keys(oldExports)) {
    if (k.startsWith(`./${layer}/`)) lastLayerKey = k;
  }
  for (const k of Object.keys(oldExports)) {
    newExports[k] = oldExports[k];
    if (k === lastLayerKey && !inserted) {
      newExports[key] = {
        types: `./dist/${layer}/${name}.d.ts`,
        import: `./dist/${layer}/${name}.js`,
        require: `./dist/${layer}/${name}.cjs`,
      };
      inserted = true;
    }
  }
  if (!inserted) {
    // No prior entries for this layer — append at end.
    newExports[key] = {
      types: `./dist/${layer}/${name}.d.ts`,
      import: `./dist/${layer}/${name}.js`,
      require: `./dist/${layer}/${name}.cjs`,
    };
  }
  return { ...json, exports: newExports };
});

/* meta/llms-full.txt — append `### <Name>` stub. */
await planAppend(llmsFull, llmsBlock, `### ${name}`);

/* ─── Apply ──────────────────────────────────────────────────── */

if (flags.dryRun) {
  console.log("DRY RUN — planned operations:\n");
  for (const w of plannedWrites) {
    console.log(`  write   ${rel(w.path)}${w.exists ? "  (overwrite)" : ""}`);
  }
  for (const a of plannedAppends) {
    console.log(`  ${a.mode.padEnd(7)} ${rel(a.path)}`);
  }
  process.exit(0);
}

try {
  // Pass 1: new files
  for (const w of plannedWrites) {
    await mkdir(dirname(w.path), { recursive: true });
    await writeFile(w.path, w.contents, "utf8");
    console.log(`  wrote   ${rel(w.path)}`);
  }

  // Pass 2: append / splice / json-patch
  for (const a of plannedAppends) {
    if (a.mode === "json") {
      const raw = await readFile(a.path, "utf8");
      const parsed = JSON.parse(raw);
      const next = a.jsonPatch(parsed);
      // Preserve trailing newline if present
      const trailing = raw.endsWith("\n") ? "\n" : "";
      await writeFile(a.path, JSON.stringify(next, null, 2) + trailing, "utf8");
      console.log(`  patched ${rel(a.path)}`);
      continue;
    }
    const current = await readFile(a.path, "utf8");
    let next;
    if (a.mode === "append") {
      next = current.endsWith("\n") ? current + a.contents : current + "\n" + a.contents;
    } else if (a.mode === "splice") {
      next = current.slice(0, a.spliceAt) + a.contents + current.slice(a.spliceAt);
    } else if (a.mode === "after") {
      const idx = current.indexOf(a.anchor) + a.anchor.length;
      next = current.slice(0, idx) + "\n" + a.contents + current.slice(idx);
    } else if (a.mode === "before") {
      const idx = current.indexOf(a.anchor);
      next = current.slice(0, idx) + a.contents + current.slice(idx);
    } else {
      die(`unknown mode: ${a.mode}`);
    }
    await writeFile(a.path, next, "utf8");
    console.log(`  updated ${rel(a.path)}`);
  }

  console.log(
    `\nScaffolded ${layerSingular} "${name}" — ${plannedWrites.length} file(s) + ${plannedAppends.length} ledger update(s).\n` +
      `Next steps:\n` +
      `  1. fill in meta/design/${name}.md and have it approved\n` +
      `  2. replace the placeholder src/${layer}/${name}/${name}.tsx with the real impl\n` +
      `  3. expand the test in src/${layer}/${name}/${name}.test.tsx\n` +
      `  4. run: pnpm typecheck && pnpm lint && pnpm format && pnpm check:llms && pnpm build && pnpm test && pnpm size\n`,
  );
} catch (err) {
  console.error("scaffold-component: I/O failure", err);
  process.exit(2);
}
