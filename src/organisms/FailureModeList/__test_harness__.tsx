import { FailureModeList } from "./FailureModeList";
import { FailureMode } from "../../molecules/FailureMode";

/**
 * Test harnesses for FailureModeList.test.tsx.
 *
 * Lives in its own module because Playwright CT requires every component
 * mounted (including the children of `mount()`) to be defined outside
 * the test file. Inline test-file components produce
 * "Component X cannot be mounted" errors at runtime.
 */

export function TwoItems() {
  return (
    <FailureModeList heading="How this breaks">
      <FailureMode index={1} title="First failure mode.">
        <p>Body text one.</p>
      </FailureMode>
      <FailureMode index={2} title="Second failure mode.">
        <p>Body text two.</p>
      </FailureMode>
    </FailureModeList>
  );
}

export function WithAllSlots() {
  return (
    <FailureModeList
      eyebrow="Where things fail"
      heading="How this breaks"
      lede="Supporting copy for the section."
    >
      <FailureMode index={1} title="Failure one.">
        <p>Details.</p>
      </FailureMode>
    </FailureModeList>
  );
}
