#!/usr/bin/env node
/**
 * scripts/check-llms-tokens-sync.mjs
 *
 * CI guard: verifies every color token defined in src/tokens/tokens.css
 * is documented in meta/llms-full.txt. Exits 1 with a clear error if any
 * token name or hex value is absent; exits 0 if all tokens are accounted for.
 *
 * Usage:
 *   node scripts/check-llms-tokens-sync.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, "..");

const tokensCSS = readFileSync(resolve(pkgRoot, "src/tokens/tokens.css"), "utf8");
const llmsFull = readFileSync(resolve(pkgRoot, "meta/llms-full.txt"), "utf8");
const llmsLower = llmsFull.toLowerCase();

// Extract all custom-property color declarations: --token-name: #hexval
const COLOR_RE = /(--[\w-]+):\s*(#[0-9a-fA-F]{3,6})/g;
const tokens = [...tokensCSS.matchAll(COLOR_RE)].map(([, name, hex]) => ({
  name,
  hex: hex.toLowerCase(),
}));

if (tokens.length === 0) {
  console.error(
    "check-llms-tokens-sync: no color tokens found in src/tokens/tokens.css — check the regex.",
  );
  process.exit(1);
}

const missing = [];

for (const { name, hex } of tokens) {
  const hasName = llmsFull.includes(name);
  const hasHex = llmsLower.includes(hex);

  if (!hasName || !hasHex) {
    missing.push({ name, hex, missingName: !hasName, missingHex: !hasHex });
  }
}

if (missing.length > 0) {
  console.error(
    "check-llms-tokens-sync: the following color tokens are not documented in meta/llms-full.txt:\n",
  );
  for (const { name, hex, missingName, missingHex } of missing) {
    const what = [missingName && "token name", missingHex && "hex value"]
      .filter(Boolean)
      .join(" and ");
    console.error("  " + name + ": " + hex + "  — missing " + what);
  }
  console.error(
    "\nFix: update meta/llms-full.txt to document every color token in src/tokens/tokens.css.",
  );
  process.exit(1);
}

console.log(
  "check-llms-tokens-sync: all " +
    tokens.length +
    " color token(s) documented in meta/llms-full.txt. OK",
);
