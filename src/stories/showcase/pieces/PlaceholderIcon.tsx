/**
 * Decorative icon stub for RoleCard demos.
 * Hoisted out of stories so the showcase doesn't import from *.stories.tsx.
 * Matches the SVG used in RoleCard.stories.tsx::PlaceholderIcon.
 */
export function PlaceholderIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 12h8" />
    </svg>
  );
}
