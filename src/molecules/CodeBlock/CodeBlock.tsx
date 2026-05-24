import {
  forwardRef,
  useState,
  useCallback,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import clsx from "clsx";
import styles from "./CodeBlock.module.css";

export interface CodeBlockProps extends ComponentPropsWithoutRef<"figure"> {
  /**
   * The code content. Plain string idiomatic; also accepts pre-highlighted
   * markup from consumer (e.g. from shiki or highlight.js).
   * Required.
   */
  children: ReactNode;
  /**
   * Short language identifier (e.g. `"tsx"`, `"bash"`, `"json"`).
   * When provided, renders a language label in the header bar.
   */
  language?: string;
  /**
   * Suppresses the CopyButton. For decorative/display-only snippets where
   * copy-to-clipboard is noise.
   * @default false
   */
  hideCopy?: boolean;
  /**
   * Rendered as `<figcaption>` below the code pane. File path, attribution,
   * or explanatory note.
   */
  caption?: ReactNode;
}

/**
 * CodeBlock — fenced code molecule.
 *
 * Semantic `<figure>` container with an optional header bar (language label +
 * copy button), a scrollable `<pre><code>` pane, and an optional
 * `<figcaption>`. The DS ships no syntax highlighting; consumers inject
 * highlighted markup via `children`.
 *
 * @example
 *   <CodeBlock language="tsx">
 *     {`const x = 1;`}
 *   </CodeBlock>
 */
export const CodeBlock = forwardRef<HTMLElement, CodeBlockProps>(function CodeBlock(
  { children, language, hideCopy = false, caption, className, ...rest },
  ref,
) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const text = typeof children === "string" ? children : "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — silently no-op
    }
  }, [children]);

  const showHeader = (language !== undefined && language !== "") || !hideCopy;

  return (
    <figure ref={ref} className={clsx(styles.root, className)} {...rest}>
      {showHeader && (
        <div className={styles.header}>
          {language !== undefined && language !== "" && (
            <span className={styles.language}>{language}</span>
          )}
          {!hideCopy && (
            <button
              type="button"
              className={styles.copyBtn}
              aria-label={copied ? "Copied" : "Copy"}
              onClick={handleCopy}
            >
              {copied ? (
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          )}
        </div>
      )}
      <pre className={styles.pre}>
        <code className={styles.code}>{children}</code>
      </pre>
      {caption !== undefined && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
});

CodeBlock.displayName = "CodeBlock";
