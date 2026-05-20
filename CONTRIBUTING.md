# Contributing to `@poukai-inc/ui`

## Welcome

This library is the component and token contract for the Poukai brand. Send a PR when you have a finished implementation backed by an approved design spec, a full five-file scaffold, and green CI. Open an issue first when you want to propose a new component, rename a prop, change a token value, or make any change that touches the frozen surface described in `meta/semver-policy.md`. The engineer's lane is implementation; the design lane (`poukai-design`) owns the brand contract. Changes that span both lanes need coordination before code lands.

## Setup

```bash
pnpm install
pnpm dev        # Ladle showcase on :61000
pnpm test       # Playwright component tests (Chromium + Firefox + WebKit)
pnpm build      # vite build + tsc --emitDeclarationOnly
pnpm size       # size-limit budget check
```

See `README.md` for install instructions and the subpath export map.

## Adding a new component

### 1. Pick the right atomic layer

The package is organised by Atomic Design. Match the layer to the component's responsibility:

- **atoms** — one job, no children of their own (`Button`, `Tag`, `Avatar`, ...)
- **molecules** — atoms composed into a self-contained unit (`Hero`, `RoleCard`, ...)
- **organisms** — molecules combined with layout intent (`SiteShell`, `Dialog`, ...)

Templates and pages belong in the consuming repo, not here. When in doubt, consult the "Add a component" section in `README.md`.

### 2. Five-file scaffold

Create `src/<layer>/<Name>/` with exactly these five files:

```
Name.tsx              React component, forwardRef, typed props
Name.module.css       Scoped styles, tokens only (no hardcoded values)
Name.stories.tsx      Ladle stories (Playground + variants)
Name.test.tsx         Playwright CT tests
index.ts              Re-exports
```

Every component must use `forwardRef` and spread `...rest` onto the root element so consumers can pass `aria-*`, `data-*`, `style`, and arbitrary HTML attributes. See existing atoms for the canonical pattern.

### 3. Author a design spec first

Before writing any code, the design spec at `meta/design/<Name>.md` must exist and carry `Status: Approved`. The spec is the design agent's deliverable — engineers translate it into code, not the other way around. Existing specs in `meta/design/` are the templates. Do not open a PR for a component without a corresponding approved spec.

### 4. Wire the five barrels

After the five-file scaffold is in place, add the component to all five registration points in the same PR:

1. **`src/<layer>.ts`** — the subpath barrel (`src/atoms.ts`, `src/molecules.ts`, `src/organisms.ts`)
2. **`src/index.ts`** — the root flat barrel, under the matching layer comment
3. **`scripts/build-llms-txt.mjs`** — the `COMPONENTS.<layer>` array so `dist/llms.txt` lists the component
4. **`meta/llms-full.txt`** — add a `### <Name>` section in the correct layer block
5. **`README.md`** — add a row to the "Components shipped today" table

Missing any of these five points is a build or CI failure.

### 5. Central a11y gate

Add an entry to `src/a11y.test.tsx`. Every shipped component must appear there. State-specific inline axe scans (e.g. invalid input, open dialog) may supplement the central gate but never replace it.

### 6. Add a changeset

Every PR that changes the consumer surface requires a changeset:

```bash
pnpm changeset
```

Pick the bump type that matches `meta/semver-policy.md`. A PR that adds a new component is `minor`. A PR that fixes a bug without changing the API is `patch`. PRs with no consumer-surface change (docs, CI config, test updates) may omit the changeset — note this explicitly in the PR description.

## Polymorphic props

Components in this library follow one of four patterns for element substitution. Pick the right one at design time; mixing patterns on the same component is an error. Full rationale and code examples are in `meta/conventions/polymorphic-props.md`.

**`asChild` (Radix Slot composition).** The consumer needs to compose the component onto an arbitrary element — an `<a>`, a Next.js `<Link>`, or any component that must own the rendered node. Expose `asChild?: boolean`; when true, render `<Slot>` from `@radix-ui/react-slot` instead of the default element. All props flow through identically. This is the open pattern: any element is accepted. Use it only where arbitrary substitution is semantically safe. Components: `Button`, `Dialog.Trigger`, `Dialog.Close`.

