# Barcelona CHRO Day 1 Stage Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a presenter-driven `/day-1` stage page for the OXYGY × Working Futures CHRO event in Barcelona — full-screen, keyboard-navigated, 7 frames covering OXYGY's narrative for the Strategy + Data working session.

**Architecture:** Multi-entry Vite project (`barcelona.html` alongside existing `index.html`) with isolated Barcelona code in `barcelona/`. Reuses the existing Tailwind CDN pattern but with a distinct, dark-themed design token set defined inline in `barcelona.html`. Each frame is a focused React component registered in an ordered array; a shared `StagePage` shell owns keyboard nav, URL-hash state, and the Esc-toggled facilitator cockpit. Frame visual implementation is done via the Impeccable Design skill (`npx impeccable craft …`) once the chassis is in place.

**Tech Stack:** React 19, TypeScript (strict), Vite 6, Tailwind CSS (CDN), Impeccable Design skill for per-frame craft passes.

**Important context for the implementer:**

- This is a **brand-register** surface (design IS the product, projected to a room of senior CHROs). All visual choices must read `barcelona/PRODUCT.md` and `barcelona/DESIGN.md` first via `IMPECCABLE_CONTEXT_DIR=barcelona node .agents/skills/impeccable/scripts/load-context.mjs`.
- Reflex-reject font list (banned for this surface): Inter, Plus Jakarta Sans, DM Sans, DM Serif, Outfit, Manrope, Fraunces, Newsreader, Cormorant, Playfair, Space Grotesk, Space Mono, IBM Plex (any), Instrument Sans/Serif. The parent `index.html` uses DM Sans — Barcelona must NOT.
- No formal test framework in this repo. **Visual verification** at each step is the QA gate. Each task includes explicit verification criteria.
- One commit per task. No `git push` (user approval required separately).

---

## File Structure

Files to create or modify:

```
/OXYGY-AI-upskilling-Sale-page/
├── barcelona.html                           NEW — entry point with inline Tailwind + font links
├── barcelona/
│   ├── main.tsx                             NEW — React bootstrap
│   ├── App.tsx                              NEW — route switcher (#day-1, #day-2, #landing)
│   ├── pages/
│   │   ├── Day1.tsx                         NEW — assembles Day 1 frame array into StagePage
│   │   ├── Day2.tsx                         NEW — placeholder "Day 2 — coming soon"
│   │   └── Landing.tsx                      NEW — placeholder
│   ├── components/
│   │   ├── StagePage.tsx                    NEW — shell: keyboard nav + chrome + cockpit
│   │   ├── Frame.tsx                        NEW — base frame layout wrapper
│   │   ├── Cockpit.tsx                      NEW — Esc-toggled overlay (thumbnails + notes)
│   │   ├── BackgroundMesh.tsx               NEW — atmospheric gradient mesh background
│   │   └── frames/day1/
│   │       ├── 01-OpenerHook.tsx            NEW — Frame 1 (crafted via Impeccable)
│   │       ├── 02-ChroPosition.tsx          NEW — Frame 2
│   │       ├── 03-DataPicture.tsx           NEW — Frame 3
│   │       ├── 04-SteerPov.tsx              NEW — Frame 4
│   │       ├── 05-TwoHalves.tsx             NEW — Frame 5
│   │       ├── 06-TwoPillars.tsx            NEW — Frame 6
│   │       └── 07-WhatWeDeliver.tsx         NEW — Frame 7
│   ├── content/
│   │   └── day1.ts                          NEW — frame metadata (title, time, speaker notes)
│   ├── hooks/
│   │   ├── useHashState.ts                  NEW — URL hash <-> frame index sync
│   │   └── useKeyboardNav.ts                NEW — keyboard handler for navigation
│   ├── types.ts                             NEW — shared types (FrameMeta, etc.)
│   ├── PRODUCT.md                           EXISTS (committed earlier)
│   └── DESIGN.md                            EXISTS (committed earlier)
└── vite.config.ts                           MODIFY — add multi-entry rollupOptions.input
```

Build outputs: existing `dist/` for AI Upskilling site, new `dist/barcelona/` for Barcelona site (Vite default for multi-entry).

---

## Phase 1 — Bootstrap (Tasks 1–2)

Get a Barcelona route serving with React mounting an empty shell. No design work yet.

### Task 1: Multi-entry Vite config + Barcelona HTML entry + minimal React bootstrap

**Files:**
- Create: `barcelona.html`
- Create: `barcelona/main.tsx`
- Create: `barcelona/App.tsx`
- Create: `barcelona/types.ts`
- Modify: `vite.config.ts` (add `build.rollupOptions.input`)

- [ ] **Step 1: Create `barcelona/types.ts` with shared types**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/types.ts`

```typescript
import type { ComponentType } from 'react';

export type Route = 'day-1' | 'day-2' | 'landing';

export interface FrameMeta {
  id: string;
  title: string;
  targetMinutes: number;
  speakerNotes: string;
  component: ComponentType;
}
```

- [ ] **Step 2: Create `barcelona/App.tsx` with route switcher**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/App.tsx`

```typescript
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
```

- [ ] **Step 3: Create `barcelona/main.tsx`**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 4: Create `barcelona.html` with inline Tailwind config and system fonts (real fonts arrive at Frame 1)**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="https://oxygy.com/wp-content/uploads/2019/11/cropped-favicon-32x32.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OXYGY × Working Futures — Day 1 · Barcelona</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['system-ui', '-apple-system', 'sans-serif'],
              mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
            },
            colors: {
              'stage-base': '#0E1320',
              'stage-white': '#EAEFF5',
              'stage-murmur': '#8B97A6',
              teal: {
                DEFAULT: '#38B2AC',
                dark: '#2C9A94',
              },
              accent: {
                yellow: '#F7E8A4',
                lavender: '#C3D0F5',
                peach: '#F5B8A0',
              },
            },
          },
        },
      };
    </script>
    <style>
      html, body, #root { height: 100%; }
      body { margin: 0; background: #0E1320; }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    </style>
    <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@^19.2.4",
          "react-dom/": "https://esm.sh/react-dom@^19.2.4/",
          "react/": "https://esm.sh/react@^19.2.4/",
          "lucide-react": "https://esm.sh/lucide-react@^0.563.0"
        }
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/barcelona/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Modify `vite.config.ts` to register the second entry**

