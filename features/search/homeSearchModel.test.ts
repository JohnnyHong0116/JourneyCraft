import test from 'node:test';
import assert from 'node:assert/strict';
import { EMOTIONS } from '../../src/constants/emotions.ts';
import { mockTrips, plannedDays, plannedTripCards, searchCategories } from '../../src/data/appData.ts';
import { filterHomeTrips, getHomeSearchTrips } from './homeSearchModel.ts';

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
