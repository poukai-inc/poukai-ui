import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import clsx from "clsx";
import { Eyebrow } from "../../atoms/Eyebrow";
import styles from "./TeamCard.module.css";

/**
 * TeamCard prop interface.
 *
 * `title` is omitted from the HTML attribute spread to prevent collision with
 * the `name` content prop. The native `title` attribute renders a browser
 * tooltip; it is not a content slot on TeamCard. Consumers who need the native
 * tooltip can pass it via `...rest` after casting, but the intent here is that
 * `name` carries the person's name — not `title`.
 */
export interface TeamCardProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "role"> {
  /**
   * Root element. Controls landmark semantics.
   * - `"article"` (default) — self-contained, independently distributable person tile.
   * - `"section"` — region landmark when the parent context expects it (rare).
   * - `"div"` — no landmark; use inside `<ul>/<li>` structures where `<li>` owns item semantics.
   */
  as?: "article" | "section" | "div";
  /**
   * Portrait slot. Pass a fully-configured `<Portrait>` instance. TeamCard does not
   * accept a `portraitSrc` shortcut — Portrait's API is authoritative for `src`,
   * `alt`, `aspect`, `width`, and `sizes`.
   */
  portrait: ReactNode;
  /**
   * Person's name. Rendered as the element specified by `nameAs` (default `h3`).
   * Accepts `ReactNode` so consumers may pass styled fragments, but standard usage
   * is a plain string.
   */
  name: ReactNode;
  /**
   * Heading level for the name element.
   * - `"h3"` (default) — correct when TeamCard lives inside a `<Section>` (h2) on a page with a Hero (h1).
   * - `"h2"` — for standalone person pages where TeamCard carries the primary heading.
   * - `"h4"` — for deeply nested contexts.
   */
  nameAs?: "h2" | "h3" | "h4";
  /**
   * Short role/title descriptor. Rendered as a `<p>` in the meta register
   * (`--fs-meta`, `--fg-muted`). Standard usage is a plain string; accepts
   * `ReactNode` for parity with other slot props.
   */
  role: ReactNode;
  /**
   * Optional supporting bio prose (1–3 sentences). Rendered as a `<p>` at body
   * scale. When absent, no element is emitted.
   */
  bio?: ReactNode;
  /**
   * Optional contact affordance. Standard usage: `<EmailLink email="…" variant="muted" />`.
   * Accepts any ReactNode — LinkedIn links, GitHub handles, etc. — so TeamCard
   * never needs spec changes to accommodate new contact types.
   */
  contact?: ReactNode;
  /**
   * Optional eyebrow label. Two calling conventions (mirroring `<Section>` / `<Pull>`):
   * - String: automatically wrapped in `<Eyebrow variant="muted">`.
   * - ReactNode: rendered as-is (escape hatch for non-default Eyebrow configuration).
   */
  eyebrow?: string | ReactNode;
  /**
   * Portrait-text spatial relationship.
   * - `"stacked"` (default) — portrait above, text block below. Grid-context default.
   * - `"horizontal"` — portrait left (fixed 5rem), text block right. Collapses to stacked below 768px.
   */
  layout?: "stacked" | "horizontal";
}

/** Root elements that carry landmark semantics and therefore warrant `aria-labelledby`. */
const LANDMARK_ELEMENTS = new Set<string>(["article", "section"]);

/**
 * TeamCard — canonical person tile.
 *
 * Surfaces a single team member as a brand object: a named, photographed
 * practitioner with a role descriptor, optional bio, and optional contact
 * affordance. Designed for the /about and /team page contexts where each tile
 * must feel authoritative — a practitioner credential, not a social media card.
 *
 * The root is `<article>` by default, correctly typed as a self-contained,
 * independently distributable content item. `aria-labelledby` is wired to the
 * name heading automatically for all landmark roots (`article`, `section`).
 *
 * @example Standard stacked card
 *   <TeamCard
 *     portrait={<Portrait src="…" alt="Arian Zargaran, founder" aspect="1:1" width={800} />}
 *     name="Arian Zargaran"
 *     role="Founder, Engineering"
 *     bio="Builds production AI systems for senior-only consulting practices."
 *     contact={<EmailLink email="arian@pouk.ai" variant="muted" />}
 *   />
 *
 * @example Horizontal layout (editorial/founder treatment)
 *   <TeamCard
 *     layout="horizontal"
 *     portrait={<Portrait src="…" alt="…" aspect="1:1" width={400} />}
 *     name="Arian Zargaran"
 *     role="Founder"
 *   />
 *
 * @example With eyebrow group label
 *   <TeamCard eyebrow="Founding team" portrait={…} name="…" role="…" />
 */
export const TeamCard = forwardRef<HTMLElement, TeamCardProps>(function TeamCard(
  {
    as: As = "article",
    portrait,
    name,
    nameAs = "h3",
    role,
    bio,
    contact,
    eyebrow,
    layout = "stacked",
    className,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const nameId = `${generatedId}-name`;

  const isLandmark = LANDMARK_ELEMENTS.has(As);
  const labelledBy = isLandmark ? nameId : undefined;

  const rootClassName = clsx(styles.root, layout === "horizontal" && styles.horizontal, className);

  const NameTag = nameAs;

  const eyebrowNode =
    eyebrow === undefined ? null : typeof eyebrow === "string" ? (
      <Eyebrow variant="muted">{eyebrow}</Eyebrow>
    ) : (
      eyebrow
    );

  const textBlock = (
    <div className={styles.textBlock}>
      {layout === "horizontal" && eyebrowNode !== null && (
        <div className={styles.eyebrowSlot}>{eyebrowNode}</div>
      )}
      <NameTag id={nameId} className={styles.name}>
        {name}
      </NameTag>
      <p className={styles.role}>{role}</p>
      {bio !== undefined && <p className={styles.bio}>{bio}</p>}
      {contact !== undefined && <div className={styles.contact}>{contact}</div>}
    </div>
  );

  const content = (
    <>
      {layout === "stacked" && eyebrowNode !== null && (
        <div className={styles.eyebrowSlot}>{eyebrowNode}</div>
      )}
      <div className={styles.portraitSlot}>{portrait}</div>
      {textBlock}
    </>
  );

  // Per-branch cast pattern from Section — satisfies TypeScript without a
  // single-branch cast while keeping identical runtime behaviour.
  if (As === "article") {
    return (
      <article
        ref={ref as Ref<HTMLElement>}
        className={rootClassName}
        aria-labelledby={labelledBy}
        {...(rest as ComponentPropsWithoutRef<"article">)}
      >
        {content}
      </article>
    );
  }

  if (As === "section") {
    return (
      <section
        ref={ref as Ref<HTMLElement>}
        className={rootClassName}
        aria-labelledby={labelledBy}
        {...(rest as ComponentPropsWithoutRef<"section">)}
      >
        {content}
      </section>
    );
  }

  // Default fallthrough: "div" — no landmark, no aria-labelledby.
  return (
    <div
      ref={ref as Ref<HTMLDivElement>}
      className={rootClassName}
      {...(rest as ComponentPropsWithoutRef<"div">)}
    >
      {content}
    </div>
  );
});

TeamCard.displayName = "TeamCard";
