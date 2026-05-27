import test from 'node:test';
import assert from 'node:assert/strict';
import { formatAppDate, translate } from './translations.ts';

test('translates built-in planned and common labels between English and Chinese', () => {
  assert.equal(translate('en', 'planned.daysUntilDeparture'), 'Days until departure');
  assert.equal(translate('zh', 'planned.daysUntilDeparture'), '距离出发');
  assert.equal(translate('en', 'planned.daysCount', { count: 25 }), '25 days');
  assert.equal(translate('zh', 'planned.daysCount', { count: 25 }), '25天');
  assert.equal(translate('en', 'common.entriesCount', { count: 4 }), '4 entries');
  assert.equal(translate('zh', 'common.entriesCount', { count: 4 }), '4 条记录');
});

test('formats system-owned dates by locale without translating user-entered content', () => {
  assert.equal(formatAppDate('2026-07-24', 'en', { month: 'short', day: 'numeric', year: 'numeric' }), 'Jul 24, 2026');
  assert.match(formatAppDate('2026-07-24', 'zh', { month: 'short', day: 'numeric', year: 'numeric' }), /2026年7月24日/);
  assert.equal('成都西安到处吃', '成都西安到处吃');
  assert.equal('Tokyo Food Trip', 'Tokyo Food Trip');
});
