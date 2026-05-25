/**
 * Accordion — compound collapsible-disclosure group.
 *
 * Compound API:
 *   Accordion.Root     — owns type, value, defaultValue, collapsible, tone
 *   Accordion.Item     — one trigger + content pair; carries a value string
 *   Accordion.Trigger  — full-width button row with trailing chevron
 *   Accordion.Content  — animated height-collapse panel
 *
 * Built on @radix-ui/react-accordion for keyboard navigation, ARIA wiring,
 * and prefers-reduced-motion support.
 *
 * @see meta/design/Accordion.md
 */

import {
  forwardRef,
  createContext,
  useContext,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
// Runtime destructuring — avoids Playwright CT bundler identifier collision
// (same pattern as Toast; see src/organisms/Toast/Toast.tsx for rationale).
import * as RadixAccordion from "@radix-ui/react-accordion";
const {
  Root: RadixRoot,
  Item: RadixItem,
  Header: RadixHeader,
  Trigger: RadixTrigger,
  Content: RadixContent,
} = RadixAccordion;
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import styles from "./Accordion.module.css";

/* ─── Tone context (Root → Content) ─────────────────────────────── */

export type AccordionTone = "default" | "tinted";

const ToneContext = createContext<AccordionTone>("default");

/* ─── Root ───────────────────────────────────────────────────────── */

/** Shared props that don't participate in the single/multiple discriminant. */
type AccordionRootBaseProps = {
  /** Content tone: default (--bg) or tinted (--surface) panels. Default "default". */
  tone?: AccordionTone;
  className?: string;
  children?: ReactNode;
};

/** Props for type="single" (default). */
export type AccordionRootSingleProps = AccordionRootBaseProps & {
  type?: "single";
  /** Controlled value. */
  value?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Change handler. */
  onValueChange?: (value: string) => void;
  /** Allow the open item to close. Default true. */
  collapsible?: boolean;
} & Omit<
    ComponentPropsWithoutRef<"div">,
    "type" | "value" | "defaultValue" | "onValueChange" | "dir"
  >;

/** Props for type="multiple". */
export type AccordionRootMultipleProps = AccordionRootBaseProps & {
  type: "multiple";
  /** Controlled values. */
  value?: string[];
  /** Uncontrolled default values. */
  defaultValue?: string[];
  /** Change handler. */
  onValueChange?: (value: string[]) => void;
} & Omit<
    ComponentPropsWithoutRef<"div">,
    "type" | "value" | "defaultValue" | "onValueChange" | "dir"
  >;

export type AccordionRootProps = AccordionRootSingleProps | AccordionRootMultipleProps;

const Root = forwardRef<HTMLDivElement, AccordionRootProps>(function AccordionRoot(props, ref) {
  const { tone = "default", className, children } = props;

  // Omit all Radix-controlled keys + our DS-only keys from the DOM spread.
  type SafeDomProps = Omit<
    ComponentPropsWithoutRef<"div">,
    | "type"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "collapsible"
    | "tone"
    | "dir"
    | "className"
    | "children"
  >;

  if (props.type === "multiple") {
    const multiProps = props as AccordionRootMultipleProps;
    const controlledProps = {
      ...(multiProps.value !== undefined && { value: multiProps.value }),
      ...(multiProps.defaultValue !== undefined && { defaultValue: multiProps.defaultValue }),
      ...(multiProps.onValueChange !== undefined && { onValueChange: multiProps.onValueChange }),
    };
    return (
      <ToneContext.Provider value={tone}>
        <RadixRoot
          ref={ref}
          type="multiple"
          {...controlledProps}
          className={clsx(styles.root, className)}
          {...(props as SafeDomProps)}
        >
          {children}
        </RadixRoot>
      </ToneContext.Provider>
    );
  }

  // type === "single" (default)
  const singleProps = props as AccordionRootSingleProps;
  const controlledProps = {
    ...(singleProps.value !== undefined && { value: singleProps.value }),
    ...(singleProps.defaultValue !== undefined && { defaultValue: singleProps.defaultValue }),
    ...(singleProps.onValueChange !== undefined && { onValueChange: singleProps.onValueChange }),
  };
  return (
    <ToneContext.Provider value={tone}>
      <RadixRoot
        ref={ref}
        type="single"
        collapsible={singleProps.collapsible ?? true}
        {...controlledProps}
        className={clsx(styles.root, className)}
        {...(props as SafeDomProps)}
      >
        {children}
      </RadixRoot>
    </ToneContext.Provider>
  );
});
Root.displayName = "Accordion.Root";

/* ─── Item ───────────────────────────────────────────────────────── */

export interface AccordionItemProps extends Omit<ComponentPropsWithoutRef<"div">, "value"> {
  /** Unique value identifying this item within the Root. Required. */
  value: string;
  /** Disables the trigger. Default false. */
  disabled?: boolean;
  children?: ReactNode;
}

const Item = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, disabled = false, className, children, ...rest },
  ref,
) {
  return (
    <RadixItem
      ref={ref}
      value={value}
      disabled={disabled}
      className={clsx(styles.item, className)}
      {...rest}
    >
      {children}
    </RadixItem>
  );
});
Item.displayName = "Accordion.Item";

/* ─── Trigger ────────────────────────────────────────────────────── */

export interface AccordionTriggerProps extends ComponentPropsWithoutRef<"button"> {
  /** Trigger label — the accessible name for this disclosure. Required. */
  children: ReactNode;
}

const Trigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(function AccordionTrigger(
  { className, children, ...rest },
  ref,
) {
  return (
    <RadixHeader className={styles.header} asChild={false}>
      <RadixTrigger ref={ref} className={clsx(styles.trigger, className)} {...rest}>
        <span className={styles.triggerLabel}>{children}</span>
        <ChevronDown size="var(--icon-sm)" aria-hidden="true" className={styles.chevron} />
      </RadixTrigger>
    </RadixHeader>
  );
});
Trigger.displayName = "Accordion.Trigger";

/* ─── Content ────────────────────────────────────────────────────── */

export interface AccordionContentProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
}

const Content = forwardRef<HTMLDivElement, AccordionContentProps>(function AccordionContent(
  { className, children, ...rest },
  ref,
) {
  const tone = useContext(ToneContext);
  return (
    <RadixContent
      ref={ref}
      className={clsx(styles.content, tone === "tinted" && styles.contentTinted, className)}
      {...rest}
    >
      <div className={styles.contentInner}>{children}</div>
    </RadixContent>
  );
});
Content.displayName = "Accordion.Content";

/* ─── Compound export ────────────────────────────────────────────── */

export const Accordion = { Root, Item, Trigger, Content };
