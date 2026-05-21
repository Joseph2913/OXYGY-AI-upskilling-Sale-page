import { Frame } from '../../Frame';

const cards = [
  {
    num: '01',
    title: 'The most strategic asset',
    sub: 'Talent. People. Capability.',
    detail: 'You own the org\'s biggest line item — and the one AI will reshape most.',
  },
  {
    num: '02',
    title: 'The messiest data',
    sub: 'HRIS. Performance. Capacity. Skills.',
    detail: 'Fragmented systems, manual updates, blind spots. The data nobody else will touch.',
  },
  {
    num: '03',
    title: 'The only broker of both',
    sub: 'Not IT. Not Strategy. You.',
    detail: 'You\'re the one person who sees the workforce strategy AND the data that proves it.',
  },
] as const;

/**
 * Frame 2 — Why the CHRO is uniquely positioned to broker the strategy/data
 * conversation. Three vertically-spaced cards, each with a teal mono numeral
 * as the single accent. Fits the viewport without scroll.
 */
export function ChroPosition() {
  return (
    <Frame>
      <div className="flex-1 flex flex-col justify-center w-full">
        {/* Kicker */}
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-teal">
          Frame 02 · The CHRO&rsquo;s Position
        </p>

        {/* Headline */}
        <h2 className="mt-4 font-sans font-semibold text-stage-white leading-[1.05] tracking-tight text-[clamp(2.5rem,5.2vw,4.75rem)]">
          Why this is{' '}
          <span className="relative inline-block">
            your moment
            <span
              className="underline-sweep absolute left-0 -bottom-1 w-full h-[3px] bg-teal rounded-full"
              aria-hidden="true"
            />
          </span>
          .
        </h2>

        {/* Three cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map(({ num, title, sub, detail }) => (
            <div
              key={num}
              className="relative border border-stage-murmur/25 bg-stage-murmur/[0.03] p-7 transition-colors hover:border-stage-murmur/50 group"
            >
              {/* Top row: numeral + decorative tick line */}
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-base text-teal tracking-wider">
                  {num}
                </span>
                <span className="flex-1 h-px bg-stage-murmur/20" aria-hidden="true" />
              </div>

              <h3 className="font-sans text-2xl font-medium text-stage-white leading-tight">
                {title}
              </h3>

              <p className="mt-3 font-sans text-base text-stage-murmur leading-snug">
                {sub}
              </p>

              <p className="mt-6 pt-5 border-t border-stage-murmur/15 font-sans text-sm text-stage-murmur/70 leading-relaxed">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
