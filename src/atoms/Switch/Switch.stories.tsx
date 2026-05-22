import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Switch, type SwitchProps } from "./Switch";

export default {
  title: "Components / Switch",
} satisfies StoryDefault;

export const Off: Story = () => <Switch aria-label="Off switch" />;

export const On: Story = () => <Switch aria-label="On switch" defaultChecked />;

export const Controlled: Story = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-body)",
        color: "var(--fg)",
      }}
    >
      <Switch id="controlled" checked={enabled} onCheckedChange={setEnabled} />
      <label htmlFor="controlled">{enabled ? "On" : "Off"}</label>
    </div>
  );
};

export const Uncontrolled: Story = () => <Switch aria-label="Uncontrolled" defaultChecked />;

export const DisabledOff: Story = () => <Switch aria-label="Disabled off" disabled />;

export const DisabledOn: Story = () => <Switch aria-label="Disabled on" disabled defaultChecked />;

export const WithLabel: Story = () => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-2)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--fg)",
    }}
  >
    <Switch id="notifications" defaultChecked />
    <label htmlFor="notifications">Enable notifications</label>
  </div>
);
