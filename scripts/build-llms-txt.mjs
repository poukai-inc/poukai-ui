#!/usr/bin/env node
/**
 * scripts/build-llms-txt.mjs
 *
 * Compose `dist/llms.txt` — a single LLM-consumable context file for
 * @poukai-inc/ui. Follows the llmstxt.org convention: one markdown file at a
 * known path that a model agent can ingest in a single read to understand the
 * package's components, tokens, and architectural decisions.
 *
 * Sources:
 *   - package.json                 (name, version, description)
 *   - src/tokens/tokens.css :root  (token values + inline comments)
 *   - meta/decisions/*.md          (ADRs with YAML frontmatter)
 *
 * Component descriptions are inlined here (the surface is small and stable —
 * cheaper to update by hand than to parse TypeScript JSDoc).
 *
 * Usage:
 *   pnpm build:llms       # writes dist/llms.txt
 *
 * Chained into `pnpm build` so the file is regenerated on every package build.
 */
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, "..");
const outFile = resolve(pkgRoot, "dist/llms.txt");

/* ─── Sources ─────────────────────────────────────────────── */

const pkg = JSON.parse(await readFile(resolve(pkgRoot, "package.json"), "utf8"));
const tokensCss = await readFile(resolve(pkgRoot, "src/tokens/tokens.css"), "utf8");

const decisionsDir = resolve(pkgRoot, "meta/decisions");
const decisionFiles = (await readdir(decisionsDir)).filter((f) => f.endsWith(".md")).sort();

/* ─── Parsers ─────────────────────────────────────────────── */

// Tokens — pull every `--var: value;` from the :root block, with optional
// trailing `/* comment */` on the same line.
function parseTokens(css) {
  const block = css.match(/:root\s*\{([\s\S]*?)\}/);
  if (!block) return [];
  const re = /(--[\w-]+)\s*:\s*([^;]+);[ \t]*(?:\/\*\s*(.*?)\s*\*\/)?/g;
  const found = [];
  let m;
  while ((m = re.exec(block[1])) !== null) {
    found.push({
      name: m[1],
      value: m[2].trim().replace(/\s+/g, " "),
      comment: (m[3] ?? "").trim(),
    });
  }
  return found;
}

// ADR frontmatter — minimal YAML subset (scalars + bracket arrays).
function parseAdr(raw, file) {
  const split = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!split) return { id: file, title: file, status: "?", date: "?", body: raw.trim(), file };
  const yaml = split[1];
  const body = split[2].trim();
  const meta = {};
  for (const line of yaml.split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (!kv) continue;
    const value = kv[2].trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      meta[kv[1]] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      meta[kv[1]] = value.replace(/^["']|["']$/g, "");
    }
  }
  return { ...meta, body, file };
}

/* ─── Component surface (hand-curated) ────────────────────── */

const ATOMS = [
  {
    name: "Wordmark",
    purpose: "Full POUKAI wordmark + isotype lockup. Inherits color via `currentColor`.",
    props: ["height?: number", "label?: string"],
  },
  {
    name: "StatusBadge",
    purpose:
      "Inline availability badge — colored dot + short caption. Pulse only animates when `status='available'` and `prefers-reduced-motion` is not requested.",
    props: ['status?: "available" | "idle" | "closed"', "children: ReactNode"],
  },
  {
    name: "Button",
    purpose:
      "Primary interactive element. Use `asChild` to render the styles on an `<a>` or other element (Radix Slot).",
    props: [
      'variant?: "primary" | "secondary" | "ghost"',
      'size?: "sm" | "md" | "lg"',
      "asChild?: boolean",
    ],
  },
  {
    name: "Stat",
    purpose:
      "Editorial statistic — display numeral on top, caption beneath, optional provenance line in uppercase micro.",
    props: [
      "value: ReactNode",
      "caption: ReactNode",
      "source?: ReactNode",
      'align?: "start" | "end"',
      'size?: "md" | "lg"',
    ],
  },
];

const MOLECULES = [
  {
    name: "Hero",
    purpose:
      "Editorial hero block — owns the hand-tuned vertical rhythm. Status / Title / Lede / CTA, each its own slot. Hero never imports atoms itself.",
    props: [
      "title: ReactNode",
      "lede: ReactNode",
      "status?: ReactNode",
      "cta?: ReactNode",
      'align?: "start" | "center"',
      'titleAs?: "h1" | "h2"',
    ],
  },
  {
    name: "RoleCard",
    purpose:
      "Role card — the recipe used on `/roles`. Surface + hairline + radius-3 card, editorial typography, icon as a content-agnostic slot.",
    props: [
      "eyebrow: ReactNode",
      "title: ReactNode",
      "body: ReactNode",
      "hiredBy?: ReactNode",
      "icon?: ReactNode",
    ],
  },
  {
    name: "Principle",
    purpose:
      "Editorial principle block — used on `/principles`. Margin numeral on desktop / inline on mobile; title + body in the main column.",
    props: ["numeral: string", "title: ReactNode", "children: ReactNode"],
  },
  {
    name: "FailureMode",
    purpose:
      "Numbered failure-mode block — `/why-ai` recipe. Large sans-serif index above the title (the failure is the subject).",
    props: [
      "index: number",
      "indexLabel?: string",
      "title: ReactNode",
      "children: ReactNode",
    ],
  },
];

