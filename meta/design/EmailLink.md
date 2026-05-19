# Design spec: EmailLink

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Purpose

`<EmailLink>` is the system's canonical `mailto:` affordance — a text link that signals "contact us" without the weight of a commitment. It is deliberately not a button. `<Button>` signals intent-to-act: a user pressing a button is committing to an outcome. `<EmailLink>` signals availability: it opens a mail client, puts a pre-filled address in the To field, and lets the user decide whether to send. The cognitive cost is lower; the visual weight must match.

Today the `mailto:` pattern recurs on at least three surfaces — the `<SiteShell>` footer (`hello@pouk.ai`, raw `<a>` with `.muted-link`), a JSDoc usage example in `SiteShell.tsx` (bare `<a href="mailto:hello@pouk.ai">`), and the holding-page CTA (pending). Each site independently reaches for a slightly different treatment. `<EmailLink>` lifts that decision into one atom so every contact surface draws from the same source of truth: same underline thickness, same hover shift, same focus ring, same icon gap, same opt-in role qualifier pattern.

This is a text link with brand treatment. It does not replicate `<Button>` styling. The distinction is not cosmetic — a consumer choosing `<EmailLink>` vs. `<Button asChild><a href="mailto:…">…</a></Button>` is making a register decision, and the DS must make both registers available with clear names.

---

## 2. Anatomy

- **Root element**: `<a>` — non-negotiable. The `mailto:` protocol is anchored to anchor semantics. No polymorphic `as` prop. The atom owns the HTML element because it owns the protocol. `href` is always computed as `mailto:${email}` — the atom owns the protocol prefix; consumers never pass a raw `href`.
- **Icon slot** (optional, leading): a `ReactNode` accepting any icon from `lucide-react` (e.g. `<Mail size={14} aria-hidden />` from lucide). When present, the root shifts to `inline-flex` to maintain icon–text optical alignment. When absent, the root is a plain inline anchor. The DS does not own or re-export the icon; the consumer passes it.
- **Label**: visible link text. Defaults to the `email` string if no explicit `label` is provided. When `label` is provided and differs from `email`, the visible text is `label` — the email value is still the `href` target (e.g. "Contact Arian" links to `mailto:arian@pouk.ai`).
- **Role qualifier slot** (optional, trailing): a parenthetical string appended after the label in a muted register, for patterns like `founder@pouk.ai (Arian)`. Rendered as a `<span>` inside the anchor, visually separated by `--space-2`. Uses `--fg-muted` at the same font size as the label, reducing visual weight without breaking the link's hit area or inline flow.

---

## 3. Tokens used

### Existing tokens (no change)

