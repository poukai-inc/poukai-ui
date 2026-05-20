import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

/** @type {import("eslint").Linter.Config[]} */
export default [
  // Flat-config ignores: exclude files outside tsconfig.json's
  // "include": ["src", "*.d.ts"]. Root-level config .ts/.mjs/.cjs files
  // are not part of the TS project and must not be parsed with
  // parserOptions.project. List them explicitly to avoid accidentally
  // excluding src/**/*.ts.
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".ladle/**",
      "scripts/**",
      "vite.config.ts",
      "playwright-ct.config.ts",
      "playwright/**",
      "*.mjs",
      "*.cjs",
    ],
  },
  ...compat.config({
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      ecmaFeatures: { jsx: true },
      project: "./tsconfig.json",
    },
    plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:react-hooks/recommended",
      "plugin:jsx-a11y/recommended",
    ],
    settings: { react: { version: "18" } },
    rules: {
      "react/prop-types": "off",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
    ignorePatterns: ["dist", "node_modules", ".ladle", "**/*.test.tsx", "**/*.stories.tsx"],
  }),
];
