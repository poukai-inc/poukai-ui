/**
 * Test fixtures for Icon.
 *
 * Playwright CT serializes props passed via `mount()`, which means component
 * references (like `Mail` from `lucide-react`) cannot survive the boundary —
 * passing them as `icon={Mail}` from a test file results in React error #130
 * at runtime. The fix: bind the icon component inside this non-test module
 * and expose a string-keyed wrapper. Tests reference the wrapper and pass a
 * serializable `name` string.
 */
import { Mail, Heart, type LucideIcon } from "lucide-react";
import { Icon, type IconProps } from "./Icon";

const ICONS: Record<string, LucideIcon> = {
  mail: Mail,
  heart: Heart,
};

export type IconFixtureName = keyof typeof ICONS;

export interface IconFixtureProps extends Omit<IconProps, "icon"> {
  name: IconFixtureName;
}

/**
 * Test-only wrapper. Looks up a Lucide icon by string name and renders Icon.
 * Used in Playwright CT tests to avoid component-as-prop serialization issues.
 */
export function IconFixture({ name, ...rest }: IconFixtureProps) {
  const Lucide = ICONS[name] ?? Mail;
  return <Icon icon={Lucide} {...rest} />;
}
