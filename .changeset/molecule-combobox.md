---
"@poukai-inc/ui": minor
---

feat(molecule): add Combobox

Searchable single-select dropdown molecule. Replaces native `<select>` for option lists too large to scan without search (timezone pickers, page/org pickers, data-source selectors).

- Pure React implementation with full ARIA combobox pattern (no cmdk/Radix dep)
- Controlled and uncontrolled usage via `value` / `defaultValue` / `onValueChange`
- Substring filter by default; custom `filter` prop for locale-sensitive search
- Optional group headings derived from `options[].group`
- `size="sm" | "md"` tiers aligned with Input/Button height ladder
- `invalid` and `disabled` states wired for Field composition
- `name` prop emits a hidden input for native form submission
- Keyboard: Enter/Space/ArrowDown opens; ArrowDown/Up navigates; Enter selects; Escape closes; Tab advances focus
- Focus management: popover open → search input; close → trigger
- Token-only CSS — no raw values
- Playwright CT test suite + a11y gate entry

Closes #155.
