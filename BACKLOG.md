# Backlog

Living to-do for `@poukai-inc/ui`. PRs that close an item should tick its box.
Items removed when stale or migrated to an issue.

**Last reviewed:** 2026-05-30 (five-lane repo audit; see § 🔎 Repo audit)

---

## 🔴 Blocking

- [ ] **Playwright CT cannot render `lucide-react` components — repo-wide
      regression.** Any test that mounts a component which renders a Lucide
      icon (whether directly via `<Icon icon={X}>` or indirectly via a
      composing atom like `<IconButton>`) crashes in-browser with React
      minified error #130 (`Element type is invalid … got: object.`) and
      leaves `<div id="root"></div>` empty. Affects `chromium` and `firefox`
      projects identically. Reproduces on a clean checkout of `main` —
      `src/atoms/Icon/Icon.test.tsx` (e.g. the `default size is sm (16px)`
      case) fails with the same React #130 stack. Verified via `git stash &&
  pnpm test src/atoms/Icon/Icon.test.tsx -g "default size is sm"` on
      `cac41bc`. Non-Lucide CT suites (`Button`, `Spinner`, `Toast`, etc.)
      are unaffected. Lucide-react `0.577.0` pinned in `pnpm-lock.yaml`,
      React `18.3.1` resolved as the single copy. Adding `optimizeDeps.include:
  ["lucide-react"]` to `ctViteConfig` does **not** fix it. The build,
      typecheck, lint, size-limit, and Ladle pipelines all stay green — only
      CT is broken. Until this is resolved, all Lucide-composing atoms
      (`Icon`, `IconButton`, future `EmailLink`-icon variants, anything in
      `<Hero>` / `<Banner>` / `<Toast>` that uses an icon) cannot be CT-
      regression-tested. Suspect Playwright CT's prop-serialisation
      transform on component-typed props (e.g. `icon={Mail}`) — needs
      bisection against an older Playwright CT version (`@playwright/
  experimental-ct-react@1.60` is current; the suite last passed against
      whatever version was in CI for PR #107).

---

## 🟣 1.0.0 milestone gate

Items from `meta/milestones/1.0.0.md` §3 that are not yet met. Tick here and in the milestone doc in the same PR.

- [x] **Author `meta/design/Statement.md`.** Backfill from existing implementation. Estimated 4–6 hours.
- [x] **Author `meta/design/Form.md`.** Compound organism; needs full prop-intent section for `Form`, `Field`, `Input`, `Textarea` composition. Estimated 6–8 hours.
- [x] **Verify `llms-full.txt` sync check passes for all 31 components.**
      Confirmed 2026-05-20: `node scripts/check-llms-tokens-sync.mjs` reports
      "all 34 color token(s) and 31 component(s) documented in
      meta/llms-full.txt. OK". Sync clean.
- [x] **Resolve Wordmark story namespace.** Unified under `Components/Wordmark`
      (landed in v0.22.x batch 6). All three Wordmark story files updated.
- [x] **Verify bundle CI gate is blocking on regression.** Verified on
      2026-05-20. Smoke test (lowering `ESM — full bundle` limit to `20 kB`)
      produced exit code 1 + "Package size limit has exceeded" message.
      Restoring limit returned exit code 0. CI runs `pnpm size` after build,
      no `continue-on-error`. Documented in `meta/ci/size-gate.md`.
- [x] **Author `meta/migrations/template.md`.** Migration guide template for future major bumps. See `meta/milestones/1.0.0.md` §4 for structure and worked example. Estimated 2–3 hours.
- [x] **Author `CONTRIBUTING.md`.** Polymorphic-prop conventions, token addition flow, story/test requirements, semver policy. Synthesises `meta/conventions/polymorphic-props.md`. Estimated 1 day.
- [x] **CHANGELOG hand-rewrite for 0.x → 1.0.** Curated narrative grouping changeset entries by theme. Final step — write after all other gate items are met. Estimated 4–6 hours.

---

## 🟡 In flight

Work the user is driving, where I'm a passenger.

- [ ] **Phase 2 — Astro site rebuild.** Lives in `poukai-inc/pouk.ai`, not
      here. Tracked from this repo only so consumer-facing gaps surface against
      the published package surface. (The earlier `apps/pouk-ai-site/` scaffold
      reference is gone — it never landed in this repo's git history; the site
      repo is canonical.)

---

## 🟢 Done — recent ships

Kept for ~one release as context, then pruned.

- [x] **`0.22.0`** — `Form` organism.
- [x] **`0.21.0`** — `Toast` organism + `useToast` hook.
- [x] **`0.20.0`** — `Tabs` organism, `Field` / `Input` / `Textarea` molecules.
- [x] **`0.19.0`** — Dark-mode tokens; Apple-HIG-aligned dark palette; all contrast budgets met. `Banner` molecule.
- [x] **`0.18.0`** — `Tag` atom, `Avatar` atom, `Dialog` + `DialogBasic`
      organism, `FieldNote` molecule, `Footer` organism, `Quote` molecule.
      `@radix-ui/react-dialog` dep is now in use.
- [x] **`0.17.0`** — `EmailLink`, `Eyebrow` atoms; `Pull`, `Section`,
      `FeatureCard`, `LinkCard`, `TeamCard` molecules. New tokens
      `--tracking-eyebrow`, `--lh-meta`, `--fs-pull`. Global `<a>`
      resting-state underline + Stat color inheritance fix. `displayName`
      backfill across all `forwardRef` components.

---

## 🔵 Next

Things to pick up while the site consumes the package. Not committed;
ordering by likely demand.

- [ ] **PWA + OG assets** — favicon set (svg + 16/32/192/512 + apple-touch),
      `site.webmanifest`, and a real `og.png` (1200×630). Placeholders dropped
      in the 0.6.x reorg; site repo will need them. Author fresh in `src/brand/`
      if they should ship via `./brand/*`, or keep in site repo if site-only.
- [ ] **Re-evaluate Lucide icon picks** — Hammer / Bot / BookOpen / Sparkles.
      Done quickly inside `roles.astro`; needs founder sign-off.
- [ ] **CI: lighthouse-ci in the site repo** — required for the Phase 4
      parity matrix (Lighthouse 100 on every page).
- [ ] **Phase 3 activation** — write the workspace-sibling setup
      (`pnpm-workspace.yaml` in the parent folder) once the site repo is
      consuming the published package end-to-end.
- [ ] **Phase 4 cutover** — run the parity matrix from migration plan §6.1,
      then DNS swap on Vercel. Last step.

---

## 🔎 Repo audit (2026-05-30)

Five-lane review (security, a11y, React correctness, build/packaging,
test coverage), every finding verified against source before listing.
All read-only gates green at audit time: `typecheck`, `lint`,
`format:check`, `check:llms` (42 tokens, 128 components synced) pass.
Most speculative findings were **checked and dismissed** — see the
"verified non-issues" note at the end so they aren't re-chased.

### High — contract-breaking or interactive gaps

- [ ] **Deprecated subpath exports resolve to nonexistent files.** ([#371](https://github.com/poukai-inc/poukai-ui/issues/371))
      `package.json` advertises `./molecules/Input` and
      `./molecules/Textarea`, but neither has a `vite.config.ts`
      `build.lib.entry` — so `dist/molecules/Input.js` and
      `dist/molecules/Textarea.js` are never emitted (confirmed via
      `ls dist/molecules/`). A consumer importing the deprecated path
      gets a hard module-resolution error instead of the intended
      `@deprecated` re-export shim (`src/molecules/Input/index.ts`,
      `src/molecules/Textarea/index.ts`). Fix: either add the two
      entries to `vite.config.ts` so the shims emit, or drop the two
      subpaths from `package.json` exports if the deprecation window
      is over.
- [ ] **`atoms/Radio` has no CT test.** ([#372](https://github.com/poukai-inc/poukai-ui/issues/372)) Interactive form control,
      `src/atoms/Radio/Radio.test.tsx` missing (confirmed). CLAUDE.md
      checklist requires `<Name>.test.tsx` per atom. Add Playwright CT
      covering checked/unchecked, keyboard selection, group semantics,
      and append the axe case to `src/a11y.test.tsx`.

### Medium — coverage + correctness polish

- [ ] **`atoms/ProgressBar` has no CT test.** ([#373](https://github.com/poukai-inc/poukai-ui/issues/373)) Stories exist, test file
      missing (`src/atoms/ProgressBar/ProgressBar.test.tsx`). Add CT for
      value/max rendering, indeterminate state, and `role="progressbar"`
      ARIA value attributes.
- [ ] **`CodeBlock` copy-reset `setTimeout` has no cleanup.** ([#374](https://github.com/poukai-inc/poukai-ui/issues/374))
      `src/molecules/CodeBlock/CodeBlock.tsx:60` —
      `setTimeout(() => setCopied(false), 1500)` runs without a ref or
      `clearTimeout`, so it fires `setState` after unmount (React warns).
      `CopyButton` already does this correctly with a tracked ref
      (`CopyButton.tsx:75-81`); mirror that pattern in `CodeBlock`.
- [ ] **Replace hardcoded `waitForTimeout` waits in CT.** ([#375](https://github.com/poukai-inc/poukai-ui/issues/375)) Flaky timing
      in `molecules/CopyButton.test.tsx` (350/150/150 ms),
      `organisms/Toast.test.tsx` (2× 800 ms),
      `organisms/Form.test.tsx` (50/100 ms),
      `molecules/TableOfContents.test.tsx` (200 ms), and
      `a11y.test.tsx` (200 ms). Swap for `expect.poll` / locator
      visibility waits so CI is deterministic.
- [ ] **Thin coverage on stateful components.** ([#376](https://github.com/poukai-inc/poukai-ui/issues/376)) `organisms/Form`,
      `organisms/SiteShell`, `organisms/TeamGrid`, and `molecules/Popover`
      sit at ≤9 CT cases despite holding layout/submission/overlay state.
      Add interaction cases (submit/validation, nav state, click-outside).

### Low — defensive hardening (consumer-supplied input)

- [ ] **`VideoEmbed` iframe has no `sandbox` and a broad `allow`.** ([#377](https://github.com/poukai-inc/poukai-ui/issues/377))
      `src/molecules/VideoEmbed/VideoEmbed.tsx:78-83` passes `src`
      through unvalidated with `allow="… clipboard-write …"` and no
      `sandbox`. It's a generic embed wrapper (src is consumer-owned),
      so this is hardening, not an active hole: add an opt-in
      `sandbox` default and/or document the trusted-src contract.
- [ ] **Reject non-http(s) href schemes in link-bearing components.** ([#378](https://github.com/poukai-inc/poukai-ui/issues/378))
      `AudioPlayer` `transcriptHref` (`AudioPlayer.tsx:98`) and similar
      pass-through hrefs accept any string incl. `javascript:`. `Link`
      already auto-applies `rel="noopener noreferrer"`; extend the same
      defensive posture by stripping/ignoring `javascript:`/`data:`
      schemes where an href is rendered verbatim.
- [ ] **`Decisions.stories` renders `marked` output unsanitized.** ([#379](https://github.com/poukai-inc/poukai-ui/issues/379))
      `src/stories/Decisions.stories.tsx:68,153` —
      `dangerouslySetInnerHTML` of `marked.parse(...)` with no
      sanitizer. Dev-only Ladle story over maintainer-authored ADR
      markdown, so low risk, but either sanitize (DOMPurify) or add a
      comment asserting the trusted-input assumption.
- [ ] **Swap the `sk-proj-…` sample key in `CopyButton.stories`.** ([#380](https://github.com/poukai-inc/poukai-ui/issues/380))
      `CopyButton.stories.tsx:57-58` uses a real-looking OpenAI/Anthropic
      key prefix. Replace with an obviously-fake `demo_key_…` so it never
      trips secret scanners or confuses readers.

### Verified non-issues (checked, do not re-chase)

- External-link `rel`: `Link` auto-applies `rel="noopener noreferrer"`
  on `target="_blank"`; `LinkCard`/`LinkList`/`Footer` do too.
- `Carousel` a11y/keyboard: has `aria-roledescription`, polite
  `aria-live`, focusable scroll region; autoplay effect already lists
  `slideCount` in deps (`Carousel.tsx:168`).
- `Pagination`: has `<nav aria-label="Pagination">`, `aria-current="page"`,
  icon-button `aria-label`s.
- `DataTable`: emits `aria-sort` on sortable headers.
- `Input`/`Select`/`Textarea`: expose an `invalid` prop wired to
  `aria-invalid`, and spread `...rest` for `aria-describedby` etc.
- `Toast`/`ToastItem`: live-region + focus handled by
  `@radix-ui/react-toast`.
- `CommandPalette`: covered in `a11y.test.tsx` (3 references).
- `license: "UNLICENSED"`: intentional — restored deliberately in #363
  (`0ab6f96`), not a mismatch with the `LICENSE` file.

---

## 🟠 Consistency audit (2026-05-18)

Sourced from a four-lane OMC review: component API, token contract,
build/exports, docs/coverage. CRITICALs already promoted to 🔴 Blocking.

### High — consumer-visible or contract-breaking

- [x] **Export `Statement` from `src/molecules.ts` subpath barrel.**
- [x] **Widen Hero type re-exports in `src/molecules.ts`** to include the full
      union: `HeroSize`, `HeroEntrance`, `HeroBleed`, `HeroVariant`,
      `HeroDefaultProps`, `HeroNoTitleProps`. Root barrel widened to match.
- [x] **Add `Portrait` and `Statement` to `scripts/build-llms-txt.mjs`
      `COMPONENTS.molecules`** so the generated `dist/llms.txt` lists all
      shipped components. Also fixed a pre-existing path-emission bug.
- [x] **Add `### Portrait` and `### Statement` sections to
      `meta/llms-full.txt`**, plus missing tokens and Hero slots.
- [x] **Add `Portrait` and `Statement` rows to the "Components shipped today"
      table in `README.md`.**
- [x] **Replace hardcoded transition values in `Button.module.css`.**
- [x] **Tokenize StatusBadge pulse duration.** Added `--dur-pulse: 1800ms`.
- [x] **Tokenize the repeated card-title clamp.** Added `--fs-card-title`.
- [x] **Define `--space-10: 2.5rem`.** Added to spacing scale.
- [x] **Add per-variant assertions to `Button.test.tsx`.**
- [x] **Backfill `StatusBadge` tests.**
- [x] **Extend `scripts/check-llms-tokens-sync.mjs`** to assert every component
      directory has a matching heading in `meta/llms-full.txt`.

### Medium — API + token + docs polish

- [x] **Root barrel `src/index.ts` Hero type completeness** — `HeroVariant`,
      `HeroDefaultProps`, `HeroNoTitleProps` now exported alongside the rest.
- [x] **Fix wrong fallback in `src/atoms/Button/Button.module.css`.**
      Replaced `var(--radius-2, 8px)` with `var(--radius-2)` so the token is
      authoritative; the wrong 8px fallback is gone.
- [x] **Add `displayName` to all `forwardRef` components.** Exhaustive sweep
      confirmed all 25 forwardRef components already carry displayName.
- [x] **Document polymorphic-prop conventions.** Documented in `meta/conventions/polymorphic-props.md`.
- [x] **Add `args` / `argTypes` to story default exports** — Added
      `args`/`argTypes` Playground knobs to the six story files: FailureMode,
      Portrait, Principle, RoleCard, Statement, SiteShell.
- [x] **Decide Wordmark story namespace.** Unified under `Components/Wordmark`.
      All three Wordmark story files updated from `"Brand / Wordmark"` to
      `"Components / Wordmark"`.
- [x] **Spread axe-core coverage.** Standardized on the central
      `src/a11y.test.tsx` gate. Inline scans removed from 14 components;
      state-specific inline scans kept for Hero, Portrait, Input, Textarea.
- [x] **Add `Portrait` to the centralized `src/a11y.test.tsx` gate.**
- [x] **Reconcile letter-spacing.** Tokens added: `--tracking-micro`,
      `--tracking-eyebrow`, `--tracking-numeric`.
- [x] **Reconcile responsive breakpoint.** `--bp-md: 768px` token +
      `@custom-media --bp-md` declaration in `tokens.css`. Hero aligned.
- [x] **Tokenize / document Button paddings.** Inline with comment linking
      `meta/design/Button.md §3`.
- [x] **Tokenize StatusBadge dot dimensions and RoleCard icon box.**
      StatusBadge dot stays inline; RoleCard icon swapped to `var(--btn-h-md)`.
- [x] **Document `illustration` slot in `meta/llms-full.txt` Hero section.**
- [x] **Prune stale `ROADMAP.md` "Shipped" block.**
- [x] **Prune stale `BACKLOG.md` "Done" entries.**
- [x] **Decide on `@radix-ui/react-dialog` dependency.** Shipped in `0.18.0`.
- [x] **Reconcile sequential-marker prop names.** Kept as-is; distinction documented.
- [x] **Make Portrait dev-mode-guard test non-vacuous.**

### Low — hygiene + future-proofing

- [x] **Dedupe ESLint config.**
- [ ] **Move `lede` (`Hero.tsx:136`) and `muted-link` (`SiteShell.tsx:86`)
      global classes into their respective CSS Modules.**
- [x] **Fix `.ladle/config.mjs` `defaultStory`.**
- [x] **Resolve orphaned tokens.**
- [x] **Pick one body line-height.** Tokens: `--lh-body`, `--lh-body-relaxed`.
- [x] **Fill `meta/brand.md` Typography / Spacing / Motion / Brand-mark sections.**
- [x] **Author missing design specs under `meta/design/`.** All 31 specs done. `Statement` and `Form` landed in 1.0.0 gate pass.
- [x] **Decide on Firefox CT coverage.** Shipped; all 1572 tests passing.
- [x] **Tokenize line-height + letter-spacing scales.**

---

## ⚪ Parked / open questions

- [ ] **`LazyRiver` / `Marquee` — approved 2026-05-20, ready to build.**
      Decision logged in `meta/brand.md`. Layer: **molecule**. Compound
      API: `Marquee.Root` / `Marquee.Track` (auto-duplicates `children`
      for seamless loop). `speed` prop maps to `--dur-marquee` (30s
      default). `animation-play-state: paused` on
      `prefers-reduced-motion: reduce` and `:hover`/`:focus-within` —
      non-negotiable. Accepts arbitrary `children`; Logo atom (when
      built) is the primary child for logo-cloud strips. Build when a
      consuming surface asks (logo cloud, testimonial strip, tech-stack
      parade).

- [ ] **CHANGELOG bootstrap.** Auto-created by `changesets/action` on first
      Version Packages merge. Pre-committing an empty `CHANGELOG.md` would
      give a cleaner first-PR diff. Low priority; superseded by the 1.0.0
      CHANGELOG hand-rewrite gate item.
- [ ] **Token for Vercel (Phase 3).** Use a separate fine-grained PAT with
      `read:packages` only for the site repo's Vercel env var. The repo's
      `NPM_TOKEN` should not be reused there.
- [x] **lint-staged worktree bug** — fixed; `scripts/pre-commit.mjs` in place.

---

## 🧱 Component coverage — atomic-design completion

Final missing-component sweep against the current 25-component surface
(8 atoms / 13 molecules / 4 organisms). The list below is the canonical
target shape for the library: every higher-layer item declares the lower-
layer atoms/molecules it depends on, so the build order falls out
naturally. Items here are _candidates_, not commitments — ship when a
consuming surface asks. CHECKED items already exist and are listed only
to make the dependency graph readable.

> Convention: `← depends on: Foo, Bar` lists the lower-layer pieces that
> must exist (or ship in the same PR) before this component can be
> implemented cleanly. Items without a dependency line are pure atoms.

### Atoms — primitives with one job, no children of their own

Foundational, semantic, or single-element. Adding any of these unlocks
multiple molecules below.

Shipped:

- [x] **Wordmark** — full POUKAI lockup, inherits `currentColor`.
- [x] **Button** — primary / secondary / ghost; `asChild` via Radix Slot.
- [x] **Stat** — display numeral + caption + optional source line.
- [x] **StatusBadge** — availability dot + caption.
- [x] **Eyebrow** — uppercase tracked micro-label.
- [x] **EmailLink** — `mailto:` affordance with icon + qualifier slots.
- [x] **Tag** — inline categorical pill.
- [x] **Avatar** — person/entity identity (image / initials / placeholder).

Missing — typography & prose primitives:

- [ ] **Heading** — `h1`–`h6` wrapper enforcing the canonical type scale
      (`--fs-h1` … `--fs-h6`); `as` + `size` props decouple visual rank
      from semantic level. Lift the inline `<h1>`/`<h2>` styling out of
      `tokens.css` global rules into a component so consumers stop
      cargo-culting raw heading tags.
- [ ] **Text** — paragraph atom with `size` (`body` / `lede` / `caption`
      / `micro`), `tone` (`default` / `muted` / `on-warm`), and `as` props.
      Replaces the ad-hoc `.lede` and `<p className="muted">` patterns
      currently sprinkled across molecules.
- [ ] **Prose** — typographic context wrapper for arbitrary long-form
      HTML (`<ul>`, `<ol>`, `<blockquote>`, `<p>`, `<code>`). Single
      class that scopes the global type rules so editorial pages can
      drop raw markdown output inside without re-styling.
- [ ] **Code** — inline `<code>` chip on `--surface` with monospace.
      Used by Prose and FieldNote.
- [ ] **Kbd** — keyboard-key glyph (`⌘ K`). Same surface family as Code.
- [ ] **Mark** — `<mark>` highlight using `--accent-glow` so editorial
      highlighting stops needing inline `<span style>` overrides.
- [ ] **Time** — semantic `<time datetime>` with locale-aware formatted
      label. Used by Byline, ArticleHeader, TimelineItem.
- [ ] **NumberFormat** — pure formatter (grouped digits, currency,
      compact). Stat currently formats inline; lift the formatter so
      StatList rows stay consistent.

Missing — interactive & link primitives:

- [ ] **Link** — styled anchor (the global `a` two-layer underline rule
      currently lives in `tokens.css`). Lifting it into an atom gives
      `Button asChild` and every nav molecule a single contract.
      `variant`: `default` / `quiet` / `muted-link`.
- [ ] **IconButton** — square Button variant carrying only an icon, with
      mandatory `aria-label`. ← depends on: Button, Icon, VisuallyHidden.
- [ ] **SkipLink** — keyboard-focus "Skip to content" anchor. Required
      a11y primitive for SiteShell and DocsLayout.

Missing — icon & media primitives:

- [ ] **Icon** — thin wrapper over `lucide-react` enforcing size
      (`xs`/`sm`/`md`/`lg`), `currentColor`, and decorative
      `aria-hidden` defaults. Nearly every higher-layer element wants
      one; codifying it stops every consumer reinventing the prop
      surface. (NB: ROADMAP "Won't" rules out re-exporting Lucide —
      this wraps, not re-exports.)
- [ ] **Image** — token-aware `<img>` with intrinsic `aspectRatio`,
      `loading="lazy"` default, and CLS-safe sizing. Portrait stays
      the editorial photograph; Image is the plain-image atom for
      logos, screenshots, illustrations.
- [ ] **Logo** — partner-/customer-logo `<img>` cell for LogoCloud,
      with `tone` (`color` / `mono` / `muted`) and consistent
      max-height. ← depends on: Image.
- [ ] **Spinner** — token-driven indeterminate load glyph (used by
      Button `loading`, async forms). 16px / 20px / 24px.
- [ ] **Skeleton** — placeholder rectangle (rounded via `--radius-2`)
      animated through `--dur-pulse`.
- [ ] **ProgressBar** — linear determinate/indeterminate bar.
- [ ] **Divider** — hairline rule (horizontal / vertical) using
      `--hairline`. Lifts the dozen inline `border-top: 1px solid
var(--hairline)` rules into one atom.
- [ ] **Spacer** — explicit-gap atom for templates where flex/grid
      `gap` can't reach (rare, but useful inside Prose).
- [ ] **VisuallyHidden** — screen-reader-only span. A11y primitive
      relied on by Dialog, IconButton, SkipLink.

Missing — form primitives (ROADMAP "Maybe — Form"; promote when
the first real form surface lands):

- [ ] **Label** — form label atom; binds to its control via `htmlFor`.
- [ ] **Input** — text input.
- [ ] **Textarea** — multiline input.
- [ ] **Select** — native `<select>` styled to tokens (keep the
      portal-based Listbox for later; native covers 95% of editorial
      surfaces).
- [ ] **Checkbox** — Radix Checkbox wrapped to tokens.
- [ ] **Radio** — Radix RadioGroup.Item wrapped to tokens.
- [ ] **Switch** — Radix Switch wrapped to tokens.

### Molecules — atoms composed into self-contained units

Shipped:

- [x] **Hero** — status / title / lede / CTA editorial vertical rhythm.
- [x] **RoleCard** — icon + eyebrow + title + body + hired-by.
- [x] **Principle** — margin numeral + title + body.
- [x] **FailureMode** — numbered failure-mode block.
- [x] **Statement** — italic-serif editorial statement + supporting line.
- [x] **Portrait** — editorial photography (AVIF/WebP/JPEG + srcset).
- [x] **Section** — page-section wrapper with eyebrow + title + lede + slot.
- [x] **Pull** — inline editorial pull-quote accent.
- [x] **LinkCard** — interactive card tile (full-surface `<a>`).
- [x] **FeatureCard** — icon + eyebrow + title + body + footer (non-interactive).
- [x] **TeamCard** — portrait + name + role + bio + contact.
- [x] **FieldNote** — inline technical aside.
- [x] **Quote** — attributed customer testimonial.

Missing — editorial & content molecules:

- [ ] **Figure** — Portrait/Image + Caption pairing with semantic
      `<figure>`/`<figcaption>`. ← depends on: Portrait or Image, Caption.
- [ ] **Caption** — figure caption row (muted, micro tracking).
      ← depends on: Text.
- [ ] **Byline** — Avatar + name + role + optional Time. The repeated
      "by X · 6 min read" affordance. ← depends on: Avatar, Text, Time.
- [ ] **MetaList** — `<dl>` label/value rows for article meta, project
      specs, pricing details. ← depends on: Text.
- [ ] **StatList** — group of Stat atoms with shared rhythm and
      optional dividers. ← depends on: Stat, Divider.
- [ ] **TagList** — wrapped Tag collection with overflow control.
      ← depends on: Tag.
- [ ] **LinkList** — vertical list of styled Link rows (footer columns,
      sitemap, on-this-page TOC). ← depends on: Link, Heading (optional).
- [ ] **TableOfContents** — sticky anchor list with active-section
      highlight. ← depends on: LinkList.
- [ ] **CtaBlock** — heading + body + Button row; horizontal or stacked.
      ← depends on: Heading, Text, Button.
- [ ] **PriceTier** — name + price + bullet list + CTA. ← depends on:
      Heading, Stat, LinkList, Button.
- [ ] **TimelineItem** — date + title + body row. ← depends on: Time,
      Heading, Text.
- [ ] **FAQItem** — question heading + collapsible answer.
      ← depends on: Accordion, Heading, Prose.

Missing — navigation molecules:

- [ ] **NavLink** — top-nav anchor with `active` / `current` state.
      ← depends on: Link.
- [ ] **MenuItem** — dropdown/menu row with optional Icon + shortcut Kbd.
      ← depends on: Icon, Kbd.
- [ ] **Breadcrumbs** — Link chain with Icon separator. ← depends on:
      Link, Icon.
- [ ] **Pagination** — first / prev / page-numerals / next / last
      controls. ← depends on: Link, IconButton.
- [ ] **Stepper** — numbered step indicator for multi-step flows or
      process explainers. ← depends on: NumberFormat, Divider.

Missing — form molecules (gated behind the form atoms above):

- [ ] **Field** — Label + Input/Textarea/Select + helper text + error
      text + required indicator. ← depends on: Label, Input/Textarea/
      Select, Text.
- [ ] **Fieldset** — grouped Field set with `<legend>` and shared
      spacing. ← depends on: Field.
- [ ] **FormRow** — horizontal multi-Field row with responsive collapse.
      ← depends on: Field.
- [ ] **SearchField** — Input + leading Icon + trailing clear
      IconButton. ← depends on: Field, Icon, IconButton.
- [ ] **NewsletterField** — inline email + submit (the inline-form
      pattern most likely to land first). ← depends on: Field, Button.

Missing — feedback & overlay molecules (Radix wraps):

- [ ] **Tooltip** — Radix Tooltip wrapped to tokens. ← depends on: Icon
      (often).
- [ ] **Popover** — Radix Popover wrapped.
- [ ] **HoverCard** — Radix HoverCard wrapped (link preview cards).
- [ ] **DropdownMenu** — Radix DropdownMenu wrapped. ← depends on:
      MenuItem.
- [ ] **ContextMenu** — Radix ContextMenu wrapped. ← depends on:
      MenuItem.
- [ ] **Accordion** — Radix Accordion (single + multiple modes).
      ← depends on: Heading, Icon.
- [ ] **Disclosure** — single open/close row when Accordion grouping
      is overkill. ← depends on: Icon.
- [ ] **Alert** / **Callout** — inline banner (`info` / `success` /
      `warn` / `error` / `note`). Distinct from FieldNote: Alert carries
      a semantic role, FieldNote is editorial. ← depends on: Icon, Text.
- [ ] **Toast** — single Radix Toast item (Toaster organism hosts the
      region). ← depends on: Icon, IconButton.

Missing — media & utility molecules:

- [ ] **CopyButton** — copy-to-clipboard button with success state.
      ← depends on: Button, Icon.
- [ ] **CodeBlock** — fenced code block with optional language label +
      CopyButton; uses `--surface`. ← depends on: Code, CopyButton.
- [ ] **Carousel** — compound scroll-snap slide container with compound
      API (`Carousel.Root` / `Carousel.Slide` / `Carousel.Prev` /
      `Carousel.Next` / `Carousel.Indicators`). CSS scroll-snap first;
      consider `embla-carousel-react` only if native scroll-snap proves
      insufficient for edge cases. Prev/Next are `IconButton` instances;
      Indicators are `role="tab"` dots with `aria-label` per slide.
      `autoplay` prop (default `false`) uses `--dur-carousel-interval`
      (4s); must set `animation-play-state: paused` on reduced-motion,
      `:hover`, and `:focus-within`. Slide transitions use
      `scroll-behavior: smooth` behind `prefers-reduced-motion: no-preference`;
      reduced-motion collapses to `scroll-behavior: auto` (instant snap).
      ← depends on: IconButton, Icon, VisuallyHidden.
- [ ] **VideoEmbed** — responsive iframe wrapper with intrinsic
      aspect ratio. CLS-safe.
- [ ] **AudioPlayer** — html5 `<audio>` with caption + transcript link.
      ← depends on: Caption.
- [ ] **ShareLinks** — share-to-X / LinkedIn / copy-URL row. ← depends
      on: IconButton, CopyButton.

### Organisms — molecules + layout intent

Shipped:

- [x] **SiteShell** — top nav + main slot + hairline footer.
- [x] **Footer** — copyright + email + optional secondary link row.
- [x] **Dialog** (+ **DialogBasic**) — compound modal overlay.
- [x] **Tabs** — Radix Tabs wrapped to tokens.

Missing — site chrome:

- [ ] **Header** / **TopNav** — lift the nav row out of SiteShell into
      its own organism so it composes with non-marketing shells (docs,
      app surfaces). ← depends on: Wordmark, NavLink, Button.
- [ ] **AnnouncementBar** — page-top banner (dismissable, persistable).
      ← depends on: Alert, IconButton.
- [ ] **Sidebar** — vertical nav surface for DocsLayout / app surfaces.
      ← depends on: LinkList, Heading.

Missing — section organisms (Section + content molecule compositions):

- [ ] **HeroSection** — Section + Hero composition with optional
      illustration / portrait. ← depends on: Section, Hero, Portrait.
- [ ] **FeatureGrid** — grid of FeatureCard. ← depends on: Section,
      FeatureCard.
- [ ] **RoleGrid** — grid of RoleCard. ← depends on: Section, RoleCard.
- [ ] **PrincipleList** — vertical Principle stack. ← depends on:
      Section, Principle.
- [ ] **FailureModeList** — Failure-mode set. ← depends on: Section,
      FailureMode.
- [ ] **TeamGrid** — TeamCard grid. ← depends on: Section, TeamCard.
- [ ] **TestimonialBlock** — Quote + Byline (+ optional Portrait) in a
      framed section. ← depends on: Section, Quote, Byline.
- [ ] **ContactBlock** — EmailLink + secondary CTAs + StatusBadge line.
      ← depends on: Section, EmailLink, Button, StatusBadge.
- [ ] **CTASection** — full-width CtaBlock variant for end-of-page.
      ← depends on: Section, CtaBlock.
- [ ] **NewsletterSection** — NewsletterField + supporting copy.
      ← depends on: Section, NewsletterField.
- [ ] **StatsSection** — StatList rendered in a section frame.
      ← depends on: Section, StatList.
- [ ] **TimelineSection** — TimelineItem list. ← depends on: Section,
      TimelineItem.
- [ ] **StepsSection** — Stepper for marketing/process pages.
      ← depends on: Section, Stepper.
- [ ] **FAQSection** — Accordion of FAQItem in a section frame.
      ← depends on: Section, Accordion, FAQItem.
- [ ] **LogoCloud** — partner-/customer-logo grid or strip. ← depends
      on: Section, Logo.
- [ ] **GalleryGrid** — Portrait grid with click-to-enlarge.
      ← depends on: Section, Portrait, Dialog.

Missing — content layout organisms (long-form templates):

- [ ] **ArticleHeader** — eyebrow + title + lede + Byline + ShareLinks.
      ← depends on: Eyebrow, Heading, Text, Byline, ShareLinks.
- [ ] **ArticleLayout** — single-column long-form template aware of
      Prose, Pull, FieldNote, Figure widths. ← depends on: ArticleHeader,
      Prose.
- [ ] **DocsLayout** — Sidebar + content + TableOfContents three-column
      template. ← depends on: Sidebar, ArticleLayout, TableOfContents.
- [ ] **BlogList** — list of BlogPostCard previews with pagination.
      ← depends on: BlogPostCard, Pagination.
- [ ] **BlogPostCard** — index-card preview for a blog post. ← depends
      on: LinkCard, Byline, TagList.

Missing — comparison / data organisms:

- [ ] **PricingTable** — PriceTier grid + ComparisonRow body.
      ← depends on: Section, PriceTier.
- [ ] **ComparisonTable** — feature × tier matrix (the dense sibling
      of PricingTable). ← depends on: Section, MetaList.

Missing — overlay & app-shell organisms:

- [ ] **Toaster** — Radix Toast Provider + Viewport region. ← depends
      on: Toast.
- [ ] **Sheet** / **Drawer** — Radix Dialog side-anchored variant
      (right/left/top/bottom). ← depends on: Dialog.
- [ ] **CommandPalette** — `cmdk`-driven search + nav overlay (⌘K).
      Mark as "maybe" until a docs site or app surface needs it.
      ← depends on: Dialog, Input, MenuItem, Kbd.
- [ ] **DataTable** — sortable, paginated tabular data. Mark as "maybe"
      until an internal tool needs it; the editorial surface won't.
      ← depends on: Pagination, IconButton, Checkbox.

### Build-order heuristic

If unsure where to start, follow the dependency arrows — every layer
depends on the one above:

1. **Icon, Link, VisuallyHidden, Divider, Spinner, Skeleton.** Tiny,
   unlocks half the molecules. Day-one wins.
2. **Heading, Text, Prose, Code, Kbd, Mark, Time, NumberFormat.** The
   typographic atom set. Lifts the inline className soup out of
   molecules.
3. **IconButton, SkipLink, Image, Logo.** Round out the interactive +
   media atom layer.
4. **Form atoms** (Label, Input, Textarea, Select, Checkbox, Radio,
   Switch). Only build when the first form surface is queued.
5. **Editorial molecules** (Figure, Caption, Byline, MetaList, StatList,
   TagList, LinkList, CtaBlock, TableOfContents). These unblock every
   long-form layout organism.
6. **Radix-wrap molecules** (Tooltip, Popover, DropdownMenu, Accordion,
   Alert, Toast). Build when a real surface asks; resist speculative
   wraps.
7. **Form molecules** (Field, Fieldset, FormRow, SearchField,
   NewsletterField).
8. **Section organisms** (HeroSection, FeatureGrid, RoleGrid, …). Most
   ship one-per-page on the marketing site, in marketing-priority
   order.
9. **Layout organisms** (Header, Sidebar, ArticleLayout, DocsLayout).
   Only when the second consuming surface exists — premature
   abstraction otherwise.
10. **Overlay + data organisms** (Toaster, Sheet, CommandPalette,
    DataTable). Strictly demand-pulled.

### 🎞 Motion — philosophy + directives

Motion in this library is **semantic, not decorative.** Every transition,
keyframe, or stagger must justify its existence by communicating something
the static layout cannot: state change, hierarchy, continuity, or
attention. The brand register is _restrained operator-grade editorial_ —
animation that calls attention to itself contradicts the type, color, and
spacing decisions everywhere else. When in doubt, ship it static.

#### Doctrine — non-negotiable rules

1. **No motion without semantic meaning.** If an animation is removed and
   the user cannot tell what state the UI is in, the animation was load-
   bearing — keep it. If removing it changes nothing about
   comprehension, delete it. "Polish" is not a reason.
2. **Subtlety bias.** When a motion is justified, prefer the smallest
   distance, the shortest duration, and the lowest contrast that still
   communicates. Default to `--dur-fast` (180ms); escalate only with a
   written reason in the component spec.
3. **One easing language.** `--easing` (`cubic-bezier(0.16, 1, 0.3, 1)`,
   expo-out) is the brand entrance/exit curve. `--easing-link` is the
   single exception, reserved for the link-underline grow. Do not
   introduce new cubic-béziers without a brand-decision-log entry.
4. **Detail-oriented at micro-scale.** The places motion _does_ live —
   StatusBadge pulse (`--dur-pulse: 1800ms`, meditative), Button press
   (`--dur-press: 80ms`, tactile), Hero entrance stagger
   (`--dur-stagger-step: 150ms` × slot index), link underline grow,
   Dialog overlay+content — each duration is hand-tuned. Don't round to
   the nearest 100ms; the existing 80 / 150 / 180 / 240 / 600 / 700 /
   1800 spread is intentional.
5. **Reduced-motion is a first-class contract.** The global
   `@media (prefers-reduced-motion: reduce)` block in
   `src/tokens/tokens.css:301` collapses every animation/transition to
   0.01ms. Components that need a meaningful no-motion fallback (Hero
   sets `opacity: 1` instead of staying invisible) must implement it
   explicitly per-component and add a test that asserts the static
   final state.
6. **Animate arrival only when arrival is the content.** If a section
   entering the viewport _is_ the semantic event — the user has scrolled
   to something new — a gentle entrance is justified. The sanctioned
   form: `opacity 0→1` + `translateY(--translate-entrance)→0`, easing
   `--easing`, duration `--dur-slow`. No other entrance form (scale,
   blur, clip, rotate) is permitted. Reference implementation:
   `pouk.ai` hero section fade-in (2026-05-20, Arian). **Continuous
   ambient motion** (marquees, autoplay carousels) is also sanctioned
   when the looping content communicates something static layout cannot
   — e.g. that a catalogue is long. Both must pause on
   `prefers-reduced-motion: reduce` and on `:hover`/`:focus-within`.
7. **Animate state, not arbitrary arrival.** Hover, focus, press, open,
   close, selected, loading, success — yes. Viewport entrance — yes,
   per rule 6. "It just looked nice" — no. Sanctioned entrances:
   Hero page-load stagger + Section scroll-entrance. Both use the same
   `opacity + translateY + --easing` language for visual consistency.

#### Token contract (canonical, do not extend without a decision-log entry)

| Token                     | Value                           | Sanctioned use                                                                                                             |
| ------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `--easing`                | `cubic-bezier(0.16, 1, 0.3, 1)` | Default expo-out curve for entrances, exits, hover state changes.                                                          |
| `--easing-link`           | `cubic-bezier(0.2, 0, 0, 1)`    | Reserved for the link-underline two-layer grow. Do not reuse.                                                              |
| `--dur-press`             | `80ms`                          | Tactile click/press feedback (transform, `:active`). Faster than `--dur-fast` on purpose.                                  |
| `--dur-fast`              | `180ms`                         | Default for color, background, border, focus-ring transitions.                                                             |
| `--dur-mid`               | `240ms`                         | Link underline grow, Hero slot opacity/transform.                                                                          |
| `--dur-slow`              | `600ms`                         | Reserved for editorial entrances where `--dur-mid` reads as hurried (Hero non-title).                                      |
| `--dur-hero-title-rise`   | `700ms`                         | Hero title slot only — 100ms longer than siblings for emphasis.                                                            |
| `--dur-stagger-step`      | `150ms`                         | Multiply by slot index (0–3) for Hero entrance stagger.                                                                    |
| `--dur-pulse`             | `1800ms`                        | StatusBadge available-state pulse — slow + meditative.                                                                     |
| `--translate-entrance`    | `20px`                          | Vertical travel for scroll-triggered section entrances (`translateY`). Small enough to feel ambient, large enough to read. |
| `--dur-marquee`           | `30s`                           | Full-loop duration for Marquee/LazyRiver continuous scroll. Tuned to read as ambient drift, not urgency.                   |
| `--dur-carousel-interval` | `4s`                            | Autoplay interval between Carousel slides. Pause on hover/focus/reduced-motion.                                            |

**Property contract.** Animate only:

- `opacity`, `transform` (translate / scale) — compositor-cheap, no layout reflow.
- `background-size` — link underline grow exception (registered above).
- `color`, `background-color`, `border-color`, `box-shadow` — hover/focus
  state changes, durations capped at `--dur-fast`.

Never animate `width`, `height`, `top`, `left`, `padding`, `margin`,
`font-size`, or anything that triggers layout. If a component _requires_
a size animation, lift it to `transform: scale()` with `transform-origin`
or rebuild the interaction. No FLIP libraries.

#### Allowlist (sanctioned motion in the library)

- Link underline two-layer grow (`tokens.css:257`, `--dur-mid / --easing-link`).
- Button color/background/border transition at `--dur-fast`; transform press at `--dur-press`.
- EmailLink hover transitions (`EmailLink.module.css:21`), same contract as Button.
- StatusBadge available-state pulse at `--dur-pulse`, opacity-only.
- Hero entrance stagger (`Hero.module.css:94,105`), opacity + translate, per-slot duration.
- Dialog overlay fade (`Dialog.module.css:19,23`) + content rise/fall at `--dur-fast`.
- LinkCard hover lift — transform only, `--dur-fast`.
- Focus-ring appearance — instant; no transition on `:focus-visible` outline.
- **Section scroll-entrance** — `opacity 0→1` + `translateY(var(--translate-entrance))→0`,
  `--dur-slow / --easing`, triggered by IntersectionObserver at `threshold: 0.1`.
  Reduced-motion: static final state instantly. Reference: `pouk.ai` hero, approved 2026-05-20.
- **Marquee / LazyRiver continuous scroll** — `translateX` loop animation at `--dur-marquee`,
  `animation-timing-function: linear`. `animation-play-state: paused` on
  `prefers-reduced-motion: reduce` and `:hover`/`:focus-within`. Approved 2026-05-20.
- **Autoplay Carousel** — slide transition `--dur-mid / --easing`, interval `--dur-carousel-interval`.
  `animation-play-state: paused` on reduced-motion, hover, and focus. Approved 2026-05-20.
- **Auto-accordion** (cycling accordion) — open/close uses Radix Accordion CSS variables
  (`--radix-accordion-content-height`), duration `--dur-mid`, easing `--easing`.
  Auto-cycle interval optional; must pause on reduced-motion + hover + focus. Approved 2026-05-20.

Anything outside this list requires a decision-log entry in
`meta/brand.md` before merge.

#### Banlist (do not ship)

- [ ] Scroll-triggered reveals beyond the sanctioned `opacity + translateY`
      form — no clip, blur, scale, rotate, or complex SVG path entrances.
      No `data-aos`, no third-party scroll libraries.
- [ ] Parallax. Of any kind. Including background-position scroll.
- [ ] Loading spinners as decoration on otherwise-instant interactions.
- [ ] Skeleton shimmer that's prettier than the loaded state.
- [ ] Autoplay carousels or marquees that do **not** pause on
      `prefers-reduced-motion: reduce` and `:hover`/`:focus-within`.
      The pattern is approved; the accessibility contract is not optional.
- [ ] Animated gradients, animated noise, animated SVG backgrounds.
- [ ] Counter "count-up" animations on Stat (numbers are the content).
- [ ] Hover-pulse on idle CTAs to "get attention".
- [ ] Page transition animations (Astro view transitions are the
      consuming site's call, not the DS's).
- [ ] Confetti, particle effects, success bursts — anywhere.
- [ ] Cursor-following effects.

#### Reduced-motion contract

- The global `@media (prefers-reduced-motion: reduce)` block in
  `tokens.css:301` is the **only** sanctioned `!important` block in the
  codebase. Do not add component-level `!important` overrides.
- Every component that ships an animation must declare its reduced-
  motion final state (StatusBadge → `animation: none`; Hero →
  `opacity: 1` + `transform: none`; Dialog → instant in/out).
- Every component that ships an animation must add a Playwright CT test
  that asserts the reduced-motion final state matches the loaded state.

#### Backlog — motion debts and polish

- [ ] **Author `meta/brand.md` § Motion** (currently `_To be filled._` —
      see `brand.md` line near "Motion — default easing, default
      duration, principles"). Codify the doctrine above so it survives
      outside this backlog.
- [ ] **Document the `ease` literal in `tokens.css:279`.** Global `a`
      color transition uses raw `ease` instead of `--easing`. Either
      tokenize as `--easing-color` (with a written reason) or migrate
      to `--easing`.
- [ ] **Audit Dialog `overlayOut` / `contentOut` easings.** Both use
      raw `ease` (`Dialog.module.css:23,73`); align with `--easing` or
      promote to `--easing-exit` if a distinct exit curve is desired.
- [ ] **Tokenize `--dur-overlay`** for Dialog overlay specifically, or
      document that `--dur-fast` is the canonical overlay duration.
- [ ] **Add reduced-motion CT tests** for Hero, Dialog, StatusBadge —
      assert final visual state matches with `forcedColors`-style
      reduced-motion emulation.
- [ ] **Lint rule: forbid `transition: all`.** Always enumerate the
      animated properties so the property contract above is auditable.
- [ ] **Lint rule: forbid raw ms / cubic-bezier values in
      `src/{atoms,molecules,organisms}/**`\*\* — every duration and
      easing must reference a token.
- [ ] **Extend `scripts/check-llms-tokens-sync.mjs`** to assert that
      every `@keyframes` in `src/**` has a matching reduced-motion
      override in the same file.
- [ ] **Spec sheet template update.** Every `meta/design/*.md` for an
      interactive component must include a "Motion" section answering:
      what state change does this animation communicate; what's the
      duration + easing token; what's the reduced-motion fallback.
- [ ] **Decide Hero stagger ceiling.** Current stagger goes 0–3 slots;
      document the contract that the 4th+ slot does not extend the
      stagger (snaps in at slot-3 duration) so future Hero variants
      don't drift to 5+ slot reveals.
- [ ] **Decide LinkCard hover lift magnitude.** Currently inline; lift
      into `--lift-card` token (`translateY(-2px)`?) so RoleCard,
      FeatureCard, LinkCard share one number.

---

### Out of scope (re-affirmed)

Already declared "Won't" in `ROADMAP.md` and not relisted here:

- Re-export of `lucide-react` (Icon **wraps**, does not re-export).
- Router abstraction; SiteShell + NavLink emit plain `<a href>`.
- `<ThemeProvider>` API; tokens are the contract.
- Dark-mode token set (content decision; the palette already inverts
  cleanly — see `meta/brand.md` decision 2026-05-15).

---

## How to use this file

- Tick the box in the same PR that lands the work.
- New work that surfaces mid-flight: add it under 🟡 In flight or 🔵 Next,
  not 🔴 Blocking, unless it actually blocks a published artifact.
- "Done" stays for ~one release for context, then gets pruned.
- ROADMAP.md is for _what to ship later_; this file is for _what's in motion now_.
  Keep them distinct.
