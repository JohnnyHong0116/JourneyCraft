import test from 'node:test';
import assert from 'node:assert/strict';
import { mockTrips, statisticsExpenses } from '../../src/data/appData.ts';
import {
  getExpenseRecordById,
  getExpensesForMonth,
  getExpensesForYear,
  getMonthlyExpenseSeries,
  getStatsForMonth,
  getStatsForYear,
  getStatisticsDrawerSnapPoints,
} from './statisticsModel.ts';

test('monthly statistics are derived from local trips and expenses', () => {
  const stats = getStatsForMonth(mockTrips, statisticsExpenses, 2025, 7);

  assert.equal(stats.expenseTotal, 200);
  assert.equal(stats.expenseRecords.length, 1);
  assert.equal(stats.travelDays, 4);
  assert.equal(stats.daysInMonth, 31);
  assert.equal(stats.travelDayPercentage, 13);
  assert.equal(stats.journalEntries, 0);
});

test('annual statistics derive monthly expense series and frequent mood from records', () => {
  const stats = getStatsForYear(mockTrips, statisticsExpenses, 2025);
  const series = getMonthlyExpenseSeries(statisticsExpenses, 2025);

  assert.equal(stats.expenseTotal, 568);
  assert.equal(stats.expenseRecords.length, 6);
  assert.equal(series.find((point) => point.month === 7)?.value, 200);
  assert.equal(stats.journalEntries, 3);
  assert.equal(stats.frequentMood?.id, 'overjoyed');
});

test('expense helpers filter by month/year and expose detail records with stable ids', () => {
  const monthly = getExpensesForMonth(statisticsExpenses, 2025, 7);
  const yearly = getExpensesForYear(statisticsExpenses, 2025);
  const record = getExpenseRecordById(statisticsExpenses, mockTrips, monthly[0].id);

  assert.deepEqual(monthly.map((item) => item.id), ['expense-record-chengdu-2025-07']);
  assert.equal(yearly.length, 6);
  assert.equal(record?.title, 'Chengdu Trip');
  assert.equal(record?.items.length, 6);
});

test('drawer snap points expose exactly collapsed and expanded heights by period', () => {
  const monthly = getStatisticsDrawerSnapPoints(800, 'monthly');
  const annual = getStatisticsDrawerSnapPoints(800, 'annual');

  assert.deepEqual(Object.keys(monthly).sort(), ['collapsed', 'expanded']);
  assert.deepEqual(Object.keys(annual).sort(), ['collapsed', 'expanded']);
  assert.ok(monthly.expanded > monthly.collapsed);
  assert.ok(annual.expanded > annual.collapsed);
  assert.equal(monthly.collapsed, 280);
  assert.equal(monthly.expanded, 550);
  assert.equal(annual.collapsed, 280);
  assert.equal(annual.expanded, 550);
});
