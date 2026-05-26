import test from 'node:test';
import assert from 'node:assert/strict';
import { getTripCoverUri } from './tripCardModel.ts';

test('does not render a cover area when a trip has no photos', () => {
  assert.equal(getTripCoverUri([]), undefined);
});

test('uses the first photo as the card cover when media exists', () => {
  assert.equal(
    getTripCoverUri(['https://images.example/cover.jpg', 'https://images.example/second.jpg']),
    'https://images.example/cover.jpg',
  );
});