Locate the `defineConfig` block at the bottom of `vite.config.ts`. Add a `build` block with `rollupOptions.input` that lists both entries. If a `build` block already exists, merge into it.

Add this block to the `defineConfig({...})` return object:

```typescript
build: {
  rollupOptions: {
    input: {
      main: path.resolve(__dirname, 'index.html'),
      barcelona: path.resolve(__dirname, 'barcelona.html'),
    },
  },
},
```

Verify by running: `grep -n "rollupOptions" vite.config.ts` — expect to see the input mapping.

- [ ] **Step 6: Start dev server and verify Barcelona route loads**

Run in a separate terminal: `npm run dev`

Open in browser: `http://localhost:5173/barcelona.html`

Expected: dark navy page (`#0E1320`) with light-grey text reading "Route: landing", a paragraph about bootstrap working, and a teal underlined "#day-1" link. Clicking it changes "Route: landing" to "Route: day-1".

Verify the existing site is unaffected: `http://localhost:5173/` should render the AI Upskilling sales page normally.

- [ ] **Step 7: Commit**

```bash
git add barcelona.html barcelona/main.tsx barcelona/App.tsx barcelona/types.ts vite.config.ts
git commit -m "$(cat <<'EOF'
Bootstrap Barcelona stage page entry: multi-entry Vite + dark-themed shell

Adds barcelona.html as a second Vite entry alongside index.html, with
its own inline Tailwind config (dark stage palette: stage-base, stage-
white, stage-murmur, teal, accent-yellow/lavender/peach). System fonts
used as a placeholder; real non-reflex sans + mono picked at Frame 1
craft pass.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Wire up basic route switching with placeholder pages

**Files:**
- Create: `barcelona/pages/Day1.tsx`
- Create: `barcelona/pages/Day2.tsx`
- Create: `barcelona/pages/Landing.tsx`
- Modify: `barcelona/App.tsx`

- [ ] **Step 1: Create `barcelona/pages/Landing.tsx`**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/pages/Landing.tsx`

```typescript
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
```

- [ ] **Step 2: Create `barcelona/pages/Day2.tsx`**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/pages/Day2.tsx`

```typescript
export function Day2() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stage-base text-stage-white">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-stage-murmur">
          Day 2 — coming soon
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `barcelona/pages/Day1.tsx` with placeholder content**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/pages/Day1.tsx`

```typescript
export function Day1() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stage-base text-stage-white">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-stage-murmur">
          Day 1 — Stage Page
        </p>
        <p className="mt-6 text-stage-white text-2xl">
          Frames will render here.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update `barcelona/App.tsx` to render the right page per route**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/App.tsx`

Replace the entire file with:

```typescript
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
```

- [ ] **Step 5: Verify in browser**

With dev server still running, visit:
- `http://localhost:5173/barcelona.html` → "Marketing landing — future round" centred on dark navy
- `http://localhost:5173/barcelona.html#day-1` → "Day 1 — Stage Page" + "Frames will render here."
- `http://localhost:5173/barcelona.html#day-2` → "Day 2 — coming soon"

Each navigation works without page reload (hash change handled in JS).

- [ ] **Step 6: Commit**

```bash
git add barcelona/pages/Day1.tsx barcelona/pages/Day2.tsx barcelona/pages/Landing.tsx barcelona/App.tsx
git commit -m "$(cat <<'EOF'
Add Barcelona page routing with placeholder Day1/Day2/Landing pages

Hash-based routing: #day-1, #day-2, default landing. No-reload nav via
hashchange listener. Placeholders show the route label in mono caps;
real content comes in subsequent tasks.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Stage Page Shell (Tasks 3–5)

Build the shared chassis that every Day 1 / Day 2 stage page sits inside: hash-based frame state, keyboard navigation, Esc-toggled cockpit overlay, frame counter chrome.

### Task 3: Build `useHashState` hook for frame-index URL sync

The hook reads the `#day-1#3` style hash, extracts the frame index, and exposes a setter that updates the hash. Two-segment hash so the route stays `day-1` while the frame index changes.

**Files:**
- Create: `barcelona/hooks/useHashState.ts`

- [ ] **Step 1: Write the hook**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/hooks/useHashState.ts`

```typescript
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
```

- [ ] **Step 2: Manual verification (no test framework — we'll wire it up in Task 5 and visually verify)**

Skip standalone verification — this hook gets exercised end-to-end in Task 5's StagePage component. No commit yet; bundle with Task 4 commit.

---

### Task 4: Build `useKeyboardNav` hook

Listens for arrow keys, space, page up/down, home, end, Esc, T. Calls callbacks. Ignores events when typing inside form fields (none in this surface, but defensive).

**Files:**
- Create: `barcelona/hooks/useKeyboardNav.ts`

- [ ] **Step 1: Write the hook**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/hooks/useKeyboardNav.ts`

```typescript
import { useEffect } from 'react';

export interface KeyboardNavHandlers {
  onNext: () => void;
  onPrev: () => void;
  onFirst: () => void;
  onLast: () => void;
  onToggleCockpit: () => void;
  onToggleTimer: () => void;
}

const FORM_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

function isFormInput(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (FORM_TAGS.has(target.tagName)) return true;
  if (target.isContentEditable) return true;
  return false;
}

export function useKeyboardNav(handlers: KeyboardNavHandlers): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isFormInput(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          handlers.onNext();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          handlers.onPrev();
          break;
        case 'Home':
          e.preventDefault();
          handlers.onFirst();
          break;
        case 'End':
          e.preventDefault();
          handlers.onLast();
          break;
        case 'Escape':
          e.preventDefault();
          handlers.onToggleCockpit();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          handlers.onToggleTimer();
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handlers]);
}
```

