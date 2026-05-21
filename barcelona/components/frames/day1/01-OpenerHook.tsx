import { Frame } from '../../Frame';

export function OpenerHook() {
  return (
    <Frame>
      {/* Venn diagram — absolute, positioned to right edge, behind type via z-index */}
      <svg
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[42%] max-w-[560px] opacity-100 pointer-events-none z-0"
        viewBox="0 0 400 280"
        aria-hidden="true"
      >
        {/* Strategy circle — pale yellow, low opacity fill, soft stroke */}
        <circle
          cx="145"
          cy="140"
          r="118"
          fill="rgba(247, 232, 164, 0.07)"
          stroke="rgba(247, 232, 164, 0.22)"
          strokeWidth="1.5"
        />
        {/* Data circle — lavender, low opacity fill, soft stroke */}
        <circle
          cx="255"
          cy="140"
          r="118"
          fill="rgba(195, 208, 245, 0.07)"
          stroke="rgba(195, 208, 245, 0.22)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Type block — left-aligned, sits above the Venn via z-index */}
      <div className="relative z-10 max-w-[62%]">
        {/* Top lockup */}
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-stage-murmur/60">
          Working Futures × OXYGY · Barcelona · June 10, 2026
        </p>

        {/* Day kicker */}
        <p className="mt-10 font-mono text-sm uppercase tracking-[0.25em] text-teal">
          Day 1
        </p>

        {/* Display headline */}
        <h1 className="mt-5 font-sans font-semibold text-stage-white leading-[1.05] tracking-tight text-[clamp(3.75rem,7vw,6rem)]">
          AI use cases don&rsquo;t live<br />
          in your strategy deck.<br />
          Or your data lake.<br />
          They live at{' '}
          <span className="relative inline-block">
            the meeting of both
            <span
              className="absolute left-0 -bottom-[6px] w-full h-[3px] bg-teal rounded-full opacity-90"
              aria-hidden="true"
            />
          </span>
          .
        </h1>

        {/* Byline */}
        <p className="mt-14 font-mono text-xs uppercase tracking-[0.25em] text-stage-murmur/60">
          Joseph Thomas · Edoardo Monopoli · Yuji Develle
        </p>
      </div>
    </Frame>
  );
}
