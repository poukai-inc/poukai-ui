import type { Story, StoryDefault } from "@ladle/react";
import { Header } from "./Header";
import { NavLink } from "../../molecules/NavLink";
import { Button } from "../../atoms/Button";

export default {
  title: "Organisms / Header",
} satisfies StoryDefault;

/**
 * Default — brand slot only (Wordmark), no nav, no actions.
 */
export const Default: Story = () => <Header homeHref="/" />;

/**
 * WithNav — brand + primary nav items via NavLink.
 */
export const WithNav: Story = () => (
  <Header homeHref="/">
    <Header.Nav>
      <li>
        <NavLink href="/why-ai">Why AI</NavLink>
      </li>
      <li>
        <NavLink href="/roles" active>
          Roles
        </NavLink>
      </li>
      <li>
        <NavLink href="/principles">Principles</NavLink>
      </li>
    </Header.Nav>
  </Header>
);

/**
 * WithCTAButtons — brand + nav + actions slot with a CTA Button.
 */
export const WithCTAButtons: Story = () => (
  <Header homeHref="/">
    <Header.Nav>
      <li>
        <NavLink href="/why-ai">Why AI</NavLink>
      </li>
      <li>
        <NavLink href="/roles" active>
          Roles
        </NavLink>
      </li>
      <li>
        <NavLink href="/principles">Principles</NavLink>
      </li>
    </Header.Nav>
    <Header.Actions>
      <Button asChild variant="primary">
        <a href="mailto:hello@pouk.ai">Contact</a>
      </Button>
    </Header.Actions>
  </Header>
);

/**
 * Bordered — always-on hairline bottom border.
 */
export const Bordered: Story = () => (
  <Header homeHref="/" bordered>
    <Header.Nav>
      <li>
        <NavLink href="/why-ai">Why AI</NavLink>
      </li>
      <li>
        <NavLink href="/roles">Roles</NavLink>
      </li>
    </Header.Nav>
  </Header>
);

/**
 * Constrained — inner band capped at --content-max.
 */
export const Constrained: Story = () => (
  <Header homeHref="/" bordered constrained>
    <Header.Nav>
      <li>
        <NavLink href="/why-ai">Why AI</NavLink>
      </li>
      <li>
        <NavLink href="/roles">Roles</NavLink>
      </li>
    </Header.Nav>
    <Header.Actions>
      <Button asChild variant="secondary">
        <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
      </Button>
    </Header.Actions>
  </Header>
);

/**
 * CustomLogo — brand slot overridden with a custom logo node.
 */
export const CustomLogo: Story = () => (
  <Header
    homeHref="/"
    logo={
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-body)",
          fontWeight: 600,
          color: "var(--fg)",
        }}
      >
        Acme Corp
      </span>
    }
    bordered
  >
    <Header.Nav>
      <li>
        <NavLink href="/products">Products</NavLink>
      </li>
      <li>
        <NavLink href="/about">About</NavLink>
      </li>
    </Header.Nav>
  </Header>
);

/**
 * Sticky — position: sticky with scroll-triggered hairline.
 * Scroll the page to see the border appear.
 */
export const Sticky: Story = () => (
  <div>
    <Header homeHref="/" sticky>
      <Header.Nav>
        <li>
          <NavLink href="/why-ai">Why AI</NavLink>
        </li>
        <li>
          <NavLink href="/roles">Roles</NavLink>
        </li>
      </Header.Nav>
      <Header.Actions>
        <Button asChild variant="primary">
          <a href="mailto:hello@pouk.ai">Contact</a>
        </Button>
      </Header.Actions>
    </Header>
    <div style={{ height: "200vh", padding: "var(--space-12) var(--page-pad)" }}>
      <p>Scroll down to see the sticky header border appear.</p>
    </div>
  </div>
);

/**
 * TwoActions — multiple items in the actions slot.
 */
export const TwoActions: Story = () => (
  <Header homeHref="/" bordered>
    <Header.Nav>
      <li>
        <NavLink href="/why-ai">Why AI</NavLink>
      </li>
      <li>
        <NavLink href="/roles" active>
          Roles
        </NavLink>
      </li>
      <li>
        <NavLink href="/principles">Principles</NavLink>
      </li>
    </Header.Nav>
    <Header.Actions>
      <Button variant="ghost">Log in</Button>
      <Button asChild variant="primary">
        <a href="mailto:hello@pouk.ai">Get started</a>
      </Button>
    </Header.Actions>
  </Header>
);
