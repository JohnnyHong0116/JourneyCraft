import test from 'node:test';
import assert from 'node:assert/strict';
import { mockTrips, people, plannedTripCards } from '../../src/data/appData.ts';
import { filterHomeTrips } from './homeSearchModel.ts';
import {
  formatAudioResultCount,
  formatPersonDisplayName,
  getPersonInitials,
  getPeopleForTrip,
} from './peopleSearchModel.ts';

test('centralizes people with stable ids and structured card references', () => {
  assert.ok(people.length > 0);
  assert.equal(new Set(people.map((person) => person.id)).size, people.length);
  assert.ok([...mockTrips, ...plannedTripCards].every((trip) => Array.isArray(trip.peopleIds)));
  assert.deepEqual(getPeopleForTrip(plannedTripCards[0], people).map((person) => person.id), ['amily-zheng', 'johnny-huang']);
});

test('formats Chinese, English, mixed, long, and missing names consistently', () => {
  assert.equal(formatPersonDisplayName('郑晨辰'), '郑晨辰');
  assert.equal(formatPersonDisplayName('Amily Zheng'), 'Amily Z.');
  assert.equal(formatPersonDisplayName('Amily Chenchen Zheng'), 'Amily Z.');
  assert.equal(formatPersonDisplayName('Mary-Jane Smith'), 'Mary-Jane S.');
  assert.equal(formatPersonDisplayName('郑晨辰 Amily'), '郑晨辰 Amily');
  assert.equal(formatPersonDisplayName('ChristopherLee'), 'ChristopherL…');
  assert.equal(formatPersonDisplayName(''), 'Unknown');
});

test('provides initials fallbacks for Chinese, English, mixed, and missing names', () => {
  assert.equal(getPersonInitials('郑晨辰'), '郑');
  assert.equal(getPersonInitials('Amily Zheng'), 'AZ');
  assert.equal(getPersonInitials('Amily Chenchen Zheng'), 'AZ');
  assert.equal(getPersonInitials('Amily'), 'AM');
  assert.equal(getPersonInitials('郑晨辰 Amily'), '郑');
  assert.equal(getPersonInitials(''), '?');
});

test('people search shows people cards by default and selected people use OR matching', () => {
  const allWithPeople = filterHomeTrips(mockTrips, { category: 'people', selectedPersonIds: [] });
  assert.ok(allWithPeople.every((trip) => (trip.peopleIds?.length ?? 0) > 0));
  assert.equal(allWithPeople.some((trip) => trip.id === '2'), false);

  assert.deepEqual(
    filterHomeTrips(mockTrips, { category: 'people', selectedPersonIds: ['mike-carter'] }).map((trip) => trip.id),
    ['3'],
  );
  assert.deepEqual(
    filterHomeTrips(mockTrips, { category: 'people', selectedPersonIds: ['mike-carter', 'alex-rivera'] }).map((trip) => trip.id),
    ['3', '4'],
  );
});

test('people query matches structured person names rather than unrelated card text', () => {
  assert.deepEqual(
    filterHomeTrips(mockTrips, { category: 'people', query: 'Lisa' }).map((trip) => trip.id),
    ['3'],
  );
  assert.deepEqual(filterHomeTrips(mockTrips, { category: 'people', query: 'Chicago' }), []);
});

test('formats green audio-result metadata only when recordings exist', () => {
  assert.equal(formatAudioResultCount(1), '1 recording');
  assert.equal(formatAudioResultCount(2), '2 recordings');
  assert.equal(formatAudioResultCount(0), undefined);
});
