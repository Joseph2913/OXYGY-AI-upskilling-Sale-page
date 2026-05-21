import { StagePage } from '../components/StagePage';
import { day1Frames } from '../content/day1';

export function Day1() {
  return <StagePage routeKey="day-1" dayLabel="DAY 1" frames={day1Frames} />;
}
