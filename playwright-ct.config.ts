import { defineConfig, devices } from "@playwright/experimental-ct-react";
import { resolve } from "node:path";

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
          "@": resolve(__dirname, "src"),
          "@atoms": resolve(__dirname, "src/atoms"),
          "@molecules": resolve(__dirname, "src/molecules"),
          "@organisms": resolve(__dirname, "src/organisms"),
          "@tokens": resolve(__dirname, "src/tokens"),
        },
      },
    },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
