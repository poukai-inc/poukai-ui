# Design spec: TeamCard

**Atomic layer**: molecule
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Purpose

`<TeamCard>` is the canonical person tile. It surfaces a single team member as a brand object: a named, photographed practitioner with a role description, optional supporting copy, and an optional contact affordance.

Its first consumer is the pouk.ai /about or /team page, which will display the principals of a senior-only consulting practice. In that context each tile must feel authoritative — a practitioner credential, not a social media profile card. The aesthetic register is operator-grade: restrained, considered, content-first.

**Contrast with `<RoleCard>`.** `<RoleCard>` describes a _function_ — a job opening, a discipline, an engagement type. TeamCard describes a _person_. RoleCard's identity is the role; TeamCard's identity is the human. They are not variants of each other; they are distinct semantic primitives.

**Contrast with a future `<Quote>` / Testimonial.** A Quote is a person _speaking_ — it renders attributed words and subordinates the speaker to their statement. TeamCard is a person _presenting themselves_ — the portrait, name, and role are primary; any copy exists to support identity, not to carry a claim. The two primitives are related (both involve a person) but compositionally and semantically different. Quote does not exist yet; when it does, it must not reuse TeamCard.

**No new tokens.** TeamCard is constructed entirely from the existing vocabulary.

---

## 2. Anatomy

TeamCard's root is `<article>` by default. The component has six named zones, three required and three optional.

- **Root element** (`<article>` default, polymorphic via `as`): semantic container for a self-contained person tile. `<article>` is the correct HTML element for an independently distributable content item. The forwarded ref targets this element.

- **Eyebrow slot** (optional): a contextual label above the portrait, e.g. "Founding team" or "Engineering". Two calling conventions match the `<Section>` / `<Pull>` pattern exactly:
  - String form: `eyebrow="Founding team"` — TeamCard internally wraps the string in `<Eyebrow variant="muted">`. Consumer writes natural case; Eyebrow applies `text-transform: uppercase`.
  - ReactNode form: `eyebrow={<Eyebrow variant="solid">Founding team</Eyebrow>}` — TeamCard renders the node as-is. This is the escape hatch for non-default Eyebrow configuration. TeamCard never double-wraps a ReactNode in a second `<Eyebrow>`.
  - Decision rule: `typeof eyebrow === 'string'` → wrap; else → render directly.
  - When present, the eyebrow sits above the portrait in stacked layout, and above the text block (not the portrait) in horizontal layout. See §5.

- **Portrait slot** (required): accepts a `<Portrait>` instance as a ReactNode. TeamCard does not construct the Portrait internally and does not accept a `portraitSrc` shortcut prop — Portrait's API is authoritative. The consumer creates and passes the Portrait instance with the correct `src`, `alt`, `aspect`, and `sizes` props. TeamCard constrains the portrait width within its layout but does not override Portrait's internal sizing logic.
  - Recommended Portrait size: `aspect="1:1"` with a container width that matches the layout (see §5). The Portrait atom fills its containing block, so TeamCard's CSS controls the rendered size.
  - Portrait always renders, even if the image fails to load — Portrait's own fallback (initials or glyph placeholder, per its spec) handles that gracefully. TeamCard has no portrait-absent state.

- **Name slot** (required): the person's name. Renders as `<h3>` by default. Overridable via `nameAs` prop (`"h2" | "h3" | "h4"`). The `h3` default is correct for a card inside a `<Section>` (which carries an `h2`); override to `h2` when TeamCard is the primary heading on a standalone person page, or to `h4` when nested deeper.
  - Typography: inherits the global `h3` rule from `tokens.css` (Instrument Serif, `--fs-card-title`, line-height 1.3).
  - No separate class is added for name typography — it relies on the semantic element inheriting `tokens.css` base styles.

- **Role slot** (required): a short descriptor, e.g. "Founder, Engineering" or "Partner, Strategy". Renders as a `<p>` in the meta register: `--fs-meta` (14px), `color: var(--fg-muted)`, `font-weight: 400`. Uses `--font-sans`. No uppercase treatment — role text is read at prose speed, not scanned as a label.
  - The Role slot is not an `<Eyebrow>`. It is a supporting descriptor rendered as plain text. No ARIA annotation is needed.

- **Bio slot** (optional): a short prose paragraph (1–3 sentences). Renders as a `<p>` at `--fs-body` with `color: var(--fg)` and the global body `line-height: 1.55`. When absent, no empty element is emitted.

