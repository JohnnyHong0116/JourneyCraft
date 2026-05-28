import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import appConfig from '../../app.config.js';
import { BRAND_ASSETS, BRAND_NAMES } from './brandAssets.ts';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('brand names use JourneyCraft and the correct Chinese name', () => {
  assert.equal(BRAND_NAMES.english, 'JourneyCraft');
  assert.equal(BRAND_NAMES.chinese, '织旅');
});

test('brand asset registry points at organized project assets', () => {
  assert.deepEqual(BRAND_ASSETS, {
    iconFlat: './assets/brand/journeycraft-icon-flat.png',
    iconLiquidGlass: './assets/brand/journeycraft-icon-liquid-glass.png',
    logoLight: './assets/brand/journeycraft-logo-light.png',
    logoMono: './assets/brand/journeycraft-logo-mono.png',
  });

  for (const assetPath of Object.values(BRAND_ASSETS)) {
    assert.equal(existsSync(path.join(repoRoot, assetPath)), true, `${assetPath} should exist`);
  }
});

test('Expo config uses the safe cross-platform flat icon and brand splash', () => {
  const expo = appConfig.expo;

  assert.equal(expo.name, BRAND_NAMES.english);
  assert.equal(expo.icon, BRAND_ASSETS.iconFlat);
  assert.equal(expo.ios.icon, BRAND_ASSETS.iconFlat);
  assert.equal(expo.android.adaptiveIcon.foregroundImage, BRAND_ASSETS.iconFlat);
  assert.equal(expo.android.adaptiveIcon.backgroundColor, '#F8F2E4');
  assert.equal(expo.splash.image, BRAND_ASSETS.logoLight);
  assert.equal(expo.web.favicon, BRAND_ASSETS.iconFlat);
  assert.equal(expo.extra.brand.iconLiquidGlass, BRAND_ASSETS.iconLiquidGlass);
});
