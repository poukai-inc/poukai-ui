import type { Story, StoryDefault } from "@ladle/react";
import { Sidebar } from "./Sidebar";
import { LinkList } from "../../molecules/LinkList/LinkList";

export default {
  title: "Organisms / Sidebar",
} satisfies StoryDefault;

const gettingStartedItems = (
  <>
    <LinkList.Item href="/docs/intro">Introduction</LinkList.Item>
    <LinkList.Item href="/docs/install">Installation</LinkList.Item>
    <LinkList.Item href="/docs/quickstart">Quick start</LinkList.Item>
  </>
);

const componentsItems = (
  <>
    <LinkList.Item href="/docs/button" current>
      Button
    </LinkList.Item>
    <LinkList.Item href="/docs/heading">Heading</LinkList.Item>
    <LinkList.Item href="/docs/link">Link</LinkList.Item>
    <LinkList.Item href="/docs/icon">Icon</LinkList.Item>
  </>
);

const advancedItems = (
  <>
    <LinkList.Item href="/docs/theming">Theming</LinkList.Item>
    <LinkList.Item href="/docs/tokens">Design tokens</LinkList.Item>
    <LinkList.Item href="/docs/contributing">Contributing</LinkList.Item>
  </>
);

export const Default: Story = () => (
  <div style={{ width: "240px", padding: "var(--space-4)" }}>
    <Sidebar>
      <Sidebar.Group heading="Getting started">{gettingStartedItems}</Sidebar.Group>
    </Sidebar>
  </div>
);

export const GroupedSections: Story = () => (
  <div style={{ width: "240px", padding: "var(--space-4)" }}>
    <Sidebar>
      <Sidebar.Group heading="Getting started">{gettingStartedItems}</Sidebar.Group>
      <Sidebar.Group heading="Components">{componentsItems}</Sidebar.Group>
      <Sidebar.Group heading="Advanced">{advancedItems}</Sidebar.Group>
    </Sidebar>
  </div>
);

export const NoGroupHeadings: Story = () => (
  <div style={{ width: "240px", padding: "var(--space-4)" }}>
    <Sidebar>
      <Sidebar.Group>{gettingStartedItems}</Sidebar.Group>
    </Sidebar>
  </div>
);

export const CollapsibleGroups: Story = () => (
  <div style={{ width: "240px", padding: "var(--space-4)" }}>
    <Sidebar>
      <Sidebar.Group heading="Getting started" collapsible defaultOpen>
        {gettingStartedItems}
      </Sidebar.Group>
      <Sidebar.Group heading="Components" collapsible defaultOpen={false}>
        {componentsItems}
      </Sidebar.Group>
      <Sidebar.Group heading="Advanced" collapsible>
        {advancedItems}
      </Sidebar.Group>
    </Sidebar>
  </div>
);

export const NonSticky: Story = () => (
  <div style={{ width: "240px", padding: "var(--space-4)" }}>
    <Sidebar sticky={false}>
      <Sidebar.Group heading="Getting started">{gettingStartedItems}</Sidebar.Group>
      <Sidebar.Group heading="Components">{componentsItems}</Sidebar.Group>
    </Sidebar>
  </div>
);

export const CustomLabel: Story = () => (
  <div style={{ width: "240px", padding: "var(--space-4)" }}>
    <Sidebar label="Documentation navigation">
      <Sidebar.Group heading="Getting started">{gettingStartedItems}</Sidebar.Group>
    </Sidebar>
  </div>
);
