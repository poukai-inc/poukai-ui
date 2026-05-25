import {
  forwardRef,
  useId,
  useRef,
  useState,
  useCallback,
  useEffect,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import clsx from "clsx";
import { Icon } from "../../atoms/Icon/Icon";
import styles from "./Combobox.module.css";

export type ComboboxSize = "sm" | "md";

export interface ComboboxOption {
  value: string;
  label: string;
  group?: string;
}

export interface ComboboxProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "onChange" | "defaultValue"
> {
  /**
   * Flat array of options. Groups derived from the optional `group` field.
   */
  options: ComboboxOption[];

  /**
   * Controlled selected value.
   */
  value?: string;

  /**
   * Uncontrolled initial value.
   */
  defaultValue?: string;

  /**
   * Fires when the user selects an option.
   */
  onValueChange?: (value: string) => void;

  /**
   * Trigger placeholder when no value is selected.
   * @default "Select…"
   */
  placeholder?: string;

  /**
   * Disables the trigger; `opacity: 0.5`, no pointer events.
   * @default false
   */
  disabled?: boolean;

  /**
   * Applies `--danger` border to trigger; pairs with Field error state.
   * @default false
   */
  invalid?: boolean;

  /**
   * Visual size — `sm` uses `--btn-h-sm` (32px) and `--fs-meta`; `md` uses `--btn-h-md` (44px).
   * @default "md"
   */
  size?: ComboboxSize;

  /**
   * Custom filter function. Defaults to substring match on `label`.
   */
  filter?: (option: ComboboxOption, query: string) => boolean;

  /**
   * Hidden `<input type="hidden">` name for native form submission.
   */
  name?: string;
}

function defaultFilter(option: ComboboxOption, query: string): boolean {
  return option.label.toLowerCase().includes(query.toLowerCase());
}

const sizeClass: Record<ComboboxSize, string> = {
  sm: styles.sizeSm!,
  md: styles.sizeMd!,
};

/**
 * Combobox — searchable single-select dropdown molecule.
 *
 * Renders a styled trigger button that opens a popover containing a search
 * input and a filtered listbox of options. Supports controlled and
 * uncontrolled usage. Groups derived from `options[].group`.
 *
 * Compose with `<Field>` for label + error anatomy.
 *
 * @example
 * // Controlled:
 * const [tz, setTz] = useState("");
 * <Combobox options={TIMEZONES} value={tz} onValueChange={setTz} placeholder="Select timezone…" />
 *
 * @example
 * // Inside Field:
 * <Field label="Timezone" id="tz">
 *   <Combobox id="tz" options={TIMEZONES} onValueChange={setTz} />
 * </Field>
 */
export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(function Combobox(
  {
    options,
    value: valueProp,
    defaultValue,
    onValueChange,
    placeholder = "Select…",
    disabled = false,
    invalid = false,
    size = "md",
    filter = defaultFilter,
    name,
    className,
    id: idProp,
    "aria-invalid": ariaInvalid,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const listboxId = `${id}-listbox`;
  const searchId = `${id}-search`;

  // ---- Controlled/uncontrolled value ----
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? "");
  const selectedValue = isControlled ? valueProp : internalValue;

  // ---- Open state (uncontrolled per Phase 1 spec) ----
  const [open, setOpen] = useState(false);

  // ---- Search query ----
  const [query, setQuery] = useState("");

  // ---- Focused option index ----
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // ---- Refs ----
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // ---- Filtered + grouped options ----
  const filtered = query ? options.filter((o) => filter(o, query)) : options;

  // Build ordered list of flat items for keyboard nav
  const flatFiltered = filtered;

  // Derive groups
  const groups = filtered.reduce<Record<string, ComboboxOption[]>>((acc, opt) => {
    const key = opt.group ?? "";
    const existing = acc[key];
    if (existing) {
      existing.push(opt);
    } else {
      acc[key] = [opt];
    }
    return acc;
  }, {});

  const hasGroups = filtered.some((o) => o.group);

  // ---- Helpers ----
  const selectedLabel = options.find((o) => o.value === selectedValue)?.label;

  const closePopover = useCallback((returnFocus = true) => {
    setOpen(false);
    setQuery("");
    setFocusedIndex(-1);
    if (returnFocus) {
      triggerRef.current?.focus();
    }
  }, []);

  const selectOption = useCallback(
    (val: string) => {
      if (!isControlled) {
        setInternalValue(val);
      }
      onValueChange?.(val);
      closePopover(true);
    },
    [isControlled, onValueChange, closePopover],
  );

  const openPopover = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    setQuery("");
    setFocusedIndex(-1);
  }, [disabled]);

  // Focus search input after open
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        searchRef.current?.focus();
      });
    }
  }, [open]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex < 0 || !listboxRef.current) return;
    const item =
      listboxRef.current.querySelectorAll<HTMLLIElement>('[role="option"]')[focusedIndex];
    item?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        closePopover(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, closePopover]);

  // ---- Keyboard: trigger ----
  const handleTriggerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        openPopover();
      }
    },
    [openPopover],
  );

  // ---- Keyboard: search input ----
  const handleSearchKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const optionCount = flatFiltered.length;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, optionCount - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((i) => {
          if (i <= 0) {
            // Wrap back to search input
            return -1;
          }
          return i - 1;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < optionCount) {
          const opt = flatFiltered[focusedIndex];
          if (opt) selectOption(opt.value);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        closePopover(true);
      } else if (e.key === "Tab") {
        closePopover(false);
      }
    },
    [flatFiltered, focusedIndex, selectOption, closePopover],
  );

  // ---- Render ----
  const triggerLabel = selectedLabel ?? placeholder;
  const isPlaceholder = !selectedLabel;

  const resolvedAriaInvalid = ariaInvalid ?? (invalid ? "true" : undefined);

  const renderOptionList = () => {
    if (flatFiltered.length === 0) {
      return (
        <li className={styles.empty} role="option" aria-selected="false" aria-disabled="true">
          No options found
        </li>
      );
    }

    if (!hasGroups) {
      return flatFiltered.map((opt, idx) => {
        const isSelected = opt.value === selectedValue;
        const isFocused = idx === focusedIndex;
        return (
          <li
            key={opt.value}
            role="option"
            aria-selected={isSelected}
            data-focused={isFocused ? "" : undefined}
            className={clsx(
              styles.option,
              isSelected && styles.optionSelected,
              isFocused && styles.optionFocused,
            )}
            onPointerDown={(e) => {
              e.preventDefault();
              selectOption(opt.value);
            }}
          >
            <span className={styles.optionCheck} aria-hidden="true">
              {isSelected && <Icon icon={Check} size="xs" decorative />}
            </span>
            <span className={styles.optionLabel}>{opt.label}</span>
          </li>
        );
      });
    }

    // Grouped render
    const groupKeys = Object.keys(groups);
    let globalIdx = 0;
    return groupKeys.map((groupKey) => {
      const groupOptions = groups[groupKey] ?? [];
      const groupContent = groupOptions.map((opt) => {
        const idx = globalIdx++;
        const isSelected = opt.value === selectedValue;
        const isFocused = idx === focusedIndex;
        return (
          <li
            key={opt.value}
            role="option"
            aria-selected={isSelected}
            data-focused={isFocused ? "" : undefined}
            className={clsx(
              styles.option,
              isSelected && styles.optionSelected,
              isFocused && styles.optionFocused,
            )}
            onPointerDown={(e) => {
              e.preventDefault();
              selectOption(opt.value);
            }}
          >
            <span className={styles.optionCheck} aria-hidden="true">
              {isSelected && <Icon icon={Check} size="xs" decorative />}
            </span>
            <span className={styles.optionLabel}>{opt.label}</span>
          </li>
        );
      });

      return (
        <li key={groupKey} role="group" aria-label={groupKey || undefined} className={styles.group}>
          {groupKey && (
            <div className={styles.groupHeading} aria-hidden="true">
              {groupKey}
            </div>
          )}
          <ul role="presentation" className={styles.groupList}>
            {groupContent}
          </ul>
        </li>
      );
    });
  };

  return (
    <div
      ref={(node) => {
        // Merge external ref + internal ref
        (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={clsx(styles.root, sizeClass[size], className)}
      {...rest}
    >
      {/* Hidden form input */}
      {name && <input type="hidden" name={name} value={selectedValue} />}

      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={resolvedAriaInvalid}
        {...(ariaLabel !== undefined && { "aria-label": ariaLabel })}
        {...(ariaLabelledBy !== undefined && { "aria-labelledby": ariaLabelledBy })}
        disabled={disabled}
        className={clsx(
          styles.trigger,
          sizeClass[size],
          invalid && styles.triggerInvalid,
          isPlaceholder && styles.triggerPlaceholder,
        )}
        onClick={() => (open ? closePopover(true) : openPopover())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={styles.triggerLabel}>{triggerLabel}</span>
        <span className={styles.triggerIcon} aria-hidden="true">
          <Icon icon={ChevronsUpDown} size="xs" decorative />
        </span>
      </button>

      {/* Popover */}
      {open && (
        <div className={clsx(styles.popover, sizeClass[size])} role="presentation">
          {/* Search row */}
          <div className={styles.searchRow}>
            <input
              ref={searchRef}
              id={searchId}
              type="text"
              role="searchbox"
              aria-label="Search"
              aria-autocomplete="list"
              aria-controls={listboxId}
              className={styles.searchInput}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setFocusedIndex(-1);
              }}
              onKeyDown={handleSearchKeyDown}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {/* Divider */}
          <div className={styles.divider} aria-hidden="true" />

          {/* Listbox */}
          <ul
            ref={listboxRef}
            role="listbox"
            id={listboxId}
            className={styles.listbox}
            aria-label={placeholder}
          >
            {renderOptionList()}
          </ul>
        </div>
      )}
    </div>
  );
});

Combobox.displayName = "Combobox";
