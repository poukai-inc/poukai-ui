import { Button } from "../../../atoms/Button";
import { StatusBadge } from "../../../atoms/StatusBadge";
import { Hero } from "../../../molecules/Hero";
import styles from "../Showcase.module.css";

const PROD_TITLE = (
  <>
    Technical consulting for teams shipping with <em>AI</em>.
  </>
);

const PROD_STATUS = <StatusBadge status="available">Taking conversations for Q3.</StatusBadge>;

const PROD_CTA = (
  <Button asChild>
    <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
  </Button>
);

/**
 * `titleAs="h2"` on every showcase Hero — the System story has its own h1
 * masthead, so molecule-level Heroes step down to keep the page's heading
 * hierarchy valid (axe `heading-order`).
 */

/** Default Hero — status + title + lede + CTA. The README sample. */
export function HeroFull() {
  return (
    <div className={styles.spec}>
      <Hero
        titleAs="h2"
        status={PROD_STATUS}
        title={PROD_TITLE}
        lede="We work alongside founders and platform teams to close the gap between pilot and production — small, senior engagements, no juniors, no theatre."
        cta={PROD_CTA}
      />
    </div>
  );
}

/** Centered Hero — short headline. */
export function HeroCentered() {
  return (
    <div className={styles.spec}>
      <Hero
        titleAs="h2"
        align="center"
        status={PROD_STATUS}
        title={<>Close the gap.</>}
        lede="Senior technical consulting for AI-native product teams."
        cta={PROD_CTA}
      />
    </div>
  );
}

/** Text-only Hero — no status, no CTA. */
export function HeroTextOnly() {
  return (
    <div className={styles.spec}>
      <Hero
        titleAs="h2"
        title={PROD_TITLE}
        lede="We work alongside founders and platform teams to close the gap between pilot and production."
      />
    </div>
  );
}
