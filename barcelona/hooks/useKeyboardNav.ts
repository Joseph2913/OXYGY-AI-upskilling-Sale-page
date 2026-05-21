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
