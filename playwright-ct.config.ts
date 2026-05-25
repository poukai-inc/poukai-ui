import { defineConfig, devices } from "@playwright/experimental-ct-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

// CI-only tuning. Locally these stay tight so flakes surface during dev.
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./src",
  testMatch: "**/*.test.tsx",
  fullyParallel: true,
  reporter: "list",
  // Per-test timeout. webkit on GitHub Actions runners occasionally needs
  // longer than the 30s default just to spin up its browser context; the
  // observed failure is `Test timeout of 30000ms exceeded while setting up
  // "context"`. Doubling the budget in CI absorbs that without masking real
  // logic timeouts in local dev.
  timeout: isCI ? 60_000 : 30_000,
  // Retry transient infra flakes (browser launch, network hiccup) twice in CI.
  // Real test bugs still fail because they fail deterministically on retry.
  // Zero retries locally so the first failure is the one you see.
  retries: isCI ? 2 : 0,
  use: {
    // Captures a trace on the first retry only — gives one debuggable trace
    // for any test that retried, without bloating artifacts on green runs.
    trace: "on-first-retry",
    ctPort: 3100,
    ctViteConfig: {
      // Expose import.meta.env.DEV as true so dev-mode guards (e.g. Portrait's
      // non-empty alt invariant) are exercisable in Playwright CT tests.
      // Vite replaces import.meta.env.DEV with false in the published build.
      define: {
        "import.meta.env.DEV": "true",
      },
      css: {
        modules: { localsConvention: "camelCaseOnly" },
      },
      resolve: {
        alias: {
          "@": resolve(rootDir, "src"),
          "@atoms": resolve(rootDir, "src/atoms"),
          "@molecules": resolve(rootDir, "src/molecules"),
          "@organisms": resolve(rootDir, "src/organisms"),
          "@tokens": resolve(rootDir, "src/tokens"),
        },
      },
    },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
