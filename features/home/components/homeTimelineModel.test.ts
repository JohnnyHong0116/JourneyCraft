import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getSectionHeaderMaterial,
  HOME_TIMELINE_STICKY_SECTION_HEADERS,
} from './homeTimelineModel.ts';

test('timeline date headers remain inline instead of covering trip cards', () => {
  assert.equal(HOME_TIMELINE_STICKY_SECTION_HEADERS, false);
});

test('date headers use adaptive frosted materials', () => {
  assert.deepEqual(getSectionHeaderMaterial('dark'), {
    tint: 'dark',
    intensity: 70,
    washColor: 'rgba(30, 30, 30, 0.42)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  });
  assert.deepEqual(getSectionHeaderMaterial('light'), {
    tint: 'systemUltraThinMaterial',
    intensity: 72,
    washColor: 'rgba(255, 255, 255, 0.26)',
    borderColor: 'rgba(24, 32, 26, 0.08)',
  });
});
