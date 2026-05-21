---
"@poukai-inc/ui": minor
---

Stack alignment (issue #105):

- **D1 — React 19 dual-peer support.** Widen `peerDependencies.react` and `peerDependencies.react-dom` from `>=18` to `>=18 || >=19`, and broaden `@types/react` / `@types/react-dom` ranges to `>=18.3.0 <20`. CI now runs Playwright component tests under React 18 _and_ React 19 via a `ct-react-matrix` job so both peer surfaces stay green.
- **D4 — lucide-react alignment.** Tighten `peerDependencies.lucide-react` floor from `>=0.400.0` to `>=0.500.0` to match org-wide consumer versions (`autopost` 0.562, `poukai` 0.511). Bump devDep to `^0.577.0` (latest 0.5xx). Icons used internally (`ArrowUpRight`, `Mail`, `Heart`, `Check`, `AlertCircle`, `X`, `LucideIcon`) are stable across the 0.4xx → 0.5xx range — no rename impact.

No public-API changes. Consumer migration: install on a host with React 18 or 19 and `lucide-react ≥ 0.500.0`.