- [ ] **Step 2: Commit both hooks together**

```bash
git add barcelona/hooks/useHashState.ts barcelona/hooks/useKeyboardNav.ts
git commit -m "$(cat <<'EOF'
Add hooks: useHashState (URL <-> frame index sync), useKeyboardNav

Two-segment hash format (#day-1#3) keeps route + frame state in URL —
refresh-safe and bookmarkable. Keyboard handler covers arrow keys,
space, page up/down, home, end, Esc (cockpit toggle), T (timer toggle).
Defensive against form-input focus (none in this surface, but cheap).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Build `StagePage` shell component

The shell renders the current frame, owns navigation state, draws brand mark + frame counter chrome, and hosts the cockpit overlay. Takes a `routeKey` and an array of `FrameMeta`.

**Files:**
- Create: `barcelona/components/StagePage.tsx`

- [ ] **Step 1: Write the component**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/components/StagePage.tsx`

```typescript
import { useState } from 'react';
import type { FrameMeta } from '../types';
import { useHashState } from '../hooks/useHashState';
import { useKeyboardNav } from '../hooks/useKeyboardNav';

interface StagePageProps {
  routeKey: string;
  dayLabel: string;
  frames: FrameMeta[];
}

export function StagePage({ routeKey, dayLabel, frames }: StagePageProps) {
  const maxIndex = frames.length - 1;
  const [frameIndex, setFrameIndex] = useHashState(routeKey, maxIndex);
  const [cockpitOpen, setCockpitOpen] = useState(false);
  const [timerOn, setTimerOn] = useState(false);

  useKeyboardNav({
    onNext: () => setFrameIndex(frameIndex + 1),
    onPrev: () => setFrameIndex(frameIndex - 1),
    onFirst: () => setFrameIndex(0),
    onLast: () => setFrameIndex(maxIndex),
    onToggleCockpit: () => setCockpitOpen((open) => !open),
    onToggleTimer: () => setTimerOn((on) => !on),
  });

  const currentFrame = frames[frameIndex];
  const FrameComponent = currentFrame.component;

  return (
    <div className="relative min-h-screen w-full bg-stage-base text-stage-white overflow-hidden">
      {/* Frame content (BackgroundMesh inserted in Task 7 once component exists) */}
      <main className="relative z-10 min-h-screen w-full">
        <FrameComponent />
      </main>

      {/* Brand mark — bottom-left, low opacity */}
      <div className="absolute left-8 bottom-8 z-20 font-mono text-xs uppercase tracking-[0.2em] text-stage-murmur/60 select-none pointer-events-none">
        OXYGY × Working Futures — {dayLabel}
      </div>

      {/* Frame counter — bottom-right, low opacity */}
      <div className="absolute right-8 bottom-8 z-20 font-mono text-xs uppercase tracking-[0.2em] text-stage-murmur/60 select-none pointer-events-none">
        {String(frameIndex + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}
      </div>

      {/* Optional per-frame timer badge */}
      {timerOn && (
        <div className="absolute right-8 top-8 z-20 font-mono text-xs uppercase tracking-[0.2em] text-teal/80 border border-teal/40 px-3 py-1.5 rounded-full">
          {currentFrame.targetMinutes} min target
        </div>
      )}

      {/* Cockpit placeholder — full implementation in Task 6 */}
      {cockpitOpen && (
        <div
          className="absolute inset-0 z-30 bg-stage-base/95 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setCockpitOpen(false)}
        >
          <div className="text-stage-white">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-stage-murmur mb-4">
              Facilitator cockpit
            </p>
            <p>Frame {frameIndex + 1} of {frames.length}: {currentFrame.title}</p>
            <p className="text-stage-murmur mt-4 max-w-xl">{currentFrame.speakerNotes}</p>
            <p className="text-stage-murmur/60 mt-8 font-mono text-xs">Press Esc to close · Thumbnails arrive in Task 6</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify nothing renders yet (we have no frames wired into Day1)**

The page still renders the placeholder Day1. We'll wire StagePage in Task 7. For now, no visible change — just verify TypeScript compiles by re-loading the dev server (no errors in browser console).

- [ ] **Step 3: Commit**

```bash
git add barcelona/components/StagePage.tsx
git commit -m "$(cat <<'EOF'
Add StagePage shell: keyboard nav + chrome + cockpit placeholder

Frame index state lives in URL hash (refresh-safe). Brand mark and
frame counter pinned to corners at low opacity. T toggles a teal-edged
timer badge with the current frame's target time. Esc opens a minimal
cockpit (full thumbnail+notes version in Task 6).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Replace the inline cockpit placeholder with full `Cockpit` component

The cockpit is the facilitator overlay: thumbnail grid of all frames (click to jump), speaker notes for the current frame, elapsed-time counter, per-frame target-minutes display.

**Files:**
- Create: `barcelona/components/Cockpit.tsx`
- Modify: `barcelona/components/StagePage.tsx`

- [ ] **Step 1: Write `Cockpit.tsx`**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/components/Cockpit.tsx`

```typescript
import { useEffect, useState } from 'react';
import type { FrameMeta } from '../types';

