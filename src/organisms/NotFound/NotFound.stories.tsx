import type { Story, StoryDefault } from "@ladle/react";
import { NotFound } from "./NotFound";

export default {
  title: "organisms/NotFound",
} satisfies StoryDefault;

export const Default: Story = () => <NotFound />;

export const WithSuggestions: Story = () => (
  <NotFound
    suggestions={[
      { label: "Home", href: "/" },
      { label: "Why AI", href: "/why-ai" },
      { label: "Roles", href: "/roles" },
    ]}
  />
);

export const CustomHeadline: Story = () => (
  <NotFound
    headline="This role doesn't exist."
    description="The URL may have changed or this role was removed."
    homeLabel="Back to roles"
    homeHref="/roles"
  />
);

export const ManyProps: Story = () => (
  <NotFound
    homeHref="/dashboard"
    headline="Dashboard page not found."
    description="The dashboard page you requested has been moved or no longer exists."
    homeLabel="Go to dashboard"
    suggestions={[
      { label: "Home", href: "/" },
      { label: "Overview", href: "/dashboard/overview" },
      { label: "Settings", href: "/dashboard/settings" },
    ]}
  />
);
