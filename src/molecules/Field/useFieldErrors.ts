import { useState, useCallback } from "react";

/**
 * Field-keyed error map. The DS-standard shape for surfacing validation
 * errors to <Field>. Compatible with Zod's flatten().fieldErrors, RHF's
 * errors object (after one transform), and hand-rolled validators.
 *
 * - Keys are <input>/<textarea> name attributes
 * - Values are the user-facing error string OR undefined to clear that field
 */
export type FieldErrors = Record<string, string | undefined>;

/**
 * Manage field-keyed error state for a Form. Returns the error map plus
 * imperative setters. Validation logic lives at the call site — this hook
 * only owns the state.
 */
export function useFieldErrors(initial?: FieldErrors): {
  errors: FieldErrors;
  /** Replace the entire error map. Use after validation runs. */
  setErrors: (next: FieldErrors) => void;
  /** Set or clear (pass undefined) the error for a single field. */
  setFieldError: (name: string, message: string | undefined) => void;
  /** Clear all errors. Call on successful submit or after server ack. */
  clearAll: () => void;
} {
  const [errors, setErrorsState] = useState<FieldErrors>(initial ?? {});

  const setErrors = useCallback((next: FieldErrors) => {
    setErrorsState(next);
  }, []);

  const setFieldError = useCallback((name: string, message: string | undefined) => {
    setErrorsState((prev) => ({ ...prev, [name]: message }));
  }, []);

  const clearAll = useCallback(() => {
    setErrorsState({});
  }, []);

  return { errors, setErrors, setFieldError, clearAll };
}
