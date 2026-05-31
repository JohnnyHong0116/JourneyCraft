import { getEmotionConfig } from '../../src/constants/emotions.ts';
import { mockTrips, people, plannedTripCards } from '../../src/data/appData.ts';
import type { PlannedTrip } from '../../src/types/plannedTrip.ts';
import type { Trip, TripMood } from '../../src/types/trip.ts';
import { dateRangeIntersects } from '../planned/plannedModel.ts';
import { tripMatchesPeople } from './peopleSearchModel.ts';

export type HomeTimelineMode = 'visited' | 'planned';
export type SearchOrigin = 'home' | 'map';
export type HomeSearchCategory =
  | 'photos'
  | 'audio'
  | 'text'
  | 'location'
  | 'saved'
  | 'people'
  | 'emotion'
  | 'date';

export interface HomeSearchFilter {
  category: HomeSearchCategory;
  query?: string;
  emotionId?: TripMood;
  selectedPersonIds?: readonly string[];
  dateRange?: { start: string; end: string };
}

const VISITED_SEARCH_CATEGORIES: HomeSearchCategory[] = [
  'photos', 'audio', 'text', 'date', 'location', 'saved', 'people', 'emotion',
];
const PLANNED_SEARCH_CATEGORIES: HomeSearchCategory[] = [
  'text', 'date', 'location', 'saved', 'people',
];

export function resolveHomeTimelineMode(value?: string | string[]): HomeTimelineMode {
  return value === 'planned' ? 'planned' : 'visited';
}

export function getHomeTimelineReturnParams(mode: HomeTimelineMode): { timelineMode: HomeTimelineMode } {
  return { timelineMode: mode };
}

export function resolveSearchOrigin(value?: string | string[]): SearchOrigin {
  return value === 'map' ? 'map' : 'home';
}

export function getSearchReturnHref(
  origin: SearchOrigin,
  mode: HomeTimelineMode,
): { pathname: '/(tabs)/location' } | { pathname: '/(tabs)/home'; params: { timelineMode: HomeTimelineMode } } {
  return origin === 'map'
    ? { pathname: '/(tabs)/location' }
    : { pathname: '/(tabs)/home', params: getHomeTimelineReturnParams(mode) };
}

export function getHomeSearchTrips(mode: HomeTimelineMode): Trip[] {
  return mode === 'planned' ? plannedTripCards : mockTrips;
}

export function getSearchCategoriesForMode(mode: HomeTimelineMode): HomeSearchCategory[] {
  return mode === 'planned' ? [...PLANNED_SEARCH_CATEGORIES] : [...VISITED_SEARCH_CATEGORIES];
}

export function formatTripSearchDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function isPlannedTrip(trip: Trip): trip is PlannedTrip {
  return 'startDate' in trip && typeof trip.startDate === 'string';
}

function searchableText(trip: Trip): string {
  const emotion = trip.mood ? getEmotionConfig(trip.mood) : undefined;
  const plannedFields = isPlannedTrip(trip)
    ? [
        trip.route,
        trip.startDate,
        trip.endDate,
        ...trip.checklistItems.map((item) => item.label),
        ...trip.itineraryEntries.flatMap((entry) => [entry.title, entry.location ?? '', entry.note ?? '']),
      ]
    : [];
  return [
    trip.title,
    trip.location,
    trip.displayDate,
    formatTripSearchDate(trip.displayDate),
    ...(trip.companions ?? []),
    emotion?.label ?? '',
    ...(emotion?.keywords ?? []),
    ...plannedFields,
  ].join(' ').toLowerCase();
}

function matchesQuery(trip: Trip, query?: string): boolean {
  const normalizedQuery = query?.trim().toLowerCase() ?? '';
  return normalizedQuery.length === 0 || searchableText(trip).includes(normalizedQuery);
}

function matchesDateQuery(trip: Trip, query?: string): boolean {
  const normalizedQuery = query?.trim().toLowerCase() ?? '';
  return normalizedQuery.length === 0 || [
    trip.displayDate,
    formatTripSearchDate(trip.displayDate),
  ].join(' ').toLowerCase().includes(normalizedQuery);
}

function parseDateRangeQuery(query?: string): { start: string; end: string } | undefined {
  const dates = query?.match(/\d{4}-\d{2}-\d{2}/g);
  if (!dates?.length) return undefined;
  return { start: dates[0]!, end: dates[1] ?? dates[0]! };
}

function matchesPlannedDate(trip: PlannedTrip, filter: HomeSearchFilter): boolean {
  const range = filter.dateRange ?? parseDateRangeQuery(filter.query);
  if (range) {
    return dateRangeIntersects(trip.startDate, trip.endDate, range.start, range.end);
  }
  return matchesDateQuery(trip, filter.query)
    || formatTripSearchDate(trip.startDate).toLowerCase().includes(filter.query?.trim().toLowerCase() ?? '')
    || formatTripSearchDate(trip.endDate).toLowerCase().includes(filter.query?.trim().toLowerCase() ?? '');
}

function matchesPhotoQuery(trip: Trip, query?: string): boolean {
  const normalizedQuery = query?.trim().toLowerCase() ?? '';
  return normalizedQuery.length === 0 || [
    trip.title,
    trip.location,
  ].join(' ').toLowerCase().includes(normalizedQuery);
}

function matchesLocationQuery(trip: Trip, query?: string): boolean {
  const normalizedQuery = query?.trim().toLowerCase() ?? '';
  if (normalizedQuery.length === 0) return true;
  const fields = isPlannedTrip(trip)
    ? [trip.location, trip.route, ...trip.itineraryEntries.map((entry) => entry.location ?? '')]
    : [trip.location];
  return fields.join(' ').toLowerCase().includes(normalizedQuery);
}

export function filterHomeTrips(trips: readonly Trip[], filter: HomeSearchFilter): Trip[] {
  switch (filter.category) {
    case 'photos':
      return trips.filter((trip) => trip.photos.length > 0 && matchesPhotoQuery(trip, filter.query));
    case 'audio':
      return trips.filter((trip) => trip.audioCount > 0 && matchesQuery(trip, filter.query));
    case 'saved':
      return trips.filter((trip) => Boolean(trip.isSaved) && matchesQuery(trip, filter.query));
    case 'people':
      return trips.filter((trip) => tripMatchesPeople(trip, people, filter.selectedPersonIds, filter.query));
    case 'emotion':
      return filter.emotionId ? trips.filter((trip) => trip.mood === filter.emotionId) : [];
    case 'date':
      return trips.filter((trip) => isPlannedTrip(trip)
        ? matchesPlannedDate(trip, filter)
        : matchesDateQuery(trip, filter.query));
    case 'location':
      return trips.filter((trip) => matchesLocationQuery(trip, filter.query));
    case 'text':
      return trips.filter((trip) => matchesQuery(trip, filter.query));
  }
}
