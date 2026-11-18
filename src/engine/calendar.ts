/**
 * Game calendar. Game time is whole minutes since 00:00 on game day 1.
 * Dates are computed with pure integer arithmetic (no browser Date), so there
 * are no time-zone or daylight-saving surprises.
 */

export const MINUTES_PER_DAY = 24 * 60;

export interface CalendarStart { year: number; month: number; day: number }

export type Block = 'morning' | 'midday' | 'evening';
export const BLOCK_HOURS: Record<Block, number> = { morning: 6, midday: 12, evening: 18 };

// Days since 1970-01-01 for a civil date (Howard Hinnant's algorithm).
export function daysFromCivil(y: number, m: number, d: number): number {
  y -= m <= 2 ? 1 : 0;
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

export function civilFromDays(z: number): { year: number; month: number; day: number } {
  z += 719468;
  const era = Math.floor(z / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const day = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const month = mp + (mp < 10 ? 3 : -9);
  return { year: yoe + era * 400 + (month <= 2 ? 1 : 0), month, day };
}

export interface GameDate {
  year: number;
  month: number; // 1-12
  day: number;
  weekday: number; // 0 = Monday ... 6 = Sunday
  hour: number;
  minute: number;
  gameDay: number; // 1 = first day of the game
  block: Block;
}

export function blockForHour(hour: number): Block {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'midday';
  return 'evening';
}

export function toGameDate(start: CalendarStart, minutes: number): GameDate {
  const m = Math.floor(minutes);
  const dayIndex = Math.floor(m / MINUTES_PER_DAY);
  const minuteOfDay = m - dayIndex * MINUTES_PER_DAY;
  const epochDays = daysFromCivil(start.year, start.month, start.day) + dayIndex;
  const { year, month, day } = civilFromDays(epochDays);
  // 1970-01-01 was a Thursday (Monday = 0 => Thursday = 3).
  const weekday = (((epochDays + 3) % 7) + 7) % 7;
  const hour = Math.floor(minuteOfDay / 60);
  return { year, month, day, weekday, hour, minute: minuteOfDay % 60, gameDay: dayIndex + 1, block: blockForHour(hour) };
}

/** Game minutes at 00:00 on a given calendar date. */
export function minutesForDate(start: CalendarStart, year: number, month: number, day: number): number {
  return (daysFromCivil(year, month, day) - daysFromCivil(start.year, start.month, start.day)) * MINUTES_PER_DAY;
}

/** The first block start strictly after `minutes`. */
export function nextBlockStart(minutes: number): { at: number; block: Block } {
  const dayStart = Math.floor(minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY;
  for (const block of ['morning', 'midday', 'evening'] as Block[]) {
    const at = dayStart + BLOCK_HOURS[block] * 60;
    if (at > minutes) return { at, block };
  }
  return { at: dayStart + MINUTES_PER_DAY + BLOCK_HOURS.morning * 60, block: 'morning' };
}

/** The first 06:00 strictly after `minutes`. */
export function nextMorning(minutes: number): number {
  const dayStart = Math.floor(minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY;
  const today = dayStart + BLOCK_HOURS.morning * 60;
  return today > minutes ? today : today + MINUTES_PER_DAY;
}

// ---- British English formatting ----
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const BLOCK_LABELS: Record<Block, string> = { morning: 'Morning', midday: 'Midday', evening: 'Evening' };

export function formatTime(d: GameDate): string {
  return `${String(d.hour).padStart(2, '0')}:${String(d.minute).padStart(2, '0')}`;
}
export function formatDate(d: GameDate, short = false): string {
  if (short) return `${WEEKDAYS[d.weekday].slice(0, 3)} ${d.day} ${MONTHS[d.month - 1].slice(0, 3)}`;
  return `${WEEKDAYS[d.weekday]} ${d.day} ${MONTHS[d.month - 1]}`;
}
export function formatDateTime(d: GameDate): string {
  return `${formatDate(d, true)}, ${formatTime(d)}`;
}