| Token           | Value                                       | Role                                                                        |
| --------------- | ------------------------------------------- | --------------------------------------------------------------------------- |
| `--fg`          | `#1D1D1F`                                   | Default link color                                                          |
| `--fg-muted`    | `#6E6E73`                                   | Role qualifier text color; also the color of `.muted-link` variant          |
| `--accent`      | `#0071E3`                                   | Hover color shift; focus ring                                               |
| `--font-sans`   | Geist stack                                 | Font family (link inherits body font; no override needed in most contexts)  |
| `--fs-body`     | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` | Default font size (inherited from body; `EmailLink` does not override it)   |
| `--space-2`     | `0.5rem` (8px)                              | Gap between icon slot and label; gap between label and role qualifier       |
| `--dur-fast`    | `180ms`                                     | Color transition duration on hover                                          |
| `--easing-link` | `cubic-bezier(0.2, 0, 0, 1)`                | Easing for color transition                                                 |
| `--accent-glow` | `rgba(0, 113, 227, 0.18)`                   | Focus ring glow (inherited via `::selection`; not applied directly to link) |
| `--radius-1`    | `2px`                                       | Focus ring border-radius                                                    |

### New tokens

None. `EmailLink` is constructed entirely from the existing token vocabulary. No new token is justified — this atom is thin by design.

**Token absence note — underline.** The underline thickness (`1px`) and offset (`2px`) are literal values authored inline in `EmailLink.module.css`, not tokenized. The design system does not yet have a `--text-underline-thickness` or `--text-underline-offset` token; the Eyebrow spec's BACKLOG note on tokenizing line-height and letter-spacing did not extend to underline properties. Introducing two new tokens for a single link atom is not warranted at this stage. The values are defensible constants: `1px` matches the existing `--hairline-w` intent (though the hairline token is for border rules, not text decoration); `2px` is the standard browser offset plus one pixel of optical breathing room. If a future type-foundations pass introduces underline tokens, `EmailLink.module.css` is the primary migration target.

---

## 4. Layout & rhythm

| Property                    | Value                                                                      | Notes                                                                                               |
| --------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `display`                   | `inline` (no icon) / `inline-flex` (icon present)                          | Inline-flex only when icon slot is populated                                                        |
| `align-items`               | `center` (when `inline-flex`)                                              | Optical center alignment; not `baseline` — icon and text read best center-aligned at the sizes used |
| `gap`                       | `var(--space-2)` (8px)                                                     | Between icon and label; between label and role qualifier                                            |
| `font-family`               | inherited                                                                  | No override; inherits `--font-sans` from body                                                       |
| `font-size`                 | inherited                                                                  | No override; adopts whatever the parent context provides                                            |
| `font-weight`               | inherited                                                                  | No override; no bold treatment                                                                      |
| `color`                     | `var(--fg)` (default) / `var(--fg-muted)` (`.muted-link` variant — see §5) |                                                                                                     |
| `text-decoration`           | `underline` — always on                                                    | See rationale below                                                                                 |
| `text-decoration-color`     | `currentColor` at 60% opacity                                              | Softens the default underline without hiding it                                                     |
| `text-decoration-thickness` | `1px`                                                                      | Matches the system's hairline weight                                                                |
| `text-underline-offset`     | `2px`                                                                      | One pixel above the baseline descenders; legible and uncluttered                                    |
| `transition`                | `color var(--dur-fast) var(--easing-link)`                                 | Color shifts on hover; underline color follows `currentColor`                                       |

**Underline-always vs. the global `a` reset.** The global `a` selector in `tokens.css` resets `text-decoration: none` and replaces it with an animated `background-image` underline that grows from 0% to 100% width on hover. `<EmailLink>` deliberately diverges from this pattern. Rationale:

1. The animated grow-underline is a navigational link idiom — it signals "go somewhere in the site." A `mailto:` affordance is not navigational; it opens a client, it does not route. A persistent underline is the correct affordance signal for an external action.
2. The background-image technique requires `padding-bottom: 2px` on the parent element, which disturbs inline flow when the link is embedded in a sentence. `text-decoration` is inline-safe.
3. The footer surface where `<EmailLink>` most commonly sits uses `.muted-link`, which itself overrides the grow-underline back to a simple color transition. `<EmailLink>` inherits the spirit of `.muted-link` in its default-on underline treatment but anchors the underline as a permanent visual rather than a hover state.

`<EmailLink>` overrides the global `a` styles with its own `text-decoration` rules. This is an intentional, documented divergence — not a bug. The engineer must scope the overrides tightly to the `EmailLink.module.css` component class to avoid leaking into descendant `<a>` elements.

**Role qualifier rendering.** The qualifier `<span>` carries `color: var(--fg-muted)` and inherits the anchor's `font-size`. It is rendered inside the `<a>`, so clicking the qualifier text still activates the mailto link. The qualifier should be preceded by a non-breaking space + opening paren and a closing paren: ` (Arian)`. The DS does not enforce this formatting — the consumer passes the qualifier string without parentheses (e.g. `qualifier="Arian"`) and the component wraps it. This way the formatting is consistent and screen readers hear "Arian" after a pause, not the raw paren characters as part of the label.

---

## 5. Variants

| Variant   | Color                                 | When to use                                                                                                                                                                                                            |
| --------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default` | `var(--fg)` hover → `var(--accent)`   | The standard contact affordance. Use on `--bg` or `--surface` contexts where full-contrast links are appropriate — e.g. the holding-page CTA, an inline contact reference in body copy.                                |
| `muted`   | `var(--fg-muted)` hover → `var(--fg)` | For footer, caption, or secondary-copy contexts where the email address should read as metadata rather than a primary call-to-action. Matches the existing `.muted-link` treatment in `SiteShell.stories.tsx` exactly. |

