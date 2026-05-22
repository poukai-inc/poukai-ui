---
"@poukai-inc/ui": major
---

Drop auto-CSS-injection. Consumers must now import `@poukai-inc/ui/styles.css`.

**Breaking change.** Prior versions injected each component's CSS into its
own JS chunk via `vite-plugin-lib-inject-css`. That made every JS chunk
side-effectful (the chunk contained `import "./Foo.css"`), which forced
bundlers to retain _every_ component chunk for any single barrel import —
tree-shaking the public barrel (`@poukai-inc/ui`) was effectively impossible.

Per `import { NumberFormat } from "@poukai-inc/ui"`, the bundled output went
from ~32 kB (whole library) to **267 B** in the latest build. The
size-limit gate's four tree-shaken buckets are all comfortably back under
budget.

**Migration.** Add one CSS import at your app root next to the existing
tokens import:

```ts
// before — tokens only
import "@poukai-inc/ui/tokens.css";

// after — tokens + component styles
import "@poukai-inc/ui/tokens.css";
import "@poukai-inc/ui/styles.css";
```

`styles.css` is the combined stylesheet for every atom / molecule / organism
in the library (single file, ~52 kB raw / ~9 kB gzipped). No per-component
imports are needed. Per-component CSS files are no longer emitted.

**What also changed:**

- Removed the `vite-plugin-lib-inject-css` dev dependency.
- Set `cssCodeSplit: false` in `vite.config.ts` so Vite emits one combined
  `dist/styles.css` instead of per-chunk CSS imports.
- Filled in missing per-component subpath entries in `vite.config.ts`
  (Code, Divider, Icon, IconButton, Image, Input, Kbd, Label, Link, Logo,
  Mark, ProgressBar, Prose, Radio, Select, Skeleton, SkipLink, Spinner,
  Switch, Text, Time, VisuallyHidden, Banner, Field, Input/Textarea molecule
  shims, Form, Tabs, Toast). Earlier these atoms were being inlined into
  `dist/index.js` instead of emitted as standalone chunks — the
  `package.json` subpath exports already pointed at JS files that did not
  exist on disk. Subpath imports such as
  `import { Radio } from "@poukai-inc/ui/atoms/Radio"` now resolve to a
  real chunk file.
