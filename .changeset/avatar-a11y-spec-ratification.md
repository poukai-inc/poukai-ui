---
"@poukai-inc/ui": patch
---

Fix Avatar accessibility and CSS spec compliance; ratify 6 Draft design specs.

- Avatar: add `aria-hidden="true"` on decorative instances (no `name`, no `alt`)
- Avatar: fix `shape="square"` border-radius to `--radius-1` (2px, was 4px)
- Avatar: move `user-select: none` to root element
- Dialog: remove redundant `clsx(className)` wrapping in DialogBasic
- Design specs: promote Avatar, Tag, FieldNote, Quote, Dialog, Footer from Draft → Approved
