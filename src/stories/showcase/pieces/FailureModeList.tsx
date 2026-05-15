import clsx from "clsx";
import { FailureMode } from "../../../molecules/FailureMode";
import styles from "../Showcase.module.css";

interface FailureModeRow {
  title: string;
  body: string;
}

const MODES: FailureModeRow[] = [
  {
    title: "The chatbot-on-top-of-RAG plateau.",
    body: "Most teams stop here. The demo dazzles; the production loop never closes; quality degrades silently and nobody has the eval harness to see it.",
  },
  {
    title: "Eval theatre.",
    body: "Vibes-based evaluation. Spreadsheets that nobody updates. A pass-rate that means nothing.",
  },
  {
    title: "The agent that ships nothing.",
    body: "Loops forever, calls every tool, returns plausible-sounding nonsense.",
  },
];

/** Three-item FailureMode list — truncated from the full /why-ai five for layout. */
export function FailureModeList() {
  return (
    <div className={clsx(styles.spec, styles.specBare)} style={{ padding: "0 var(--space-2)" }}>
      {MODES.map((m, i) => (
        <FailureMode key={m.title} index={i + 1} title={m.title}>
          <p>{m.body}</p>
        </FailureMode>
      ))}
    </div>
  );
}
