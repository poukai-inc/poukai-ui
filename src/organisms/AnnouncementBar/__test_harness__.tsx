import { AnnouncementBar, type AnnouncementBarProps } from "./AnnouncementBar";

/**
 * Test harness for AnnouncementBar.test.tsx.
 *
 * Lives in its own module because Playwright CT requires every component
 * mounted to be defined outside the test file. Inline test-file component
 * definitions produce "Component X cannot be mounted" errors at runtime.
 */

/** Renders AnnouncementBar with a unique id so localStorage state is isolated. */
export function Harness(props: Omit<AnnouncementBarProps, "id"> & { id?: string }) {
  return <AnnouncementBar id={props.id ?? "harness-default"} {...props} />;
}
