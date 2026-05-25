import test from 'node:test';
import assert from 'node:assert/strict';
import { getFooterBottomInset, getFooterVisualHeight, getScrollBottomInset } from './appScreenModel.ts';

test('leaves ordinary scroll screens at their requested bottom inset', () => {
  assert.equal(getScrollBottomInset(20), 20);
});

test('reserves room for an anchored footer above scrolling content', () => {
  assert.equal(getScrollBottomInset(16, 68), 84);
});

test('extends footer background through native bottom inset while the keyboard is hidden', () => {
  assert.equal(getFooterBottomInset(34, false), 34);
  assert.equal(getFooterVisualHeight(68, getFooterBottomInset(34, false)), 102);
  assert.equal(getScrollBottomInset(12, getFooterVisualHeight(68, 34)), 114);
});

test('removes home-indicator padding when keyboard owns the bottom boundary', () => {
  assert.equal(getFooterBottomInset(34, true), 0);
  assert.equal(getFooterVisualHeight(68, getFooterBottomInset(34, true)), 68);
});
