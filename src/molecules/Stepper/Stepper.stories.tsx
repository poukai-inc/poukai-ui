import type { Story, StoryDefault } from "@ladle/react";
import { Stepper } from "./Stepper";

export default {
  title: "Molecules / Stepper",
} satisfies StoryDefault;

const THREE_STEPS = [{ label: "Account" }, { label: "Profile" }, { label: "Confirm" }];

const FOUR_STEPS = [
  { label: "Select plan" },
  { label: "Payment" },
  { label: "Review" },
  { label: "Launch" },
];

/** Default — three steps, step 1 (index 0) active.
 *  Verifies: upcoming states for steps 2 and 3, active ring on step 1, horizontal layout. */
export const Default: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Stepper steps={THREE_STEPS} current={0} />
  </div>
);

/** ThreeSteps_MiddleActive — step 2 active, step 1 complete.
 *  Verifies: checkmark on complete, accent ring on active, upcoming for step 3. */
export const ThreeSteps_MiddleActive: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Stepper steps={THREE_STEPS} current={1} />
  </div>
);

/** ThreeSteps_LastActive — steps 1 and 2 complete, step 3 active.
 *  Verifies: two complete checkmarks, active ring on last step. */
export const ThreeSteps_LastActive: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Stepper steps={THREE_STEPS} current={2} />
  </div>
);

/** FourSteps_SecondActive — four steps, step 2 active.
 *  Verifies: connector layout across four steps. */
export const FourSteps_SecondActive: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Stepper steps={FOUR_STEPS} current={1} />
  </div>
);

/** FourSteps_ThirdActive — four steps, step 3 active.
 *  Verifies: two complete, one active, one upcoming. */
export const FourSteps_ThirdActive: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Stepper steps={FOUR_STEPS} current={2} />
  </div>
);

/** AllThreeStates — three-step stepper with current=1, so all three states (complete/active/upcoming) are visible simultaneously. */
export const AllThreeStates: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Stepper steps={THREE_STEPS} current={1} />
  </div>
);

/** SizeSmall — sm size, labels hidden by default. */
export const SizeSmall: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Stepper steps={THREE_STEPS} current={1} size="sm" />
  </div>
);

/** SizeMediumNoLabels — md size with showLabels=false. */
export const SizeMediumNoLabels: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Stepper steps={THREE_STEPS} current={1} size="md" showLabels={false} />
  </div>
);

/** Vertical — three steps in vertical orientation, step 2 active. */
export const Vertical: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Stepper steps={THREE_STEPS} current={1} orientation="vertical" />
  </div>
);
