interface OxygyLogoProps {
  variant?: 'wordmark' | 'mark';
  className?: string;
}

/**
 * OXYGY brand mark. Two variants:
 * - `wordmark` — the full OXYGY text with the angular X icon prefix
 * - `mark` — just the angular X icon (used in tight corner placements)
 * Color is controlled via `currentColor` so the parent's text colour drives it.
 */
export function OxygyLogo({ variant = 'wordmark', className = '' }: OxygyLogoProps) {
  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label="OXYGY"
        role="img"
      >
        <path
          d="M6 7 L13 16 L6 25"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 7 L19 16 L26 25"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 132 30"
      fill="none"
      className={className}
      aria-label="OXYGY"
      role="img"
    >
      {/* Small angular X icon on the left */}
      <path
        d="M2 7 L9 15 L2 23"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 7 L12 15 L19 23"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wordmark */}
      <text
        x="28"
        y="22"
        fill="currentColor"
        fontFamily="Plus Jakarta Sans, DM Sans, sans-serif"
        fontWeight="700"
        fontSize="20"
        letterSpacing="-0.01em"
      >
        OXYGY
      </text>
    </svg>
  );
}
