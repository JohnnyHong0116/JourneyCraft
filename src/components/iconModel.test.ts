import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAppIconName } from './iconModel.ts';

test('maps common signed-in actions onto JourneyCraft assets', () => {
  assert.equal(resolveAppIconName('location-outline'), 'location-unselected');
  assert.equal(resolveAppIconName('images-outline'), 'cardimage');
  assert.equal(resolveAppIconName('mic-outline'), 'microphone');
  assert.equal(resolveAppIconName('people-outline'), 'cardpeople');
  assert.equal(resolveAppIconName('cardpeople'), 'cardpeople');
  assert.equal(resolveAppIconName('cardperson'), 'cardperson');
  assert.equal(resolveAppIconName('checkmark'), 'check');
});

test('leaves specialized unsupported icons for the existing fallback renderer', () => {
  assert.equal(resolveAppIconName('airplane-outline'), undefined);
});
