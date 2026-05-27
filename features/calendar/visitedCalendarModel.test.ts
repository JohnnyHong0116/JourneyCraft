import test from 'node:test';
import assert from 'node:assert/strict';
import { mockTrips } from '../../src/data/appData.ts';
import type { Trip } from '../../src/types/trip.ts';
import {
  dateHasCards,
  getAnchoredDrawerLayout,
  getAllowedMonthStarts,
  getCalendarMoodForDate,
  getCardsForDateRange,
  getDateSelectionPresentation,
  getFirstCardMonth,
  getMajorityEmotionForDate,
  getMoodEditorDate,
  getMonthCells,
  getSelectedRange,
  isDateInSelectedRange,
  toMonthKey,
  updateDateSelection,
} from './visitedCalendarModel.ts';

const today = new Date(2026, 4, 26);

test('limits navigable months to the first visited card month through the current month', () => {
  assert.equal(toMonthKey(getFirstCardMonth(mockTrips)), '2024-06');
  assert.deepEqual(
    getAllowedMonthStarts(mockTrips, today).map(toMonthKey).slice(-2),
    ['2026-04', '2026-05'],
  );
});

test('does not make dates after today selectable in the current month', () => {
  const cells = getMonthCells(new Date(2026, 4, 1), today);
  const may26 = cells.find((cell) => cell.key === '2026-05-26');
  const may27 = cells.find((cell) => cell.key === '2026-05-27');

  assert.equal(may26?.selectable, true);
  assert.equal(may27?.selectable, false);
  assert.equal(may27?.future, true);
});

test('uses the majority card emotion and breaks ties by the earliest card emotion', () => {
  const trips: Trip[] = [
    { ...mockTrips[0], id: 'later-happy', displayDate: '2025-01-03T15:00:00', mood: 'happy' },
    { ...mockTrips[0], id: 'early-sad', displayDate: '2025-01-03T13:00:00', mood: 'sad' },
    { ...mockTrips[0], id: 'third-happy', displayDate: '2025-01-03T16:00:00', mood: 'happy' },
  ];

  assert.equal(getMajorityEmotionForDate(trips, '2025-01-03'), 'happy');
  assert.equal(getMajorityEmotionForDate(trips.slice(0, 2), '2025-01-03'), 'sad');
});

test('keeps daily mood overrides separate and higher priority than card-derived moods', () => {
  const key = '2025-01-15';
  assert.equal(dateHasCards(mockTrips, key), true);
  assert.equal(getCalendarMoodForDate(mockTrips, {}, key), 'overjoyed');
  assert.equal(getCalendarMoodForDate(mockTrips, { [key]: 'sad' }, key), 'sad');
  assert.equal(getCalendarMoodForDate(mockTrips, { '2025-01-16': 'neutral' }, '2025-01-16'), 'neutral');
});

test('filters drawer cards to an inclusive selected date range', () => {
  assert.deepEqual(
    getCardsForDateRange(mockTrips, '2025-01-05', '2025-01-15').map((trip) => trip.id),
    ['5', '4', '3'],
  );
});

test('uses at most two anchors and shifts a range to the latest two tapped dates', () => {
  let anchors = updateDateSelection([], '2025-01-03');
  assert.deepEqual(anchors, ['2025-01-03']);
  anchors = updateDateSelection(anchors, '2025-01-08');
  assert.deepEqual(getSelectedRange(anchors), { start: '2025-01-03', end: '2025-01-08' });
  assert.equal(isDateInSelectedRange('2025-01-05', anchors), true);

  anchors = updateDateSelection(anchors, '2025-01-12');
  assert.deepEqual(getSelectedRange(anchors), { start: '2025-01-08', end: '2025-01-12' });

  anchors = updateDateSelection(anchors, '2025-01-12');
  assert.deepEqual(anchors, ['2025-01-12']);
  assert.deepEqual(getSelectedRange(updateDateSelection(['2025-01-12'], '2025-01-03')), {
    start: '2025-01-03',
    end: '2025-01-12',
  });
});

test('distinguishes one selected day from chronological range endpoints and interior days', () => {
  assert.equal(getDateSelectionPresentation('2025-01-03', ['2025-01-03']), 'single');
  assert.equal(getDateSelectionPresentation('2025-01-03', ['2025-01-08', '2025-01-03']), 'rangeStart');
  assert.equal(getDateSelectionPresentation('2025-01-05', ['2025-01-08', '2025-01-03']), 'rangeMiddle');
  assert.equal(getDateSelectionPresentation('2025-01-08', ['2025-01-08', '2025-01-03']), 'rangeEnd');
  assert.equal(getDateSelectionPresentation('2025-01-10', ['2025-01-08', '2025-01-03']), 'none');
});

test('allows daily mood editing only when selection identifies one day', () => {
  assert.equal(getMoodEditorDate(['2025-01-03']), '2025-01-03');
  assert.equal(getMoodEditorDate(['2025-01-03', '2025-01-03']), '2025-01-03');
  assert.equal(getMoodEditorDate(['2025-01-03', '2025-01-08']), undefined);
});

test('keeps the drawer bottom anchored while expanded height grows upward', () => {
  const layout = getAnchoredDrawerLayout({
    containerHeight: 640,
    calendarHeight: 360,
    collapsedGap: 16,
    bottomCoverage: 34,
  });

  assert.equal(layout.collapsedTop, 376);
  assert.equal(layout.expandedTop, 0);
  assert.equal(layout.collapsedTop + layout.collapsedHeight, 674);
  assert.equal(layout.expandedTop + layout.expandedHeight, 674);
  assert.ok(layout.expandedHeight > layout.collapsedHeight);
});
