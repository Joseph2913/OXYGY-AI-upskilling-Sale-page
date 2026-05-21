import type { ComponentType } from 'react';

export type Route = 'day-1' | 'day-2' | 'landing';

export interface FrameMeta {
  id: string;
  title: string;
  targetMinutes: number;
  speakerNotes: string;
  component: ComponentType;
}