**`as` (closed root-element swap).** The root element's tag is the only thing that varies, the variant set is known and small, and no behaviour changes with the tag. Declare a closed union prop typed as `as?: "div" | "footer"`. The ref type widens to `HTMLElement`. This is the closed pattern — it cannot accept arbitrary components. If consumers ask for a `<Link>`, they need `asChild`, not an expanding `as` union. Components: `Footer` (`"div" | "footer"`), `Statement` (`"p" | "blockquote"`).

**`<slot>As` (named inner-slot element swap).** A named inner slot — not the root — needs to vary in tag. The canonical case is a heading slot that must match the surrounding document outline. Declare a typed union prop named `<slot>As?:` (e.g. `titleAs?: "h1" | "h2"`). Use a capitalised local alias to satisfy JSX syntax. Use this pattern only where document-outline correctness genuinely varies across usage sites. Components: `Hero` (`titleAs: "h1" | "h2"`).

**No polymorphism (default).** Start here. Pick one root element and hard-code it. Add polymorphism only when a concrete recurring consumer need is documented. The cost of a speculative prop is paid by every future reader of the component. Components with semantically load-bearing roots (`Quote` → `<figure>`, `FieldNote` → `<aside>`, `Tag` → `<span>`) must never gain polymorphism.

## Token additions

Tokens live in `src/tokens/tokens.css` and are owned exclusively by the `poukai-design` agent. Engineers do not modify `tokens.css` directly.

If a component needs a value that has no existing token, the process is:

1. Open an issue or add a note in the design spec referencing the gap.
2. `poukai-design` adds the token to `src/tokens/tokens.css` with a brand-decision comment and updates `meta/brand.md` in the same commit.
3. Document the new token in the relevant section of `meta/llms-full.txt` (Color, Typography, Spacing, Motion, or Radius/Border).
4. The sync check (`scripts/check-llms-tokens-sync.mjs`) runs in CI and fails if `meta/llms-full.txt` is out of date with `tokens.css`.

Never reach for a hardcoded color, size, or font stack. If a token is missing, the process above is the path — not an inline value in a CSS Module.

## Story and test requirements

Every component must ship with both a story file and a test file.

**Stories (`Name.stories.tsx`).** At minimum one story covering the default state, plus one story per meaningful variant. The default export must include `args` and `argTypes` for every prop that has variant behavior, so Ladle's Playground knobs work. No barrel imports in stories — import directly from the component file.

**Tests (`Name.test.tsx`).** Playwright CT tests must cover:

- Rendering with default props
- Each prop variant (one assertion per meaningful state)
- `ref` forwarding (attach a `ref`, assert the element type)
- `className` merge (consumer `className` survives alongside the module class)
- Arbitrary prop forwarding (`data-testid`, `aria-label`, etc.)
- axe-core accessibility scan via `@axe-core/playwright`

Add an entry to the central `src/a11y.test.tsx` gate as well. State-specific scans (open dialog, invalid input, disabled button) belong inline in `Name.test.tsx` and supplement — not replace — the central gate entry.

## Token and a11y enforcement

`pnpm test` includes axe-core scans. Zero violations are required — CI fails on any axe finding. `scripts/check-llms-tokens-sync.mjs` runs in CI and asserts that every component directory has a `### ComponentName` heading in `meta/llms-full.txt` and that every token in `tokens.css` is documented there. Both gates must be green before a PR can merge.

## Commit and PR

Commit messages follow conventional commits:

```
feat: add <ComponentName> atom
fix: correct focus ring offset in Button
docs: backfill design spec for Statement
chore: update size-limit budgets
```

Every non-draft PR triggers auto-merge once CI is green. Keep PRs focused — one component, one fix, or one doc update per PR. CI must be fully green (tests, type-check, size-limit, token sync) before merge.

## Reference

- `meta/brand.md` — token rationale, palette, type scale, motion catalog
- `meta/semver-policy.md` — what constitutes major / minor / patch
- `meta/conventions/polymorphic-props.md` — full polymorphic-prop guide with code examples
- `meta/milestones/1.0.0.md` — 1.0.0 gate criteria and frozen surface definition
- `ROADMAP.md` — what ships next
- `BACKLOG.md` — in-flight work and open questions
