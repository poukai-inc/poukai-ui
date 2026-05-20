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
export default {
  stories: "src/**/*.stories.{ts,tsx}",
  defaultStory: "system-reference--all",
  base: "/poukai-ui/",
  appendToHead: `<link rel="stylesheet" href="tokens.css" />`,
};
