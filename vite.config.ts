import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
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
              "atoms/Checkbox": resolve(__dirname, "src/atoms/Checkbox/index.ts"),
              "atoms/Code": resolve(__dirname, "src/atoms/Code/index.ts"),
              "atoms/Divider": resolve(__dirname, "src/atoms/Divider/index.ts"),
              "atoms/EmailLink": resolve(__dirname, "src/atoms/EmailLink/index.ts"),
              "atoms/Eyebrow": resolve(__dirname, "src/atoms/Eyebrow/index.ts"),
              "atoms/Heading": resolve(__dirname, "src/atoms/Heading/index.ts"),
              "atoms/Icon": resolve(__dirname, "src/atoms/Icon/index.ts"),
              "atoms/IconButton": resolve(__dirname, "src/atoms/IconButton/index.ts"),
              "atoms/Image": resolve(__dirname, "src/atoms/Image/index.ts"),
              "atoms/Input": resolve(__dirname, "src/atoms/Input/index.ts"),
              "atoms/Kbd": resolve(__dirname, "src/atoms/Kbd/index.ts"),
              "atoms/Label": resolve(__dirname, "src/atoms/Label/index.ts"),
              "atoms/Link": resolve(__dirname, "src/atoms/Link/index.ts"),
              "atoms/Logo": resolve(__dirname, "src/atoms/Logo/index.ts"),
              "atoms/Mark": resolve(__dirname, "src/atoms/Mark/index.ts"),
              "atoms/NumberFormat": resolve(__dirname, "src/atoms/NumberFormat/index.ts"),
              "atoms/ProgressBar": resolve(__dirname, "src/atoms/ProgressBar/index.ts"),
              "atoms/Prose": resolve(__dirname, "src/atoms/Prose/index.ts"),
              "atoms/Radio": resolve(__dirname, "src/atoms/Radio/index.ts"),
              "atoms/Select": resolve(__dirname, "src/atoms/Select/index.ts"),
              "atoms/Skeleton": resolve(__dirname, "src/atoms/Skeleton/index.ts"),
              "atoms/SkipLink": resolve(__dirname, "src/atoms/SkipLink/index.ts"),
              "atoms/Spacer": resolve(__dirname, "src/atoms/Spacer/index.ts"),
              "atoms/Spinner": resolve(__dirname, "src/atoms/Spinner/index.ts"),
              "atoms/Stat": resolve(__dirname, "src/atoms/Stat/index.ts"),
              "atoms/StatusBadge": resolve(__dirname, "src/atoms/StatusBadge/index.ts"),
              "atoms/Switch": resolve(__dirname, "src/atoms/Switch/index.ts"),
              "atoms/Tag": resolve(__dirname, "src/atoms/Tag/index.ts"),
              "atoms/Text": resolve(__dirname, "src/atoms/Text/index.ts"),
              "atoms/Textarea": resolve(__dirname, "src/atoms/Textarea/index.ts"),
              "atoms/Time": resolve(__dirname, "src/atoms/Time/index.ts"),
              "atoms/TimePicker": resolve(__dirname, "src/atoms/TimePicker/index.ts"),
              "atoms/VisuallyHidden": resolve(__dirname, "src/atoms/VisuallyHidden/index.ts"),
              "atoms/Wordmark": resolve(__dirname, "src/atoms/Wordmark/index.ts"),
              "atoms/Tooltip": resolve(__dirname, "src/atoms/Tooltip/index.ts"),
              "molecules/Alert": resolve(__dirname, "src/molecules/Alert/index.ts"),
              "molecules/Banner": resolve(__dirname, "src/molecules/Banner/index.ts"),
              "molecules/DatePicker": resolve(__dirname, "src/molecules/DatePicker/index.ts"),
              "molecules/CtaBlock": resolve(__dirname, "src/molecules/CtaBlock/index.ts"),
              "molecules/Byline": resolve(__dirname, "src/molecules/Byline/index.ts"),
              "molecules/Stepper": resolve(__dirname, "src/molecules/Stepper/index.ts"),
              "molecules/FailureMode": resolve(__dirname, "src/molecules/FailureMode/index.ts"),
              "molecules/Figure": resolve(__dirname, "src/molecules/Figure/index.ts"),
              "molecules/FeatureCard": resolve(__dirname, "src/molecules/FeatureCard/index.ts"),
              "molecules/Field": resolve(__dirname, "src/molecules/Field/index.ts"),
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
              "molecules/MenuItem": resolve(__dirname, "src/molecules/MenuItem/index.ts"),
              "molecules/LinkList": resolve(__dirname, "src/molecules/LinkList/index.ts"),
              "molecules/MetaList": resolve(__dirname, "src/molecules/MetaList/index.ts"),
              "molecules/TagList": resolve(__dirname, "src/molecules/TagList/index.ts"),
              "molecules/TeamCard": resolve(__dirname, "src/molecules/TeamCard/index.ts"),
              "molecules/Disclosure": resolve(__dirname, "src/molecules/Disclosure/index.ts"),
              "molecules/FormRow": resolve(__dirname, "src/molecules/FormRow/index.ts"),
              "molecules/TimelineItem": resolve(__dirname, "src/molecules/TimelineItem/index.ts"),
              "molecules/SearchField": resolve(__dirname, "src/molecules/SearchField/index.ts"),
              "molecules/NavLink": resolve(__dirname, "src/molecules/NavLink/index.ts"),
              "molecules/StatList": resolve(__dirname, "src/molecules/StatList/index.ts"),
              "molecules/Caption": resolve(__dirname, "src/molecules/Caption/index.ts"),
              "molecules/Fieldset": resolve(__dirname, "src/molecules/Fieldset/index.ts"),
              "molecules/HoverCard": resolve(__dirname, "src/molecules/HoverCard/index.ts"),
              "molecules/Popover": resolve(__dirname, "src/molecules/Popover/index.ts"),
              "molecules/Table": resolve(__dirname, "src/molecules/Table/index.ts"),
              "molecules/CopyButton": resolve(__dirname, "src/molecules/CopyButton/index.ts"),
              "molecules/Pagination": resolve(__dirname, "src/molecules/Pagination/index.ts"),
              "molecules/EmptyState": resolve(__dirname, "src/molecules/EmptyState/index.ts"),
              "molecules/Breadcrumb": resolve(__dirname, "src/molecules/Breadcrumb/index.ts"),
              "organisms/TeamGrid": resolve(__dirname, "src/organisms/TeamGrid/index.ts"),
              "organisms/FailureModeList": resolve(
                __dirname,
                "src/organisms/FailureModeList/index.ts",
              ),
              "organisms/FeatureGrid": resolve(__dirname, "src/organisms/FeatureGrid/index.ts"),
              "molecules/ShareLinks": resolve(__dirname, "src/molecules/ShareLinks/index.ts"),
              "molecules/TableOfContents": resolve(
                __dirname,
                "src/molecules/TableOfContents/index.ts",
              ),
              "molecules/PriceTier": resolve(__dirname, "src/molecules/PriceTier/index.ts"),
              "molecules/Carousel": resolve(__dirname, "src/molecules/Carousel/index.ts"),
              "molecules/NewsletterField": resolve(
                __dirname,
                "src/molecules/NewsletterField/index.ts",
              ),
              "molecules/CodeBlock": resolve(__dirname, "src/molecules/CodeBlock/index.ts"),
              "organisms/Sidebar": resolve(__dirname, "src/organisms/Sidebar/index.ts"),
              "organisms/CTASection": resolve(__dirname, "src/organisms/CTASection/index.ts"),
              "organisms/ContactBlock": resolve(__dirname, "src/organisms/ContactBlock/index.ts"),
              "organisms/Header": resolve(__dirname, "src/organisms/Header/index.ts"),
              "organisms/ArticleHeader": resolve(__dirname, "src/organisms/ArticleHeader/index.ts"),
              "organisms/HeroSection": resolve(__dirname, "src/organisms/HeroSection/index.ts"),
              "organisms/StepsSection": resolve(__dirname, "src/organisms/StepsSection/index.ts"),
              "organisms/StatsSection": resolve(__dirname, "src/organisms/StatsSection/index.ts"),
              "organisms/Dialog": resolve(__dirname, "src/organisms/Dialog/index.ts"),
              "organisms/Footer": resolve(__dirname, "src/organisms/Footer/index.ts"),
              "organisms/Form": resolve(__dirname, "src/organisms/Form/index.ts"),
              "organisms/SiteShell": resolve(__dirname, "src/organisms/SiteShell/index.ts"),
              "organisms/Tabs": resolve(__dirname, "src/organisms/Tabs/index.ts"),
              "organisms/Toast": resolve(__dirname, "src/organisms/Toast/index.ts"),
              "organisms/LogoCloud": resolve(__dirname, "src/organisms/LogoCloud/index.ts"),
              "organisms/PrincipleList": resolve(__dirname, "src/organisms/PrincipleList/index.ts"),
              "organisms/RoleGrid": resolve(__dirname, "src/organisms/RoleGrid/index.ts"),
              "organisms/TestimonialBlock": resolve(
                __dirname,
                "src/organisms/TestimonialBlock/index.ts",
              ),
              "organisms/ComparisonTable": resolve(
                __dirname,
                "src/organisms/ComparisonTable/index.ts",
              ),
              "organisms/NewsletterSection": resolve(
                __dirname,
                "src/organisms/NewsletterSection/index.ts",
              ),
              "organisms/AnnouncementBar": resolve(
                __dirname,
                "src/organisms/AnnouncementBar/index.ts",
              ),
              "organisms/BlogPostCard": resolve(__dirname, "src/organisms/BlogPostCard/index.ts"),
              "organisms/PricingTable": resolve(__dirname, "src/organisms/PricingTable/index.ts"),
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
              // Single combined stylesheet emitted as `dist/styles.css`.
              // Per-component CSS imports were removed (see `cssCodeSplit`)
              // so JS chunks have no CSS side effects and tree-shake cleanly.
              // Consumers add one `import "@poukai-inc/ui/styles.css"`
              // alongside the existing `import "@poukai-inc/ui/tokens.css"`.
              assetFileNames: (asset) =>
                asset.names?.some((n) => n.endsWith(".css")) ? "styles.css" : "[name][extname]",
            },
          },
          sourcemap: true,
          // Emit a single, combined `dist/styles.css` so per-chunk JS files
          // are free of CSS side-effect imports. This is what unlocks barrel
          // tree-shaking: without it, every JS chunk carries an
          // `import "./Foo.css"` line that forces the bundler to retain the
          // chunk for its side effect. Trade-off: consumers must `import`
          // the stylesheet once at their app root.
          cssCodeSplit: false,
        },
      }
    : {}),
});
