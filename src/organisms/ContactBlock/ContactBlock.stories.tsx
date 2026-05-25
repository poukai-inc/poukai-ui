import type { Story, StoryDefault } from "@ladle/react";
import { ContactBlock } from "./ContactBlock";
import { StatusBadge } from "../../atoms/StatusBadge";
import { Button } from "../../atoms/Button";

export default {
  title: "Components / ContactBlock",
} satisfies StoryDefault;

export const Default: Story = () => <ContactBlock email="hello@pouk.ai" />;

export const WithHeading: Story = () => (
  <ContactBlock heading="Get in touch" email="hello@pouk.ai" />
);

export const WithStatus: Story = () => (
  <ContactBlock
    email="hello@pouk.ai"
    status={<StatusBadge status="available">Open for projects.</StatusBadge>}
  />
);

export const WithActions: Story = () => (
  <ContactBlock
    email="hello@pouk.ai"
    actions={
      <Button asChild>
        <a href="/book">Book a call</a>
      </Button>
    }
  />
);

export const WithEmailLabel: Story = () => (
  <ContactBlock email="hello@pouk.ai" emailLabel="Say hello" />
);

export const FullComposition: Story = () => (
  <ContactBlock
    heading="Get in touch"
    email="hello@pouk.ai"
    emailLabel="Say hello"
    status={<StatusBadge status="available">Open for projects.</StatusBadge>}
    actions={
      <>
        <Button asChild>
          <a href="/book">Book a call</a>
        </Button>
        <Button variant="secondary" asChild>
          <a href="/roles">See all roles</a>
        </Button>
      </>
    }
  />
);

export const Idle: Story = () => (
  <ContactBlock
    heading="Get in touch"
    email="hello@pouk.ai"
    status={<StatusBadge status="idle">Checking availability.</StatusBadge>}
  />
);

export const Closed: Story = () => (
  <ContactBlock
    heading="Get in touch"
    email="hello@pouk.ai"
    status={<StatusBadge status="closed">Not taking new work.</StatusBadge>}
  />
);
