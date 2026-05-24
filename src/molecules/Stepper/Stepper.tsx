import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./Stepper.module.css";

export type StepperOrientation = "horizontal" | "vertical";
export type StepperSize = "sm" | "md";

export interface StepDef {
  label: string;
}

export interface StepperProps extends ComponentPropsWithoutRef<"ol"> {
  /** Ordered step definitions. Label is the visible text below each marker. */
  steps: StepDef[];
  /** 0-based index of the active step. Steps before are complete; steps after are upcoming. */
  current: number;
  /** Layout direction. Default: "horizontal". */
  orientation?: StepperOrientation;
  /** "sm" reduces marker diameter and hides labels. Default: "md". */
  size?: StepperSize;
  /** Explicit override for label visibility. size="sm" sets this false by default. */
  showLabels?: boolean;
}

/**
 * Stepper — numbered step indicator for multi-step flows.
 *
 * Display-only. No interactive states, no click handlers, no hover styles.
 * Consumer's flow controller owns navigation between steps.
 *
 * A11y:
 *   - Root: <ol> — ordered sequence.
 *   - Active step: aria-current="step" on the active <li>.
 *   - Complete steps: checkmark icon (aria-hidden) + visually-hidden "(complete)" span.
 *   - Connectors: aria-hidden="true" — decorative.
 */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { steps, current, orientation = "horizontal", size = "md", showLabels, className, ...rest },
  ref,
) {
  const labelsVisible = showLabels !== undefined ? showLabels : size !== "sm";

  return (
    <ol
      ref={ref}
      className={clsx(styles.root, styles[orientation], styles[size], className)}
      {...rest}
    >
      {steps.map((step, index) => {
        const isComplete = index < current;
        const isActive = index === current;
        const isUpcoming = index > current;

        return (
          <li
            key={index}
            className={clsx(
              styles.step,
              isComplete && styles.complete,
              isActive && styles.active,
              isUpcoming && styles.upcoming,
            )}
            aria-current={isActive ? "step" : undefined}
          >
            {/* Connector before each step except the first */}
            {index > 0 && (
              <span
                className={clsx(styles.connector, isComplete && styles.connectorComplete)}
                aria-hidden="true"
              />
            )}

            <span className={styles.stepInner}>
              {/* Step marker: checkmark for complete, numeral for active/upcoming */}
              <span className={styles.marker} aria-hidden="true">
                {isComplete ? (
                  /* Checkmark SVG — aria-hidden because the <li> announces "(complete)" via visually-hidden span */
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <polyline
                      points="1.5,5.5 4,8 8.5,2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className={styles.numeral}>{index + 1}</span>
                )}
              </span>

              {/* Visually-hidden state suffix for screen readers */}
              {isComplete && <span className={styles.srOnly}>(complete)</span>}

              {/* Step label */}
              {labelsVisible && <span className={styles.label}>{step.label}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
});

Stepper.displayName = "Stepper";
