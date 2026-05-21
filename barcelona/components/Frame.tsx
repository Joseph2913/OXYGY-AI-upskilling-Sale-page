import type { ReactNode } from 'react';

interface FrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * Base layout wrapper. Centered max-width-6xl content area with vertical centring,
 * generous padding. Frames may compose freely inside. Each frame mounts with a
 * 400ms staggered fade-in via the `frame-enter` class (defined in barcelona.html).
 *
 * Re-animation on frame change happens automatically: StagePage swaps the
 * FrameComponent reference, React unmounts the old + mounts the new, and the
 * CSS animation fires on the freshly mounted DOM. No keys or remount tricks.
 */
export function Frame({ children, className = '' }: FrameProps) {
  return (
    <section
      className={`relative min-h-screen w-full flex items-center justify-center px-12 py-16 ${className}`}
    >
      <div className="relative z-10 w-full max-w-6xl frame-enter">
        {children}
      </div>
    </section>
  );
}
