# @poukai-inc/ui

Production React component library for the Poukai brand.

## Install

```bash
pnpm add @poukai-inc/ui react react-dom lucide-react
```

The package is published to GitHub Packages (`@poukai-inc` scope). Configure your `.npmrc`:

```
@poukai-inc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

## Use

Import the tokens stylesheet **once** at your app root:

```ts
// app/layout.tsx (Next.js) or main.tsx (Vite)
import "@poukai-inc/ui/tokens.css";
```

Then import components as needed. Fonts are bundled and referenced from
`@poukai-inc/ui/fonts/*` automatically by `tokens.css`.

```tsx
import { Wordmark, StatusBadge, Button } from "@poukai-inc/ui";

export function Hero() {
  return (
    <header>
      <Wordmark height={64} />
      <h1>
        Technical consulting for teams shipping with <em>AI</em>.
      </h1>
      <StatusBadge status="available">Taking conversations for Q3.</StatusBadge>
      <Button asChild>
        <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
      </Button>
    </header>
  );
}
```

### Subpath imports (tree-shaking)

The flat root export above is the recommended path — modern bundlers
tree-shake it cleanly. If you want belt-and-braces, every atomic layer
also has a subpath export:

```ts
import { Wordmark, Button } from "@poukai-inc/ui/atoms";
import { Hero } from "@poukai-inc/ui/molecules";
import { SiteShell } from "@poukai-inc/ui/organisms";
```

Useful when a consuming surface only touches one layer (e.g. an internal
tool that wants atoms only) — the subpath entry never pulls in code from
other layers, even if the bundler's tree-shaker would miss it.

## Components shipped today

| Layer    | Name          | Purpose                                                    |
| -------- | ------------- | ---------------------------------------------------------- |
| atom     | `Wordmark`    | Full POUKAI lockup, inherits `currentColor`                |
| atom     | `StatusBadge` | Availability dot + caption (available / idle / closed)     |
| atom     | `Button`      | Primary / secondary / ghost; `asChild` via Radix Slot      |
| atom     | `Stat`        | Display numeral + caption + optional source line           |
| molecule | `Hero`        | Status / title / lede / CTA — editorial vertical rhythm    |
| molecule | `RoleCard`    | Icon + eyebrow + title + body + hired-by; card recipe      |
| molecule | `Principle`   | Margin numeral + title + body; editorial layout            |
| molecule | `FailureMode` | Numbered failure-mode block (`/why-ai`)                    |
| organism | `SiteShell`   | Top nav + main slot + hairline footer; no router awareness |

More to come — see `ROADMAP.md`.

## Develop

```bash
pnpm install
pnpm dev          # Ladle on :61000
pnpm test         # Playwright component tests
pnpm build        # vite build + tsc --emitDeclarationOnly
pnpm size         # size-limit budget check
```

### Add a component

The package is organised by **Atomic Design**:

```
src/
  tokens/      single source of truth for color, type, spacing, motion
  atoms/       one job, no children of their own         (Wordmark, Button, ...)
  molecules/   atoms composed into a self-contained unit (Hero, RoleCard, ...)
  organisms/   molecules + layout intent                 (SiteShell, ...)
```

Templates and pages live in the **consuming repo**, not here.

Pick the right layer, then create `src/<layer>/<Name>/` with five files:

```
Name.tsx              React component, forwardRef, typed props
Name.module.css       Scoped styles, tokens only (no hardcoded values)
Name.stories.tsx      Ladle stories (Playground + variants)
Name.test.tsx         Playwright CT tests
index.ts              Re-exports
```

Then add the export to `src/index.ts` under the matching layer comment.

## Release

```bash
pnpm changeset             # record a changeset
git commit && git push     # CI opens the version PR
# merge the version PR; CI publishes
```

## Conventions

- **Never hardcode colors, sizes, or font stacks.** Always reference CSS custom
  properties from `tokens.css`. If a value is missing, add it to tokens first.
- **`forwardRef` every component.** Consumers expect to attach refs.
- **`...rest` spread** onto the root element so consumers can pass `aria-*`,
  `data-*`, `style`, etc.
- **Accessibility first.** Decorative SVG gets `aria-hidden`; interactive
  composites use Radix primitives (`Slot`, `Dialog`, `Tabs`).
- **No barrel re-exports in stories or tests.** Import from the component file
  directly so tree-shaking is provable.
