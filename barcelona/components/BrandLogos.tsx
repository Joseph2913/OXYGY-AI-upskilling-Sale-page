/**
 * Lightweight SVG icons for AI / tech brands used to ground the slides in
 * the actual market. These are stylised approximations — recognizable shapes
 * drawn from the public brand marks but not exact reproductions.
 */

interface IconProps {
  className?: string;
}

export function OpenAIIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-label="OpenAI">
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M16 4 L24 8.5 L24 17.5 L16 22 L8 17.5 L8 8.5 Z" />
        <path d="M16 4 L16 22" />
        <path d="M8 8.5 L24 17.5" />
        <path d="M8 17.5 L24 8.5" />
      </g>
    </svg>
  );
}

export function AnthropicIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-label="Anthropic Claude">
      <path d="M11.7 6 L8 26 L11.3 26 L12.05 22 L19.55 22 L20.3 26 L23.6 26 L19.9 6 L11.7 6 Z M12.7 18.5 L13.95 12 L17.65 12 L18.9 18.5 L12.7 18.5 Z" />
    </svg>
  );
}

export function GeminiIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-label="Google Gemini">
      <path d="M16 2 C16 8.5 19.5 12 26 12 C19.5 12 16 15.5 16 22 C16 15.5 12.5 12 6 12 C12.5 12 16 8.5 16 2 Z" opacity="0.85" />
      <path d="M22 18 C22 22 24 24 28 24 C24 24 22 26 22 30 C22 26 20 24 16 24 C20 24 22 22 22 18 Z" opacity="0.55" />
    </svg>
  );
}

export function MetaIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-label="Meta">
      <path
        d="M5 22 C5 22 8 8 13 8 C16 8 18 11 20 14 C22 17 23 19 25 19 C26.5 19 27 18 27 16 C27 13 25 9 22 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 22 C5 22 8 22 12 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MicrosoftIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-label="Microsoft">
      <rect x="5" y="5" width="10" height="10" fill="#F25022" />
      <rect x="17" y="5" width="10" height="10" fill="#7FBA00" />
      <rect x="5" y="17" width="10" height="10" fill="#00A4EF" />
      <rect x="17" y="17" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

export function MistralIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-label="Mistral">
      <g>
        <rect x="4" y="6" width="4" height="4" fill="#FFCC00" />
        <rect x="9" y="6" width="4" height="4" fill="#FFCC00" />
        <rect x="14" y="6" width="4" height="4" fill="#FF7A00" />
        <rect x="19" y="6" width="4" height="4" fill="#FF3D00" />
        <rect x="24" y="6" width="4" height="4" fill="#FF0033" />
        <rect x="4" y="11" width="4" height="4" fill="#FFCC00" />
        <rect x="14" y="11" width="4" height="4" fill="#FF7A00" />
        <rect x="24" y="11" width="4" height="4" fill="#FF0033" />
        <rect x="4" y="16" width="4" height="4" fill="#FFCC00" />
        <rect x="14" y="16" width="4" height="4" fill="#FF7A00" />
        <rect x="24" y="16" width="4" height="4" fill="#FF0033" />
        <rect x="4" y="21" width="4" height="4" fill="#FFCC00" />
        <rect x="14" y="21" width="4" height="4" fill="#FF7A00" />
        <rect x="24" y="21" width="4" height="4" fill="#FF0033" />
        <rect x="4" y="26" width="4" height="4" fill="#000000" />
        <rect x="9" y="26" width="4" height="4" fill="#000000" />
        <rect x="14" y="26" width="4" height="4" fill="#000000" />
        <rect x="19" y="26" width="4" height="4" fill="#000000" />
        <rect x="24" y="26" width="4" height="4" fill="#000000" />
      </g>
    </svg>
  );
}

export function OpenSourceIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-label="Open Source">
      <path
        d="M11 9 L5 16 L11 23"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 9 L27 16 L21 23"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="18"
        y1="7"
        x2="14"
        y2="25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
