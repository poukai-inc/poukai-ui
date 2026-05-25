import React, {
  forwardRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useId,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from "react";
import clsx from "clsx";
import styles from "./DatePicker.module.css";

/* ─── helpers ───────────────────────────────────────────────────────────── */

const DAY_ABBRS: readonly { abbr: string; full: string }[] = [
  { abbr: "Su", full: "Sunday" },
  { abbr: "Mo", full: "Monday" },
  { abbr: "Tu", full: "Tuesday" },
  { abbr: "We", full: "Wednesday" },
  { abbr: "Th", full: "Thursday" },
  { abbr: "Fr", full: "Friday" },
  { abbr: "Sa", full: "Saturday" },
];

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Format a Date using Intl.DateTimeFormat.
 * Supports the canonical spec format "MMM d, yyyy" via option mapping.
 * Falls back to `toLocaleDateString` for unrecognised format strings so
 * consumers can supply a `formatFn` override instead.
 */
function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function monthYearLabel(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

/* ─── types ─────────────────────────────────────────────────────────────── */

export interface DatePickerProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  /** Controlled selected date. */
  value?: Date | null;
  /** Uncontrolled initial date. */
  defaultValue?: Date | null;
  /** Fires on day selection with the new date, or null if cleared. */
  onValueChange?: (date: Date | null) => void;
  /** Disables days before this date. */
  min?: Date;
  /** Disables days after this date. */
  max?: Date;
  /** Disables trigger and all interaction. @default false */
  disabled?: boolean;
  /** Intl locale for day/month names and display format. @default "en-US" */
  locale?: string;
  /**
   * Display format hint. Currently the component uses `Intl.DateTimeFormat`
   * (no custom mini-parser). Consumers who need full format control can supply
   * `formatFn` instead. This prop is accepted for API forward-compatibility
   * but its value is not parsed — the Intl formatter always produces
   * the canonical "MMM d, yyyy" equivalent for the given locale.
   * @default "MMM d, yyyy"
   */
  format?: string;
  /**
   * Optional format function. When supplied, overrides the built-in
   * `Intl.DateTimeFormat` formatter for the trigger label.
   */
  formatFn?: (date: Date) => string;
  /** Trigger placeholder when no date is selected. @default "Pick a date" */
  placeholder?: string;
  /** Error state — red border on trigger, sets `aria-invalid` on the trigger. @default false */
  invalid?: boolean;
  /** Forwarded to the trigger button; used by parent Field for label association. */
  id?: string;
  /** Hidden `<input type="hidden">` name for native form submission. */
  name?: string;
}

/* ─── CalendarIcon ──────────────────────────────────────────────────────── */

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

/* ─── ChevronIcon ───────────────────────────────────────────────────────── */

function ChevronIcon({ direction }: { direction: "down" | "left" | "right" }) {
  const rotate = direction === "left" ? "90" : direction === "right" ? "-90" : "0";
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ─── DatePicker ────────────────────────────────────────────────────────── */

/**
 * Controlled or uncontrolled calendar-based date input.
 *
 * Composes a styled trigger button (calendar icon + formatted date label +
 * chevron) with a Radix Popover containing a hand-rolled ARIA grid calendar
 * panel. No external date library required.
 *
 * The trigger accepts an `id` for `<Field>` label wiring. A hidden
 * `<input type="hidden">` carries the ISO-8601 value for native form
 * submission when `name` is provided.
 *
 * Root is `<div>`. Ref forwarded to the root div.
 *
 * @example
 * // Controlled:
 * const [date, setDate] = useState<Date | null>(null);
 * <DatePicker value={date} onValueChange={setDate} />
 *
 * @example
 * // Inside Field:
 * <Field label="Schedule date" id="sched">
 *   <DatePicker id="sched" name="scheduledFor" />
 * </Field>
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(
  {
    value,
    defaultValue = null,
    onValueChange,
    min,
    max,
    disabled = false,
    locale = "en-US",
    format: _format = "MMM d, yyyy",
    formatFn,
    placeholder = "Pick a date",
    invalid = false,
    id,
    name,
    className,
    ...rest
  },
  ref,
) {
  const isControlled = value !== undefined;

  // Uncontrolled internal state
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue ?? null);
  const selectedDate = isControlled ? (value ?? null) : internalValue;

  // Calendar viewpoint month
  const [viewDate, setViewDate] = useState<Date>(() => {
    const base = selectedDate ?? new Date();
    return startOfMonth(base);
  });

  const [open, setOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLTableElement>(null);

  // Focus management: track focused cell index in the grid
  const [focusedDay, setFocusedDay] = useState<number | null>(null);

  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const headingId = `${triggerId}-heading`;
  const dialogId = `${triggerId}-dialog`;

  /* ── derived calendar data ── */

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const totalDays = daysInMonth(viewYear, viewMonth);
  const firstDow = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const today = new Date();

  // Build cells: leading empty + day cells (memoised so referential identity
  // is stable across renders — required by useCallback deps below).
  type Cell = { day: number; disabled: boolean } | null;
  const cells: Cell[] = useMemo(() => {
    const arr: Cell[] = [];
    for (let i = 0; i < firstDow; i++) arr.push(null);
    for (let d = 1; d <= totalDays; d++) {
      const cellDate = new Date(viewYear, viewMonth, d);
      const isDisabled =
        disabled ||
        (min != null && cellDate < new Date(min.getFullYear(), min.getMonth(), min.getDate())) ||
        (max != null && cellDate > new Date(max.getFullYear(), max.getMonth(), max.getDate()));
      arr.push({ day: d, disabled: isDisabled });
    }
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [firstDow, totalDays, viewYear, viewMonth, disabled, min, max]);

  /* ── label ── */

  const triggerLabel = selectedDate
    ? formatFn
      ? formatFn(selectedDate)
      : formatDate(selectedDate, locale)
    : placeholder;

  /* ── hidden input value ── */

  const hiddenValue = selectedDate ? isoDate(selectedDate) : "";

  /* ── handlers ── */

  const selectDay = useCallback(
    (day: number) => {
      const newDate = new Date(viewYear, viewMonth, day);
      if (!isControlled) setInternalValue(newDate);
      onValueChange?.(newDate);
      setOpen(false);
      // Return focus to trigger after closing
      requestAnimationFrame(() => triggerRef.current?.focus());
    },
    [isControlled, onValueChange, viewYear, viewMonth],
  );

  const prevMonth = useCallback(() => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    setFocusedDay(null);
  }, []);

  const nextMonth = useCallback(() => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    setFocusedDay(null);
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (disabled) return;
      setOpen(nextOpen);
      if (nextOpen) {
        // Reset view to selected date or today when opening
        const base = selectedDate ?? new Date();
        setViewDate(startOfMonth(base));
        setFocusedDay(selectedDate ? selectedDate.getDate() : null);
      }
    },
    [disabled, selectedDate],
  );

  // Arrow-key navigation within the day grid
  const handleGridKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTableElement>) => {
      const validDays = cells
        .map((c, i) => (c !== null ? { ...c, index: i } : null))
        .filter((c) => c !== null && !c.disabled)
        .map((c) => c!.day);

      if (validDays.length === 0) return;

      const currentDay =
        focusedDay ??
        (selectedDate?.getMonth() === viewMonth ? selectedDate.getDate() : validDays[0]!);

      const move = (delta: number) => {
        const idx = validDays.indexOf(currentDay);
        if (idx === -1) return;
        const nextIdx = Math.max(0, Math.min(validDays.length - 1, idx + delta));
        setFocusedDay(validDays[nextIdx]!);
        e.preventDefault();
      };

      switch (e.key) {
        case "ArrowRight":
          move(1);
          break;
        case "ArrowLeft":
          move(-1);
          break;
        case "ArrowDown":
          move(7);
          break;
        case "ArrowUp":
          move(-7);
          break;
        case "Enter":
        case " ": {
          e.preventDefault();
          const target = focusedDay ?? currentDay;
          const cell = cells.find((c) => c !== null && c.day === target);
          if (cell && !cell.disabled) selectDay(target);
          break;
        }
        case "Escape":
          setOpen(false);
          requestAnimationFrame(() => triggerRef.current?.focus());
          break;
      }
    },
    [cells, focusedDay, selectedDate, viewMonth, selectDay],
  );

  // Focus the correct cell button when focusedDay changes
  const handleCellRef = useCallback(
    (node: HTMLButtonElement | null, day: number) => {
      if (node && focusedDay === day) {
        node.focus();
      }
    },
    [focusedDay],
  );

  /* ── render ── */

  // Chunk cells into rows of 7
  const rows: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  // Internal ref to root element for outside-click detection
  const rootRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside the root element
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  // Focus management when panel opens
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      if (gridRef.current) {
        const target = focusedDay ?? null;
        if (target !== null) {
          const btn = gridRef.current.querySelector<HTMLButtonElement>(`[data-day="${target}"]`);
          btn?.focus();
        } else {
          const first = gridRef.current.querySelector<HTMLButtonElement>("button:not([disabled])");
          first?.focus();
        }
      }
    });
    // Only run when panel opens (open flips to true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Merge forwarded ref with internal rootRef
  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );

  return (
    <div ref={mergedRef} className={clsx(styles.root, className)} {...rest}>
      {name && <input type="hidden" name={name} value={hiddenValue} />}

      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        // aria-invalid not allowed on role=button by jsx-a11y; expose
        // invalid state via data-invalid + visual class instead. Parent
        // <Field> wires aria-describedby for any error text.
        data-invalid={invalid ? "true" : undefined}
        className={clsx(styles.trigger, invalid && styles.triggerInvalid)}
        onClick={() => handleOpenChange(!open)}
      >
        <span className={styles.triggerIcon}>
          <CalendarIcon />
        </span>
        <span className={clsx(styles.triggerLabel, !selectedDate && styles.triggerPlaceholder)}>
          {triggerLabel}
        </span>
        <span className={styles.triggerChevron}>
          <ChevronIcon direction="down" />
        </span>
      </button>

      {open && (
        <div className={styles.panelWrapper}>
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- role="dialog" is interactive; Escape handler is required for ARIA dialog pattern */}
          <div
            id={dialogId}
            role="dialog"
            aria-label="Choose date"
            aria-modal="true"
            data-state="open"
            className={styles.panel}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false);
                requestAnimationFrame(() => triggerRef.current?.focus());
              }
            }}
          >
            {/* Month header */}
            <div className={styles.header}>
              <button
                type="button"
                onClick={prevMonth}
                aria-label="Previous month"
                className={styles.navButton}
              >
                <ChevronIcon direction="left" />
              </button>

              <span id={headingId} role="heading" aria-level={2} className={styles.monthLabel}>
                {monthYearLabel(viewDate, locale)}
              </span>

              <button
                type="button"
                onClick={nextMonth}
                aria-label="Next month"
                className={styles.navButton}
              >
                <ChevronIcon direction="right" />
              </button>
            </div>

            {/* Day grid */}
            <table
              ref={gridRef}
              role="grid"
              aria-labelledby={headingId}
              className={styles.grid}
              onKeyDown={handleGridKeyDown}
            >
              <thead>
                <tr role="row">
                  {DAY_ABBRS.map(({ abbr, full }) => (
                    <th
                      key={abbr}
                      role="columnheader"
                      scope="col"
                      aria-label={full}
                      className={styles.dayHeader}
                    >
                      <abbr title={full}>{abbr}</abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx} role="row">
                    {row.map((cell, colIdx) => {
                      if (cell === null) {
                        return (
                          <td
                            key={colIdx}
                            role="gridcell"
                            aria-disabled="true"
                            className={styles.emptyCell}
                          />
                        );
                      }

                      const cellDate = new Date(viewYear, viewMonth, cell.day);
                      const isSelected = selectedDate != null && sameDay(cellDate, selectedDate);
                      const isToday = sameDay(cellDate, today);
                      const isFocused = focusedDay === cell.day;

                      return (
                        <td
                          key={colIdx}
                          role="gridcell"
                          aria-selected={isSelected ? "true" : undefined}
                          aria-current={isToday ? "date" : undefined}
                          aria-disabled={cell.disabled ? "true" : undefined}
                          className={styles.cell}
                        >
                          <button
                            ref={(node) => handleCellRef(node, cell.day)}
                            type="button"
                            data-day={cell.day}
                            tabIndex={
                              isFocused ||
                              (!focusedDay && isSelected) ||
                              (!focusedDay && !selectedDate && cell.day === 1)
                                ? 0
                                : -1
                            }
                            disabled={cell.disabled}
                            onClick={() => !cell.disabled && selectDay(cell.day)}
                            className={clsx(
                              styles.dayButton,
                              isSelected && styles.daySelected,
                              isToday && !isSelected && styles.dayToday,
                              cell.disabled && styles.dayDisabled,
                            )}
                            aria-label={cellDate.toLocaleDateString(locale, {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          >
                            {cell.day}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

DatePicker.displayName = "DatePicker";
