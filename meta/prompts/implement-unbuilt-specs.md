# Prompt — Implement 47 unbuilt component specs in @poukai-inc/ui

Copy-paste this entire block into a fresh Claude Code session at the repo root.

---

Implement the 47 unbuilt component specs in `@poukai-inc/ui` (repo `poukai-inc/poukai-ui`, working dir `/Users/arianzargaran/Desktop/poukai org/poukai-ui`). Specs live in `meta/design/*.md`, all currently **Status: Approved** (normalized in PR #311 — confirm merged before starting).

## Phase 0 — Create one GitHub issue per unbuilt component

Use `gh issue create` for each of the 47 components below. One issue per component, do not bundle.

**Issue title format:** `feat(<layer>): <Name> — <one-line intent from spec section 1>`

Layer is derived from the spec (atoms / molecules / organisms). The wave list below already groups by layer where it matters.

**Issue body must include:**

- Link to the spec: `meta/design/<Name>.md`
- The "Intent" paragraph copied from spec section 1
- Required Radix peers (if any) — grep the spec for `@radix-ui/react-`
- Wave number (W1–W6)
- A checklist mirroring the "New atom checklist" in `CLAUDE.md`:
  - [ ] `src/<layer>/<Name>/<Name>.tsx` (forwardRef + displayName)
  - [ ] `src/<layer>/<Name>/<Name>.module.css` (tokens only — no raw values)
  - [ ] `src/<layer>/<Name>/index.ts`
  - [ ] `src/<layer>/<Name>/<Name>.stories.tsx` (title `<Layer> / <Name>`)
  - [ ] `src/<layer>/<Name>/<Name>.test.tsx` (Playwright CT)
  - [ ] Append axe cases to `src/a11y.test.tsx`
  - [ ] Append export to `src/index.ts`
  - [ ] Add `vite.config.ts` `build.lib.entry` line
  - [ ] Add `./<layer>/<Name>` subpath to `package.json#exports`
  - [ ] Add Radix peer(s) to `peerDependencies` + `devDependencies` (and `dependencies` if first-class runtime dep)
  - [ ] Append component doc block to `meta/llms-full.txt`
  - [ ] `.changeset/<id>.md` with `"@poukai-inc/ui": minor`
  - [ ] All local gates green (typecheck, lint, format:check, check:llms, build, test, size)
- Labels: `enhancement`, `wave-<N>`

### Wave order (do not deviate — dependency-ordered)

**Wave 1 — Overlay primitives** (6): Tooltip, Popover, HoverCard, DropdownMenu, ContextMenu, Sheet

**Wave 2 — Standalone widgets** (11): CopyButton, CodeBlock, Figure, Pagination, ShareLinks, TableOfContents, VideoEmbed, AudioPlayer, DatePicker, Carousel, Accordion

**Wave 3 — Compositions** (5): Combobox, CommandPalette, Table, DataTable, ComparisonTable

**Wave 4 — Item-level** (4): AnnouncementBar, BlogPostCard, FAQItem, PriceTier

**Wave 5 — Sections** (18): ArticleHeader, CTASection, ContactBlock, FAQSection, FailureModeList, FeatureGrid, GalleryGrid, LogoCloud, NewsletterSection, PrincipleList, PricingTable, RoleGrid, StatsSection, StepsSection, TeamGrid, TestimonialBlock, TimelineSection, BlogList

**Wave 6 — Layouts** (3): Header, ArticleLayout, DocsLayout

Confirm all 47 issues created before starting Phase 1.

## Phase 1 — Implement, one component per PR, in wave order

For each component, in the listed wave order:

1. **Fresh branch + worktree** (mandatory per `CLAUDE.md`):
   ```bash
   git fetch origin main
   git worktree add /tmp/poukai-<name-lower> origin/main
   cd /tmp/poukai-<name-lower>
   git checkout -b feat/<layer>-<name-lower>
   pnpm install
   ```

2. **Read the spec** at `meta/design/<Name>.md` end-to-end. Treat it as source of truth.

3. **Delegate implementation** to the `poukai-ds-engineer` agent with the spec and the checklist. That agent owns code; do NOT make brand decisions yourself. If the spec is ambiguous or needs a new token, stop and route the question to `poukai-design`.

4. **Local gate sequence — all must pass before push:**
   ```bash
   pnpm typecheck
   pnpm lint
   pnpm format:check    # if fails: pnpm format then re-check
   pnpm check:llms
   pnpm build
   pnpm test            # Playwright CT — run `pnpm exec playwright install` first if browsers missing
   pnpm size
   ```
   Run `typecheck` / `lint` / `format:check` / `check:llms` in parallel (all read-only). `build` → `test` → `size` sequential.

5. **Visual check via Ladle**: `pnpm dev`, open `http://localhost:<port>/poukai-ui/`, verify the story renders under the correct sidebar group (`<Layer> / <Name>`). Never use the `Components / ...` title — see `.ladle/config.mjs` `storyOrder`.

6. **Commit + push + PR**, linking the issue with `Closes #<n>`. PR title format: `feat(<layer>): add <Name> — <intent>`.

7. **Remove the worktree** after the PR opens: `git worktree remove /tmp/poukai-<name-lower>`.

## Stop-and-ask triggers (per `CLAUDE.md`)

- Spec says no new tokens, but a design invariant requires one → route to `poukai-design`, do not invent.
- New Radix peer's major differs from existing `1.x` peers → flag before adding.
- `pnpm-lock.yaml` merge conflict producing checksum errors → delete `node_modules`, delete `pnpm-lock.yaml`, re-run `pnpm install`, verify, then proceed.
- `size-limit` budget exceeded → do not raise the budget silently; raise with the user.
- Playwright CT cannot run (browser install fails, X11 missing, etc.) → surface the blocker, do not skip; CT is not optional.
- A spec dependency is unbuilt (e.g. an organism in Wave 5 needs a Wave 4 card not yet shipped) → block until the dependency lands.

## Reporting

- After each PR opens, post a one-line summary: `[Wave N] <Name>: PR #<n>` plus any blockers.
- After each wave completes, post a wave summary listing PRs and any deferred items.

## Hard rules

- Do NOT batch multiple components into a single PR.
- Do NOT skip the gate sequence.
- Do NOT push without all gates green.
- Do NOT commit directly to `main`.
- Do NOT work in the shared worktree when sibling tasks are running.
