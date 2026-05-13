import { defineConfig, devices } from "@playwright/experimental-ct-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: "./src",
  testMatch: "**/*.test.tsx",
  fullyParallel: true,
  reporter: "list",
  use: {
    trace: "on-first-retry",
    ctPort: 3100,
    ctViteConfig: {
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
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
