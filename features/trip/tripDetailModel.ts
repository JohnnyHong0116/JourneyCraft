import type { ExpenseItem } from '../../src/data/appData.ts';
import type { Trip } from '../../src/types/trip.ts';

export type TripFeatureId = 'photos' | 'location' | 'audio' | 'people';

export interface TripFeature {
  id: TripFeatureId;
  label: string;
  value: string;
}

export interface CompanionCluster {
  initials: string[];
  overflow: number;
  label: string;
}

export interface TripExpenseSummary {
  total: number;
  count: number;
  label: string;
}

export function getTripById(trips: readonly Trip[], id?: string): Trip | undefined {
  return id ? trips.find((trip) => trip.id === id) : undefined;
}

function pluralizedCount(count: number, singular: string): string {
  return `${count} ${singular}${count === 1 ? '' : 's'}`;
}

export function getTripFeatures(trip: Trip): TripFeature[] {
  const companionCount = trip.companions?.length ?? 0;
  return [
    {
      id: 'photos',
      label: 'Photos',
      value: trip.photos.length ? pluralizedCount(trip.photos.length, 'Photo') : 'No Photos',
    },
    { id: 'location', label: 'Location', value: trip.location },
    {
      id: 'audio',
      label: 'Audio',
      value: trip.audioCount ? pluralizedCount(trip.audioCount, 'Recording') : 'No Audio',
    },
    {
      id: 'people',
      label: 'People',
      value: companionCount ? pluralizedCount(companionCount, 'Person') : 'No People',
    },
  ];
}

export function getCompanionCluster(companions: readonly string[] = []): CompanionCluster {
  if (!companions.length) return { initials: [], overflow: 0, label: 'Add people' };
  return {
    initials: companions.slice(0, 2).map((name) => name.trim().charAt(0).toUpperCase()),
    overflow: Math.max(0, companions.length - 2),
    label: companions.length === 1 ? companions[0] : `${companions.length} people`,
  };
}

export function getTripExpenseSummary(
  expenses: readonly ExpenseItem[],
  tripId: string,
): TripExpenseSummary {
  const linked = expenses.filter((expense) => expense.tripId === tripId);
  const total = linked.reduce((sum, expense) => sum + expense.amount, 0);
  return {
    total,
    count: linked.length,
    label: linked.length ? `\u00a5${total.toFixed(2)}` : 'No expenses yet',
  };
}

export function formatTripTimestamp(value: string): string {
  const date = new Date(value);
  const day = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${day} at ${time}`;
}