const ORGANISMS = [
  {
    name: "SiteShell",
    purpose:
      "Site chrome — top nav (wordmark + route labels), main slot, hairline footer. Router-agnostic: emits plain `<a href>`. Consumers using a framework router pass their own anchor via a parent.",
    props: [
      "currentRoute?: string",
      "routes?: { href: string; label: ReactNode }[]",
      "footer?: ReactNode",
      "homeHref?: string",
      "navLabel?: string",
      "children: ReactNode",
    ],
  },
];

/* ─── Compose ─────────────────────────────────────────────── */

const tokens = parseTokens(tokensCss);
const adrs = await Promise.all(
  decisionFiles.map(async (f) => parseAdr(await readFile(resolve(decisionsDir, f), "utf8"), f)),
);

const lines = [];

lines.push(`# ${pkg.name}`);
lines.push("");
lines.push(`> ${pkg.description}`);
lines.push("");
lines.push(
  "Poukai is a React component library organised by Atomic Design (tokens → atoms → molecules → organisms). Tokens are the single source of truth for color, type, spacing, motion, and shape. Components reference tokens only — never hardcode color, size, or font stack.",
);
lines.push("");
lines.push(`Version: \`${pkg.version}\``);
lines.push("");

lines.push("## Usage");
lines.push("");
lines.push(
  'Import tokens once at the app root: `import "@poukai-inc/ui/tokens.css"`. Then import components from the package root (modern bundlers tree-shake cleanly) or from a layer subpath (`@poukai-inc/ui/atoms`, `/molecules`, `/organisms`).',
);
lines.push("");

const emitLayer = (label, components) => {
  lines.push(`### ${label}`);
  lines.push("");
  for (const c of components) {
    lines.push(`#### \`<${c.name}>\``);
    lines.push("");
    lines.push(c.purpose);
    lines.push("");
    lines.push("Props:");
    for (const p of c.props) lines.push(`- \`${p}\``);
    lines.push("");
  }
};

lines.push("## Components");
lines.push("");
emitLayer("Atoms", ATOMS);
emitLayer("Molecules", MOLECULES);
emitLayer("Organisms", ORGANISMS);

lines.push("## Design tokens");
lines.push("");
lines.push(
  `Authoritative source: \`src/tokens/tokens.css\`. ${tokens.length} tokens defined on \`:root\`.`,
);
lines.push("");
for (const t of tokens) {
  lines.push(`- \`${t.name}\`: \`${t.value}\`${t.comment ? ` — ${t.comment}` : ""}`);
}
lines.push("");

lines.push("## Architecture decisions");
lines.push("");
lines.push(
  `${adrs.length} decisions. Authoritative source: \`meta/decisions/\`. Listed by id; each ADR includes the full Context / Decision / Consequences body.`,
);
lines.push("");
for (const adr of adrs) {
  lines.push(`### ADR-${adr.id} — ${adr.title}`);
  lines.push("");
  const meta = [
    `Status: **${adr.status}**`,
    `Date: ${adr.date}`,
    Array.isArray(adr.deciders) && adr.deciders.length
      ? `Deciders: ${adr.deciders.join(", ")}`
      : null,
    Array.isArray(adr.tags) && adr.tags.length ? `Tags: ${adr.tags.join(", ")}` : null,
  ].filter(Boolean);
  lines.push(meta.join(" · "));
  lines.push("");
  lines.push(adr.body);
  lines.push("");
}

lines.push("## Conventions");
lines.push("");
lines.push(
  "- Never hardcode colors, sizes, or font stacks — always reference tokens via CSS custom properties.",
);
lines.push("- Every component is `forwardRef`'d. Consumers expect to attach refs.");
lines.push(
  "- `...rest` is spread onto the root element so consumers can pass `aria-*`, `data-*`, `style`, etc.",
);
lines.push(
  "- Decorative SVG gets `aria-hidden`; interactive composites use Radix primitives (`Slot`, `Dialog`, `Tabs`).",
);
lines.push(
  "- No barrel re-exports in stories or tests — import from the component file directly for provable tree-shaking.",
);
lines.push("");

const out = lines.join("\n") + "\n";

await mkdir(dirname(outFile), { recursive: true });
await writeFile(outFile, out, "utf8");

console.log(
  `Wrote ${outFile}\n  ${out.length} bytes · ${tokens.length} tokens · ${adrs.length} ADRs · ${
    ATOMS.length + MOLECULES.length + ORGANISMS.length
  } components`,
);
