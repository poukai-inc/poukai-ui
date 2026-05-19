import type { Story, StoryDefault } from "@ladle/react";
import { Avatar, type AvatarSize, type AvatarShape } from "./Avatar";

export default {
  title: "Components / Avatar",
  args: {
    size: "md",
    shape: "circle",
  },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"] satisfies AvatarSize[],
      control: { type: "radio" },
      defaultValue: "md",
    },
    shape: {
      options: ["circle", "square"] satisfies AvatarShape[],
      control: { type: "radio" },
      defaultValue: "circle",
    },
  },
} satisfies StoryDefault;

export const Image: Story<{ size: AvatarSize; shape: AvatarShape }> = ({ size, shape }) => (
  <Avatar
    mode="image"
    src="https://picsum.photos/seed/avatar-story/80/80"
    alt="Story person — headshot"
    size={size}
    shape={shape}
  />
);

export const Initials: Story<{ size: AvatarSize; shape: AvatarShape }> = ({ size, shape }) => (
  <Avatar mode="initials" initials="AZ" name="Arian Zargaran" size={size} shape={shape} />
);

export const Empty: Story<{ size: AvatarSize; shape: AvatarShape }> = ({ size, shape }) => (
  <Avatar name="Unknown person" size={size} shape={shape} />
);

export const AllSizes: Story = () => {
  const sizes: AvatarSize[] = ["sm", "md", "lg"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
      {sizes.map((s) => (
        <Avatar key={s} mode="initials" initials="AZ" name="Arian Zargaran" size={s} />
      ))}
    </div>
  );
};

export const AllShapes: Story = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
    <Avatar mode="initials" initials="AZ" name="Arian Zargaran" shape="circle" />
    <Avatar mode="initials" initials="AZ" name="Arian Zargaran" shape="square" />
  </div>
);

export const ImageAllSizes: Story = () => {
  const sizes: AvatarSize[] = ["sm", "md", "lg"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
      {sizes.map((s) => (
        <Avatar
          key={s}
          mode="image"
          src="https://picsum.photos/seed/avatar-story/80/80"
          alt="Story person"
          size={s}
        />
      ))}
    </div>
  );
};

export const EmptyAllSizes: Story = () => {
  const sizes: AvatarSize[] = ["sm", "md", "lg"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
      {sizes.map((s) => (
        <Avatar key={s} name="Unknown person" size={s} />
      ))}
    </div>
  );
};
