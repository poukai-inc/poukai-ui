import type { Story, StoryDefault } from "@ladle/react";
import * as RadixToastModule from "@radix-ui/react-toast";
const ToastProvider = RadixToastModule.Provider;
const ToastViewport = RadixToastModule.Viewport;
import { ToastItem } from "./ToastItem";

export default {
  title: "Components / ToastItem",
} satisfies StoryDefault;

const viewportStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "1.5rem",
  right: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  width: "min(420px, calc(100vw - 3rem))",
  listStyle: "none",
  margin: 0,
  padding: 0,
  zIndex: 200,
  outline: "none",
};

const padStyle: React.CSSProperties = {
  background: "var(--bg)",
  padding: "var(--space-8) var(--space-4)",
  minHeight: "12rem",
};

/** Info — default tone. */
export const Info: Story = () => (
  <div style={padStyle}>
    <ToastProvider>
      <ToastItem tone="info" open duration={60000}>
        <ToastItem.Title>Note</ToastItem.Title>
        <ToastItem.Description>Your session will expire in 15 minutes.</ToastItem.Description>
        <ToastItem.Close />
      </ToastItem>
      <ToastViewport style={viewportStyle} />
    </ToastProvider>
  </div>
);

/** Success — accent left-rule. */
export const Success: Story = () => (
  <div style={padStyle}>
    <ToastProvider>
      <ToastItem tone="success" open duration={60000}>
        <ToastItem.Title>Saved</ToastItem.Title>
        <ToastItem.Description>Your changes have been saved.</ToastItem.Description>
        <ToastItem.Close />
      </ToastItem>
      <ToastViewport style={viewportStyle} />
    </ToastProvider>
  </div>
);

/** Warning — amber surface, assertive live region. */
export const Warning: Story = () => (
  <div style={padStyle}>
    <ToastProvider>
      <ToastItem tone="warning" open duration={60000}>
        <ToastItem.Title>Trial ending</ToastItem.Title>
        <ToastItem.Description>
          Your trial ends in 3 days. Upgrade to keep access.
        </ToastItem.Description>
        <ToastItem.Close />
      </ToastItem>
      <ToastViewport style={viewportStyle} />
    </ToastProvider>
  </div>
);

/** Danger — red surface, assertive live region. */
export const Danger: Story = () => (
  <div style={padStyle}>
    <ToastProvider>
      <ToastItem tone="danger" open duration={60000}>
        <ToastItem.Title>Payment failed</ToastItem.Title>
        <ToastItem.Description>Please check your card details and try again.</ToastItem.Description>
        <ToastItem.Close />
      </ToastItem>
      <ToastViewport style={viewportStyle} />
    </ToastProvider>
  </div>
);

/** With Action — inline action button alongside close. */
export const WithAction: Story = () => (
  <div style={padStyle}>
    <ToastProvider>
      <ToastItem tone="danger" open duration={60000}>
        <ToastItem.Description>Deployment failed.</ToastItem.Description>
        <ToastItem.Action altText="Retry the deployment">Retry</ToastItem.Action>
        <ToastItem.Close />
      </ToastItem>
      <ToastViewport style={viewportStyle} />
    </ToastProvider>
  </div>
);

/** Description only — no title. */
export const DescriptionOnly: Story = () => (
  <div style={padStyle}>
    <ToastProvider>
      <ToastItem tone="success" open duration={60000}>
        <ToastItem.Description>Profile updated successfully.</ToastItem.Description>
        <ToastItem.Close />
      </ToastItem>
      <ToastViewport style={viewportStyle} />
    </ToastProvider>
  </div>
);

/** All four tones stacked. */
export const AllTones: Story = () => (
  <div style={padStyle}>
    <ToastProvider>
      <ToastItem tone="info" open duration={60000}>
        <ToastItem.Title>Info</ToastItem.Title>
        <ToastItem.Description>Informational message.</ToastItem.Description>
        <ToastItem.Close />
      </ToastItem>
      <ToastItem tone="success" open duration={60000}>
        <ToastItem.Title>Success</ToastItem.Title>
        <ToastItem.Description>Operation completed.</ToastItem.Description>
        <ToastItem.Close />
      </ToastItem>
      <ToastItem tone="warning" open duration={60000}>
        <ToastItem.Title>Warning</ToastItem.Title>
        <ToastItem.Description>Something needs attention.</ToastItem.Description>
        <ToastItem.Close />
      </ToastItem>
      <ToastItem tone="danger" open duration={60000}>
        <ToastItem.Title>Error</ToastItem.Title>
        <ToastItem.Description>Something went wrong.</ToastItem.Description>
        <ToastItem.Close />
      </ToastItem>
      <ToastViewport style={viewportStyle} />
    </ToastProvider>
  </div>
);
