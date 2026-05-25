import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SemanticIcon } from '@/components/Icon';
import { router } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, SegmentedControl, SurfaceCard } from '@/components/layout/AppScreen';
import {
  AnnualSpendPoint,
  getAnnualSpend,
  getStatisticsMonthOptions,
  getStatisticsSummary,
  getStatisticsYearOptions,
  moods,
  StatisticsMonthOption,
  StatisticsYearOption,
} from '@/data/appData';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Spacing, Typography } from '@/theme/designSystem';

type Period = 'monthly' | 'annual';

const INITIAL_YEAR = 2025;
const INITIAL_MONTH = 7;

export default function StatsTab() {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const [period, setPeriod] = useState<Period>('monthly');
  const [selectedYear, setSelectedYear] = useState(INITIAL_YEAR);
  const [selectedMonth, setSelectedMonth] = useState(INITIAL_MONTH);
  const [pickerOpen, setPickerOpen] = useState(false);
  const yearOptions = getStatisticsYearOptions();
  const monthOptions = getStatisticsMonthOptions(selectedYear);
  const selectedMonthName = monthOptions[selectedMonth - 1].shortName;
  const summary = getStatisticsSummary(selectedYear, period === 'monthly' ? selectedMonth : undefined);

  const handlePeriodChange = (next: Period) => {
    setPeriod(next);
    setPickerOpen(false);
  };

  return (
    <AppScreen scroll bottomInset={126}>
      <ContentContainer style={styles.content}>
        <Text style={styles.screenTitle}>Statistics</Text>
        <SegmentedControl
          value={period}
          onChange={handlePeriodChange}
          options={[{ value: 'monthly', label: 'Monthly' }, { value: 'annual', label: 'Annual' }]}
        />
        <PeriodPicker
          period={period}
          open={pickerOpen}
          onToggle={() => setPickerOpen((current) => !current)}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedMonthName={selectedMonthName}
          years={yearOptions}
          months={monthOptions}
          onSelectYear={(year) => setSelectedYear(year)}
          onSelectMonth={(month) => {
            setSelectedMonth(month);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
        <Pressable
          onPress={() => router.push({
            pathname: '/stats/summary',
            params: {
              period,
              year: String(selectedYear),
              month: String(selectedMonth),
            },
          })}
        >
          <SurfaceCard style={styles.expenseCard}>
            <View>
              <Text style={styles.cardTitle}>Trip Expenses</Text>
              <Text style={styles.meta}>
                {period === 'monthly' ? `${monthOptions[selectedMonth - 1].name}, ${selectedYear}` : selectedYear} | {summary.tripCount} Trips
              </Text>
            </View>
            <View style={styles.totalBlock}>
              <Text style={styles.meta}>Total</Text>
              <Text style={styles.total}>¥{summary.total.toFixed(2)}</Text>
            </View>
            <SemanticIcon name="chevron-forward" size={23} color={palette.text} />
          </SurfaceCard>
        </Pressable>
        {period === 'monthly' ? (
          <MonthlyStats summary={summary} />
        ) : (
          <AnnualStats year={selectedYear} summary={summary} />
        )}
      </ContentContainer>
    </AppScreen>
  );
}

function PeriodPicker({
  period,
  open,
  onToggle,
  selectedYear,
  selectedMonth,
  selectedMonthName,
  years,
  months,
  onSelectYear,
  onSelectMonth,
  onClose,
}: {
  period: Period;
  open: boolean;
  onToggle: () => void;
  selectedYear: number;
  selectedMonth: number;
  selectedMonthName: string;
  years: StatisticsYearOption[];
  months: StatisticsMonthOption[];
  onSelectYear: (year: number) => void;
  onSelectMonth: (month: number) => void;
  onClose: () => void;
}) {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <View style={styles.periodPicker}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Select ${period === 'monthly' ? 'month and year' : 'year'}`}
        accessibilityState={{ expanded: open }}
        onPress={onToggle}
        style={styles.dateButton}
      >
        <Text style={styles.dateText}>{period === 'monthly' ? `${selectedMonthName} ${selectedYear}` : selectedYear}</Text>
        <SemanticIcon name={open ? 'chevron-up' : 'chevron-down'} size={18} color={palette.text} />
      </Pressable>
      {open ? (
        <SurfaceCard style={styles.pickerCard}>
          <Text style={styles.pickerTitle}>{period === 'monthly' ? 'Select year and month' : 'Select year'}</Text>
          <View style={styles.optionRow}>
            {years.map((option) => (
              <PeriodOption
                key={`year-${option.year}`}
                label={String(option.year)}
                active={option.year === selectedYear}
                hasRecords={option.hasRecords}
                onPress={() => {
                  onSelectYear(option.year);
                  if (period === 'annual') onClose();
                }}
              />
            ))}
          </View>
          {period === 'monthly' ? (
            <View style={styles.monthGrid}>
              {months.map((option) => (
                <PeriodOption
                  key={`month-${selectedYear}-${option.month}`}
                  label={option.shortName}
                  active={option.month === selectedMonth}
                  hasRecords={option.hasRecords}
                  onPress={() => onSelectMonth(option.month)}
                />
              ))}
            </View>
          ) : null}
          <View style={styles.legend}>
            <View style={[styles.legendDot, { backgroundColor: palette.accentStrong }]} />
            <Text style={styles.legendText}>Recorded activity</Text>
            <View style={[styles.legendDot, { backgroundColor: stylesVars.mutedOption }]} />
            <Text style={styles.legendText}>No records</Text>
          </View>
        </SurfaceCard>
      ) : null}
    </View>
  );
}

function PeriodOption({
  label,
  active,
  hasRecords,
  onPress,
}: {
  label: string;
  active: boolean;
  hasRecords: boolean;
  onPress: () => void;
}) {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.periodOption, active && styles.periodOptionSelected]}
    >
      <Text
        style={[
          styles.periodOptionText,
          { color: hasRecords ? palette.accentStrong : stylesVars.mutedOption },
          active && styles.periodOptionTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function MonthlyStats({ summary }: { summary: ReturnType<typeof getStatisticsSummary> }) {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const percentage = Math.min(100, Math.round((summary.travelDays / 30) * 100));
  return (
    <>
      <SurfaceCard style={styles.rowCard}>
        <Metric icon="airplane" value={String(summary.travelDays)} label="Travel days recorded this month" />
        <View style={styles.ring}><Text style={styles.ringValue}>{percentage}%</Text></View>
      </SurfaceCard>
      <SurfaceCard style={styles.rowCard}>
        <Metric icon="map" value={String(summary.tripCount)} label="Trips with activity this month" />
        <SemanticIcon name="chevron-forward" size={22} color={palette.text} />
      </SurfaceCard>
      <MoodCard />
    </>
  );
}

function AnnualStats({ year, summary }: { year: number; summary: ReturnType<typeof getStatisticsSummary> }) {
  const { mode } = useAppState();
  const styles = createStyles(AppPalette[mode]);
  const spend = useMemo(() => getAnnualSpend(year), [year]);
  const maximum = Math.max(...spend.map((month) => month.value), 1);

  return (
    <>
      <SurfaceCard style={styles.chart}>
        <Text style={styles.meta}>Unit: ¥</Text>
        <View style={styles.bars}>
          {spend.map((month) => (
            <AnnualBar key={month.key} month={month} maximum={maximum} />
          ))}
        </View>
      </SurfaceCard>
      <View style={styles.metricsGrid}>
        {[
          ['calendar', String(summary.travelDays), 'Traveled Days'],
          ['location', String(summary.tripCount), 'Recorded Trips'],
          ['happy', '40%', 'Frequent Mood'],
          ['book', String(summary.tripCount), 'Journal Entries'],
        ].map(([icon, value, label]) => (
          <SurfaceCard key={label} style={styles.metricTile}>
            <Metric icon={icon} value={value} label={label} compact />
          </SurfaceCard>
        ))}
      </View>
      <MoodCard />
    </>
  );
}

function AnnualBar({ month, maximum }: { month: AnnualSpendPoint; maximum: number }) {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <View style={styles.barColumn}>
      <View
        style={[
          styles.bar,
          {
            height: Math.max(7, (month.value / maximum) * 112),
            backgroundColor: month.hasRecords ? palette.accentStrong : stylesVars.mutedBar,
          },
        ]}
      />
      <Text style={styles.monthLabel}>{month.label}</Text>
    </View>
  );
}

function MoodCard() {
  const { mode } = useAppState();
  const styles = createStyles(AppPalette[mode]);
  return (
    <SurfaceCard style={styles.moodCard}>
      <Text style={styles.cardTitle}>Mood Bar</Text>
      <View style={styles.moods}>
        {moods.map((mood) => (
          <View key={mood.label} style={styles.moodItem}>
            <View style={[styles.moodCircle, { backgroundColor: mood.color }]} />
            <Text style={styles.percent}>{mood.percentage}%</Text>
          </View>
        ))}
      </View>
      <View style={styles.flow}>
        {moods.map((mood) => <View key={mood.label} style={[styles.flowUnit, { backgroundColor: mood.color, flex: mood.percentage }]} />)}
      </View>
    </SurfaceCard>
  );
}

function Metric({ icon, value, label, compact = false }: { icon: string; value: string; label: string; compact?: boolean }) {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <View style={styles.metric}>
      <SemanticIcon name={`${icon}-outline`} size={compact ? 22 : 27} color={palette.accentStrong} />
      <View style={styles.metricCopy}>
        <Text style={[styles.metricValue, compact && styles.metricValueLarge]}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
    </View>
  );
}

const stylesVars = {
  mutedOption: '#72747a',
  mutedBar: '#b0b0ad',
};

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.md, gap: Spacing.lg },
  screenTitle: { fontSize: Typography.fontSize.xl, textAlign: 'center', fontWeight: '700', color: palette.text },
  periodPicker: { alignItems: 'center', zIndex: 4 },
  dateButton: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md },
  dateText: { fontSize: Typography.fontSize.md, fontWeight: '700', color: palette.text },
  pickerCard: { gap: Spacing.md, padding: Spacing.md },
  pickerTitle: { color: palette.text, fontSize: Typography.fontSize.sm, fontWeight: '700' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  periodOption: { minWidth: 66, minHeight: 39, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: palette.divider, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.sm },
  periodOptionSelected: { backgroundColor: palette.accent, borderColor: palette.accentStrong },
  periodOptionText: { fontSize: Typography.fontSize.sm, fontWeight: '700' },
  periodOptionTextSelected: { color: '#223124' },
  legend: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.xs },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { color: palette.secondaryText, fontSize: Typography.fontSize.xs, marginRight: Spacing.sm },
  expenseCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg },
  cardTitle: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: palette.text },
  meta: { fontSize: Typography.fontSize.xs, color: palette.secondaryText, marginTop: 3 },
  totalBlock: { flex: 1, alignItems: 'flex-end' },
  total: { fontSize: 28, fontWeight: '600', color: palette.text },
  rowCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metric: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  metricCopy: { flex: 1 },
  metricValue: { fontSize: Typography.fontSize.md, fontWeight: '700', color: palette.text },
  metricValueLarge: { fontSize: 31 },
  metricLabel: { color: palette.text, fontSize: Typography.fontSize.sm, marginTop: 3 },
  ring: { width: 54, height: 54, borderRadius: 27, borderWidth: 6, borderColor: palette.accentStrong, alignItems: 'center', justifyContent: 'center' },
  ringValue: { fontSize: 11, fontWeight: '700' },
  moodCard: { gap: Spacing.md },
  moods: { flexDirection: 'row', justifyContent: 'space-between' },
  moodItem: { alignItems: 'center', gap: Spacing.xs },
  moodCircle: { width: 31, height: 31, borderRadius: 16 },
  percent: { fontSize: 11, color: palette.text, borderRadius: 8, backgroundColor: palette.cardMuted, paddingHorizontal: 7 },
  flow: { height: 36, borderRadius: BorderRadius.xl, overflow: 'hidden', flexDirection: 'row' },
  flowUnit: { height: '100%' },
  chart: { height: 238 },
  bars: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 7, marginTop: Spacing.md },
  barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 3 },
  bar: { width: '70%', minHeight: 7, borderRadius: 7 },
  monthLabel: { fontSize: 10, color: palette.secondaryText },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.lg },
  metricTile: { width: '47%', minHeight: 105, justifyContent: 'center', padding: Spacing.md },
});
