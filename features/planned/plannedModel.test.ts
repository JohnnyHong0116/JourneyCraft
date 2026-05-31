import test from 'node:test';
import assert from 'node:assert/strict';
import { plannedTripCards } from '../../src/data/appData.ts';
import type { PlannedTrip } from '../../src/types/plannedTrip.ts';
import {
  PLANNED_DRAWER_STACK_OVERLAP,
  addPlannedCompanion,
  createPlannedItineraryEntry,
  getChecklistProgress,
  getChecklistProgressPercent,
  getDaysUntilDeparture,
  getNextItineraryEntry,
  getPlannedCalendarRange,
  getPlannedDateMarker,
  getPlannedDrawerStackLayer,
  getPlannedTripById,
  getPlannedTripsForDate,
  getPlannedTripsForDateRange,
  getUpcomingPlannedTrips,
} from './plannedModel.ts';

const plans: PlannedTrip[] = [
  {
    id: 'later',
    title: 'Tokyo Food Trip',
    location: 'Tokyo',
    route: 'Osaka - Tokyo',
    createdAt: '2026-08-10T00:00:00Z',
    displayDate: '2026-08-10',
    startDate: '2026-08-10',
    endDate: '2026-08-13',
    photos: [],
    audioCount: 0,
    videoCount: 0,
    checklistItems: [
      { id: 'l-1', label: 'Reserve rail pass', status: 'pending', userEntered: true },
    ],
    itineraryEntries: [],
  },
  {
    id: 'soon',
    title: '成都西安到处吃',
    location: '成都 + 西安',
    route: '成都 - 西安',
    createdAt: '2026-07-24T00:00:00Z',
    displayDate: '2026-07-24',
    startDate: '2026-07-24',
    endDate: '2026-07-27',
    photos: [],
    audioCount: 0,
    videoCount: 0,
    checklistItems: [
      { id: 's-1', label: 'Passport', status: 'completed', userEntered: false },
      { id: 's-2', label: 'Hotel', status: 'completed', userEntered: false },
      { id: 's-3', label: 'Hotpot booking', status: 'pending', userEntered: true },
      { id: 's-4', label: 'Pack', status: 'notStarted', userEntered: false },
    ],
    itineraryEntries: [],
  },
  {
    id: 'past',
    title: 'Past planning card',
    location: 'Madison',
    route: 'Madison',
    createdAt: '2026-01-01T00:00:00Z',
    displayDate: '2026-01-01',
    startDate: '2026-01-01',
    endDate: '2026-01-03',
    photos: [],
    audioCount: 0,
    videoCount: 0,
    checklistItems: [],
    itineraryEntries: [],
  },
];

test('planned list hides completed past plans and sorts upcoming departures ascending', () => {
  assert.deepEqual(
    getUpcomingPlannedTrips(plans, new Date(2026, 4, 27)).map((trip) => trip.id),
    ['soon', 'later'],
  );
});

test('checklist progress uses meaningful completed, pending, and remaining counts', () => {
  assert.deepEqual(getChecklistProgress(plans[1]), {
    completed: 2,
    pending: 1,
    notStarted: 1,
    total: 4,
  });
  assert.equal(getDaysUntilDeparture(plans[1].startDate, new Date(2026, 4, 27)), 58);
});

test('planned-card summaries resolve the correct plan, completion percentage, and next itinerary stop', () => {
  const plan = plannedTripCards[0]!;

  assert.equal(getPlannedTripById(plannedTripCards, plan.id)?.title, plan.title);
  assert.equal(getPlannedTripById(plannedTripCards, 'missing-plan'), undefined);
  assert.equal(getChecklistProgressPercent(plan), 40);
  assert.deepEqual(getNextItineraryEntry(plan), plan.itineraryEntries[0]);
});

test('new itinerary stops and travelers are normalized for inline plan editing', () => {
  const plan = plannedTripCards[0]!;

  assert.deepEqual(createPlannedItineraryEntry(plan, 'new-stop', {
    title: '  Museum visit ',
    date: '2026-07-26',
    time: ' 14:30 ',
    location: '  Wuhou District ',
  }), {
    id: 'new-stop',
    title: 'Museum visit',
    type: 'activity',
    date: '2026-07-26',
    dayNumber: 3,
    time: '14:30',
    location: 'Wuhou District',
  });
  assert.equal(createPlannedItineraryEntry(plan, 'blank-stop', { title: '   ', date: plan.startDate }), undefined);
  assert.deepEqual(addPlannedCompanion(['Amily'], ' Johnny '), ['Amily', 'Johnny']);
  assert.deepEqual(addPlannedCompanion(['Amily'], 'amily'), ['Amily']);
});

test('planned calendar covers future planned months and identifies range marker roles', () => {
  const range = getPlannedCalendarRange(plans.slice(0, 2), new Date(2026, 4, 27));
  assert.deepEqual(range.map((month) => `${month.getFullYear()}-${month.getMonth() + 1}`), ['2026-7', '2026-8']);
  assert.equal(getPlannedDateMarker(plans, '2026-07-24'), 'endpoint');
  assert.equal(getPlannedDateMarker(plans, '2026-07-25'), 'middle');
  assert.equal(getPlannedDateMarker(plans, '2026-07-27'), 'endpoint');
  assert.equal(getPlannedDateMarker(plans, '2026-07-28'), 'none');
});

test('drawer selection returns every plan active on the selected date', () => {
  assert.deepEqual(getPlannedTripsForDate(plans, '2026-07-25').map((trip) => trip.id), ['soon']);
  assert.deepEqual(getPlannedTripsForDate(plans, '2026-08-11').map((trip) => trip.id), ['later']);
});

test('drawer range selection returns plans that intersect the inclusive selected range', () => {
  const overlapping: PlannedTrip = {
    ...plans[0]!,
    id: 'overlap',
    title: 'Overlapping route',
    startDate: '2026-07-26',
    endDate: '2026-08-11',
  };

  assert.deepEqual(
    getPlannedTripsForDateRange([...plans, overlapping], '2026-07-27', '2026-08-10')
      .map((trip) => trip.id),
    ['soon', 'overlap', 'later'],
  );
});

test('planned mock records provide stable stacked-drawer fixtures with overlapping trips', () => {
  assert.ok(plannedTripCards.length >= 5);
  assert.equal(new Set(plannedTripCards.map((trip) => trip.id)).size, plannedTripCards.length);

  const concentratedPlans = getPlannedTripsForDate(plannedTripCards, '2026-07-26');
  assert.ok(concentratedPlans.length >= 3);
  assert.ok(concentratedPlans.every((trip) => trip.checklistItems.length > 0));
  assert.ok(concentratedPlans.every((trip) => trip.itineraryEntries.length > 0));
});

test('later drawer cards overlay earlier cards so their rounded leading edge stays visible', () => {
  const first = getPlannedDrawerStackLayer(0);
  const second = getPlannedDrawerStackLayer(1);

  assert.equal(first.isOverlayCard, false);
  assert.equal(second.isOverlayCard, true);
  assert.equal(second.overlapsPrevious, true);
  assert.ok(second.zIndex > first.zIndex);
});

test('stacked drawer cards use a restrained overlap that leaves prior card content readable', () => {
  assert.equal(PLANNED_DRAWER_STACK_OVERLAP, 8);
});
