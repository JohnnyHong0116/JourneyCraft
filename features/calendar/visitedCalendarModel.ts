import type { Trip, TripMood } from '../../src/types/trip.ts';

export type DateKey = string;
export type MoodOverrides = Record<DateKey, TripMood>;

export interface CalendarDay {
  key: DateKey;
  date: Date;
  dayNumber: number;
  inMonth: boolean;
  selectable: boolean;
  future: boolean;
}

export interface SelectedRange {
  start: DateKey;
  end: DateKey;
}

export interface AnchoredDrawerLayoutInput {
  containerHeight: number;
  calendarHeight: number;
  collapsedGap: number;
  bottomCoverage: number;
}

export interface AnchoredDrawerLayout {
  collapsedTop: number;
  collapsedHeight: number;
  expandedTop: number;
  expandedHeight: number;
}

export function getAnchoredDrawerLayout({
  containerHeight,
  calendarHeight,
  collapsedGap,
  bottomCoverage,
}: AnchoredDrawerLayoutInput): AnchoredDrawerLayout {
  const bottomEdge = Math.max(0, containerHeight + bottomCoverage);
  const collapsedTop = Math.min(bottomEdge, Math.max(0, calendarHeight + collapsedGap));
  return {
    collapsedTop,
    collapsedHeight: bottomEdge - collapsedTop,
    expandedTop: 0,
    expandedHeight: bottomEdge,
  };
}

function pad(value: number): string {
  return `${value}`.padStart(2, '0');
}

export function toDateKey(value: Date | string): DateKey {
  const date = typeof value === 'string' ? new Date(value) : value;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function dateFromKey(key: DateKey): Date {
  const [year, month, date] = key.split('-').map(Number);
  return new Date(year, month - 1, date);
}

export function monthStart(value: Date | string): Date {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function toMonthKey(value: Date): string {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}`;
}

function addMonths(value: Date, amount: number): Date {
  return new Date(value.getFullYear(), value.getMonth() + amount, 1);
}

export function getFirstCardMonth(trips: readonly Trip[]): Date {
  const firstTrip = [...trips].sort(
    (left, right) => new Date(left.displayDate).getTime() - new Date(right.displayDate).getTime(),
  )[0];
  return monthStart(firstTrip?.displayDate ?? new Date());
}

export function getAllowedMonthStarts(trips: readonly Trip[], today: Date): Date[] {
  const firstMonth = getFirstCardMonth(trips);
  const lastMonth = monthStart(today);
  const months: Date[] = [];

  for (let date = firstMonth; date.getTime() <= lastMonth.getTime(); date = addMonths(date, 1)) {
    months.push(date);
  }

  return months;
}

export function getMonthCells(visibleMonth: Date, today: Date): CalendarDay[] {
  const start = monthStart(visibleMonth);
  const gridStart = new Date(start.getFullYear(), start.getMonth(), 1 - start.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
    const inMonth = date.getMonth() === start.getMonth() && date.getFullYear() === start.getFullYear();
    const future = date.getTime() > today.getTime();
    return {
      key: toDateKey(date),
      date,
      dayNumber: date.getDate(),
      inMonth,
      selectable: inMonth && !future,
      future,
    };
  });
}

export function getCardsForDate(trips: readonly Trip[], key: DateKey): Trip[] {
  return trips
    .filter((trip) => toDateKey(trip.displayDate) === key)
    .sort((left, right) => new Date(left.displayDate).getTime() - new Date(right.displayDate).getTime());
}

export function getCardsForDateRange(
  trips: readonly Trip[],
  start: DateKey,
  end: DateKey,
): Trip[] {
  const first = start <= end ? start : end;
  const last = start <= end ? end : start;
  return trips
    .filter((trip) => {
      const key = toDateKey(trip.displayDate);
      return key >= first && key <= last;
    })
    .sort((left, right) => new Date(left.displayDate).getTime() - new Date(right.displayDate).getTime());
}

export function dateHasCards(trips: readonly Trip[], key: DateKey): boolean {
  return trips.some((trip) => toDateKey(trip.displayDate) === key);
}

export function getMajorityEmotionForDate(
  trips: readonly Trip[],
  key: DateKey,
): TripMood | undefined {
  const cards = getCardsForDate(trips, key).filter((trip): trip is Trip & { mood: TripMood } => Boolean(trip.mood));
  if (cards.length === 0) return undefined;

  const counts = cards.reduce<Partial<Record<TripMood, number>>>((lookup, trip) => {
    lookup[trip.mood] = (lookup[trip.mood] ?? 0) + 1;
    return lookup;
  }, {});
  const highestCount = Math.max(...Object.values(counts));

  // Cards are chronological; the first mood at the highest count deterministically wins ties.
  return cards.find((trip) => counts[trip.mood] === highestCount)?.mood;
}

export function getCalendarMoodForDate(
  trips: readonly Trip[],
  overrides: MoodOverrides,
  key: DateKey,
): TripMood | undefined {
  return overrides[key] ?? getMajorityEmotionForDate(trips, key);
}

export function updateDateSelection(anchors: readonly DateKey[], next: DateKey): DateKey[] {
  if (anchors.length === 0) return [next];
  if (anchors[anchors.length - 1] === next) return [next];
  if (anchors.length === 1) return [anchors[0], next];
  return [anchors[1], next];
}

export function getSelectedRange(anchors: readonly DateKey[]): SelectedRange | undefined {
  if (anchors.length === 0) return undefined;
  const latest = anchors[anchors.length - 1];
  const earliest = anchors.length > 1 ? anchors[0] : latest;
  return {
    start: earliest <= latest ? earliest : latest,
    end: earliest <= latest ? latest : earliest,
  };
}

export function isDateInSelectedRange(key: DateKey, anchors: readonly DateKey[]): boolean {
  const range = getSelectedRange(anchors);
  return Boolean(range && key >= range.start && key <= range.end);
}

export function formatMonthTitle(month: Date): string {
  return month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function formatSelectedRangeLabel(anchors: readonly DateKey[]): string {
  const range = getSelectedRange(anchors);
  if (!range) return 'Select a date';
  const start = dateFromKey(range.start);
  const end = dateFromKey(range.end);
  if (range.start === range.end) {
    return start.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} - ${end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
}
