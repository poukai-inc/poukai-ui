import clsx from "clsx";
import { RoleCard } from "../../../molecules/RoleCard";
import styles from "../Showcase.module.css";
import { PlaceholderIcon } from "./PlaceholderIcon";

interface Role {
  eyebrow: string;
  title: string;
  body: string;
  hiredBy: string;
}

const ROLES: Role[] = [
  {
    eyebrow: "Role 01",
    title: "Builder",
    body: "Ships production systems end-to-end.",
    hiredBy: "Anthropic · Vercel · Stripe",
  },
  {
    eyebrow: "Role 02",
    title: "Automator",
    body: "Turns repeatable, high-friction internal work into reliable software.",
    hiredBy: "Linear · Notion",
  },
  {
    eyebrow: "Role 03",
    title: "Educator",
    body: "Brings the team up the curve — workshops, pairing, codified playbooks.",
    hiredBy: "Shopify · Figma",
  },
  {
    eyebrow: "Role 04",
    title: "Creator",
    body: "Shapes the product surface — prototypes, motion, the feel of the thing.",
    hiredBy: "Arc · Raycast",
  },
];

/** One RoleCard — the canonical recipe. */
export function RoleCardSingle() {
  return (
    <div className={clsx(styles.spec, styles.specBare)}>
      <RoleCard
        icon={<PlaceholderIcon size={24} />}
        eyebrow="Role 01"
        title="Builder"
        body="Ships production systems end-to-end. Comfortable in the codebase from day one; closes the loop between design intent and what runs in prod."
        hiredBy="Anthropic · Vercel · Stripe"
      />
    </div>
  );
}

/** 4-up RoleCard grid — matches /roles. */
export function RoleCardGrid() {
  return (
    <div className={clsx(styles.spec, styles.specBare)}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "var(--space-6)",
        }}
      >
        {ROLES.map((r) => (
          <RoleCard
            key={r.title}
            icon={<PlaceholderIcon size={24} />}
            eyebrow={r.eyebrow}
            title={r.title}
            body={r.body}
            hiredBy={r.hiredBy}
          />
        ))}
      </div>
    </div>
  );
}
