import clsx from "clsx";
import { Principle } from "../../../molecules/Principle";
import styles from "../Showcase.module.css";

interface PrincipleRow {
  numeral: string;
  title: string;
  body: string;
}

const PRINCIPLES: PrincipleRow[] = [
  {
    numeral: "i.",
    title: "Ship the smallest real thing.",
    body: "Pilots fail because they're rehearsals. Production is the only proving ground — find the smallest piece of the workflow that can run for real, and run it for real.",
  },
  {
    numeral: "ii.",
    title: "Senior, end-to-end, no handoff theatre.",
    body: "Every engagement is one or two senior engineers from intake through cutover. No PMs translating, no juniors carrying.",
  },
  {
    numeral: "iii.",
    title: "Evaluation is part of the system.",
    body: "If you can't measure the quality of an AI output, you can't ship it. Evals are infrastructure, not analytics.",
  },
];

/** Three-item editorial Principle list (`/principles` page recipe). */
export function PrincipleList() {
  return (
    <div className={clsx(styles.spec, styles.specBare)} style={{ padding: "0 var(--space-2)" }}>
      {PRINCIPLES.map((p) => (
        <Principle key={p.numeral} numeral={p.numeral} title={p.title}>
          <p>{p.body}</p>
        </Principle>
      ))}
    </div>
  );
}
