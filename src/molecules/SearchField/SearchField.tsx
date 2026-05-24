import {
  forwardRef,
  useId,
  useRef,
  useCallback,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from "react";
import { Search, X } from "lucide-react";
import clsx from "clsx";
import { Field } from "../Field/Field";
import { Input } from "../../atoms/Input/Input";
import { Icon } from "../../atoms/Icon/Icon";
import { IconButton } from "../../atoms/IconButton/IconButton";
import styles from "./SearchField.module.css";

export type SearchFieldSize = "sm" | "md";

export interface SearchFieldProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "onChange" | "defaultValue"
> {
  /**
   * Controlled value. Pair with `onValueChange`.
   */
  value?: string;

  /**
   * Uncontrolled initial value.
   * @default ""
   */
  defaultValue?: string;

  /**
   * Change handler; receives the new string on every keystroke.
   */
  onValueChange?: (v: string) => void;

  /**
   * Input placeholder text.
   * @default "Search…"
   */
  placeholder?: string;

  /**
   * Visual size — aligns with `--btn-h-sm` / `--btn-h-md`.
   * @default "md"
   */
  size?: SearchFieldSize;

  /**
   * When true, disables the input and suppresses the clear button.
   * @default false
   */
  disabled?: boolean;

  /**
   * Passed to the Field wrapper. Visually hidden by default via Field convention.
   * Defaults to "Search" so every instance has an accessible label.
   * @default "Search"
   */
  label?: string;

  /**
   * Form field name for native form submission.
   */
  name?: string;
}

const sizeClass: Record<SearchFieldSize, string> = {
  sm: styles.sizeSm!,
  md: styles.sizeMd!,
};

/**
 * Canonical table-filter and dashboard-search molecule.
 *
 * Composes Field + Input (type="search") with a leading search Icon and a
 * trailing clear IconButton that renders only when value is non-empty.
 *
 * Root is `<div role="search">`. Ref forwarded to the root div.
 *
 * @example
 * // Controlled:
 * const [q, setQ] = useState("");
 * <SearchField value={q} onValueChange={setQ} label="Filter results" />
 *
 * @example
 * // Uncontrolled:
 * <SearchField defaultValue="" placeholder="Search…" label="Search" />
 */
export const SearchField = forwardRef<HTMLDivElement, SearchFieldProps>(function SearchField(
  {
    value,
    defaultValue = "",
    onValueChange,
    placeholder = "Search…",
    size = "md",
    disabled = false,
    label = "Search",
    name,
    className,
    ...rest
  },
  ref,
) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const hasValue = isControlled ? value.length > 0 : false;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(e.target.value);
    },
    [onValueChange],
  );

  const handleClear = useCallback(() => {
    if (!inputRef.current) return;
    if (!isControlled) {
      // Reset uncontrolled DOM value via native setter so React sees the event.
      const nativeSet = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeSet?.call(inputRef.current, "");
      inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
      inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
    onValueChange?.("");
    inputRef.current.focus();
  }, [isControlled, onValueChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        if (!isControlled && inputRef.current) {
          const nativeSet = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value",
          )?.set;
          nativeSet?.call(inputRef.current, "");
          inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
          inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
        }
        onValueChange?.("");
      }
    },
    [isControlled, onValueChange],
  );

  // For controlled mode: only render the clear button when there is a value.
  // For uncontrolled mode: always render the wrap; CSS :placeholder-shown
  // handles show/hide (input has a placeholder so this works reliably).
  const showClearWrap = isControlled ? hasValue && !disabled : !disabled;

  const inputNode = (
    <div className={clsx(styles.inputWrap, sizeClass[size])}>
      <span className={styles.leadingIcon} aria-hidden="true">
        <Icon icon={Search} size="sm" decorative />
      </span>
      <Input
        ref={inputRef}
        id={inputId}
        type="search"
        size={size}
        name={name}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={styles.input}
        {...(isControlled ? { value } : { defaultValue })}
      />
      {showClearWrap && (
        <span
          className={clsx(
            styles.clearWrap,
            isControlled && !hasValue ? styles.clearHidden : undefined,
          )}
        >
          <IconButton
            icon={X}
            aria-label="Clear search"
            variant="ghost"
            size="sm"
            tabIndex={isControlled && !hasValue ? -1 : 0}
            onClick={handleClear}
            disabled={disabled}
            className={styles.clearButton}
          />
        </span>
      )}
    </div>
  );

  return (
    <div
      ref={ref}
      role="search"
      className={clsx(styles.root, sizeClass[size], className)}
      {...rest}
    >
      <Field label={label} id={inputId} className={styles.field}>
        {inputNode}
      </Field>
    </div>
  );
});

SearchField.displayName = "SearchField";
