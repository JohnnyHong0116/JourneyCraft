import { getEmotionConfig } from '../../src/constants/emotions.ts';
import { mockTrips, plannedTripCards } from '../../src/data/appData.ts';
import type { Trip, TripMood } from '../../src/types/trip.ts';

export type HomeTimelineMode = 'visited' | 'planned';
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
}

export function getHomeSearchTrips(mode: HomeTimelineMode): Trip[] {
  return mode === 'planned' ? plannedTripCards : mockTrips;
}

export function formatTripSearchDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function searchableText(trip: Trip): string {
  const emotion = trip.mood ? getEmotionConfig(trip.mood) : undefined;
  return [
    trip.title,
    trip.location,
    trip.displayDate,
    formatTripSearchDate(trip.displayDate),
    ...(trip.companions ?? []),
    emotion?.label ?? '',
    ...(emotion?.keywords ?? []),
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

function matchesPhotoQuery(trip: Trip, query?: string): boolean {
  const normalizedQuery = query?.trim().toLowerCase() ?? '';
  return normalizedQuery.length === 0 || [
    trip.title,
    trip.location,
  ].join(' ').toLowerCase().includes(normalizedQuery);
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
      return trips.filter((trip) => Boolean(trip.companions?.length) && matchesQuery(trip, filter.query));
    case 'emotion':
      return filter.emotionId ? trips.filter((trip) => trip.mood === filter.emotionId) : [];
    case 'date':
      return trips.filter((trip) => matchesDateQuery(trip, filter.query));
    case 'location':
    case 'text':
      return trips.filter((trip) => matchesQuery(trip, filter.query));
  }
}
