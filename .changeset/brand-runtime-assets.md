---
"@poukai/ui": minor
---

Ship favicon set + OpenGraph image as runtime brand assets.

New `./brand/*` export — drop-in social/favicon files referenced by the
consuming repo's `<head>`:

- `favicon.svg` (vector, `prefers-color-scheme`-aware fill)
- `favicon-32.png`, `favicon-16.png` (raster fallbacks)
- `apple-touch-icon.png` (180×180, iOS home screen)
- `og.png` (1200×630, OpenGraph + Twitter card)

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<meta property="og:image" content="https://pouk.ai/og.png" />
```

In a Next.js / Vite consumer the files resolve as URL imports:

```ts
import faviconSvg from "@poukai/ui/brand/favicon.svg";
import og from "@poukai/ui/brand/og.png";
```

Build pipeline: new `build:brand` script copies `src/brand/**` into
`dist/brand`; the root `build` now chains `build:tokens` and `build:brand`
so a single `pnpm build` produces a publish-ready `dist/` (previously the
tokens copy had to be invoked separately).

Source files live in `src/brand/`. The package-root `brand/poukai-logo.svg`
remains the build-time source for the inlined Wordmark geometry and is
unchanged.
