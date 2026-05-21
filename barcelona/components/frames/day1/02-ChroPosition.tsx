import { Frame } from '../../Frame';

const cards = [
  {
    num: '01',
    title: 'You sit on the most strategic asset',
    sub: 'Talent. People. Capability.',
  },
  {
    num: '02',
    title: 'You sit on the messiest data',
    sub: 'HRIS. Performance. Capacity. Skills.',
  },
  {
    num: '03',
    title: "You're the only one with authority to broker both",
    sub: 'Not IT. Not Strategy. You.',
  },
] as const;

export function ChroPosition() {
  return (
    <Frame>
      {/* Headline — left-aligned, not centred */}
      <h2 className="font-sans font-semibold text-stage-white leading-[1.1] tracking-tight text-[clamp(2.5rem,5vw,4.5rem)]">
        Why this is your moment
      </h2>

      {/* Three equal cards */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(({ num, title, sub }) => (
          <div
            key={num}
            className="border border-stage-murmur/30 p-10"
          >
            {/* Teal numeral — only accent in this frame */}
            <p className="font-mono text-sm text-teal">{num}</p>

            {/* Card title */}
            <h3 className="mt-6 font-sans text-2xl font-medium text-stage-white leading-snug">
              {title}
            </h3>

            {/* Supporting line */}
            <p className="mt-4 font-sans text-lg text-stage-murmur leading-relaxed">
              {sub}
            </p>
          </div>
        ))}
      </div>
    </Frame>
  );
}
