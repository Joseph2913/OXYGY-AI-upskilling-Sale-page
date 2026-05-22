import type { ReactNode } from 'react';

interface FrameProps {
  children: ReactNode;
  className?: string;
  /** When true, the inner container does not center children — the frame controls its own layout */
  noContainer?: boolean;
}

/**
 * Base layout wrapper for a slide. Each frame fills exactly one viewport
 * (h-screen overflow-hidden) and never scrolls. Children flow inside a
 * centered max-width container that the frame can subdivide as needed.
 *
 * The 400-600ms staggered fade-in fires automatically on mount via the
 * `frame-enter` class defined in barcelona.html.
 */
export function Frame({ children, className = '', noContainer = false }: FrameProps) {
  if (noContainer) {
    return (
      <section className={`relative h-screen w-full overflow-hidden bg-white ${className}`}>
        <div className="relative z-10 w-full h-full frame-enter">{children}</div>
      </section>
    );
  }
  return (
    <section className={`relative h-screen w-full overflow-hidden bg-white ${className}`}>
      <div className="relative z-10 w-full h-full max-w-[1280px] mx-auto px-16 py-12 flex flex-col frame-enter">
        {children}
      </div>
    </section>
  );
}
