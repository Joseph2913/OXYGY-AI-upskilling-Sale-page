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
      className={`relative h-screen w-full overflow-hidden ${className}`}
    >
      <div className="relative z-10 w-full h-full max-w-6xl mx-auto px-12 py-14 flex flex-col frame-enter">
        {children}
      </div>
    </section>
  );
}
