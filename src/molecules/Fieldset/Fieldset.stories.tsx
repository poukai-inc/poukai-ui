import type { Story, StoryDefault } from "@ladle/react";
import { Fieldset } from "./Fieldset";
import { Field } from "../Field/Field";
import { Input } from "../../atoms/Input/Input";

export default {
  title: "Components / Fieldset",
} satisfies StoryDefault;

/** Default — billing address composition with three Field children. */
export const Default: Story = () => (
  <div style={{ maxWidth: "28rem" }}>
    <Fieldset legend="Billing address">
      <Field label="Street" id="story-street">
        <Input placeholder="123 Main St" />
      </Field>
      <Field label="City" id="story-city">
        <Input placeholder="San Francisco" />
      </Field>
      <Field label="Postal code" id="story-postal">
        <Input placeholder="94105" />
      </Field>
    </Fieldset>
  </div>
);

/** WithPaymentBlock — bordered + spacious variant for a contained payment group. */
export const WithPaymentBlock: Story = () => (
  <div style={{ maxWidth: "28rem" }}>
    <Fieldset legend="Payment details" bordered spacing="spacious">
      <Field label="Card number" id="story-card">
        <Input placeholder="1234 5678 9012 3456" />
      </Field>
      <Field label="Expiry" id="story-expiry">
        <Input placeholder="MM / YY" />
      </Field>
      <Field label="CVC" id="story-cvc">
        <Input placeholder="123" />
      </Field>
    </Fieldset>
  </div>
);

/** MutedLegend — secondary section that should visually recede. */
export const MutedLegend: Story = () => (
  <div style={{ maxWidth: "28rem" }}>
    <Fieldset legend="Optional — notification preferences" legendTone="muted">
      <Field label="Email notifications" id="story-notif-email">
        <Input placeholder="you@example.com" />
      </Field>
      <Field label="SMS notifications" id="story-notif-sms">
        <Input placeholder="+1 555 000 0000" />
      </Field>
    </Fieldset>
  </div>
);

/** Disabled — all fields inside are disabled via native fieldset propagation. */
export const Disabled: Story = () => (
  <div style={{ maxWidth: "28rem" }}>
    <Fieldset legend="Shipping address" disabled>
      <Field label="Street" id="story-dis-street">
        <Input defaultValue="123 Main St" />
      </Field>
      <Field label="City" id="story-dis-city">
        <Input defaultValue="San Francisco" />
      </Field>
    </Fieldset>
  </div>
);
