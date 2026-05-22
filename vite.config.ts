import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { visualizer } from "rollup-plugin-visualizer";
import { resolve } from "node:path";

// Library mode is gated on BUILD_TARGET=lib so Ladle (which reuses this config
// when it invokes Vite) can render the showcase as a normal SPA instead of
// producing library chunks.
const isLibBuild = process.env.BUILD_TARGET === "lib";

export default defineConfig({
  plugins: isLibBuild
    ? [
        react(),
        dts({ include: ["src"], rollupTypes: true }),
        libInjectCss(),
        visualizer({
          filename: "dist/stats.html",
          template: "treemap",
          gzipSize: true,
          brotliSize: true,
          emitFile: false,
        }),
      ]
    : [react()],
  css: {
    modules: {
      // Stable, debuggable class names in dev; hashed in prod.
      generateScopedName:
        process.env.NODE_ENV === "production"
          ? "poukai_[hash:base64:6]"
          : "poukai_[name]__[local]__[hash:base64:4]",
      localsConvention: "camelCaseOnly",
    },
  },
  ...(isLibBuild
    ? {
        build: {
          lib: {
            entry: {
              index: resolve(__dirname, "src/index.ts"),
              atoms: resolve(__dirname, "src/atoms.ts"),
              molecules: resolve(__dirname, "src/molecules.ts"),
              organisms: resolve(__dirname, "src/organisms.ts"),
              // Per-component subpath entries.
              // Belt-and-braces for consumers whose bundlers don't tree-shake
              // the layer barrels (CJS consumers, Jest without transform,
              // Next.js with transpilePackages, etc.). Modern ESM bundlers
              // (Vite / webpack 5 / esbuild) tree-shake the layer barrels
              // cleanly and don't need these — but the subpaths cost nothing
              // to ship and remove all doubt.
              "atoms/Avatar": resolve(__dirname, "src/atoms/Avatar/index.ts"),
              "atoms/Button": resolve(__dirname, "src/atoms/Button/index.ts"),
              "atoms/EmailLink": resolve(__dirname, "src/atoms/EmailLink/index.ts"),
              "atoms/Eyebrow": resolve(__dirname, "src/atoms/Eyebrow/index.ts"),
              "atoms/Heading": resolve(__dirname, "src/atoms/Heading/index.ts"),
              "atoms/Stat": resolve(__dirname, "src/atoms/Stat/index.ts"),
              "atoms/StatusBadge": resolve(__dirname, "src/atoms/StatusBadge/index.ts"),
              "atoms/Tag": resolve(__dirname, "src/atoms/Tag/index.ts"),
              "atoms/Textarea": resolve(__dirname, "src/atoms/Textarea/index.ts"),
              "atoms/Wordmark": resolve(__dirname, "src/atoms/Wordmark/index.ts"),
              "atoms/NumberFormat": resolve(__dirname, "src/atoms/NumberFormat/index.ts"),
              "atoms/Checkbox": resolve(__dirname, "src/atoms/Checkbox/index.ts"),
              "atoms/Spacer": resolve(__dirname, "src/atoms/Spacer/index.ts"),
              "molecules/FailureMode": resolve(__dirname, "src/molecules/FailureMode/index.ts"),
              "molecules/FeatureCard": resolve(__dirname, "src/molecules/FeatureCard/index.ts"),
              "molecules/FieldNote": resolve(__dirname, "src/molecules/FieldNote/index.ts"),
              "molecules/Hero": resolve(__dirname, "src/molecules/Hero/index.ts"),
              "molecules/LinkCard": resolve(__dirname, "src/molecules/LinkCard/index.ts"),
              "molecules/Portrait": resolve(__dirname, "src/molecules/Portrait/index.ts"),
              "molecules/Principle": resolve(__dirname, "src/molecules/Principle/index.ts"),
              "molecules/Pull": resolve(__dirname, "src/molecules/Pull/index.ts"),
              "molecules/Quote": resolve(__dirname, "src/molecules/Quote/index.ts"),
              "molecules/RoleCard": resolve(__dirname, "src/molecules/RoleCard/index.ts"),
              "molecules/Section": resolve(__dirname, "src/molecules/Section/index.ts"),
              "molecules/Statement": resolve(__dirname, "src/molecules/Statement/index.ts"),
              "molecules/TeamCard": resolve(__dirname, "src/molecules/TeamCard/index.ts"),
              "organisms/Dialog": resolve(__dirname, "src/organisms/Dialog/index.ts"),
              "organisms/Footer": resolve(__dirname, "src/organisms/Footer/index.ts"),
              "organisms/SiteShell": resolve(__dirname, "src/organisms/SiteShell/index.ts"),
            },
            name: "PoukaiUI",
            formats: ["es", "cjs"] as const,
            fileName: (format, entry) => `${entry}.${format === "es" ? "js" : "cjs"}`,
          },
          rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime", "lucide-react"],
            output: {
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
                "lucide-react": "LucideReact",
              },
              assetFileNames: "[name][extname]",
            },
          },
          sourcemap: true,
          cssCodeSplit: true,
        },
      }
    : {}),
});
