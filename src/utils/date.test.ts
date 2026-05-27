import test from 'node:test';
import assert from 'node:assert/strict';
import type { Trip } from '../types/trip.ts';
import type { PlannedTrip } from '../types/plannedTrip.ts';
import { groupTripsBySection } from './date.ts';

const todayTrip: Trip = {
  id: 'raw-title',
  title: 'Tokyo Food Trip',
  location: 'Tokyo',
  createdAt: new Date().toISOString(),
  displayDate: new Date().toISOString(),
  photos: [],
  audioCount: 0,
  videoCount: 0,
};

test('localizes generated section labels while preserving raw trip content', () => {
  const english = groupTripsBySection([todayTrip], 'edited', 'desc', 'en');
  const chinese = groupTripsBySection([todayTrip], 'edited', 'desc', 'zh');

  assert.equal(english[0]?.title, 'Today');
  assert.equal(chinese[0]?.title, '今天');
  assert.equal(chinese[0]?.data[0]?.title, 'Tokyo Food Trip');
});

test('groups and sorts planned trips by their departure date using the shared helper', () => {
  const later: PlannedTrip = {
    ...todayTrip,
    id: 'later',
    displayDate: '2026-06-01',
    createdAt: '2026-01-01T00:00:00Z',
    route: 'Osaka - Tokyo',
    startDate: '2026-08-10',
    endDate: '2026-08-13',
    checklistItems: [],
    itineraryEntries: [],
  };
  const sooner: PlannedTrip = {
    ...later,
    id: 'sooner',
    displayDate: '2026-08-30',
    createdAt: '2026-01-02T00:00:00Z',
    startDate: '2026-07-24',
    endDate: '2026-07-27',
  };

  const sections = groupTripsBySection([later, sooner], 'edited', 'asc', 'en');

  assert.deepEqual(sections.flatMap((section) => section.data.map((trip) => trip.id)), ['sooner', 'later']);
  assert.deepEqual(sections.map((section) => section.title), ['July', 'August']);
});
