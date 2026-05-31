import { EMOTIONS, type EmotionConfig } from '../../src/constants/emotions.ts';
import type { ExpenseItem } from '../../src/data/appData.ts';
import type { Trip, TripMood } from '../../src/types/trip.ts';

export type StatisticsPeriod = 'monthly' | 'annual';
export type DrawerSnap = 'collapsed' | 'expanded';

export interface TripExpenseRecord {
  id: string;
  tripId: string;
  title: string;
  route: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  currency: string;
  itemCount: number;
  paidBy?: string;
  splitParticipants: string[];
  budgetAmount?: number;
  items: ExpenseItem[];
}

export interface MoodDistributionItem {
  id: TripMood;
  count: number;
  percentage: number;
  color: string;
  isDominant: boolean;
}

export interface ExpenseSeriesPoint {
  key: string;
  month: number;
  label: string;
  value: number;
  hasRecords: boolean;
}

export interface MonthlyMoodFlowPoint {
  key: string;
  month: number;
  label: string;
  distribution: MoodDistributionItem[];
  total: number;
}

export interface StatisticsSummary {
  year: number;
  month?: number;
  expenseTotal: number;
  expenseRecords: TripExpenseRecord[];
  travelDays: number;
  daysInMonth?: number;
  travelDayPercentage?: number;
  cityCount: number;
  countryCount: number;
  journalEntries: number;
  frequentMood?: EmotionConfig;
  moodDistribution: MoodDistributionItem[];
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const EXPENSE_TRIP_FALLBACKS: Record<string, { title: string; route: string; budgetAmount?: number }> = {
  chengdu: { title: 'Chengdu Trip', route: 'Chengdu, China', budgetAmount: 260 },
  spring: { title: 'Spring City Break', route: 'Madison, WI', budgetAmount: 120 },
  lake: { title: 'Lake Weekend', route: 'Devil\'s Lake, WI', budgetAmount: 150 },
  autumn: { title: 'Autumn Museum Day', route: 'Door County, WI', budgetAmount: 110 },
  winter: { title: 'Winter Holiday Rail', route: 'Aspen, CO', budgetAmount: 140 },
};

function monthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

function sameMonth(date: string, year: number, month: number): boolean {
  return date.startsWith(monthKey(year, month));
}

function sameYear(date: string, year: number): boolean {
  return date.startsWith(`${year}-`);
}

function dateOnly(value: string): string {
  return value.slice(0, 10);
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function uniq<T>(items: readonly T[]): T[] {
  return Array.from(new Set(items));
}

function cityFromLocation(location: string): string {
  return location.split(',')[0].trim() || location;
}

function countryFromLocation(location: string): string {
  if (/china|chengdu|xi'?an|shanghai|hangzhou/i.test(location)) return 'China';
  if (/japan|tokyo|osaka/i.test(location)) return 'Japan';
  return 'United States';
}

function tripTitle(trips: readonly Trip[], tripId: string): string {
  return trips.find((trip) => trip.id === tripId)?.title
    ?? EXPENSE_TRIP_FALLBACKS[tripId]?.title
    ?? 'Trip Expenses';
}

function tripRoute(trips: readonly Trip[], tripId: string): string {
  return trips.find((trip) => trip.id === tripId)?.location
    ?? EXPENSE_TRIP_FALLBACKS[tripId]?.route
    ?? 'Recorded trip';
}

export function buildTripExpenseRecords(
  expenses: readonly ExpenseItem[],
  trips: readonly Trip[] = [],
): TripExpenseRecord[] {
  const grouped = expenses.reduce<Record<string, ExpenseItem[]>>((records, expense) => {
    records[expense.tripId] = [...(records[expense.tripId] ?? []), expense];
    return records;
  }, {});

  return Object.entries(grouped)
    .map(([tripId, items]) => {
      const sorted = [...items].sort((a, b) => a.occurredOn.localeCompare(b.occurredOn));
      const startDate = sorted[0]?.occurredOn ?? '';
      const endDate = sorted[sorted.length - 1]?.occurredOn ?? startDate;
      return {
        id: `expense-record-${tripId}-${startDate.slice(0, 7)}`,
        tripId,
        title: tripTitle(trips, tripId),
        route: tripRoute(trips, tripId),
        startDate,
        endDate,
        totalAmount: sorted.reduce((sum, item) => sum + item.amount, 0),
        currency: '¥',
        itemCount: sorted.length,
        paidBy: sorted[0]?.people[0],
        splitParticipants: uniq(sorted.flatMap((item) => item.people)),
        budgetAmount: EXPENSE_TRIP_FALLBACKS[tripId]?.budgetAmount,
        items: sorted,
      };
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function getExpensesForMonth(
  expenses: readonly ExpenseItem[],
  year: number,
  month: number,
  trips: readonly Trip[] = [],
): TripExpenseRecord[] {
  return buildTripExpenseRecords(
    expenses.filter((expense) => sameMonth(expense.occurredOn, year, month)),
    trips,
  );
}

export function getExpensesForYear(
  expenses: readonly ExpenseItem[],
  year: number,
  trips: readonly Trip[] = [],
): TripExpenseRecord[] {
  return buildTripExpenseRecords(
    expenses.filter((expense) => sameYear(expense.occurredOn, year)),
    trips,
  );
}

export function getExpenseRecordById(
  expenses: readonly ExpenseItem[],
  trips: readonly Trip[],
  id?: string,
): TripExpenseRecord | undefined {
  if (!id) return undefined;
  return buildTripExpenseRecords(expenses, trips).find((record) => record.id === id);
}

export function getUniqueTravelDays(trips: readonly Trip[], expenses: readonly ExpenseItem[]): string[] {
  return uniq([
    ...trips.map((trip) => dateOnly(trip.displayDate)),
    ...expenses.map((expense) => expense.occurredOn),
  ]).sort();
}

export function getMoodDistribution(trips: readonly Trip[]): MoodDistributionItem[] {
  const counts = EMOTIONS.reduce<Record<TripMood, number>>((next, emotion) => {
    next[emotion.id] = 0;
    return next;
  }, {} as Record<TripMood, number>);

  trips.forEach((trip) => {
    if (trip.mood) counts[trip.mood] += 1;
  });

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const dominant = EMOTIONS.reduce<TripMood | undefined>((current, emotion) => {
    if (!current) return emotion.id;
    return counts[emotion.id] > counts[current] ? emotion.id : current;
  }, undefined);

  return EMOTIONS.map((emotion) => ({
    id: emotion.id,
    count: counts[emotion.id],
    percentage: total ? Math.round((counts[emotion.id] / total) * 100) : 0,
    color: emotion.color,
    isDominant: total > 0 && emotion.id === dominant,
  }));
}

function filterTripsForMonth(trips: readonly Trip[], year: number, month: number): Trip[] {
  return trips.filter((trip) => sameMonth(trip.displayDate, year, month));
}

function filterTripsForYear(trips: readonly Trip[], year: number): Trip[] {
  return trips.filter((trip) => sameYear(trip.displayDate, year));
}

export function getStatsForMonth(
  trips: readonly Trip[],
  expenses: readonly ExpenseItem[],
  year: number,
  month: number,
): StatisticsSummary {
  const monthTrips = filterTripsForMonth(trips, year, month);
  const monthExpenses = expenses.filter((expense) => sameMonth(expense.occurredOn, year, month));
  const travelDays = getUniqueTravelDays(monthTrips, monthExpenses);
  const distribution = getMoodDistribution(monthTrips);
  const frequent = distribution.find((mood) => mood.isDominant && mood.count > 0);
  const monthLength = daysInMonth(year, month);

  return {
    year,
    month,
    expenseTotal: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    expenseRecords: getExpensesForMonth(expenses, year, month, trips),
    travelDays: travelDays.length,
    daysInMonth: monthLength,
    travelDayPercentage: Math.round((travelDays.length / monthLength) * 100),
    cityCount: uniq(monthTrips.map((trip) => cityFromLocation(trip.location))).length,
    countryCount: uniq(monthTrips.map((trip) => countryFromLocation(trip.location))).length,
    journalEntries: monthTrips.length,
    frequentMood: frequent ? EMOTIONS.find((emotion) => emotion.id === frequent.id) : undefined,
    moodDistribution: distribution,
  };
}

export function getStatsForYear(
  trips: readonly Trip[],
  expenses: readonly ExpenseItem[],
  year: number,
): StatisticsSummary {
  const yearTrips = filterTripsForYear(trips, year);
  const yearExpenses = expenses.filter((expense) => sameYear(expense.occurredOn, year));
  const distribution = getMoodDistribution(yearTrips);
  const frequent = distribution.find((mood) => mood.isDominant && mood.count > 0);

  return {
    year,
    expenseTotal: yearExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    expenseRecords: getExpensesForYear(expenses, year, trips),
    travelDays: getUniqueTravelDays(yearTrips, yearExpenses).length,
    cityCount: uniq(yearTrips.map((trip) => cityFromLocation(trip.location))).length,
    countryCount: uniq(yearTrips.map((trip) => countryFromLocation(trip.location))).length,
    journalEntries: yearTrips.length,
    frequentMood: frequent ? EMOTIONS.find((emotion) => emotion.id === frequent.id) : undefined,
    moodDistribution: distribution,
  };
}

export function getMonthlyExpenseSeries(expenses: readonly ExpenseItem[], year: number): ExpenseSeriesPoint[] {
  return MONTH_LABELS.map((label, index) => {
    const month = index + 1;
    const monthExpenses = expenses.filter((expense) => sameMonth(expense.occurredOn, year, month));
    return {
      key: monthKey(year, month),
      month,
      label,
      value: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      hasRecords: monthExpenses.length > 0,
    };
  });
}

export function getMonthlyMoodFlow(trips: readonly Trip[], year: number): MonthlyMoodFlowPoint[] {
  return MONTH_LABELS.map((label, index) => {
    const month = index + 1;
    const monthTrips = filterTripsForMonth(trips, year, month);
    return {
      key: monthKey(year, month),
      month,
      label,
      distribution: getMoodDistribution(monthTrips),
      total: monthTrips.filter((trip) => trip.mood).length,
    };
  });
}

export function getJournalEntryCount(trips: readonly Trip[]): number {
  return trips.length;
}

export function getStatisticsDrawerSnapPoints(
  screenHeight: number,
  period: StatisticsPeriod,
): Record<DrawerSnap, number> {
  const safeHeight = Math.max(620, screenHeight);
  const heightFromTop = (top: number, minimum: number) => Math.max(minimum, safeHeight - top);
  if (period === 'annual') {
    return {
      collapsed: heightFromTop(520, 180),
      expanded: heightFromTop(250, 360),
    };
  }
  return {
    collapsed: heightFromTop(520, 180),
    expanded: heightFromTop(250, 360),
  };
}
