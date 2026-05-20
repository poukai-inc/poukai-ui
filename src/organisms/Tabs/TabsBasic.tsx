/**
 * TabsBasic — convenience wrapper for the common case.
 *
 * Composes Tabs compound subcomponents into a data-driven tabbed interface.
 * Consumers who need full composition control use the Tabs compound API directly.
 *
 * @see meta/design/Tabs.md §2
 */

import { forwardRef, type ReactNode } from "react";
import clsx from "clsx";
import { Tabs } from "./Tabs";

export interface TabItem {
  /** Unique value identifying this tab and its content panel. */
  value: string;
  /** Visible label rendered inside the tab trigger button. */
  label: string;
  /** Content rendered in the associated panel when this tab is active. */
  content: ReactNode;
}

export interface TabsBasicProps {
  /** Tab definitions. Each item maps a trigger label to a content panel. */
  tabs: TabItem[];
  /** Uncontrolled: which tab is active on first render. Defaults to the first tab's value. */
  defaultValue?: string;
  /** Controlled active tab value. Pair with onValueChange. */
  value?: string;
  onValueChange?: (value: string) => void;
  /** Tab layout orientation. Default "horizontal". */
  orientation?: "horizontal" | "vertical";
  /** className forwarded to Tabs.Root for layout overrides. */
  className?: string;
}

export const TabsBasic = forwardRef<HTMLDivElement, TabsBasicProps>(function TabsBasic(
  { tabs, defaultValue, value, onValueChange, orientation = "horizontal", className },
  ref,
) {
  const resolvedDefault = defaultValue ?? tabs[0]?.value;

  const rootProps = {
    ...(resolvedDefault !== undefined && { defaultValue: resolvedDefault }),
    ...(value !== undefined && { value }),
    ...(onValueChange !== undefined && { onValueChange }),
  };

  return (
    <Tabs.Root ref={ref} orientation={orientation} className={clsx(className)} {...rootProps}>
      <Tabs.List>
        {tabs.map((tab) => (
          <Tabs.Trigger key={tab.value} value={tab.value}>
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {tabs.map((tab) => (
        <Tabs.Content key={tab.value} value={tab.value}>
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
});

TabsBasic.displayName = "TabsBasic";
