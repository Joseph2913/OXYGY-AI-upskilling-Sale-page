import { useEffect, useState } from 'react';
import type { Route } from './types';
import { Day1 } from './pages/Day1';
import { Day2 } from './pages/Day2';
import { Landing } from './pages/Landing';

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

  if (route === 'day-1') return <Day1 />;
  if (route === 'day-2') return <Day2 />;
  return <Landing />;
}
