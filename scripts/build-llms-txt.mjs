#!/usr/bin/env node
/**
 * scripts/build-llms-txt.mjs
 *
 * Generates two files per the llmstxt.org convention:
 *
 *   dist/llms.txt       — Short index (auto-generated). Lists components,
 *                         tokens, and exports. Under 60 lines.
 *   dist/llms-full.txt  — Copy of meta/llms-full.txt (hand-authored by
 *                         poukai-design). The authoritative brand contract.
 *
 * Usage:
 *   pnpm build:llms       # writes both dist files
 *
 * Chained into `pnpm build` so the files are regenerated on every package build.
 */
import { readFile, copyFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, "..");
const distDir = resolve(pkgRoot, "dist");
const outIndex = resolve(distDir, "llms.txt");
const outFull = resolve(distDir, "llms-full.txt");

/* ─── Sources ─────────────────────────────────────────────── */

const pkg = JSON.parse(await readFile(resolve(pkgRoot, "package.json"), "utf8"));

/* ─── dist/llms-full.txt — copy of hand-authored source ───── */

await mkdir(distDir, { recursive: true });
await copyFile(resolve(pkgRoot, "meta/llms-full.txt"), outFull);

/* ─── dist/llms.txt — short auto-generated index ──────────── */

const COMPONENTS = {
  atoms: ["Wordmark", "StatusBadge", "Button", "Stat"],
  molecules: ["Hero", "RoleCard", "Principle", "FailureMode"],
  organisms: ["SiteShell"],
};

const exportKeys = Object.keys(pkg.exports ?? {});

const lines = [];

lines.push(`# ${pkg.name}`);
lines.push("");
lines.push(`> ${pkg.description}`);
lines.push("");
lines.push(
  "Poukai is a React component library organised by Atomic Design (tokens → atoms → molecules → organisms).",
);
lines.push("");
lines.push(`Version: \`${pkg.version}\``);
lines.push("");

lines.push("## LLM context");
lines.push("");
lines.push(
  "Full brand rules, token semantics, component constraints, and anti-patterns are in `dist/llms-full.txt`.",
);
lines.push("");
lines.push("```");
lines.push("cat node_modules/@poukai-inc/ui/dist/llms-full.txt");
lines.push("```");
lines.push("");

lines.push("## Components");
lines.push("");
lines.push(
  `Import tokens once at the app root: \`import "@poukai-inc/ui/tokens.css"\`. Then import components:`,
);
lines.push("");
for (const [layer, names] of Object.entries(COMPONENTS)) {
  lines.push(`**${layer}:** ${names.map((n) => `\`<${n}>\``).join(", ")}`);
}
lines.push("");

lines.push("## Tokens");
lines.push("");
lines.push(
  "Authoritative source: `src/tokens/tokens.css`. All values on `:root` — color, typography, spacing, motion, radii.",
);
lines.push("");

lines.push("## Exports");
lines.push("");
for (const key of exportKeys) {
  lines.push(`- \`@poukai-inc/ui${key === "." ? "" : key}\``);
}
lines.push("");

const out = lines.join("\n") + "\n";
await writeFile(outIndex, out, "utf8");

const totalComponents = Object.values(COMPONENTS).flat().length;
console.log(
  `Wrote ${outIndex}\n  ${out.length} bytes · ${totalComponents} components · ${exportKeys.length} exports`,
);
console.log(`Copied ${outFull}\n  from meta/llms-full.txt`);
