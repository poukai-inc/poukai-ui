# Design spec: Byline

**Atomic layer**: molecule
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-23
**Implements proposal**: GitHub issue #164 (`poukai-inc/poukai-ui`)

---

## 1. Purpose

`<Byline>` is the single-author article attribution affordance: the "by Jane Doe · Editor · May 21, 2026 · 6 min read" row appearing directly below article headings or blog post titles. It composes Avatar + semantic text elements + Time into a stable, semantically correct horizontal row. Byline owns the layout and typographic register; it introduces no new tokens.

Static presentational molecule. Not interactive.

---

## 2. Anatomy

- **Root** — `<div>` flex row
- **Avatar** — `<Avatar size="md" shape="circle">` decorative (no name/alt prop — Avatar auto-emits aria-hidden)
- **Text column** — vertical `<span>`: name `<strong>` + optional role `<span>`
- **Separator dot** — `<span aria-hidden="true">·</span>` present when trailing content (time or readTime) exists
- **Time group** (optional) — `<Time format="absolute">` + optional second separator dot + readTime `<span>`
- **Read-time fragment** (optional standalone) — readTime only, when publishedAt is absent but readTime is present

---

## 3. Tokens used

No new tokens.

| Token              | Role                                            |
| ------------------ | ----------------------------------------------- |
| `--fs-meta`        | Name, dots, Time display, read-time text (14px) |
| `--fs-micro`       | Role line (12px)                                |
| `--tracking-micro` | Role letter-spacing (0.04em)                    |
| `--fg`             | Name color                                      |
| `--fg-muted`       | Role, dots, Time, read-time                     |
| `--font-sans`      | All text                                        |
| `--lh-meta`        | Line-height 1.2                                 |
| `--space-1`        | Gap within text column (4px)                    |
| `--space-2`        | padding-inline on each separator dot (8px each) |
| `--space-3`        | Gap between Avatar and text column (12px)       |

---

## 4. Layout & rhythm

Root: display:flex; align-items:center; flex-wrap:nowrap; font-family:var(--font-sans); font-size:var(--fs-meta); line-height:var(--lh-meta); color:var(--fg-muted); gap:var(--space-3).

Text column: display:flex; flex-direction:column; gap:var(--space-1); min-width:0.

Name strong: font-size:var(--fs-meta); font-weight:500; color:var(--fg); line-height:var(--lh-meta).

Role span: font-size:var(--fs-micro); letter-spacing:var(--tracking-micro); text-transform:uppercase; color:var(--fg-muted); line-height:var(--lh-meta).

Separator dot span: padding-inline:var(--space-2); color:var(--fg-muted); user-select:none.

---

## 5. States

| publishedAt | readTime | Trailing content          |
| ----------- | -------- | ------------------------- |
| present     | present  | `· <Time> · N min read`   |
| present     | absent   | `· <Time>`                |
| absent      | present  | `· N min read`            |
| absent      | absent   | Nothing; dot also omitted |

role absent: role span not rendered. avatar+initials absent: Avatar renders in empty mode.

---

## 6. Motion

None. Static molecule.

---

## 7. Accessibility

Root: `<div>`, no ARIA role. Avatar is decorative (name already in text). Dots: aria-hidden="true". Time: native `<time datetime>`. Name: `<strong>`. Contrast: --fg on --bg 16.29:1 AAA; --fg-muted on --bg 4.91:1 AA.

---

## 8. Prop intent

- avatar?: string — image URL forwarded to Avatar mode="image"
- initials?: string — forwarded to Avatar mode="initials" when no avatar
- name: string — required; rendered as `<strong>`
- role?: string — optional; omitted when absent
- publishedAt?: string | Date — forwarded to Time dateTime; omitted when absent
- readTime?: string — consumer-formatted string; omitted when absent
- ...rest spreads to root `<div>`; ref forwarded to root `<div>`

---

## 9. Composition rules

Sits outside Prose. Below h1/h2; parent owns spacing. Single-author only.

---

## 10. Out of scope

BylineGroup, authorHref, timeFormat prop, responsive collapse, Avatar onError fallback, read-time localisation, skeleton state.
