import test from 'node:test';
import assert from 'node:assert/strict';
import { EMOTIONS } from '../../src/constants/emotions.ts';
import { mockTrips, plannedDays, plannedTripCards, searchCategories } from '../../src/data/appData.ts';
import {
  filterHomeTrips,
  getHomeSearchTrips,
  getHomeTimelineReturnParams,
  getSearchReturnHref,
  getSearchCategoriesForMode,
  resolveSearchOrigin,
  resolveHomeTimelineMode,
} from './homeSearchModel.ts';

test('defines the five canonical card emotion categories once and in design order', () => {
  assert.deepEqual(
    EMOTIONS.map((emotion) => emotion.id),
    ['overjoyed', 'happy', 'neutral', 'sad', 'depressed'],
  );
  assert.equal(new Set(EMOTIONS.map((emotion) => emotion.id)).size, 5);
  assert.deepEqual(EMOTIONS.map((emotion) => emotion.icon), EMOTIONS.map((emotion) => emotion.id));
});

test('scopes Home search records to the active timeline mode', () => {
  assert.deepEqual(getHomeSearchTrips('visited').map((trip) => trip.id), mockTrips.map((trip) => trip.id));
  assert.deepEqual(getHomeSearchTrips('planned').map((trip) => trip.id), plannedTripCards.map((trip) => trip.id));
});

test('search cancel round-trips the originating Home timeline mode', () => {
  assert.deepEqual(getHomeTimelineReturnParams('planned'), { timelineMode: 'planned' });
  assert.deepEqual(getHomeTimelineReturnParams('visited'), { timelineMode: 'visited' });
  assert.equal(resolveHomeTimelineMode(getHomeTimelineReturnParams('planned').timelineMode), 'planned');
  assert.equal(resolveHomeTimelineMode(getHomeTimelineReturnParams('visited').timelineMode), 'visited');
  assert.equal(resolveHomeTimelineMode(undefined), 'visited');
});

test('search returns to its originating tab instead of always returning home', () => {
  assert.equal(resolveSearchOrigin('map'), 'map');
  assert.equal(resolveSearchOrigin(undefined), 'home');
  assert.deepEqual(getSearchReturnHref('map', 'visited'), { pathname: '/(tabs)/location' });
  assert.deepEqual(getSearchReturnHref('home', 'planned'), {
    pathname: '/(tabs)/home',
    params: { timelineMode: 'planned' },
  });
});

test('planned search exposes only trip-planning relevant categories', () => {
  assert.deepEqual(getSearchCategoriesForMode('planned'), ['text', 'date', 'location', 'saved', 'people']);
});

test('retains explicit stable ids for planned itinerary days', () => {
  assert.ok(plannedDays.every((day) => typeof day.id === 'string' && day.id.length > 0));
  assert.equal(new Set(plannedDays.map((day) => day.id)).size, plannedDays.length);
});

test('uses an outline icon for the Home emotion search category', () => {
  assert.equal(searchCategories.find((category) => category.id === 'emotion')?.icon, 'happy-outline');
});

test('text search matches visible trip data and canonical emotion labels', () => {
  assert.deepEqual(
    filterHomeTrips(mockTrips, { category: 'text', query: 'Chicago' }).map((trip) => trip.id),
    ['3'],
  );
  assert.deepEqual(
    filterHomeTrips(mockTrips, { category: 'text', query: 'overjoyed' }).map((trip) => trip.id),
    ['3', '6', '10'],
  );
});

test('photo search returns only cards with photos and narrows on available metadata', () => {
  const withPhotos = filterHomeTrips(mockTrips, { category: 'photos' });
  assert.ok(withPhotos.length > 0);
  assert.ok(withPhotos.every((trip) => trip.photos.length > 0));
  assert.deepEqual(
    filterHomeTrips(mockTrips, { category: 'photos', query: 'Chicago' }).map((trip) => trip.id),
    ['3'],
  );
  assert.deepEqual(
    filterHomeTrips(mockTrips, { category: 'photos', query: 'overjoyed' }),
    [],
  );
});

test('emotion and date filters do not return unrelated cards', () => {
  assert.ok(
    filterHomeTrips(mockTrips, { category: 'emotion', emotionId: 'happy' })
      .every((trip) => trip.mood === 'happy'),
  );
  assert.deepEqual(
    filterHomeTrips(mockTrips, { category: 'date', query: 'January 15, 2025' }).map((trip) => trip.id),
    ['3'],
  );
  assert.deepEqual(
    filterHomeTrips(mockTrips, { category: 'date', query: 'Chicago' }),
    [],
  );
  assert.deepEqual(
    filterHomeTrips(plannedTripCards, { category: 'emotion', emotionId: 'depressed' }),
    [],
  );
});

test('planned search uses structured checklist and itinerary data plus date range intersections', () => {
  assert.deepEqual(
    filterHomeTrips(plannedTripCards, { category: 'text', query: '火锅预订' }).map((trip) => trip.id),
    ['planned-1'],
  );
  assert.deepEqual(
    filterHomeTrips(plannedTripCards, { category: 'text', query: 'Tsukiji breakfast' }).map((trip) => trip.id),
    ['planned-2'],
  );
  assert.deepEqual(
    filterHomeTrips(plannedTripCards, { category: 'location', query: 'Tokyo' }).map((trip) => trip.id),
    ['planned-2'],
  );
  assert.deepEqual(
    filterHomeTrips(plannedTripCards, { category: 'location', query: '火锅预订' }),
    [],
  );
  assert.deepEqual(
    filterHomeTrips(plannedTripCards, {
      category: 'date',
      dateRange: { start: '2026-07-26', end: '2026-08-14' },
    }).map((trip) => trip.id),
    ['planned-1', 'planned-3', 'planned-4', 'planned-2'],
  );
});
