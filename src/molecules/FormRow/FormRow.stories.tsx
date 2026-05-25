import type { Story, StoryDefault } from "@ladle/react";
import { FormRow } from "./FormRow";
import { Field } from "../Field/Field";
import { Input } from "../Input/Input";

export default {
  title: "Molecules / FormRow",
} satisfies StoryDefault;

/** (a) Default — first name / last name side-by-side. */
export const Default: Story = () => (
  <div style={{ maxWidth: "40rem" }}>
    <FormRow>
      <Field label="First name" id="story-first-name">
        <Input placeholder="Arian" />
      </Field>
      <Field label="Last name" id="story-last-name">
        <Input placeholder="Zargaran" />
      </Field>
    </FormRow>
  </div>
);

/** (b) Triple — city / state / zip. */
export const Triple: Story = () => (
  <div style={{ maxWidth: "40rem" }}>
    <FormRow columns={3}>
      <Field label="City" id="story-city">
        <Input placeholder="San Francisco" />
      </Field>
      <Field label="State" id="story-state">
        <Input placeholder="CA" />
      </Field>
      <Field label="ZIP" id="story-zip">
        <Input placeholder="94103" />
      </Field>
    </FormRow>
  </div>
);

/** (c) Tight gap — utility-dense context (address line). */
export const TightGap: Story = () => (
  <div style={{ maxWidth: "40rem" }}>
    <FormRow gap="tight">
      <Field label="Address line 1" id="story-addr1">
        <Input placeholder="123 Main St" />
      </Field>
      <Field label="Address line 2" id="story-addr2">
        <Input placeholder="Suite 100" />
      </Field>
    </FormRow>
  </div>
);

/** (d) Responsive narrow — shows stacked layout at narrow viewport.
 *  Resize the preview pane below ~768px to see the collapse. */
export const ResponsiveNarrow: Story = () => (
  <div style={{ maxWidth: "22rem" }}>
    <FormRow>
      <Field label="First name" id="story-narrow-first">
        <Input placeholder="Arian" />
      </Field>
      <Field label="Last name" id="story-narrow-last">
        <Input placeholder="Zargaran" />
      </Field>
    </FormRow>
  </div>
);
