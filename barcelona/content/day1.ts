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
