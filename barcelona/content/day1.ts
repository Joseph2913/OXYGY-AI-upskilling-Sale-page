import type { FrameMeta } from '../types';
import { OpenerHook } from '../components/frames/day1/01-OpenerHook';
import { ChroPosition } from '../components/frames/day1/02-ChroPosition';
import { DataPicture } from '../components/frames/day1/03-DataPicture';
import { SteerPov } from '../components/frames/day1/04-SteerPov';
import { TwoHalves } from '../components/frames/day1/05-TwoHalves';
import { TwoPillars } from '../components/frames/day1/06-TwoPillars';
import { WhatWeDeliver } from '../components/frames/day1/07-WhatWeDeliver';

/**
 * Day 1 frame sequence, aligned to the printed deck.
 *
 * Frames 1-5 below are the shared framing slides:
 *   1. Title — "Strategic Workforce Planning in the Age of AI"
 *   2. The Hook — "What will set yours apart?"
 *   3. The Shift — three-layer stack
 *   4. The Old Playbook Is Gone — four shifts
 *   5. What You're About To Do — 1 case, 2 angles, 1 question
 *
 * Frames 6-7 still hold the legacy placeholder components — they'll
 * be repurposed as "Meet HorizonWorks" and "Two Tables" in the next pass.
 */
export const day1Frames: FrameMeta[] = [
  {
    id: 'title',
    title: 'Strategic Workforce Planning in the Age of AI',
    targetMinutes: 1,
    speakerNotes:
      "Open the session. Set the room. Click 'Let's Begin' or hit → to move into the hook.",
    component: OpenerHook,
  },
  {
    id: 'hook',
    title: 'What will set yours apart?',
    targetMinutes: 1.5,
    speakerNotes:
      'Pause after the first sentence. Let it land. Then the second line — the question is the heart of the session. Look around the room before clicking on.',
    component: ChroPosition,
  },
  {
    id: 'shift',
    title: "The AI advantage isn't where you think it is",
    targetMinutes: 3,
    speakerNotes:
      "Walk the stack top-down. Bottom layer (Model) is commoditising — same for everyone in 5 years. Middle (Strategy) is your advantage. Top (Data + Adoption) is your foundation. The model is what everyone will have. The other two are what only you can build.",
    component: DataPicture,
  },
  {
    id: 'old-playbook',
    title: 'The old playbook is gone',
    targetMinutes: 3,
    speakerNotes:
      "Four shifts that broke strategic workforce planning. Don't dwell — name each and move. The point is the closing quote: today's CHRO isn't running a more advanced version of yesterday's HR function — they're running a fundamentally different operation.",
    component: SteerPov,
  },
  {
    id: 'what-you-do',
    title: "What you're about to do",
    targetMinutes: 1,
    speakerNotes:
      "Frame the next 40 minutes: One case (HorizonWorks). Two angles (top-down strategy vs bottom-up data). One question (what AI use cases would you take to the CEO?). Then click on to Meet HorizonWorks.",
    component: TwoHalves,
  },
  {
    id: 'meet-horizonworks',
    title: 'Meet HorizonWorks',
    targetMinutes: 2,
    speakerNotes:
      "Placeholder — to be built next. Will introduce the fictional case company: 7,500 employees, 3 regions, 30·50·20 revenue split, medium AI maturity, CEO mandate of 'documented, measurable AI impact by end of 2026'.",
    component: TwoPillars,
  },
  {
    id: 'two-tables',
    title: '40 minutes · Two tables · One question',
    targetMinutes: 1,
    speakerNotes:
      'Placeholder — to be built next. Will show the table assignment and split the room.',
    component: WhatWeDeliver,
  },
];
