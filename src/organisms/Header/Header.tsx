import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { Wordmark } from "../../atoms/Wordmark";
import styles from "./Header.module.css";

/* ─── Sub-component props ─────────────────────────────────────── */

export interface HeaderBrandProps extends ComponentPropsWithoutRef<"a"> {
  /** href for the brand anchor. Defaults to "/". */
  href?: string;
  /** Override the default <Wordmark>. Any ReactNode. */
  logo?: ReactNode;
  children?: ReactNode;
}

export interface HeaderNavProps extends ComponentPropsWithoutRef<"nav"> {
  /** aria-label forwarded to <nav>. Defaults to "Primary". */
  "aria-label"?: string;
  children: ReactNode;
}

export interface HeaderActionsProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

/* ─── Root props ──────────────────────────────────────────────── */

export interface HeaderProps extends ComponentPropsWithoutRef<"header"> {
  /** href for the brand link. Default "/". */
  homeHref?: string;
  /** Override <Wordmark> in the brand slot. */
  logo?: ReactNode;
  /** aria-label for <nav>. Default "Primary". */
  navLabel?: string;
  /** position: sticky; top: 0; adds hairline on scroll. */
  sticky?: boolean;
  /** Always-on hairline bottom border. */
  bordered?: boolean;
  /** Caps band content at --content-max. */
  constrained?: boolean;
  children?: ReactNode;
}

/* ─── Brand ───────────────────────────────────────────────────── */

export const HeaderBrand = forwardRef<HTMLAnchorElement, HeaderBrandProps>(function HeaderBrand(
  { href = "/", logo, className, children, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      href={href}
      aria-label="Poukai — home"
      className={clsx(styles.brand, className)}
      {...rest}
    >
      {logo ?? children ?? <Wordmark height={56} />}
    </a>
  );
});
HeaderBrand.displayName = "Header.Brand";

/* ─── Nav ─────────────────────────────────────────────────────── */

export const HeaderNav = forwardRef<HTMLElement, HeaderNavProps>(function HeaderNav(
  { "aria-label": ariaLabel = "Primary", className, children, ...rest },
  ref,
) {
  return (
    <nav ref={ref} aria-label={ariaLabel} className={clsx(styles.nav, className)} {...rest}>
      <ul className={styles.navList}>{children}</ul>
    </nav>
  );
});
HeaderNav.displayName = "Header.Nav";

/* ─── Actions ─────────────────────────────────────────────────── */

export const HeaderActions = forwardRef<HTMLDivElement, HeaderActionsProps>(function HeaderActions(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={clsx(styles.actions, className)} {...rest}>
      {children}
    </div>
  );
});
HeaderActions.displayName = "Header.Actions";

/* ─── Root ────────────────────────────────────────────────────── */

type HeaderComponent = React.ForwardRefExoticComponent<
  HeaderProps & React.RefAttributes<HTMLElement>
> & {
  Brand: typeof HeaderBrand;
  Nav: typeof HeaderNav;
  Actions: typeof HeaderActions;
};

/**
 * Header — standalone site nav-bar organism.
 *
 * Use on surfaces that need a top navigation row outside of `SiteShell`.
 * Do NOT use inside `SiteShell` — `SiteShell` already owns its header band.
 *
 * Compound API: `<Header>`, `<Header.Brand>`, `<Header.Nav>`, `<Header.Actions>`.
 *
 * @example
 *   <Header sticky bordered homeHref="/">
 *     <Header.Nav>
 *       <NavLink href="/why-ai">Why AI</NavLink>
 *       <NavLink href="/roles" active>Roles</NavLink>
 *     </Header.Nav>
 *     <Header.Actions>
 *       <Button asChild><a href="mailto:hello@pouk.ai">Contact</a></Button>
 *     </Header.Actions>
 *   </Header>
 */
const HeaderRoot = forwardRef<HTMLElement, HeaderProps>(function Header(
  {
    homeHref = "/",
    logo,
    navLabel: _navLabel = "Primary",
    sticky = false,
    bordered = false,
    constrained = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sticky) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(entry !== undefined && !entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sticky]);

  const inner = (
    <>
      {/* Default brand slot */}
      <HeaderBrand href={homeHref} logo={logo} />
      {children}
    </>
  );

  return (
    <>
      {sticky && (
        <div
          ref={sentinelRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            height: "1px",
            width: "1px",
            pointerEvents: "none",
          }}
        />
      )}
      <header
        ref={ref}
        className={clsx(
          styles.root,
          sticky && styles.sticky,
          (bordered || (sticky && scrolled)) && styles.bordered,
          constrained && styles.constrained,
          className,
        )}
        {...rest}
      >
        {constrained ? <div className={styles.inner}>{inner}</div> : inner}
      </header>
    </>
  );
});

HeaderRoot.displayName = "Header";

export const Header = Object.assign(HeaderRoot, {
  Brand: HeaderBrand,
  Nav: HeaderNav,
  Actions: HeaderActions,
}) as HeaderComponent;
