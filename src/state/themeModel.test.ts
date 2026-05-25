import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getThemeTransitionPlan,
  resolveThemeMode,
  THEME_TRANSITION_REVEAL_MS,
} from './themeModel.ts';

test('system preference follows device appearance', () => {
  assert.equal(resolveThemeMode('system', 'dark'), 'dark');
  assert.equal(resolveThemeMode('system', 'light'), 'light');
  assert.equal(resolveThemeMode('system', null), 'light');
});

test('manual theme preference overrides device appearance', () => {
  assert.equal(resolveThemeMode('dark', 'light'), 'dark');
  assert.equal(resolveThemeMode('light', 'dark'), 'light');
});

test('changing modes crossfades from a captured outgoing frame without a solid-color flash', () => {
  assert.deepEqual(getThemeTransitionPlan('dark', 'light'), {
    shouldAnimate: true,
    strategy: 'snapshot',
  });
  assert.deepEqual(getThemeTransitionPlan('light', 'dark'), {
    shouldAnimate: true,
    strategy: 'snapshot',
  });
});

test('a resolved mode that did not change skips transition animation', () => {
  assert.deepEqual(getThemeTransitionPlan('dark', 'dark'), {
    shouldAnimate: false,
    strategy: 'none',
  });
});

test('snapshot reveal remains subtle and responsive', () => {
  assert.equal(THEME_TRANSITION_REVEAL_MS, 220);
  assert.ok(THEME_TRANSITION_REVEAL_MS < 300);
});
