import { Fragment } from "react";
import { Button, type ButtonSize, type ButtonVariant } from "../../../atoms/Button";
import styles from "../Showcase.module.css";

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "ghost"];
const SIZES: ButtonSize[] = ["sm", "md", "lg"];

const LABEL: Record<ButtonVariant, string> = {
  primary: "Get in touch",
  secondary: "View work",
  ghost: "Learn more",
};

/** 3-variant × 3-size matrix. Labels follow the on-brand copy from each variant. */
export function ButtonMatrix() {
  return (
    <div className={styles.spec}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "max-content 1fr 1fr 1fr",
          rowGap: "var(--space-6)",
          columnGap: "var(--space-6)",
          alignItems: "center",
        }}
      >
        <span />
        {SIZES.map((s) => (
          <span key={s} className="micro">
            {s}
          </span>
        ))}
        {VARIANTS.map((v) => (
          <Fragment key={v}>
            <span className="micro">{v}</span>
            {SIZES.map((s) => (
              <Button key={`${v}-${s}`} variant={v} size={s}>
                {LABEL[v]}
              </Button>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
