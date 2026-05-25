# ArticleHeader

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`ArticleHeader` is the canonical top-of-article block for long-form surfaces — blog posts, docs pages, case studies. It assembles an eyebrow category label, a semantic `<h1>` title, a lede paragraph, a `Byline` row (author + timestamp + read time), and a `ShareLinks` row into one cohesive organism. By owning this composition at the DS level, every article surface gets identical rhythm, typography, and spacing without each consumer re-deriving the vertical stack.

## 2. Anatomy

```
<header>                          ← semantic article header
  <p class="eyebrow">             ← Eyebrow atom — category label (e.g. "Engineering")
  <h1>                            ← Heading atom, level 1 — article title
  <p class="lede">                ← Text atom — supporting sentence(s)
  <Byline />                      ← Byline molecule — avatar + name + role + time
  <ShareLinks />                  ← ShareLinks molecule — share icons + copy-URL
</header>
```

Slots: `eyebrow` (string), `title` (ReactNode — supports `<em>` for italic accent), `lede` (string), `byline` (ReactNode — accepts `<Byline>`), `share` (ReactNode — accepts `<ShareLinks>`, optional).

## 3. Tokens

- `--fs-micro` — eyebrow font-size (0.75rem / 12px)
- `--tracking-eyebrow` — eyebrow letter-spacing (0.06em)
- `--fg-muted` — eyebrow color; also lede color
- `--font-sans` — eyebrow font family (UI label register)
- `--font-serif` — title font family (Instrument Serif)
- `--fs-tagline-intimate` — title font-size (clamp 32–52px); article titles use the intimate ramp, not display
- `--fg` — title color
- `--fs-body` — lede font-size (clamp 17–19px)
- `--space-2` — eyebrow → title gap (8px)
- `--space-6` — title → lede gap (24px)
- `--space-6` — lede → Byline gap (24px)
- `--space-4` — Byline → ShareLinks gap (16px)
- `--hairline` — optional rule below the block
- `--hairline-w` — rule width (1px)
- `--space-8` — block bottom margin before article body (32px)
- `--space-10` — block bottom margin on `md+` (40px)

## 4. Variants / Props

| Prop      | Type        | Default     | Rationale                                                                  |
| --------- | ----------- | ----------- | -------------------------------------------------------------------------- |
| `eyebrow` | `string`    | —           | Required. Category label above the title ("Engineering", "Design").        |
| `title`   | `ReactNode` | —           | Required. Rendered as `<h1>`. Accepts `<em>` for serif-italic accent.      |
| `lede`    | `string`    | —           | Required. 1–3 sentence article summary; rendered in `--fg-muted`.          |
| `byline`  | `ReactNode` | —           | Required slot. Accepts `<Byline>` molecule.                                |
| `share`   | `ReactNode` | `undefined` | Optional slot. Accepts `<ShareLinks>`. Omit on pages without social share. |
| `divider` | `boolean`   | `false`     | When true, renders a `--hairline` rule below the block before body prose.  |

No size or alignment variants. Article headers are always left-aligned; the `--fs-tagline-intimate` ramp is the fixed register. Display-scale (`--fs-tagline`) is for marketing heroes — not editorial article titles.

## 5. Interaction

Static block. No hover, active, or dismissal states on the container itself. Slots delegate:

- `byline` slot: any links inside `<Byline>` (author name, etc.) follow global `<a>` hover treatment from `tokens.css`.
- `share` slot: `<ShareLinks>` and `<CopyButton>` own their own interaction states.
- Keyboard focus flows naturally through the DOM order: eyebrow (non-interactive) → title (non-interactive) → lede (non-interactive) → Byline links → ShareLinks buttons.

## 6. A11y

- Root is `<header>` inside an `<article>` — semantically correct; `<header>` within sectioning content scopes its landmark to the article, not the page.
- `<h1>` is the article's sole heading at level 1. One per page rule applies; `ArticleLayout` should enforce this by wrapping the article in `<article>`.
- Eyebrow renders as `<p>` (not a heading). It is a visual annotation, not a structural level — consistent with Hero `variant="no-title"` eyebrow treatment.
- Contrast: `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) = 4.56:1 — AA pass at 12px with uppercase + tracking. Title `--fg` on `--bg` = 16.29:1 (AAA).
- `<em>` spans inside the title are read as emphasis by screen readers — correct; no `aria-label` workaround needed.
- The `share` slot must carry its own accessible labels; `<ShareLinks>` and `<CopyButton>` own this.

## 7. Motion

None — static organism. No entrance animation authored here.

If a consumer places `ArticleHeader` inside a container with staggered entrance, the slots animate as a unit (the organism is one DOM subtree). No per-slot stagger is defined at this layer — that belongs to a future `ArticleLayout` entrance spec if ever needed.

`prefers-reduced-motion`: no transitions or animations to suppress.

## 8. Anti-patterns

- Do not use `ArticleHeader` for marketing hero moments — use `Hero` (molecule) or `HeroSection` (organism) instead. ArticleHeader is editorial long-form only.
- Do not place a second `<h1>` below `ArticleHeader` on the same page. ArticleHeader owns the one `<h1>`.
- Do not pass a `<Heading level={2}>` or lower into the `title` slot. The slot renders `<h1>` regardless; the consumer must not circumvent this by slotting a lower heading.
- Do not use this as a section header within an article — for in-article section breaks use `<Heading level={2}>` directly.
- Do not omit `byline` on attributed content — authorship metadata is a consumer obligation for editorial trust, not optional decoration.
- Do not use `ArticleHeader` on pages that lack article body content (landing sections, pricing, etc.) — those surfaces use `Hero` or `CtaBlock`.

## 9. Depends on

- `Eyebrow` atom — eyebrow label
- `Heading` atom — `<h1>` title
- `Text` atom — lede paragraph
- `Byline` molecule — author + role + date + read time
- `ShareLinks` molecule — share-to-social + copy-URL row (optional slot)