Two variants. No `accent` variant (an accent-colored link would be redundant — the hover state on `default` already delivers accent on hover). No further expansion is anticipated; file a proposal if a third register surfaces.

**Variant → migration note.** The `hello@pouk.ai` link in `SiteShell.stories.tsx` currently uses `className="muted-link"` on a raw `<a>`. When `SiteShell` migrates to `<EmailLink>`, it should pass `variant="muted"` and remove the `muted-link` className. The visual output is identical; the mechanism is now the DS atom rather than a global utility class.

---

## 6. States

| State                       | Visual                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `:link` (unvisited default) | `color: var(--fg)` (default variant) or `var(--fg-muted)` (muted variant). Underline at `text-decoration-color: currentColor` 60% opacity.                                                                                                                                                                                                                                |
| `:visited`                  | No distinct treatment. Rationale: the brand contract does not track read state for editorial links. Visited state creates false scent on contact links — a user may have visited the link on this device but not yet sent a message, or the same `mailto:` is shared across surfaces. A purple `:visited` state would confuse the signal. Treated identically to `:link`. |
| `:hover`                    | Default: color shifts to `var(--accent)`. Muted: color shifts to `var(--fg)`. In both cases `text-decoration-color` follows `currentColor`, so the underline color shifts with the text color. No transform, no scale, no underline thickness change.                                                                                                                     |
| `:focus-visible`            | 2px solid `var(--accent)` outline, 2px offset, `border-radius: var(--radius-1)` (2px). Identical to the global `a:focus-visible` rule in `tokens.css`. The component module must not override this — it is already correct in the base stylesheet.                                                                                                                        |
| `:active`                   | `color: var(--accent)` (same as hover — no additional treatment). `<EmailLink>` does not use `transform: translateY(1px)` — that press-feedback idiom belongs to `<Button>` where the affordance is "press a physical control." A link being clicked does not need press feedback.                                                                                        |

**Visited state decision recorded.** Treating `:visited` identically to `:link` is a brand-level call, not a default fallback. It is noted here so future maintainers do not accidentally add a `:visited` color without understanding the rationale.

---

## 7. Accessibility

**Semantic element and announcement.** `<EmailLink>` renders as `<a href="mailto:…">`. Screen readers announce this as a link and, depending on the client, may announce "mailto link" or open the OS mail dialog. The link text (the visible label or the email string) is the accessible name. This is correct and sufficient for the default usage.

**When `label` differs from `email`.** If a consumer passes `label="Contact Arian"` and `email="founder@pouk.ai"`, the accessible name is "Contact Arian" — the visible text. The email address is not read aloud. This is intentional and correct: the human-readable label is the accessible name; the href is the action. Do not add `aria-label` redundantly when `label` is already clear. If the label is not descriptive enough (e.g. `label="here"`), that is a content problem, not an ARIA problem.

**When `label` equals `email` (the default).** The accessible name is the email address string (e.g. "founder at pouk dot ai" or similar, depending on client). This is standard and expected for email address links. No ARIA augmentation needed.

