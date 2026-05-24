/** @type {import("@ladle/react").UserConfig} */
//
// GitHub Pages serves this site at `/poukai-ui/`, so the production build
// must emit asset paths with that subpath prefix. Without `base`, Ladle
// emits `<script src="/assets/...">` and the browser fetches it from the
// domain root (`https://poukai-inc.github.io/assets/...`) — which 404s and
// blanks the page.
//
// `appendToHead` uses a RELATIVE href so the same config works at the
// domain root (dev) and the subpath (prod). The relative `tokens.css`
// resolves against the current URL: `/poukai-ui/<story>` → fetches
// `/poukai-ui/tokens.css`. The build step must copy `dist/tokens.css`
// into the Ladle `build/` output so the fetch resolves.
// Sidebar ordering: Home → System → Atoms → Molecules → Organisms → Showcase.
// Story ids carry their title slug as a prefix (e.g. `atoms-button--default`),
// so the leading hyphen-delimited token identifies the group.
//
// Ladle evaluates `storyOrder` as a stand-alone function expression — outer
// module-scope identifiers are NOT in scope at sort time, so the group table
// must be inlined inside the function body itself.
export default {
  stories: "src/**/*.stories.{ts,tsx}",
  defaultStory: "home--showcase",
  base: "/poukai-ui/",
  appendToHead: `<link rel="stylesheet" href="tokens.css" />`,
  storyOrder: (stories) => {
    const order = ["home", "system", "atoms", "molecules", "organisms", "showcase"];
    const groupIndex = (id) => {
      const head = id.split("--", 1)[0];
      const first = head.split("-", 1)[0];
      const idx = order.indexOf(first);
      return idx === -1 ? order.length : idx;
    };
    return [...stories].sort((a, b) => {
      const ga = groupIndex(a);
      const gb = groupIndex(b);
      if (ga !== gb) return ga - gb;
      return a.localeCompare(b);
    });
  },
};
