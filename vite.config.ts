import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), dts({ include: ["src"], rollupTypes: true }), libInjectCss()],
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
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        atoms: resolve(__dirname, "src/atoms.ts"),
        molecules: resolve(__dirname, "src/molecules.ts"),
        organisms: resolve(__dirname, "src/organisms.ts"),
      },
      name: "PoukaiUI",
      formats: ["es", "cjs"],
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
});
