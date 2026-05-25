import test from 'node:test';
import assert from 'node:assert/strict';
import { getOverlayMaterial, getPopoverPosition } from './overlayModel.ts';

test('dark and light overlays use adaptive material styling', () => {
  assert.equal(getOverlayMaterial('dark').tint, 'dark');
  assert.equal(getOverlayMaterial('light').tint, 'systemMaterial');
  assert.equal(getOverlayMaterial('dark').borderColor, 'rgba(255, 255, 255, 0.12)');
  assert.equal(getOverlayMaterial('light').sheetWash, 'rgba(246, 247, 243, 0.82)');
  assert.equal(getOverlayMaterial('dark').sheetWash, 'rgba(24, 24, 26, 0.74)');
});

test('popover is clamped horizontally and flips above a low anchor', () => {
  assert.deepEqual(getPopoverPosition({
    anchorX: 380,
    anchorY: 720,
    anchorWidth: 24,
    anchorHeight: 24,
    panelWidth: 248,
    panelHeight: 220,
    viewportWidth: 390,
    viewportHeight: 844,
  }), { left: 130, top: 492, placement: 'above' });
});

test('popover remains below a high anchor', () => {
  assert.deepEqual(getPopoverPosition({
    anchorX: 270,
    anchorY: 32,
    anchorWidth: 42,
    anchorHeight: 42,
    panelWidth: 248,
    panelHeight: 250,
    viewportWidth: 390,
    viewportHeight: 844,
  }), { left: 64, top: 82, placement: 'below' });
});
