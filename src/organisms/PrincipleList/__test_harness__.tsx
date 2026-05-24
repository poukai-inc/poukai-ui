/**
 * Test harnesses for PrincipleList CT tests.
 *
 * Playwright CT cannot mount wrapper components defined inline inside
 * test files. Shared fixtures live here.
 */
import { PrincipleList } from "./PrincipleList";
import { Principle } from "../../molecules/Principle";

export const TwoPrinciples = () => (
  <PrincipleList heading="Our principles.">
    <Principle numeral="i." title="First principle.">
      <p>Body one.</p>
    </Principle>
    <Principle numeral="ii." title="Second principle.">
      <p>Body two.</p>
    </Principle>
  </PrincipleList>
);
