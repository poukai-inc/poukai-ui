/**
 * @deprecated The `Textarea` primitive lives at the **atom** layer.
 *
 * Import from the canonical path instead:
 *
 * ```ts
 * // Preferred:
 * import { Textarea } from "@poukai-inc/ui";
 * // or the atom subpath:
 * import { Textarea } from "@poukai-inc/ui/atoms/Textarea";
 * ```
 *
 * The molecule path (`@poukai-inc/ui/molecules/Textarea`) is kept as a
 * re-export shim for one major version. It will be removed in v2.0.
 */
export { Textarea, type TextareaProps, type TextareaResize } from "../../atoms/Textarea";
