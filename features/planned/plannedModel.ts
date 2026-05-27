import type { PlannedTrip } from '../../src/types/plannedTrip.ts';

export type PlannedDateMarker = 'none' | 'middle' | 'endpoint';

export const PLANNED_DRAWER_STACK_OVERLAP = 8;

export interface ChecklistProgress {
  completed: number;
  pending: number;
  notStarted: number;
  total: number;
}

export interface PlannedDrawerStackLayer {
  zIndex: number;
  overlapsPrevious: boolean;
  isOverlayCard: boolean;
}

function keyToDate(key: string): Date {
  const [year, month, day] = key.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

function monthStart(key: string | Date): Date {
  const date = typeof key === 'string' ? keyToDate(key) : key;
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toDateKey(date: Date): string {
  const pad = (value: number) => `${value}`.padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getUpcomingPlannedTrips(plans: readonly PlannedTrip[], today: Date): PlannedTrip[] {
  const todayKey = toDateKey(today);
  return [...plans]
    .filter((plan) => plan.endDate.slice(0, 10) >= todayKey)
    .sort((left, right) => left.startDate.localeCompare(right.startDate));
}

export function getChecklistProgress(plan: PlannedTrip): ChecklistProgress {
  return plan.checklistItems.reduce<ChecklistProgress>(
    (progress, item) => ({
      ...progress,
      [item.status]: progress[item.status] + 1,
      total: progress.total + 1,
    }),
    { completed: 0, pending: 0, notStarted: 0, total: 0 },
  );
}

export function getDaysUntilDeparture(startDate: string, today: Date): number {
  const start = keyToDate(startDate);
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.max(0, Math.ceil((start.getTime() - current.getTime()) / 86_400_000));
}

export function getPlannedCalendarRange(plans: readonly PlannedTrip[], fallback: Date): Date[] {
  if (plans.length === 0) return [monthStart(fallback)];
  const first = monthStart([...plans].sort((left, right) => left.startDate.localeCompare(right.startDate))[0]!.startDate);
  const last = monthStart([...plans].sort((left, right) => right.endDate.localeCompare(left.endDate))[0]!.endDate);
  const months: Date[] = [];
  for (
    let month = first;
    month.getTime() <= last.getTime();
    month = new Date(month.getFullYear(), month.getMonth() + 1, 1)
  ) {
    months.push(month);
  }
  return months;
}

export function getPlannedTripsForDate(plans: readonly PlannedTrip[], key: string): PlannedTrip[] {
  return getPlannedTripsForDateRange(plans, key, key);
}

export function dateRangeIntersects(
  planStart: string,
  planEnd: string,
  selectedStart: string,
  selectedEnd: string,
): boolean {
  const start = selectedStart <= selectedEnd ? selectedStart : selectedEnd;
  const end = selectedStart <= selectedEnd ? selectedEnd : selectedStart;
  return planStart.slice(0, 10) <= end && planEnd.slice(0, 10) >= start;
}

export function getPlannedTripsForDateRange(
  plans: readonly PlannedTrip[],
  selectedStart: string,
  selectedEnd: string,
): PlannedTrip[] {
  return plans
    .filter((plan) => dateRangeIntersects(plan.startDate, plan.endDate, selectedStart, selectedEnd))
    .sort((left, right) => left.startDate.localeCompare(right.startDate));
}

export function getPlannedDateMarker(plans: readonly PlannedTrip[], key: string): PlannedDateMarker {
  const active = getPlannedTripsForDate(plans, key);
  if (active.some((plan) => plan.startDate.slice(0, 10) === key || plan.endDate.slice(0, 10) === key)) {
    return 'endpoint';
  }
  return active.length > 0 ? 'middle' : 'none';
}

export function getPlannedDrawerStackLayer(index: number): PlannedDrawerStackLayer {
  const layer = Math.max(0, index);
  return {
    zIndex: layer + 1,
    overlapsPrevious: layer > 0,
    isOverlayCard: layer > 0,
  };
}

export function getPlannedMonthCells(visibleMonth: Date): Array<{
  key: string;
  date: Date;
  dayNumber: number;
  inMonth: boolean;
}> {
  const start = monthStart(visibleMonth);
  const gridStart = new Date(start.getFullYear(), start.getMonth(), 1 - start.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
    return {
      key: toDateKey(date),
      date,
      dayNumber: date.getDate(),
      inMonth: date.getMonth() === start.getMonth() && date.getFullYear() === start.getFullYear(),
    };
  });
}
