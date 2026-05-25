import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const centeredGearMarker = 'M10 3.5H14';

for (const iconName of ['setting-selected.svg', 'setting-unselected.svg']) {
  test(`${iconName} uses a transparent, centered gear glyph`, () => {
    const source = readFileSync(
      join(process.cwd(), 'src', 'assets', 'icons', iconName),
      'utf8',
    );

    assert.doesNotMatch(source, /<rect\b/);
    assert.match(source, new RegExp(centeredGearMarker));
  });
}
