import { Copy, Heart, X } from "lucide-react";
import { IconButton, type IconButtonProps } from "./IconButton";

export type IconButtonFixtureProps = Omit<IconButtonProps, "icon">;

export function IconButtonFixture(props: IconButtonFixtureProps) {
  return <IconButton icon={X} {...props} />;
}

export function IconButtonVariantFixture() {
  return (
    <div>
      <IconButton icon={X} aria-label="Close (primary)" variant="primary" />
      <IconButton icon={Copy} aria-label="Copy (secondary)" variant="secondary" />
      <IconButton icon={Heart} aria-label="Favourite (ghost)" variant="ghost" />
    </div>
  );
}

export function IconButtonSizeFixture() {
  return (
    <div>
      <IconButton icon={X} aria-label="Close (sm)" size="sm" />
      <IconButton icon={X} aria-label="Close (compact)" size="compact" />
      <IconButton icon={X} aria-label="Close (md)" size="md" />
      <IconButton icon={X} aria-label="Close (lg)" size="lg" />
    </div>
  );
}
