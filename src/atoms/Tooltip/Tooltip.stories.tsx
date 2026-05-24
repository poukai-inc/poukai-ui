import type { Story, StoryDefault } from "@ladle/react";
import { TooltipProvider, Tooltip } from "./Tooltip";

export default {
  title: "Atoms / Tooltip",
} satisfies StoryDefault;

const Provider = ({ children }: { children: React.ReactNode }) => (
  <TooltipProvider>
    <div style={{ padding: "4rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      {children}
    </div>
  </TooltipProvider>
);

export const Default: Story = () => (
  <Provider>
    <Tooltip content="This is a tooltip">
      <button type="button">Hover me</button>
    </Tooltip>
  </Provider>
);

export const OnIconButton: Story = () => (
  <Provider>
    <Tooltip content="Settings">
      <button
        type="button"
        aria-label="Settings"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: "var(--radius-2)",
          border: "var(--hairline-w) solid var(--hairline)",
          background: "var(--surface)",
          cursor: "pointer",
        }}
      >
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        </svg>
      </button>
    </Tooltip>
  </Provider>
);

export const LongContent: Story = () => (
  <Provider>
    <Tooltip content="This tooltip has a slightly longer label — still within the 80-char guideline">
      <button type="button">Long label</button>
    </Tooltip>
  </Provider>
);

export const WithDelay: Story = () => (
  <TooltipProvider delayDuration={0}>
    <div style={{ padding: "4rem" }}>
      <Tooltip content="Opens immediately (delayDuration=0)" delayDuration={0}>
        <button type="button">No delay</button>
      </Tooltip>
    </div>
  </TooltipProvider>
);
