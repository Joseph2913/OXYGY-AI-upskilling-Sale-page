import { useEffect, useRef } from 'react';

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
  // Keep latest handlers in a ref so the event listener can read fresh callbacks
  // without re-attaching on every render. Empty deps on the listener effect
  // means it mounts once and tears down on unmount.
  const handlersRef = useRef<KeyboardNavHandlers>(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isFormInput(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const current = handlersRef.current;
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          current.onNext();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          current.onPrev();
          break;
        case 'Home':
          e.preventDefault();
          current.onFirst();
          break;
        case 'End':
          e.preventDefault();
          current.onLast();
          break;
        case 'Escape':
          e.preventDefault();
          current.onToggleCockpit();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          current.onToggleTimer();
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