**Icon slot — decorative marking.** The icon slot accepts a `ReactNode`. When the icon is purely decorative (e.g. a `Mail` icon that adds visual context but duplicates the link's purpose), the consumer must pass `aria-hidden="true"` on the icon element to suppress it from the accessibility tree. This is documented in the component's JSDoc. Example:

```tsx
<EmailLink email="hello@pouk.ai" icon={<Mail size={14} aria-hidden="true" />} />
```

If the icon carries meaningful information not conveyed by the label (rare for this atom), the consumer should provide `aria-label` on the icon or use an alternative approach — not a pattern this atom needs to prescribe.

**Role qualifier.** The qualifier `<span>` (e.g. `(Arian)`) sits inside the `<a>` and is part of the accessible name. A screen reader will announce the full string: "founder at pouk dot ai (Arian)". This is acceptable — the qualifier adds contextual information. If a consumer does not want the qualifier in the accessible name, they should not use the qualifier slot and instead place the contextual label in a sibling element outside the anchor.

**Contrast verification.**

- `default` variant: `--fg` (#1D1D1F) on `--bg` (#FBFBFD) = 16.29 : 1 (AAA). On `:hover`: `--accent` (#0071E3) on `--bg` = 4.54 : 1 (AA normal — at threshold; safe for body text).
- `muted` variant: `--fg-muted` (#6E6E73) on `--bg` = 4.91 : 1 (AA normal). On `:hover`: `--fg` (#1D1D1F) on `--bg` = 16.29 : 1 (AAA).
- Focus ring: `--accent` (#0071E3) outline — WCAG 1.4.11 non-text contrast satisfied on every surface. Focus ring contrast vs. `--bg` ≈ 4.54 : 1.
- All ratios verified against WCAG 2.1 sRGB linearization; inherited from `meta/brand.md` canonical palette table.

**Keyboard interaction.** Native `<a>` behavior: `Tab` focuses, `Enter` activates. No custom key handlers. The atom does not need to manage focus beyond what the browser provides.

---

## 8. Motion

Color transition on hover only: `color var(--dur-fast) var(--easing-link)` (180ms, link easing). The `text-decoration-color` follows `currentColor` implicitly — no separate transition declaration needed. No transform, no entrance animation, no scale.

This is a deliberate understatement relative to `<Button>`. Links are ambient affordances; they do not need the press-feedback of `translateY(1px)` or the 120ms color burst of a button hover. 180ms is long enough to feel intentional, short enough to feel snappy.

**Reduced-motion fallback.** Handled globally by the `@media (prefers-reduced-motion: reduce)` block in `tokens.css`, which clamps all `transition-duration` to `0.01ms`. No per-component fallback needed.

---

## 9. Prop intent

- Consumers must be able to pass the email address as a required string (`email`). The component computes `href="mailto:${email}"` — consumers never construct the href themselves. This ownership is intentional: it prevents `href="email@domain.com"` (missing protocol) bugs and ensures the atom is always a mailto link, never a navigation link.
- Consumers must be able to pass an optional display label (`label`). When omitted, the visible text defaults to the `email` string. When provided, `label` replaces `email` as the visible text — the component renders the label string, not the email, as the link text.
- Consumers must be able to pass an optional leading icon (`icon: ReactNode`). When passed, the root element shifts to `inline-flex`; when absent, it is a plain inline element. The DS does not enforce which icon is passed — any `lucide-react` icon is valid. Icon sizing is consumer responsibility; guidance: 14px for `--fs-meta` contexts, 16px for `--fs-body` contexts.
- Consumers must be able to pass an optional role qualifier string (`qualifier`). The component wraps it as ` (qualifier)` in a muted `<span>` inside the anchor. The consumer passes the bare name/role without parentheses.
- Consumers must be able to choose the color register: `variant="default"` (full-contrast, `--fg` → `--accent`) or `variant="muted"` (`--fg-muted` → `--fg`). Default is `"default"`.
- Consumers must be able to pass `className` for layout overrides. The DS does not own margin — `EmailLink` has no margin on the root; the parent context positions it.
- Standard anchor props (`id`, `data-*`, event handlers, `target`, `rel`) should be spreadable onto the root `<a>`. The engineer designs the spread pattern. Note: `href` must not be in the spread — it is always computed from `email`.

The engineer translates these intents into TypeScript prop types. A likely signature (intent-level, not prescriptive):

```tsx
// INTENT ONLY — engineer designs the actual API
interface EmailLinkProps {
  email: string; // required — computes href="mailto:${email}"
  label?: string; // visible text; defaults to email
  icon?: React.ReactNode; // optional leading icon
  qualifier?: string; // optional trailing "(qualifier)" in muted span
  variant?: "default" | "muted"; // default: "default"
  className?: string;
  // ...standard AnchorHTMLAttributes minus href
}
```

`href` is explicitly excluded from the passthrough props. The engineer should use `Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>` as the base extension type. This is the one constraint the spec places on the API shape — `href` must not be overrideable by the consumer.

---

## 10. Composition rules

- `<EmailLink>` is an inline atom. It composes cleanly into paragraph copy, footer lines, card bodies, and any flow context that accepts inline elements.
- Inside `<SiteShell>` footer: pass `variant="muted"`. The footer register is metadata, not primary CTA. This replaces the current `.muted-link` className pattern.
- Inside a holding-page hero or CTA block: pass `variant="default"`. This is the low-commitment contact affordance — it lives near but is visually distinct from the `<Button>` that commits to an action. Do not replace the `<EmailLink>` with `<Button asChild>` for a mailto href just because the Button is nearby — the register difference matters.
- `<EmailLink>` does not compose with `<Button>`. They are sibling affordances, not parent/child. A typical CTA layout: `<Button>` (primary action) + `<EmailLink>` (contact fallback), separated by `--space-3` or `--space-4`. The button reads as commitment; the link reads as "or reach out instead."
- Inside body copy (`<p>`): use without icon slot. An icon in a sentence disrupts the text baseline. The icon slot is for standalone CTA-row contexts, not prose.
- `<EmailLink>` does not compose with `<Eyebrow>`, `<Stat>`, or `<StatusBadge>`. It is a text link, not a label or data primitive.

---

## 11. Out of scope

- **`tel:` and `sms:` protocol support.** This atom has one job: `mailto:`. If telephone or SMS affordances surface, they get their own atoms (`PhoneLink`, `SmsLink`) with appropriate semantics (e.g. mobile-first tap affordance considerations for phone links). Mixing protocols into a single atom produces a component whose identity is "generic protocol link" — that is a different component with a different prop contract and different a11y story. Follow-up proposal when a `tel:` surface appears.
- **Button-styled email link.** Consumers wanting a `mailto:` link rendered as a Button use `<Button asChild><a href="mailto:…">label</a></Button>`. That is a valid composition the DS already supports. `<EmailLink>` does not add a `buttonStyle` prop — it is a text link, not a button.
- **`subject` and `body` query parameters.** `mailto:email?subject=Hello&body=…` is a valid URI. This spec does not support pre-filling subject or body. A contact surface that needs pre-filled content is a more opinionated UX pattern — file a proposal when the use case arrives. Adding `subject` and `body` props to this atom is additive and backward-compatible when it lands.
- **Dark-mode variant overrides.** `--fg`, `--fg-muted`, and `--accent` flip cleanly via the global dark-mode token override block sketched in `meta/brand.md`. No per-component dark-mode CSS needed.
- **Truncation / overflow handling.** Long email addresses in constrained containers (e.g. a narrow card) are the consumer's responsibility. `<EmailLink>` does not clamp, truncate, or wrap. If the `label` prop is used, the consumer writes a short label and avoids the overflow. The long-email overflow story test (§12) documents what happens without intervention — the engineer should verify this renders without breaking layout.
- **Copy-to-clipboard affordance.** Not in scope. If a consumer wants a "copy email" pattern, that is a different atom with different interaction semantics.
- **Icon-trailing position.** The icon slot is leading only. A trailing icon on a link reads as "external link" (the diagonal-arrow convention). That convention belongs to a future `ExternalLink` atom, not here.

---

## 12. Story matrix

| Story file                          | Story name             | Description                                                                                                                                                                                                |
| ----------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EmailLink.stories.tsx`             | `Default`              | `email="hello@pouk.ai"`, no props — plain inline link, default variant, label defaults to email string                                                                                                     |
| `EmailLink.stories.tsx`             | `WithIcon`             | `email="hello@pouk.ai"`, `icon={<Mail size={14} aria-hidden />}` — verifies inline-flex layout, icon gap, optical alignment                                                                                |
| `EmailLink.stories.tsx`             | `WithQualifier`        | `email="founder@pouk.ai"`, `qualifier="Arian"` — verifies qualifier rendering, muted color of qualifier span, parenthetical wrapping                                                                       |
| `EmailLink.stories.tsx`             | `MutedVariant`         | `email="hello@pouk.ai"`, `variant="muted"` — verifies `--fg-muted` base color and `--fg` hover; matches SiteShell footer treatment                                                                         |
| `EmailLink.stories.tsx`             | `WithIconAndQualifier` | All slots populated: email + icon + qualifier — full anatomy rendered together                                                                                                                             |
| `EmailLink.AllVariants.stories.tsx` | `AllVariants`          | Both variants stacked, with and without icon, for the design-matrix record                                                                                                                                 |
| `EmailLink.AllVariants.stories.tsx` | `FocusVisible`         | Programmatically focused instance — `.focus()` called in `play()` — visual review of the 2px `--accent` outline at 2px offset                                                                              |
| `EmailLink.AllVariants.stories.tsx` | `InlineSentence`       | `<EmailLink>` embedded inside a `<p>` sentence ("Questions? Contact us at …") — verifies inline flow, no baseline disruption, underline alignment with surrounding text                                    |
| `EmailLink.AllVariants.stories.tsx` | `LongEmailOverflow`    | An intentionally long email string (e.g. `very-long-name@subdomain.example.com`) in a constrained 240px container — documents overflow behavior without intervention; engineer verifies no layout breakage |

---

## 13. Open questions for the engineer

1. **`href` exclusion from spread.** The prop interface should use `Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>` to prevent consumers from overriding the computed `mailto:` href. Verify this pattern does not conflict with any existing DS component conventions — if `Omit` is already used in another atom (e.g. in `Button`'s spread), follow the same implementation pattern for consistency.

2. **Inline vs. inline-flex switching.** The `display` property must switch between `inline` and `inline-flex` depending on whether `icon` is populated. The recommended approach is a CSS module class toggled by a prop-derived boolean, e.g. `className={cx(styles.root, icon && styles.withIcon)}`. Confirm this is consistent with how other atoms that have optional icon slots handle the display switch.

3. **Qualifier whitespace.** The qualifier is wrapped as ` (qualifier)` to prevent the opening paren from wrapping to a new line separated from the qualifier content. Verify the non-breaking space renders correctly in all target browsers and in the Ladle story context. If NBSP causes issues, `white-space: nowrap` on the qualifier `<span>` is the fallback.

4. **`muted-link` global class retirement.** After `<EmailLink variant="muted">` ships and `SiteShell` migrates to it, the `.muted-link` global utility class in `tokens.css` (lines 259–268) becomes a duplicate. It should not be removed in the same PR — other consumers may reference it. File a follow-up to audit usage and deprecate if appropriate.

5. **Focus ring interaction with `tokens.css` base styles.** The global `a:focus-visible` rule in `tokens.css` already provides the correct 2px `--accent` outline at 4px offset (note: `tokens.css` uses `outline-offset: 4px` for the global rule; this spec calls for `2px` offset to match `<Button>`). Decide whether to align with the global `a:focus-visible` (4px offset) or the Button focus ring (2px offset). Recommendation: match the global `a:focus-visible` (4px offset) — `<EmailLink>` is a link, not a button, and should inherit the link focus ring convention, not the button one. This is a minor correction to the spec: use `outline-offset: 4px`, not `2px`.
