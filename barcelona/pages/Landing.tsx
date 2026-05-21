export function Landing() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stage-base text-stage-white">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-stage-murmur">
          Marketing landing — future round
        </p>
        <p className="mt-4 text-stage-murmur">
          Try <a href="#day-1" className="text-teal underline">#day-1</a> or{' '}
          <a href="#day-2" className="text-teal underline">#day-2</a>
        </p>
      </div>
    </div>
  );
}
