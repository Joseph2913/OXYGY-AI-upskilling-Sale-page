import { Frame } from '../../Frame';

/**
 * Slide 5 — What You're About To Do
 * The session's structure: 1 case · 2 angles · 1 question.
 * Three numbered items revealed in sequence with a thin teal divider between.
 */
export function TwoHalves() {
  return (
    <Frame>
      {/* Header */}
      <div>
        <h2 className="font-display font-extrabold text-navy-900 leading-[1.05] tracking-[-0.02em] text-[clamp(2.25rem,4vw,3.5rem)]">
          What you&rsquo;re about to do.
        </h2>
        <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.3em] text-teal font-medium">
          The next 40 minutes
        </p>
      </div>

      {/* Three numbered beats */}
      <div className="flex-1 flex flex-col justify-center gap-2 mt-6">
        <Beat
          number="1"
          title="One case."
          desc="A real-shaped company with a real-shaped problem."
          delay={300}
          dividerWeight="thin"
        />
        <Beat
          number="2"
          title="Two angles."
          desc="Half the room works top-down from strategy. The other half works bottom-up from data."
          delay={600}
          dividerWeight="bold"
        />
        <Beat
          number="3"
          title="One question."
          desc="What AI use cases would you take to the CEO?"
          delay={900}
          dividerWeight={null}
        />
      </div>
    </Frame>
  );
}

interface BeatProps {
  number: string;
  title: string;
  desc: string;
  delay: number;
  dividerWeight: 'thin' | 'bold' | null;
}

function Beat({ number, title, desc, delay, dividerWeight }: BeatProps) {
  return (
    <>
      <div
        className="number-rise group flex items-center gap-10 py-5"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="shrink-0 w-28 flex items-center justify-center">
          <span className="font-display font-extrabold text-teal leading-none text-[clamp(5rem,8vw,7.5rem)] tracking-tighter">
            {number}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-navy-900 leading-tight text-[clamp(1.75rem,2.5vw,2.4rem)]">
            {title}
          </h3>
          <p className="mt-2 font-sans text-navy-700 leading-snug text-[clamp(1.05rem,1.3vw,1.25rem)]">
            {desc}
          </p>
        </div>
      </div>
      {dividerWeight && (
        <div
          className={`h-px w-full ${
            dividerWeight === 'bold' ? 'bg-teal/70 h-[2px]' : 'bg-surface-border'
          }`}
        />
      )}
    </>
  );
}
