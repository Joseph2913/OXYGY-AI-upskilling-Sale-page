import { useCallback, useEffect, useState } from 'react';

const FRAME_HASH_RE = /^#?([a-z0-9-]+)(?:#(\d+))?$/i;

function parseHash(hash: string, routeKey: string): number {
  const match = FRAME_HASH_RE.exec(hash);
  if (!match) return 0;
  const [, route, frameIdx] = match;
  if (route !== routeKey) return 0;
  return frameIdx ? Math.max(0, parseInt(frameIdx, 10) - 1) : 0;
}

function buildHash(routeKey: string, frameIdx: number): string {
  return frameIdx === 0 ? `#${routeKey}` : `#${routeKey}#${frameIdx + 1}`;
}

/**
 * Two-segment hash sync. Reads `#day-1#3` as route="day-1" + frame index 2 (0-based).
 * Updates window.location.hash when index changes. Survives refresh.
 *
 * @param routeKey e.g. "day-1"
 * @param maxIndex total number of frames - 1 (clamps out-of-range)
 */
export function useHashState(routeKey: string, maxIndex: number): [number, (next: number) => void] {
  const [index, setIndex] = useState<number>(() =>
    Math.min(parseHash(window.location.hash, routeKey), maxIndex)
  );

  useEffect(() => {
    const onHashChange = () => {
      setIndex(Math.min(parseHash(window.location.hash, routeKey), maxIndex));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [routeKey, maxIndex]);

  const updateIndex = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(next, maxIndex));
      window.history.replaceState(null, '', buildHash(routeKey, clamped));
      setIndex(clamped);
    },
    [routeKey, maxIndex]
  );

  return [index, updateIndex];
}
