import type { Story, StoryDefault } from "@ladle/react";
import { Button, type ButtonVariant, type ButtonSize } from "./Button";

export default {
  title: "Components / Button",
  args: { variant: "primary", size: "md", children: "Get in touch" },
  argTypes: {
    variant: {
      options: ["primary", "secondary", "ghost"] satisfies ButtonVariant[],
      control: { type: "radio" },
      defaultValue: "primary",
    },
    size: {
      options: ["sm", "md", "lg"] satisfies ButtonSize[],
      control: { type: "radio" },
      defaultValue: "md",
    },
  },
} satisfies StoryDefault;

export const Playground: Story<{
  variant: ButtonVariant;
  size: ButtonSize;
  children: string;
}> = ({ variant, size, children }) => (
  <Button variant={variant} size={size}>
    {children}
  </Button>
);

export const VariantsAndSizes: Story = () => {
  const variants: ButtonVariant[] = ["primary", "secondary", "ghost"];
  const sizes: ButtonSize[] = ["sm", "md", "lg"];
  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        {variants.map((v) => (
          <tr key={v}>
            <th
              style={{
                textAlign: "left",
                padding: "var(--space-2) var(--space-4)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--fs-micro)",
                color: "var(--fg-muted)",
              }}
            >
              {v}
            </th>
            {sizes.map((s) => (
              <td key={s} style={{ padding: "var(--space-2)" }}>
                <Button variant={v} size={s}>
                  Get in touch
                </Button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const AsLink: Story = () => (
  <Button asChild>
    <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
  </Button>
);

export const Disabled: Story = () => <Button disabled>Disabled</Button>;
