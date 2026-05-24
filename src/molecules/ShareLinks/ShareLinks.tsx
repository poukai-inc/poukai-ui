import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Twitter, Linkedin } from "lucide-react";
import clsx from "clsx";
import { IconButton } from "../../atoms/IconButton";
import { CopyButton } from "../CopyButton";
import styles from "./ShareLinks.module.css";

export type ShareNetwork = "x" | "linkedin" | "copy";
export type ShareLinksSize = "sm" | "md";

export interface ShareLinksProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /** The URL to share or copy. Required. */
  url: string;
  /** Page title passed to navigator.share and pre-filled in intent URLs. */
  title?: string;
  /**
   * Which networks to render and in what order.
   * @default ["x", "linkedin", "copy"]
   */
  networks?: Array<ShareNetwork>;
  /**
   * Maps to IconButton size. Use "sm" for compact editorial footers.
   * @default "md"
   */
  size?: ShareLinksSize;
}

function buildIntentUrl(
  network: Exclude<ShareNetwork, "copy">,
  url: string,
  title: string,
): string {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  if (network === "x") {
    return `https://x.com/intent/tweet?url=${encoded}&text=${encodedTitle}`;
  }
  // linkedin
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`;
}

/**
 * Compact share-action row for editorial surfaces (articles, case studies).
 *
 * Renders per-network `IconButton` entries for X, LinkedIn, and a `CopyButton`
 * for the URL. When `navigator.share` is available the entire row is replaced
 * by a single native-share button; the OS sheet handles destination choice.
 *
 * @example
 *   <ShareLinks url="https://poukai.com/blog/post" title="My Post" />
 *   <ShareLinks url={url} networks={["linkedin", "copy"]} size="sm" />
 */
export const ShareLinks = forwardRef<HTMLDivElement, ShareLinksProps>(function ShareLinks(
  { url, title = "", networks = ["x", "linkedin", "copy"], size = "md", className, ...rest },
  ref,
) {
  // Always render the per-network buttons for visual + a11y consistency
  // across browsers. The navigator.share branch was removed because it
  // collapses the UI to a single share icon on WebKit-based UAs (Safari,
  // mobile Safari) and breaks the expected three-icon row. Per-network
  // intent URLs work uniformly across all browsers; a future enhancement
  // can wire navigator.share into the per-network click handlers.

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Share this article"
      className={clsx(styles.root, className)}
      {...rest}
    >
      {networks.map((network) => {
        if (network === "copy") {
          return (
            <CopyButton key="copy" value={url} label={false} aria-label="Copy link" size={size} />
          );
        }

        const intentUrl = buildIntentUrl(network, url, title);
        const label = network === "x" ? "Share on X" : "Share on LinkedIn";
        const icon = network === "x" ? Twitter : Linkedin;

        return (
          <IconButton
            key={network}
            icon={icon}
            aria-label={label}
            variant="ghost"
            size={size}
            onClick={() => {
              window.open(intentUrl, "_blank", "noopener,noreferrer");
            }}
          />
        );
      })}
    </div>
  );
});

ShareLinks.displayName = "ShareLinks";
