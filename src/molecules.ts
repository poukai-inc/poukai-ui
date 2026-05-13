/**
 * @poukai/ui/molecules — subpath entry.
 *
 * Composite components that combine atoms into a self-contained unit of
 * meaning. Importing this subpath also pulls the atoms each molecule
 * actually uses internally (Hero / RoleCard / Principle / FailureMode
 * currently use none — they rely on caller-provided slots).
 */
export { Hero, type HeroProps, type HeroAlign } from "./molecules/Hero";
export { RoleCard, type RoleCardProps } from "./molecules/RoleCard";
export { Principle, type PrincipleProps } from "./molecules/Principle";
export { FailureMode, type FailureModeProps } from "./molecules/FailureMode";