- **Contact slot** (optional): accepts any ReactNode. The canonical usage is `<EmailLink email="…" variant="muted" />`, but the slot is intentionally untyped at the DS level so that LinkedIn links, GitHub handles, X links, or any future contact affordance work without spec changes. Contact affordance interactivity (hover, focus, states) is wholly owned by the inner component — TeamCard provides no interaction states of its own.

---

## 3. Tokens used

No new tokens. TeamCard is constructed entirely from the existing vocabulary.

| Token                | Value                                       | Role                                                    |
| -------------------- | ------------------------------------------- | ------------------------------------------------------- |
| `--space-2`          | `0.5rem` (8px)                              | Gap: name → role                                        |
| `--space-4`          | `1rem` (16px)                               | Gap: portrait → name (stacked); role → bio              |
| `--space-6`          | `1.5rem` (24px)                             | Gap: portrait ↔ text block (horizontal layout)          |
| `--space-8`          | `2rem` (32px)                               | Gap: bio → contact (when both present)                  |
| `--space-3`          | `0.75rem` (12px)                            | Gap: eyebrow → portrait (stacked layout)                |
| `--fg`               | `#1D1D1F`                                   | Name heading color (inherited from global h3 rule); bio |
| `--fg-muted`         | `#6E6E73`                                   | Role text color                                         |
| `--font-serif`       | Instrument Serif stack                      | Name heading font family (inherited from global h3)     |
| `--font-sans`        | Geist stack                                 | Role and bio font family (inherited from body)          |
| `--fs-card-title`    | `clamp(1.5rem, 1.15rem + 1.2vw, 2rem)`      | Name heading font size (inherited from global h3)       |
| `--fs-meta`          | `0.875rem` (14px)                           | Role text font size                                     |
| `--fs-body`          | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` | Bio font size (inherited from body)                     |
| `--tracking-eyebrow` | `0.06em`                                    | Eyebrow slot letter-spacing (owned by `<Eyebrow>`)      |
| `--lh-meta`          | `1.2`                                       | Eyebrow slot line-height (owned by `<Eyebrow>`)         |

**No border, no background surface.** TeamCard is padding-less and surface-less by default. The card has no background color, no border, and no border-radius — it is a content tile, not a chrome tile. The consumer's grid owns the column gutter; TeamCard owns only the internal vertical rhythm between its slots. This is the correct register for a senior-only consulting practice: identity tiles that sit on the page as content, not as cards punched through a UI chrome.

This is a considered decision, not an omission. If a specific surface requires a bordered or surfaced variant, that is a consumer-side className override, not a spec variant. The decision is logged here for permanence.

---

## 4. Layout & rhythm

### Stacked layout (default, `layout="stacked"`)

Portrait sits above the text block. The text block is a flex column.

| Slot gap                                 | Token       | Value |
| ---------------------------------------- | ----------- | ----- |
| Eyebrow → Portrait                       | `--space-3` | 12px  |
| Portrait → Name                          | `--space-4` | 16px  |
| Name → Role                              | `--space-2` | 8px   |
| Role → Bio (when bio present)            | `--space-4` | 16px  |
| Bio → Contact (when both present)        | `--space-8` | 32px  |
| Role → Contact (no bio, contact present) | `--space-8` | 32px  |

**Portrait width in stacked layout.** The portrait fills the card's full column width. Consumer's grid cell determines the rendered portrait size. Recommended: use Portrait with `aspect="1:1"` so the image is square; the card column width governs the size. A 3-column grid at `--content-max` (64rem) yields roughly 19–20rem per column, which maps to Portrait rendering at approximately 300–320px — a comfortable identity photo size at both mobile and desktop.

**Card width.** Content-driven. No explicit `max-width` is set on TeamCard itself. The consumer's grid or flex container determines the column width. TeamCard does not impose a min-width. If a stacked card appears in a very narrow slot (<160px), layout will degrade — this is a consumer grid concern, not a TeamCard concern.

**Min-height.** None. Content-driven height. Grid alignment (equal card heights in a row) is the consumer's responsibility — CSS `align-items: stretch` on the grid container or `height: 100%` on the card root handles this at the consumer level without TeamCard encoding an arbitrary minimum.

### Horizontal layout (`layout="horizontal"`)

Portrait sits to the left; the text block (eyebrow, name, role, bio, contact) sits to the right. The two columns are side by side with a `--space-6` (24px) gap.

Portrait width in horizontal layout: fixed at `5rem` (80px). This keeps the portrait as a thumbnail credential anchor rather than a dominant image — the text block is primary in horizontal mode. The consumer passes a Portrait sized for this context (e.g. `aspect="1:1"`, `width` prop calibrated to source resolution). The `5rem` constraint is applied by TeamCard's CSS on the portrait slot wrapper.

**Collapse to stacked below 768px.** At viewports narrower than 768px, horizontal layout collapses to stacked. This uses `768px` as a literal breakpoint (the `--bp-md` token is pending; see §11, open question 1). The collapse removes the portrait-left / text-right layout and falls back to the stacked portrait-above / text-below layout.

**Text block alignment.** In horizontal layout, the text block is vertically start-aligned against the portrait (not center-aligned). Centering name + role + bio against a portrait would look fine with minimal content but would create an awkward float with long bios. Start-alignment is always correct.

---

## 5. Variants

One variant is specified: `layout`, with two values — `"stacked"` (default) and `"horizontal"`.

**`layout="stacked"` (default).** Portrait on top, text below. The standard person-tile format for grid contexts: /team page, about page side-by-side founding team display, or any grid of person tiles. This is the correct default because most TeamCard usage will be inside a multi-column grid where column width is already constrained.

**`layout="horizontal"` ships in v1.** The horizontal layout earns its place: the /about page founder treatment will likely use it — a medium-size portrait left of a name + bio + email block is the Apple/editorial model for a solo or named-founder treatment. The layout is simple to implement (flexbox row with a fixed portrait width), and deferring it would require a spec revision and re-implementation later. Ship it.

**No "compact" variant.** A compact variant (smaller portrait, no bio) is YAGNI. A consumer wanting minimal output (portrait + name + role only) achieves it by simply not passing `bio` or `contact` — the slots are optional. Compact is not a layout change; it is a slot-omission. The spec does not need to name it.

---

## 6. States

None. TeamCard is a structural molecule, not an interactive one. It has no hover, focus, active, or disabled treatment. The contact slot's interactivity is wholly owned by its inner component (e.g. `<EmailLink>` handles its own hover, focus ring, and active color shift). TeamCard's root element is `<article>` — not a button, not a link, not a role=button.

If a consumer needs an entire card to be clickable (e.g. linking to a person's profile page), they wrap TeamCard in a `<Link>` or `<a>` at the consumer layer and accept responsibility for the interaction pattern. TeamCard does not provide a `href` prop and does not become a link element.

---

## 7. Accessibility

**`<article>` root semantics.** `<article>` is the correct landmark for a self-contained, independently distributable content item. A person tile — portrait + name + role — is exactly this. The article's accessible name is the name heading (the `<h3>` or overridden element). The engineer must wire `aria-labelledby` on the article root to the name heading's `id` (following the same pattern specified in the Section spec §9). Screen readers announce the tile as "[Name] — article", which is correct and useful for users navigating by landmark.

When the consumer overrides `as="div"` (e.g. inside a list where the parent `<ul>` owns the landmark role), the `aria-labelledby` wiring is omitted — a `<div>` carries no landmark role.

**Name heading and document outline.** The `nameAs="h3"` default is correct for the most common context: a TeamCard inside a `<Section>` (which owns an `<h2>`), on a page with a `<Hero>` (which owns the `<h1>`). The `nameAs` prop makes the heading level explicit — consumers must choose the right level for their document outline. The DS cannot enforce heading order at runtime; `nameAs` is the mechanism for making intention visible.

**Role text.** The role `<p>` is plain text. No `aria-label` annotation is needed — the text is already announced correctly. The muted color (`--fg-muted` at `--fs-meta`) passes AA contrast (4.91:1 on `--bg`) but is 14px sans-serif. WCAG 1.4.3 requires 4.5:1 for normal text under 18px or 14px bold; 4.91:1 satisfies this threshold.

**Portrait a11y.** Portrait's a11y contract is owned by Portrait: the consumer must pass a non-empty `alt` text when constructing the Portrait instance. TeamCard does not add or override alt text on the portrait. Portrait's spec documents that it throws in development on empty alt — this contract is sufficient.

**Contact slot a11y.** The contact slot renders whatever the consumer passes. `<EmailLink>` carries its own a11y contract (link text, focus ring, keyboard activation). Other ReactNode contacts are the consumer's responsibility.

**Contrast verification.**

- Name heading: `--fg` (#1D1D1F) on `--bg` (#FBFBFD) = 16.29:1 (AAA).
- Role text: `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) = 4.91:1 (AA normal). Passes at 14px.
- Bio text: `--fg` (#1D1D1F) on `--bg` = 16.29:1 (AAA).
- All ratios inherited from `meta/brand.md` canonical palette table.

**Keyboard interaction.** TeamCard has no keyboard interaction of its own. Interactive children (contact slot) handle their own keyboard affordances.

---

## 8. Motion

None. TeamCard is a structural, static molecule. It does not own an entrance animation or a state-transition animation. If a consumer wants a staggered entrance for a grid of TeamCards (e.g. on the /team page), that animation is applied at the grid/page level, not inside TeamCard. The `@media (prefers-reduced-motion: reduce)` block in `tokens.css` handles suppression globally for any animations inside children.

---

## 9. Prop intent

Final proposed signature:

```tsx
// INTENT ONLY — engineer designs the actual API
interface TeamCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  as?: "article" | "section" | "div";
  portrait: React.ReactNode;
  name: React.ReactNode;
  nameAs?: "h2" | "h3" | "h4";
  role: React.ReactNode;
  bio?: React.ReactNode;
  contact?: React.ReactNode;
  eyebrow?: string | React.ReactNode;
  layout?: "stacked" | "horizontal";
}
```

**Why `Omit<…, "title">`.** The native `title` attribute on `HTMLElement` is a tooltip string. `name` is TeamCard's primary content prop; `title` is a collision. `Omit<…, "title">` prevents the native tooltip prop from appearing as if it were a content slot.

**Why `portrait: React.ReactNode` (not `portraitSrc: string`).** Portrait's API owns portrait construction — `src`, `alt`, `aspect`, `width`, `sizes`, `objectPosition`. If TeamCard accepted `portraitSrc`, it would silently duplicate Portrait's API surface and bake in assumptions (which aspect ratio? what alt text? what sizes hint?) that should be explicit at the call site. The ReactNode slot is the correct boundary: the consumer builds the Portrait instance with full authorship; TeamCard places it.

**Prop-by-prop intent:**

- `as` — root element override for landmark and semantic correctness. Default `"article"`. Use `"section"` when the parent context expects section landmarks (rare); use `"div"` inside a `<ul>`/`<li>` list structure where the `<li>` itself carries item semantics.
- `portrait` — required. A `<Portrait>` instance. TeamCard does not render a placeholder if this is omitted at runtime (Portrait handles its own fallback internally). The TypeScript type is `React.ReactNode` rather than `React.ReactElement<PortraitProps>` to avoid coupling the molecule to the atom's type signature — follow the same approach used in other DS slot props.
- `name` — required. The person's name. Rendered as the element specified by `nameAs`. Accepts `React.ReactNode` so consumers can pass a styled fragment if needed (rare), but the standard usage is a plain string.
- `nameAs` — the heading level for the name. Default `"h3"`. Document outline correctness is the consumer's responsibility; this prop is the system's mechanism for making the choice explicit.
- `role` — required. Short role/title descriptor string. Accepts `ReactNode` for parity with other slot props, but standard usage is a plain string.
- `bio` — optional. Short supporting prose. When absent, no element is emitted. When present, rendered as a `<p>` at body scale.
- `contact` — optional. Any contact affordance. Standard usage: `<EmailLink email="…" variant="muted" />`. Accepts any ReactNode.
- `eyebrow` — optional. String or ReactNode. When string: TeamCard wraps in `<Eyebrow variant="muted">`. When ReactNode: rendered as-is.
- `layout` — `"stacked"` (default) or `"horizontal"`. Controls the portrait-text spatial relationship. See §5.
- `className` — for layout overrides at the consumer layer. TeamCard has no margin of its own; the parent grid positions it.
- Standard HTML attributes (`id`, `data-*`, `aria-*`, event handlers) are spreadable onto the root element. The engineer uses `HTMLElement` (not `HTMLArticleElement`) as the base type because the root is polymorphic.

**What was cut and why:**

- `portraitSrc`, `portraitAlt`, `portraitAspect` — cut. Portrait's API is authoritative. See rationale above.
- `compact` variant prop — cut. Slot omission achieves the effect without a named variant. See §5.
- `href` / `onClick` — cut. TeamCard is not interactive. Consumer wraps in a link if needed.
- `border`, `surface`, `padding` props — cut. TeamCard is padding-less and surface-less. Consumer uses `className` for override. See §3 rationale.

---

## 10. Composition rules

- **TeamCard in a grid.** The canonical usage is three TeamCards in a 3-column CSS grid inside a `<Section>`. The Section owns the heading, padding, and spacing above the grid. The grid cell owns the column width. TeamCard fills the cell. Example structure: `<Section title="The team"><div class="team-grid"><TeamCard … /><TeamCard … /><TeamCard … /></div></Section>`.

- **Portrait slot.** Always pass a `<Portrait>` instance. Do not pass a raw `<img>`. The Portrait atom's CLS-prevention, AVIF/WebP delivery, and alt-text contract are the reason it exists; bypassing it defeats the system.

- **EmailLink in the contact slot.** The standard composition is `<EmailLink email="…" variant="muted" />`. The `muted` variant is correct for the contact-slot register — it reads as metadata rather than a primary CTA. Use `variant="default"` only if the card's primary purpose is to drive contact (very rare for a person tile in a grid).

- **Eyebrow slot convention.** Follows Section and Pull: string → auto-wrap; ReactNode → pass-through. The eyebrow in TeamCard is typically a group label ("Founding team", "Partners") rather than an individual label — when grouping multiple TeamCards under a shared label, prefer placing the `<Eyebrow>` in the Section header rather than repeating it on every card. The per-card eyebrow slot is for cases where cards in the same grid belong to different groups.

- **TeamCard does not compose with `<RoleCard>`.** They are sibling atoms at the molecule layer, each with distinct semantics. Do not nest one inside the other.

- **TeamCard does not compose with `<Hero>`.** Hero is the page's `<h1>` moment; a TeamCard inside a Hero would produce a heading-level conflict. TeamCard belongs in post-Hero sections.

- **Horizontal layout and the `<figure>` pattern.** TeamCard does not emit `<figure>` or `<figcaption>`. If a consumer wants a caption below the portrait (rare; typically not appropriate for a person tile), they construct the Portrait + caption inside a `<figure>` and pass that figure node as the `portrait` slot. TeamCard renders it as-is.

---

## 11. Out of scope

- **`portraitSrc` shortcut prop.** Explicitly excluded. Portrait's API is authoritative. This must not be added as a convenience — it would silently break the Portrait contract.
- **Interactive card (clickable tile).** TeamCard is not a link. Linking behavior is consumer responsibility.
- **Dark-mode variant overrides.** `--fg`, `--fg-muted`, and all inherited tokens flip cleanly via the global dark-mode token override block in `tokens.css`. No per-component dark-mode CSS needed.
- **"compact" variant.** Achieved by not passing `bio` / `contact`. Not a named variant.
- **Avatar / initials fallback slot.** Portrait handles its own fallback. TeamCard does not add a parallel avatar system.
- **Social icon links grid.** Multiple contact links (e.g. email + LinkedIn + GitHub row) are a consumer composition in the `contact` slot, not a built-in DS feature.
- **Hover lift or surface on the card root.** Not in the register. TeamCard is a content tile, not a chrome tile.
- **`align` variants (left / center).** Content is always left-aligned. Center-aligned person tiles are a marketing-page pattern not in the brand register.

---

## 12. Story matrix

| Story file                         | Story name           | Description                                                                                                                                                                                                |
| ---------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TeamCard.stories.tsx`             | `Default`            | Full composition: Portrait (1:1, with alt) + name + role + bio (2 sentences) + `<EmailLink variant="muted">` contact. Stacked layout. Verifies all slots render, gap stack correct, role muted color.      |
| `TeamCard.stories.tsx`             | `Minimal`            | Portrait + name + role only — no bio, no contact, no eyebrow. Verifies optional slots omit cleanly with no empty elements or gap artifacts.                                                                |
| `TeamCard.stories.tsx`             | `HorizontalLayout`   | `layout="horizontal"`, full composition. Verifies portrait sits left at 5rem width, text block right-aligned, `--space-6` gap between columns.                                                             |
| `TeamCard.stories.tsx`             | `WithEyebrow`        | `eyebrow="Founding team"` (string form) + full composition. Verifies string→Eyebrow wrapping, `--space-3` gap eyebrow→portrait, eyebrow muted variant.                                                     |
| `TeamCard.stories.tsx`             | `PolymorphicSection` | `as="section"` — verifies root element is `<section>`, that `aria-labelledby` is wired to the name heading `id`, and styling is identical to `as="article"`.                                               |
| `TeamCard.AllVariants.stories.tsx` | `ThreeColumnGrid`    | Three `<TeamCard>` instances in a CSS 3-column grid at `--content-max`. The primary smoke test for the component's raison d'être. Verifies equal-height behavior, portrait alignment, rhythm across cards. |
| `TeamCard.AllVariants.stories.tsx` | `HorizontalCollapse` | `layout="horizontal"` at a constrained viewport width (< 768px). Verifies collapse to stacked layout. Engineer implements this as a Storybook viewport story.                                              |
| `TeamCard.AllVariants.stories.tsx` | `EyebrowReactNode`   | `eyebrow={<Eyebrow variant="solid">Partners</Eyebrow>}` (ReactNode form). Verifies pass-through (no double-wrapping), solid variant renders at full contrast.                                              |
| `TeamCard.AllVariants.stories.tsx` | `ContactVariants`    | Two cards side by side: one with `<EmailLink>`, one with a plain `<a>` LinkedIn link — verifies contact slot accepts arbitrary ReactNode without style interference from TeamCard.                         |
| `TeamCard.AllVariants.stories.tsx` | `NameHeadingLevels`  | Three instances: `nameAs="h2"`, `nameAs="h3"` (default), `nameAs="h4"` — verifies each renders the correct element; confirms typography scale is consistent across levels.                                 |

---

## 13. Open questions for the engineer

1. **`--bp-md` literal.** The horizontal layout collapse uses `768px` as a literal breakpoint value (consistent with Section, Eyebrow, and Principle). When the `--bp-md: 768px` token ships (pending as noted in the Eyebrow and Section specs), TeamCard is a migration target. No action required now; the literal `768px` is the correct interim value.

2. **`aria-labelledby` wiring on the article root.** The spec requires wiring `aria-labelledby` on the root element (when `as !== "div"`) to the name heading's generated `id`. Follow the same implementation pattern as `<Section>` — derive the heading id from the consumer-supplied `id` prop (e.g. `${id}-name`), falling back to `useId()` (React 18+) or a module-level counter. Confirm which React version the DS targets before choosing the `useId` path.

3. **Portrait container sizing in stacked layout.** TeamCard's stacked layout should not set an explicit `width` or `height` on the portrait slot wrapper — it should be `width: 100%` so Portrait fills the card column. Verify that Portrait's `display: block` root and `width: 100%` behavior interact correctly with TeamCard's flex column layout. A known risk: if Portrait renders with an inline-level display in a flex context, it may not fill the column as expected.

4. **Portrait container sizing in horizontal layout.** The portrait slot wrapper in horizontal layout should be `flex-shrink: 0; width: 5rem` to prevent the portrait from compressing when bio text is long. Confirm this produces the correct behavior when Portrait's aspect ratio is 1:1 (portrait will render as a 5rem × 5rem square).

5. **`h3` global margin.** The global `h3` rule in `tokens.css` may apply a bottom margin. Inside TeamCard's flex-column layout, this margin will double-stack with the gap value (same issue as Section spec open question 6 for `h2`). The engineer must zero the margin on the name heading within TeamCard's scope and let the flex `gap` control spacing — consistent with the pattern in Principle (`.title { margin: 0 }`).

6. **`Omit<React.HTMLAttributes<HTMLElement>, "title">` spread.** Confirm this pattern does not conflict with existing DS component conventions. The `title` omission is non-standard; add a JSDoc note explaining why `title` is omitted (collision with the name prop intent, not an intentional feature removal).

7. **ReactNode name slot and the accessible name.** `name` is `React.ReactNode`. When a consumer passes a styled fragment (e.g. `name={<span>Arian <em>Zargaran</em></span>}`), the accessible name computed from `aria-labelledby` will include the inner text nodes. Verify that the accessible name is correct in this case and does not include HTML markup — this is standard browser behavior (accessible name computation strips markup) but worth a smoke test with axe-core in the story suite.
