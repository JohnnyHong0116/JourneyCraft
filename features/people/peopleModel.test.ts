import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addCompanion,
  applyCompanionOverrides,
  getPeopleIconName,
  removeCompanion,
} from './peopleModel.ts';

test('adds trimmed companions without case-insensitive duplicates', () => {
  assert.deepEqual(addCompanion(['Amily'], '  Johnny  '), ['Amily', 'Johnny']);
  assert.deepEqual(addCompanion(['Amily'], 'amily'), ['Amily']);
  assert.deepEqual(addCompanion(['Amily'], '   '), ['Amily']);
});

test('removes a companion by name', () => {
  assert.deepEqual(removeCompanion(['Amily', 'Johnny'], 'Amily'), ['Johnny']);
});

test('uses a single-person icon only for exactly one companion', () => {
  assert.equal(getPeopleIconName([]), 'cardperson');
  assert.equal(getPeopleIconName(['Amily']), 'cardperson');
  assert.equal(getPeopleIconName(['Amily', 'Johnny']), 'cardpeople');
});

test('applies persisted companion overrides without mutating source trips', () => {
  const trips = [{ id: 'trip-1', companions: ['Amily'] }, { id: 'trip-2', companions: [] }];
  const merged = applyCompanionOverrides(trips, { 'trip-1': ['Johnny'] });
  assert.deepEqual(merged, [{ id: 'trip-1', companions: ['Johnny'] }, { id: 'trip-2', companions: [] }]);
  assert.deepEqual(trips[0]?.companions, ['Amily']);
});
