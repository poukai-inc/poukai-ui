import styles from "../Showcase.module.css";

export interface Easing {
  /** Token name — e.g. "--easing". */
  name: string;
  /** Full `cubic-bezier(x1, y1, x2, y2)` declaration. */
  curve: string;
  /** Caption — what the easing is used for. */
  caption: string;
}

interface BezierPoints {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function parseCubicBezier(curve: string): BezierPoints | null {
  const match = curve.match(/cubic-bezier\(([^)]+)\)/);
  if (!match || !match[1]) return null;
  const parts = match[1].split(",").map((s) => parseFloat(s.trim()));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return null;
  const [x1, y1, x2, y2] = parts as [number, number, number, number];
  return { x1, y1, x2, y2 };
}

function Curve({ points }: { points: BezierPoints }) {
  const W = 200;
  const H = 100;
  const PAD = 8;
  const px = (t: number) => PAD + t * (W - 2 * PAD);
  const py = (t: number) => H - PAD - t * (H - 2 * PAD);
  const { x1, y1, x2, y2 } = points;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.easingCurve} aria-hidden="true">
      <line
        x1={PAD}
        y1={H - PAD}
        x2={W - PAD}
        y2={H - PAD}
        stroke="var(--hairline)"
        strokeWidth="1"
      />
      <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="var(--hairline)" strokeWidth="1" />
      <path
        d={`M ${px(0)} ${py(0)} C ${px(x1)} ${py(y1)} ${px(x2)} ${py(y2)} ${px(1)} ${py(1)}`}
        fill="none"
        stroke="var(--fg)"
        strokeWidth="1.5"
      />
      <line
        x1={px(0)}
        y1={py(0)}
        x2={px(x1)}
        y2={py(y1)}
        stroke="var(--accent-glow)"
        strokeWidth="1"
      />
      <line
        x1={px(1)}
        y1={py(1)}
        x2={px(x2)}
        y2={py(y2)}
        stroke="var(--accent-glow)"
        strokeWidth="1"
      />
      <circle cx={px(x1)} cy={py(y1)} r="2.5" fill="var(--accent)" />
      <circle cx={px(x2)} cy={py(y2)} r="2.5" fill="var(--accent)" />
    </svg>
  );
}

/** One easing card — token caption, SVG curve, declaration, use note. */
export function EasingCard({ ease }: { ease: Easing }) {
  const points = parseCubicBezier(ease.curve);
  return (
    <div className={styles.spec}>
      <p className={styles.specCaption}>{ease.name}</p>
      {points ? <Curve points={points} /> : null}
      <div className={styles.easingCaption}>{ease.curve}</div>
      <p className="meta" style={{ marginTop: "auto" }}>
        {ease.caption}
      </p>
    </div>
  );
}
