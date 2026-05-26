import test from 'node:test';
import assert from 'node:assert/strict';
import { mockTrips, statisticsExpenses } from '../../src/data/appData.ts';
import {
  formatTripTimestamp,
  getCompanionCluster,
  getTripById,
  getTripExpenseSummary,
  getTripFeatures,
} from './tripDetailModel.ts';

test('resolves detail content from the trip route identifier', () => {
  assert.equal(getTripById(mockTrips, '1')?.title, 'Morning Coffee Run');
  assert.equal(getTripById(mockTrips, 'missing'), undefined);
});

test('builds compact feature values from real trip data', () => {
  const coffeeFeatures = getTripFeatures(mockTrips[0]);
  const walkFeatures = getTripFeatures(mockTrips[1]);

  assert.equal(coffeeFeatures.find((feature) => feature.id === 'photos')?.value, '1 Photo');
  assert.equal(coffeeFeatures.find((feature) => feature.id === 'location')?.value, 'Madison, WI');
  assert.equal(coffeeFeatures.find((feature) => feature.id === 'audio')?.value, 'No Audio');
  assert.equal(walkFeatures.find((feature) => feature.id === 'photos')?.value, 'No Photos');
});

test('summarizes participant clusters without inventing people', () => {
  assert.deepEqual(getCompanionCluster([]), {
    initials: [],
    overflow: 0,
    label: 'Add people',
  });
  assert.deepEqual(getCompanionCluster(['Sarah']), {
    initials: ['S'],
    overflow: 0,
    label: 'Sarah',
  });
  assert.deepEqual(getCompanionCluster(['Amily', 'Johnny', 'Mia']), {
    initials: ['A', 'J'],
    overflow: 1,
    label: '3 people',
  });
});

test('reports only expenses linked to the selected trip', () => {
  assert.deepEqual(getTripExpenseSummary(statisticsExpenses, '1'), {
    total: 0,
    count: 0,
    label: 'No expenses yet',
  });
  assert.deepEqual(getTripExpenseSummary(statisticsExpenses, '3'), {
    total: 92,
    count: 1,
    label: '\u00a592.00',
  });
});

test('formats a subdued timestamp for pull-down disclosure', () => {
  assert.equal(formatTripTimestamp('2026-05-25T09:00:00Z'), 'May 25, 2026 at 4:00 AM');
});
