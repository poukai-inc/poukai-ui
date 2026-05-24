import type { Story, StoryDefault } from "@ladle/react";
import { Breadcrumb } from "./Breadcrumb";

export default {
  title: "Components / Breadcrumb",
} satisfies StoryDefault;

/** Default — 3-level compound usage.
 *  Verifies: nav landmark, ol > li structure, ancestor links, current item (plain text). */
export const Default: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Breadcrumb>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item href="/dashboard/pages">Pages</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>
  </div>
);

/** DeepNested — 5-level trail to test separator rhythm at depth.
 *  Verifies: 4 separators between 5 items, wrapping behavior on narrow viewports. */
export const DeepNested: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Breadcrumb>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item href="/dashboard/autopost">Autopost</Breadcrumb.Item>
      <Breadcrumb.Item href="/dashboard/autopost/pages">Pages</Breadcrumb.Item>
      <Breadcrumb.Item href="/dashboard/autopost/pages/my-page">My Page</Breadcrumb.Item>
      <Breadcrumb.Item current>Edit</Breadcrumb.Item>
    </Breadcrumb>
  </div>
);

/** WithDataDrivenItems — items prop API (data-driven alias).
 *  Verifies: items array renders equivalent output to compound children API. */
export const WithDataDrivenItems: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Breadcrumb
      items={[
        { href: "/dashboard", label: "Dashboard" },
        { href: "/dashboard/pages", label: "Pages" },
        { label: "Settings", current: true },
      ]}
    />
  </div>
);

/** DashboardComposition — realistic dashboard shell context.
 *  Verifies: breadcrumb sits above a page heading without competing with the H1 hierarchy. */
export const DashboardComposition: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
      maxWidth: "var(--content-max)",
    }}
  >
    <Breadcrumb>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item href="/dashboard/autopost">Autopost</Breadcrumb.Item>
      <Breadcrumb.Item current>Data Sources</Breadcrumb.Item>
    </Breadcrumb>
    <h1
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-h2)",
        color: "var(--fg)",
        margin: 0,
      }}
    >
      Data Sources
    </h1>
    <p
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-body)",
        color: "var(--fg-muted)",
        margin: 0,
      }}
    >
      Connect your RSS feeds, social accounts, and newsletters to power Autopost scheduling.
    </p>
  </div>
);

/** CustomSeparator — pipe character separator override.
 *  Verifies: separator prop accepts ReactNode, renders custom char between items. */
export const CustomSeparator: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Breadcrumb separator="/">
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item href="/dashboard/pages">Pages</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>
  </div>
);
