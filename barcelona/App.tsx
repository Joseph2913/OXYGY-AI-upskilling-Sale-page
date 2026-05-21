import { useEffect, useState } from 'react';
import type { Route } from './types';

function getRouteFromHash(): Route {
  const hash = window.location.hash.replace(/^#/, '').split('/')[0] ?? '';
  if (hash.startsWith('day-1')) return 'day-1';
  if (hash.startsWith('day-2')) return 'day-2';
  return 'landing';
}

export function App() {
  const [route, setRoute] = useState<Route>(getRouteFromHash);

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className="min-h-screen w-full bg-stage-base text-stage-white font-sans">
      <div className="p-8">
        <p className="text-stage-murmur">Route: {route}</p>
        <p className="text-stage-murmur">Bootstrap working. Frame content arrives in later tasks.</p>
        <p className="text-stage-murmur mt-4">Try: <a href="#day-1" className="text-teal underline">#day-1</a></p>
      </div>
    </div>
  );
}
