import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Form } from "./Form";
import { Field } from "../../molecules/Field";
import { Input } from "../../molecules/Input";
import { Textarea } from "../../molecules/Textarea";
import { Button } from "../../atoms/Button";

export default {
  title: "Components / Form",
} satisfies StoryDefault;

/* ─── Simple — single Field + Input ────────────────────────── */

export const Simple: Story = () => (
  <Form onSubmit={(data) => console.log([...data.entries()])}>
    <Field label="Email address" id="simple-email" helper="We'll never share your email.">
      <Input type="email" name="email" placeholder="you@example.com" />
    </Field>
    <Button variant="primary" type="submit">
      Subscribe
    </Button>
  </Form>
);

/* ─── MultiField — email + name + message ───────────────────── */

export const MultiField: Story = () => (
  <Form onSubmit={(data) => console.log([...data.entries()])}>
    <Field label="Full name" id="multi-name" required>
      <Input name="name" placeholder="Arian Zargaran" />
    </Field>
    <Field
      label="Email address"
      id="multi-email"
      required
      helper="We'll reach out within 48 hours."
    >
      <Input type="email" name="email" placeholder="you@example.com" />
    </Field>
    <Field label="Message" id="multi-message" helper="Tell us about your project.">
      <Textarea name="message" placeholder="What are you working on?" rows={5} />
    </Field>
    <Button variant="primary" type="submit">
      Send message
    </Button>
  </Form>
);

/* ─── WithSubmitLog — logs FormData entries to a story arg ──── */

export const WithSubmitLog: Story = () => {
  const [log, setLog] = useState<string>("");

  function handleSubmit(data: FormData) {
    const entries = [...data.entries()].map(([k, v]) => `${k}: ${v}`).join("\n");
    setLog(entries || "(no named fields)");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <Form onSubmit={handleSubmit}>
        <Field label="Name" id="log-name">
          <Input name="name" placeholder="Arian Zargaran" />
        </Field>
        <Field label="Email" id="log-email">
          <Input type="email" name="email" placeholder="you@example.com" />
        </Field>
        <Button variant="primary" type="submit">
          Submit and log
        </Button>
      </Form>
      {log && (
        <pre
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-meta)",
            color: "var(--fg-muted)",
            background: "var(--surface)",
            padding: "var(--space-4)",
            borderRadius: "var(--radius-2)",
            margin: 0,
          }}
        >
          {log}
        </pre>
      )}
    </div>
  );
};

/* ─── WithErrorState — one field in error state ─────────────── */

export const WithErrorState: Story = () => (
  <Form onSubmit={(data) => console.log([...data.entries()])}>
    <Field label="Email address" id="err-email" error="Please enter a valid email address.">
      <Input type="email" name="email" defaultValue="not-an-email" />
    </Field>
    <Field label="Message" id="err-message">
      <Textarea name="message" placeholder="Tell us about your project…" />
    </Field>
    <Button variant="primary" type="submit">
      Submit
    </Button>
  </Form>
);
