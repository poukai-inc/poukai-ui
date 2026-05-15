import clsx from "clsx";
import { Button } from "../../../atoms/Button";
import { StatusBadge } from "../../../atoms/StatusBadge";
import { Hero } from "../../../molecules/Hero";
import { SiteShell } from "../../../organisms/SiteShell";
import styles from "../Showcase.module.css";

const ROUTES = [
  { href: "/why-ai", label: "Why AI" },
  { href: "/roles", label: "Roles" },
  { href: "/principles", label: "Principles" },
];

/** Full SiteShell with the canonical hero inside main, /why-ai active. */
export function SiteShellFull() {
  return (
    <div
      className={clsx(styles.spec, styles.specBare)}
      style={{
        overflow: "hidden",
        borderRadius: "var(--radius-3)",
        border: "1px solid var(--hairline)",
      }}
    >
      <SiteShell
        currentRoute="/why-ai"
        routes={ROUTES}
        footer={
          <p style={{ margin: 0 }}>
            © Pouk AI INC 2026 ·{" "}
            <a href="mailto:hello@pouk.ai" className="muted-link">
              hello@pouk.ai
            </a>
          </p>
        }
      >
        <Hero
          titleAs="h2"
          status={<StatusBadge status="available">Taking conversations for Q3.</StatusBadge>}
          title={
            <>
              Technical consulting for teams shipping with <em>AI</em>.
            </>
          }
          lede="We work alongside founders and platform teams to close the gap between pilot and production."
          cta={
            <Button asChild>
              <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
            </Button>
          }
        />
      </SiteShell>
    </div>
  );
}
