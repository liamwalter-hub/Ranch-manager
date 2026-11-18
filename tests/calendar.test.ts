import { describe, expect, it } from 'vitest';
import { formatDate, minutesForDate, nextBlockStart, nextMorning, toGameDate } from '../src/engine/calendar';

const start = { year: 2027, month: 3, day: 1 };

describe('calendar', () => {
  it('day 1 is Monday 1 March 2027', () => {
    const d = toGameDate(start, 0);
    expect(d).toMatchObject({ year: 2027, month: 3, day: 1, weekday: 0, gameDay: 1, hour: 0 });
    expect(formatDate(d)).toBe('Monday 1 March');
  });

  it('rolls into April and keeps weekdays right', () => {
    const d = toGameDate(start, 31 * 1440 + 14 * 60 + 5);
    expect(d).toMatchObject({ month: 4, day: 1, weekday: 3, hour: 14, minute: 5, block: 'midday', gameDay: 32 });
  });

  it('handles leap years for multi-year play', () => {
    const feb29 = minutesForDate(start, 2028, 2, 29);
    expect(toGameDate(start, feb29)).toMatchObject({ year: 2028, month: 2, day: 29 });
  });

  it('finds the next block start and the next morning', () => {
    expect(nextBlockStart(5 * 60)).toEqual({ at: 6 * 60, block: 'morning' });
    expect(nextBlockStart(6 * 60)).toEqual({ at: 12 * 60, block: 'midday' });
    expect(nextBlockStart(20 * 60)).toEqual({ at: 1440 + 6 * 60, block: 'morning' });
    expect(nextMorning(6 * 60)).toBe(1440 + 6 * 60);
    expect(nextMorning(3 * 60)).toBe(6 * 60);
  });
});