interface CockpitProps {
  frames: FrameMeta[];
  currentIndex: number;
  onJumpTo: (index: number) => void;
  onClose: () => void;
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function Cockpit({ frames, currentIndex, onJumpTo, onClose }: CockpitProps) {
  const [startTime] = useState<number>(() => Date.now());
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(Date.now() - startTime), 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const currentFrame = frames[currentIndex];
  const targetTotalMin = frames.reduce((acc, f) => acc + f.targetMinutes, 0);

  return (
    <div
      className="absolute inset-0 z-30 bg-stage-base/95 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div className="max-w-6xl mx-auto p-12" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-stage-murmur">
            Facilitator cockpit
          </h2>
          <div className="flex items-baseline gap-8 font-mono text-xs uppercase tracking-[0.15em] text-stage-murmur">
            <span>Elapsed <span className="text-teal ml-2">{formatElapsed(elapsed)}</span></span>
            <span>Target <span className="text-teal ml-2">{targetTotalMin} min</span></span>
            <button onClick={onClose} className="text-stage-white hover:text-teal transition-colors">
              Esc to close
            </button>
          </div>
        </div>

        {/* Speaker notes for current frame */}
        <div className="mb-12 border-l-2 border-teal pl-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal mb-2">
            Now showing · Frame {currentIndex + 1} · {currentFrame.targetMinutes} min target
          </p>
          <h3 className="text-2xl text-stage-white mb-3">{currentFrame.title}</h3>
          <p className="text-stage-murmur leading-relaxed max-w-2xl">
            {currentFrame.speakerNotes}
          </p>
        </div>

        {/* Thumbnail grid */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-stage-murmur mb-4">
            All frames · click to jump
          </p>
          <div className="grid grid-cols-4 gap-3">
            {frames.map((frame, idx) => {
              const active = idx === currentIndex;
              return (
                <button
                  key={frame.id}
                  onClick={() => {
                    onJumpTo(idx);
                    onClose();
                  }}
                  className={`text-left p-4 border transition-colors ${
                    active
                      ? 'border-teal bg-teal/10'
                      : 'border-stage-murmur/30 hover:border-stage-white/60'
                  }`}
                >
                  <p className="font-mono text-xs text-stage-murmur mb-2">
                    {String(idx + 1).padStart(2, '0')} · {frame.targetMinutes} min
                  </p>
                  <p className={`text-sm ${active ? 'text-stage-white' : 'text-stage-murmur'}`}>
                    {frame.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update `StagePage.tsx` to use the real Cockpit**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/components/StagePage.tsx`

In the existing file, replace the entire `{cockpitOpen && (...)}` block with:

```typescript
      {cockpitOpen && (
        <Cockpit
          frames={frames}
          currentIndex={frameIndex}
          onJumpTo={setFrameIndex}
          onClose={() => setCockpitOpen(false)}
        />
      )}
```

Add this import at the top of the file (after the existing imports):

```typescript
import { Cockpit } from './Cockpit';
```

- [ ] **Step 3: Verification deferred to Task 7**

We can't yet see the Cockpit without a `FrameMeta` array. Task 7 wires it up. No commit yet — bundle with Task 7's commit.

---

## Phase 3 — Frame Infrastructure (Task 7)

### Task 7: Frame base layout + BackgroundMesh + Day1 wiring with 7 placeholder frames

**Files:**
- Create: `barcelona/components/Frame.tsx`
- Create: `barcelona/components/BackgroundMesh.tsx`
- Create: `barcelona/content/day1.ts`
- Create: `barcelona/components/frames/day1/01-OpenerHook.tsx` (placeholder)
- Create: `barcelona/components/frames/day1/02-ChroPosition.tsx` (placeholder)
- Create: `barcelona/components/frames/day1/03-DataPicture.tsx` (placeholder)
- Create: `barcelona/components/frames/day1/04-SteerPov.tsx` (placeholder)
- Create: `barcelona/components/frames/day1/05-TwoHalves.tsx` (placeholder)
- Create: `barcelona/components/frames/day1/06-TwoPillars.tsx` (placeholder)
- Create: `barcelona/components/frames/day1/07-WhatWeDeliver.tsx` (placeholder)
- Modify: `barcelona/pages/Day1.tsx`

- [ ] **Step 1: Create `barcelona/components/BackgroundMesh.tsx`**

This is a minimal stub — Frame 1's craft pass will replace its visual with the real gradient mesh. For now, ensure it renders and reserves the position.

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/components/BackgroundMesh.tsx`

```typescript
export function BackgroundMesh() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse at 20% 20%, rgba(56, 178, 172, 0.06) 0%, transparent 50%), ' +
          'radial-gradient(ellipse at 80% 70%, rgba(195, 208, 245, 0.04) 0%, transparent 55%)',
      }}
      aria-hidden
    />
  );
}
```

- [ ] **Step 1b: Mount `BackgroundMesh` inside `StagePage`**

Modify `barcelona/components/StagePage.tsx`:

Add this import to the top of the file (after the existing `useKeyboardNav` import):

```typescript
import { BackgroundMesh } from './BackgroundMesh';
```

Then in the JSX, just after the opening `<div className="relative min-h-screen w-full bg-stage-base ...">`, replace the existing `{/* Frame content (BackgroundMesh inserted in Task 7 once component exists) */}` comment with:

```typescript
      {/* Atmospheric background — sits behind frame content */}
      <BackgroundMesh />

      {/* Frame content */}
```

- [ ] **Step 2: Create `barcelona/components/Frame.tsx`**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/components/Frame.tsx`

```typescript
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
      className={`relative min-h-screen w-full flex items-center justify-center px-12 py-16 ${className}`}
    >
      <div className="relative z-10 w-full max-w-6xl frame-enter">
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add `frame-enter` animation in `barcelona.html`**

Modify `barcelona.html`. Inside the existing `<style>` block, append:

```css
      @keyframes frame-enter {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .frame-enter > * {
        opacity: 0;
        animation: frame-enter 0.4s ease-out forwards;
      }
      .frame-enter > *:nth-child(1) { animation-delay: 0ms; }
      .frame-enter > *:nth-child(2) { animation-delay: 80ms; }
      .frame-enter > *:nth-child(3) { animation-delay: 160ms; }
      .frame-enter > *:nth-child(4) { animation-delay: 240ms; }
      .frame-enter > *:nth-child(5) { animation-delay: 320ms; }
      .frame-enter > *:nth-child(6) { animation-delay: 400ms; }
```

- [ ] **Step 4: Create placeholder frames (all seven, identical pattern)**

For each of the 7 frame files below, use the same template, varying only the frame number / title.

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/components/frames/day1/01-OpenerHook.tsx`

```typescript
import { Frame } from '../../Frame';

export function OpenerHook() {
  return (
    <Frame>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-stage-murmur">
        Frame 01 — placeholder
      </p>
      <h1 className="text-stage-white text-4xl mt-4">Opener + Hook</h1>
      <p className="text-stage-murmur mt-2">Crafted via Impeccable in Task 9.</p>
    </Frame>
  );
}
```

Create the other six placeholder files with the same shape, substituting frame number and title:

- `02-ChroPosition.tsx` → `ChroPosition`, "Frame 02 — placeholder", "CHRO's Unique Position"
- `03-DataPicture.tsx` → `DataPicture`, "Frame 03 — placeholder", "Accurate Data Picture"
- `04-SteerPov.tsx` → `SteerPov`, "Frame 04 — placeholder", "Steer + POV"
- `05-TwoHalves.tsx` → `TwoHalves`, "Frame 05 — placeholder", "Two Halves That Meet"
- `06-TwoPillars.tsx` → `TwoPillars`, "Frame 06 — placeholder", "The Two Pillars"
- `07-WhatWeDeliver.tsx` → `WhatWeDeliver`, "Frame 07 — placeholder", "What We Deliver"

- [ ] **Step 5: Create `barcelona/content/day1.ts` — frame metadata array**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/content/day1.ts`

```typescript
import type { FrameMeta } from '../types';
import { OpenerHook } from '../components/frames/day1/01-OpenerHook';
import { ChroPosition } from '../components/frames/day1/02-ChroPosition';
import { DataPicture } from '../components/frames/day1/03-DataPicture';
import { SteerPov } from '../components/frames/day1/04-SteerPov';
import { TwoHalves } from '../components/frames/day1/05-TwoHalves';
import { TwoPillars } from '../components/frames/day1/06-TwoPillars';
import { WhatWeDeliver } from '../components/frames/day1/07-WhatWeDeliver';

export const day1Frames: FrameMeta[] = [
  {
    id: 'opener-hook',
    title: 'Opener + Hook',
    targetMinutes: 1,
    speakerNotes:
      'Title slide that IS the hook. Pause after each line. Then say: "That\'s the gap we\'re closing this hour."',
    component: OpenerHook,
  },
  {
    id: 'chro-position',
    title: "CHRO's Unique Position",
    targetMinutes: 1,
    speakerNotes:
      'Most CHROs default to letting the CIO drive AI. That\'s a strategic miss. You\'re the bridge.',
    component: ChroPosition,
  },
  {
    id: 'data-picture',
    title: 'Accurate Data Picture',
    targetMinutes: 2,
    speakerNotes:
      'Walk each item. Pause on DUPLICATES — biggest commercial unlock. Most CHROs have never seen this map.',
    component: DataPicture,
  },
  {
    id: 'steer-pov',
    title: 'Steer + POV',
    targetMinutes: 1.5,
    speakerNotes:
      'CHROs resist AI because they think they have to learn data engineering. They don\'t. They have to learn what to ask for. Spend extra time on the ongoing-data point.',
    component: SteerPov,
  },
  {
    id: 'two-halves',
    title: 'Two Halves That Meet',
    targetMinutes: 1,
    speakerNotes:
      'Set up the next frame. Don\'t dive into either pillar yet.',
    component: TwoHalves,
  },
  {
    id: 'two-pillars',
    title: 'The Two Pillars',
    targetMinutes: 1.5,
    speakerNotes:
      'High-level view of Leadership Strategic Agenda + Data Foundation Mapping. Anchor what we do. No deep dives.',
    component: TwoPillars,
  },
  {
    id: 'what-we-deliver',
    title: 'What We Deliver',
    targetMinutes: 1,
    speakerNotes:
      'Soft sell. The diagnostic is focused, defendable, board-ready. No week numbers, no specifics — anchor the outcome.',
    component: WhatWeDeliver,
  },
];
```

- [ ] **Step 6: Rewrite `barcelona/pages/Day1.tsx` to use `StagePage` + frames**

Path: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/pages/Day1.tsx`

Replace the entire file with:

```typescript
import { StagePage } from '../components/StagePage';
import { day1Frames } from '../content/day1';

export function Day1() {
  return <StagePage routeKey="day-1" dayLabel="DAY 1" frames={day1Frames} />;
}
```

(`BackgroundMesh` is rendered inside `StagePage` — Day1 just composes content + chassis.)

- [ ] **Step 7: Verify in browser**

With dev server running:
- Visit `http://localhost:5173/barcelona.html#day-1`
- Expect: Frame 01 placeholder ("Opener + Hook") rendered, brand mark + frame counter visible at the bottom
- Press `→` or Space — Frame 02 placeholder appears, counter changes to `02 / 07`. URL hash becomes `#day-1#2`
- Press `←` — back to Frame 01
- Press `Home` — Frame 01. Press `End` — Frame 07
- Press `Esc` — Cockpit overlay opens. Thumbnails visible. Click any thumbnail — jumps to that frame and closes cockpit
- Press `T` — teal timer badge appears top-right showing target minutes for current frame
- Refresh the page on `#day-1#4` — Frame 04 is the one that renders (not Frame 01)

- [ ] **Step 8: Commit**

```bash
git add barcelona/components/Frame.tsx barcelona/components/BackgroundMesh.tsx barcelona/components/frames/day1/ barcelona/content/day1.ts barcelona/pages/Day1.tsx barcelona/components/StagePage.tsx barcelona/components/Cockpit.tsx barcelona.html
git commit -m "$(cat <<'EOF'
Wire Day 1 stage page with 7 placeholder frames + full Cockpit

StagePage drives keyboard nav across the day1Frames array. Frame base
layout adds a 400ms staggered fade-in on entry (respects prefers-
reduced-motion via barcelona.html). BackgroundMesh stub holds the spot
for the real gradient mesh, picked at Frame 1 craft pass. Cockpit
shows speaker notes for the current frame, elapsed time, and a
clickable thumbnail grid.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Frame Implementation via Impeccable (Tasks 8–14)

Each task follows the same pattern. The chassis is in place; we now craft each frame's visual + content using the Impeccable Design skill. The first frame (Task 8) carries an extra responsibility: it commits the typography choice that propagates to every subsequent frame.

### How to invoke Impeccable for each frame

Each frame task is structured as a brief to the Impeccable skill. The implementer runs:

```bash
IMPECCABLE_CONTEXT_DIR=barcelona node .agents/skills/impeccable/scripts/load-context.mjs
```

…then opens a craft session by invoking the Impeccable skill via the slash command (`/impeccable craft <description>`) or by directly editing the frame file with the skill's reference loaded. Either way, the skill loads `barcelona/PRODUCT.md` and `barcelona/DESIGN.md` and must honour the constraints there (banned fonts, restrained colour, one accent per frame, etc.).

The implementer is expected to:

1. Read the frame's "Visual brief" section in this plan
2. Read the "Acceptance criteria" section
3. Implement (with `/impeccable craft` or equivalent)
4. Render in browser at the matching URL
5. Iterate using `/impeccable polish`, `/impeccable bolder`, `/impeccable quieter`, or `/impeccable live` until acceptance criteria are met
6. Commit

---

### Task 8: Craft Frame 1 — Opener + Hook *(also commits typography choice)*

**File to modify:** `barcelona/components/frames/day1/01-OpenerHook.tsx`
**Also modify (first time only):** `barcelona.html` — replace `system-ui` with the chosen sans + add mono font

**URL to test at:** `http://localhost:5173/barcelona.html#day-1#1`

**Visual brief:**
- Tiny top lockup (low opacity, mono, tracked uppercase): `WORKING FUTURES × OXYGY · BARCELONA · JUNE 10, 2026`
- Mid: `DAY 1` tag in teal, mono, small caps
- Display: **"AI use cases don't live in your strategy deck. Or your data lake. They live at the meeting of both."** — three lines, one per row. Teal underline beneath "the meeting of both."
- Bottom (subtle, mono, low opacity): `Joseph Thomas · Edoardo Monopoli · Yuji Develle`
- One quiet visual element: a two-circle Venn (Strategy + Data) sitting at the right edge or behind the type, OKLCH-correct soft fills, no shadows. Strategy in pale yellow at very low opacity, Data in lavender at very low opacity, overlap implies (don't label) the meeting point.
- Asymmetric layout — type left-aligned to a left rail, Venn anchored to the right. Not centered.

**Typography choice (commit this in this task):**
- Pick a non-reflex sans for display + body. Recommended candidates: **Hanken Grotesk** (Google Fonts, characterful humanist), **Geist Sans** (Google Fonts, distinctive geometric), **Onest** (Google Fonts, clean humanist), or **Funnel Display** (Google Fonts, characterful display). Whichever is chosen, also add **Geist Mono** or equivalent for mono companion.
- Banned: Inter, Plus Jakarta Sans, DM Sans, Outfit, Manrope, Fraunces, Newsreader, Cormorant, Playfair, Space Grotesk, Space Mono, IBM Plex (any).
- Update `barcelona.html` `<link>` tag to load the chosen fonts from Google Fonts.
- Update `tailwind.config` script in `barcelona.html`: change `fontFamily.sans` and `fontFamily.mono` to the chosen families.

**Acceptance criteria:**
- Display type readable from the back of a conference room (≥60px, ideally clamped 60–96px)
- Body / metadata ≥14px for the kicker, with high enough contrast (7:1) against the dark base
- One accent: teal underline only. Soft accents in the Venn are low-opacity atmospherics, not competing accents
- 400ms staggered reveal on first paint — already wired by `Frame` base. Respect `prefers-reduced-motion`
- No drop shadows. No glassmorphism. No bullet points. No checkmarks.
- Passes the "single voice" rule: the mono is for the kicker + names only; everything else is the chosen sans
- Looks distinctively different from the parent AI Upskilling site (which uses DM Sans + teal everywhere)

**Implementation pattern:**

Replace the current placeholder content in `01-OpenerHook.tsx`. The component receives no props. It uses Tailwind classes (already defined via the inline config in `barcelona.html`) and may include inline `<style>` if needed for one-off effects.

**Commit message template:**

```
Craft Frame 1: Opener + Hook (commits typography choice)

[Brief description of the visual decision: chosen sans family + reasoning,
chosen mono companion. Layout summary. Why the chosen approach over
alternatives.]

Updates barcelona.html with Google Fonts link for the chosen families
and updates the Tailwind fontFamily config accordingly. All subsequent
frames inherit this type system.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

---

### Task 9: Craft Frame 2 — CHRO's Unique Position

**File to modify:** `barcelona/components/frames/day1/02-ChroPosition.tsx`
**URL to test at:** `http://localhost:5173/barcelona.html#day-1#2`

**Visual brief:**
- Mono kicker top-left: `FRAME 02 · CHRO'S UNIQUE POSITION` (already in chrome, optional to repeat)
- Headline (sans, large, but smaller than Frame 1's display): **"Why this is your moment"**
- Three cards in a row (responsive: stack on narrow, three columns at desktop):
  1. **You sit on the most strategic asset** — supporting line: "Talent. People. Capability."
  2. **You sit on the messiest data** — supporting line: "HRIS. Performance. Capacity. Skills."
  3. **You're the only one with authority to broker both** — supporting line: "Not IT. Not Strategy. You."
- Each card: thin border in `stage-murmur/30`, generous internal padding, no shadow. Title in stage-white sans medium, supporting line in stage-murmur. A small teal numeral (`01`, `02`, `03`) in mono at the top-left of each card as the only accent.

**Acceptance criteria:**
- One accent (teal numerals). No competing colour highlights.
- Cards read as equals (same width, same internal spacing) — no card is visually privileged
- Body type 20px+ inside cards, headline ≥40px
- Cards keep their integrity at projector resolution (1920×1080 typical); type does not crowd internal padding
- No icons; no checkmarks; no scaling-pyramid metaphors
- Asymmetric outer layout permitted (e.g. headline left-rail, cards right-rail) — avoid centred-stack template feel

**Commit message:** `Craft Frame 2: CHRO's Unique Position (three-card row)`

---

### Task 10: Craft Frame 3 — Accurate Data Picture

**File to modify:** `barcelona/components/frames/day1/03-DataPicture.tsx`
**URL to test at:** `http://localhost:5173/barcelona.html#day-1#3`

**Visual brief:**
- Headline (sans, large): **"What 'an accurate data picture' actually means"**
- Sub-line (smaller, stage-murmur): "For AI to be useful, your organisation has to be queryable from the people side."
- 2×3 grid of small cards. Each card has:
  - A mono caps label (e.g. `WHO`, `WHAT`, `SKILLS`, `PROCESSES`, `STANDARDS`, `DUPLICATES`)
  - A one-line description in sans body

Card content (exact wording):

| Label | Description |
|---|---|
| WHO | is working on what at any given point |
| WHAT | topics they're working on right now |
| SKILLS | and tools they have access to |
| PROCESSES | they actually use day-to-day |
| STANDARDS | SOPs and workflows they follow |
| DUPLICATES | where the same work happens different ways |

**Acceptance criteria:**
- Grid is even (2×3). Cards same dimensions. Generous gutter (≥2rem).
- Mono labels at body-size or slightly larger, with letter-spacing for readability at distance
- The DUPLICATES card optionally gets a subtle visual emphasis (slightly stronger border, or a single teal underline on the label) — pause moment for the facilitator. ONE emphasis maximum, this is the room's "aha."
- No icons in the cards
- One accent total across the frame: either the teal underline on DUPLICATES, or no accent at all. Not both.
- Per the One Accent Rule + the Distance Rule from DESIGN.md

**Commit message:** `Craft Frame 3: Accurate Data Picture (2×3 grid)`

---

### Task 11: Craft Frame 4 — Steer + POV (merged)

**File to modify:** `barcelona/components/frames/day1/04-SteerPov.tsx`
**URL to test at:** `http://localhost:5173/barcelona.html#day-1#4`

**Visual brief:**

This frame has three beats, vertically stacked. Use generous space between beats — they are conceptually distinct.

- **Beat 1 (top):** Two-line statement, large display sans:
  > **Your job isn't to build the data layer.**
  > **Your job is to demand it.**

  Underneath in sans body, stage-murmur, smaller: "And then use it to make holistic decisions about people, expertise, and where work actually happens."

- **Beat 2 (middle):** Three OXYGY-POV statements, sans body but emphasised weight. Each with a teal mono numeric marker (`01`, `02`, `03`):
  - `01` **Strategy without data is fantasy.**
  - `02` **Data without strategy is noise.**
  - `03` **AI use cases live at the meeting of both.**

- **Beat 3 (bottom):** A callout in a thin bordered box (border in pale yellow, fill at very low pale-yellow opacity):
  > "And data has to be **ongoing** — not a snapshot. Baseline. Test. See change. Refine."

**Acceptance criteria:**
- Three beats clearly separated by space (≥4rem between)
- One soft accent only — the pale yellow callout in Beat 3
- Teal numeric markers are the brand accent (mono, small, at ≤10% of surface)
- Type reads from back of room — Beat 1's two lines should be the largest type on the frame
- Vertical rhythm dominates — no horizontal sprawl
- No bullets, no checkboxes, no decorative icons

**Commit message:** `Craft Frame 4: Steer + POV (merged) — three vertical beats`

---

### Task 12: Craft Frame 5 — Our offering: two halves that meet

**File to modify:** `barcelona/components/frames/day1/05-TwoHalves.tsx`
**URL to test at:** `http://localhost:5173/barcelona.html#day-1#5`

**Visual brief:**
- Headline (sans, large): **"What we do in this space"**
- Two columns side-by-side, separated by a centre gutter:
  - **LEFT column (pale-yellow accent):** Title "Leadership Strategic Agenda" in sans medium. Supporting line: "The top-down: aligning leadership vision to AI initiatives." A thin pale-yellow border-top.
  - **RIGHT column (lavender accent):** Title "Data Foundation Mapping" in sans medium. Supporting line: "The bottom-up: making the people side of your org queryable." A thin lavender border-top.
- Beneath the two columns, a Y-shaped converging connector (two thin lines from the column bases meeting at a single point lower-centre)
- At the meeting point, a single label in a teal pill: **= AI Use Cases that can be funded**

**Acceptance criteria:**
- The split between strategy (yellow) and data (lavender) is the visual story — Frame 5 is the only frame allowed to use TWO soft accents (per the Positional Soft-Accent Rule, which says one per frame *unless* the frame literally depicts the meeting)
- The convergence label is teal — the single brand-accent moment
- Columns balanced (same width, same height)
- Y-connector drawn cleanly (SVG strokes, no fills, no rounded joints that look "pillowy")
- The convergence label sits below the columns, not inside them

**Commit message:** `Craft Frame 5: Two halves that meet (split + Y converge)`

---

### Task 13: Craft Frame 6 — The two pillars (high-level)

**File to modify:** `barcelona/components/frames/day1/06-TwoPillars.tsx`
**URL to test at:** `http://localhost:5173/barcelona.html#day-1#6`

**Visual brief:**

This is the high-level view of both pillars — no deep dives. The viewer should leave with a confident impression of "OXYGY has thought hard about both halves" without being expected to absorb the detail.

Layout:
- Two stacked rows (vertical, not side-by-side this time):
  - **Top row — Leadership Strategic Agenda**: title in sans medium, one-line summary ("A framework that takes vision through to deployment"), and a single ultra-compact visual hint — three or four small mono labels in a row: `BIG Y` → `LITTLE Ys` → `XS` → `QUARTERLY` (with small arrows, no boxes). Pale-yellow tinted background panel.
  - **Bottom row — Data Foundation Mapping**: title in sans medium, one-line summary ("A system that keeps the people side of your org queryable"), and a single ultra-compact visual hint — three or four small mono labels in a row: `SOURCES` → `PEOPLE PICTURE` → `SIGNALS` (with arrows and a tiny loop-back arrow). Lavender tinted background panel.

The point of this frame is to register the SHAPE of each pillar, not the content. If a viewer can describe "one is a cascade, the other is a loop" after 90 seconds, the frame has worked.

**Acceptance criteria:**
- Two rows, not two columns
- Each row gets one soft accent (yellow / lavender), per the Positional Rule (these are still on opposite sides of the same idea)
- Visual hints are mono labels with arrows, not full diagrams — restraint is the point
- No deep-dive content, no AGENDA acronym broken out, no full data flow
- Type ≥20px body, ≥40px section headlines

**Commit message:** `Craft Frame 6: Two pillars (high-level overview)`

---

### Task 14: Craft Frame 7 — What we deliver

**File to modify:** `barcelona/components/frames/day1/07-WhatWeDeliver.tsx`
**URL to test at:** `http://localhost:5173/barcelona.html#day-1#7`

**Visual brief:**
- Headline (sans, large): **"What we deliver"**
- Sub-line (sans body, stage-murmur): "A focused diagnostic that produces a defendable, prioritised use case portfolio."
- Three small phase labels in a horizontal row (mono caps):
  - `DISCOVER` — sub-line: "Strategy + data audits in parallel"
  - `SYNTHESISE` — sub-line: "Where strategy and data meet"
  - `DELIVER` — sub-line: "Board-ready use case portfolio"
- No week numbers. No use-case counts. No timelines or arrows between phases. The three labels stand as equals.
- A single teal pill at the bottom: **"Continue the conversation"** — this is the soft CTA / signal to the facilitator that this is where the room's exit point sits

**Acceptance criteria:**
- No specifics that would be wrong at scale — no "3-5 weeks", no "5-8 use cases", no "Week 1: …"
- Three phase labels balanced (same width, equal weight)
- One accent: the teal pill at the bottom
- The frame reads as a soft handoff, not a hard close

**Commit message:** `Craft Frame 7: What we deliver (three-phase soft close)`

---

## Phase 5 — Audit + Polish (Task 15)

### Task 15: Run Impeccable audit across all 7 frames, address findings

**Files:** any frame component, plus `barcelona.html` if global tokens need tightening

- [ ] **Step 1: Run the audit**

```bash
IMPECCABLE_CONTEXT_DIR=barcelona node .agents/skills/impeccable/scripts/load-context.mjs
```

Then invoke `/impeccable audit barcelona/components/frames/day1/` (or audit each frame individually if the skill prefers per-file audits).

- [ ] **Step 2: For each finding, classify and act**

For each finding the audit produces, decide:
- **Fix immediately** if it's a violation of an explicit rule in DESIGN.md (banned fonts, accent overuse, contrast under AA, etc.)
- **Adjust the frame** via `/impeccable polish` or `/impeccable bolder`/`quieter` if it's a tonal issue
- **Note as deferred** if it's a structural change that needs Joseph's input (e.g. content cuts, narrative restructure)

- [ ] **Step 3: Final visual walk-through**

Sit through all 7 frames in order at `#day-1#1` through `#day-1#7`. Time yourself: total time should land near 9 minutes for the narrative. If a frame takes substantially longer to land than its `targetMinutes`, the frame is too dense — split or cut.

Verify:
- Frame transitions feel calm (400ms crossfade)
- Cockpit (Esc) opens cleanly, speaker notes visible, thumbnail jumps work
- T toggles the timer badge
- Refresh on any frame restores you to that frame
- Brand mark and counter visible without dominating

- [ ] **Step 4: Commit any fixes**

```bash
git add barcelona/
git commit -m "$(cat <<'EOF'
Audit pass across Day 1 frames: [summary of changes]

[Brief description of what changed: specific violations fixed,
specific frames polished, any deferred items flagged for Joseph review.]

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: Tell Joseph the build is ready for review**

Day 1 is done. Hand over for Joseph to walk through, react, and request polish per-frame. From here we move into iterative refinement (using `/impeccable polish`, `/impeccable bolder`, `/impeccable quieter`, or `/impeccable live`) until Joseph signs off.

---

## Out of scope for this plan

- Day 2 stage page (handled by forking Day 1 patterns in a later round)
- Case study / activity / share-back frames within Day 1 (third round)
- Gamification of the workshop activity (third round)
- Marketing landing page at `/` (fourth round)
- Firebase Hosting deployment + custom domain (deferred until Day 1 is signed off)

## Open items at end of plan

- Final font choice committed in Task 8 — propagates to all subsequent frames
- Speaker notes will likely need revision after Joseph hears them out loud once
- Frame 6's compact visual hints may need a polish pass once Joseph sees them — they're the lowest-confidence area of the brief
