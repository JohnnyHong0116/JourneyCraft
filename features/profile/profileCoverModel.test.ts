import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getClosedCoverUri,
  getProfileCoverHeight,
  getRevealProgress,
  shouldTriggerRevealHaptic,
} from './profileCoverModel.ts';

test('profile cover stretches gradually while pulling and never shrinks below its closed height', () => {
  assert.equal(getProfileCoverHeight({ scrollY: 0, baseHeight: 220, expandedHeight: 430, revealProgress: 0 }), 220);
  assert.equal(getProfileCoverHeight({ scrollY: -60, baseHeight: 220, expandedHeight: 430, revealProgress: 0 }), 280);
  assert.equal(getProfileCoverHeight({ scrollY: 80, baseHeight: 220, expandedHeight: 430, revealProgress: 0 }), 220);
});

test('revealed profile cover collapses smoothly as content scrolls upward', () => {
  assert.equal(getRevealProgress(0, 96), 1);
  assert.equal(getRevealProgress(48, 96), 0.5);
  assert.equal(getRevealProgress(96, 96), 0);
  assert.equal(getProfileCoverHeight({ scrollY: 48, baseHeight: 220, expandedHeight: 430, revealProgress: 0.5 }), 325);
});

test('profile cover haptic fires only once when crossing the reveal threshold', () => {
  assert.equal(shouldTriggerRevealHaptic(-119, 120, false), false);
  assert.equal(shouldTriggerRevealHaptic(-120, 120, false), true);
  assert.equal(shouldTriggerRevealHaptic(-160, 120, true), false);
});

test('profile cover keeps one crop source through reveal and collapse', () => {
  assert.equal(getClosedCoverUri('cropped.jpg', 'full.jpg'), 'cropped.jpg');
  assert.equal(getClosedCoverUri(null, 'full.jpg'), 'full.jpg');
});
