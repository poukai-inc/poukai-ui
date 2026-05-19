#!/usr/bin/env node
/**
 * Pre-commit linter/formatter for staged files.
 *
 * Replaces `npx lint-staged` to avoid lint-staged's partial-stage stash cycle,
 * which corrupts commits when run from a git worktree by recording phantom
 * deletions for tracked files it never touched (lint-staged#1762, #1402).
 *
 * Logic:
 *   1. Read the staged-file list via `git diff --cached --diff-filter=ACMR`.
 *   2. Group by the patterns mirrored from the previous package.json config:
 *      - src/**\/*.{ts,tsx}            → eslint --fix + prettier --write
 *      - playwright-ct.config.ts,
 *        vite.config.ts                → prettier --write
 *      - **\/*.{css,md,json}           → prettier --write
 *   3. Re-stage originally-staged paths so formatter edits land in the commit.
 *
 * Trade-off vs lint-staged: the whole file is linted/formatted, not just the
 * staged hunks. If a file has both staged and unstaged changes, the unstaged
 * hunks may get reformatted too — and they remain unstaged after re-add. That
 * is the standard pre-commit behavior outside lint-staged and is safe across
 * worktrees, which is the point.
 */
import { execSync, spawnSync } from "node:child_process";

function sh(cmd, args, { silent = false } = {}) {
  const result = spawnSync(cmd, args, {
    stdio: silent ? "pipe" : "inherit",
    encoding: "utf8",
  });
  if (result.status !== 0) {
    if (silent && result.stderr) process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }
  return result.stdout ?? "";
}

const stagedRaw = execSync("git diff --cached --name-only --diff-filter=ACMR", {
  encoding: "utf8",
});
const staged = stagedRaw.split("\n").filter(Boolean);

if (staged.length === 0) process.exit(0);

const srcTs = [];
const configTs = [];
const docs = [];

for (const f of staged) {
  if (/^src\/.+\.(ts|tsx)$/.test(f)) srcTs.push(f);
  else if (f === "playwright-ct.config.ts" || f === "vite.config.ts") configTs.push(f);
  else if (/\.(css|md|json)$/.test(f)) docs.push(f);
}

const touched = [...new Set([...srcTs, ...configTs, ...docs])];
if (touched.length === 0) process.exit(0);

if (srcTs.length > 0) {
  sh("pnpm", [
    "exec",
    "eslint",
    "--fix",
    "--max-warnings",
    "0",
    "--no-warn-ignored",
    ...srcTs,
  ]);
}

const prettierTargets = [...srcTs, ...configTs, ...docs];
if (prettierTargets.length > 0) {
  sh("pnpm", ["exec", "prettier", "--write", "--log-level", "warn", ...prettierTargets]);
}

sh("git", ["add", ...touched]);
