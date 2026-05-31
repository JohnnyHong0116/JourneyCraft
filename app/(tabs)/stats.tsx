import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import { Circle, Line, Polygon, Polyline, Svg, Text as SvgTextNode } from 'react-native-svg';
import { Icon, SemanticIcon } from '@/components/Icon';
import { AppPalette, AppScreen, ContentContainer, SegmentedControl, SurfaceCard } from '@/components/layout/AppScreen';
import { EMOTIONS, getEmotionConfig } from '@/constants/emotions';
import {
  getStatisticsMonthOptions,
  getStatisticsYearOptions,
  mockTrips,
  statisticsExpenses,
  StatisticsMonthOption,
  StatisticsYearOption,
} from '@/data/appData';
import {
  DrawerSnap,
  getMonthlyExpenseSeries,
  getMonthlyMoodFlow,
  getStatisticsDrawerSnapPoints,
  getStatsForMonth,
  getStatsForYear,
  MoodDistributionItem,
  StatisticsPeriod,
  StatisticsSummary,
  TripExpenseRecord,
} from '@features/stats/statisticsModel';
import { useTranslation } from '@/i18n/useTranslation';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Shadows, Spacing, Typography } from '@/theme/designSystem';

const INITIAL_YEAR = 2025;
const INITIAL_MONTH = 7;
const NAV_GAP = 124;

export default function StatsTab() {
  const params = useLocalSearchParams<{
    period?: StatisticsPeriod;
    year?: string;
    month?: string;
    drawer?: string;
    snap?: DrawerSnap;
  }>();
  const { mode } = useAppState();
  const { t } = useTranslation();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const { height } = useWindowDimensions();
  const [period, setPeriod] = useState<StatisticsPeriod>('monthly');
  const [selectedYear, setSelectedYear] = useState(INITIAL_YEAR);
  const [selectedMonth, setSelectedMonth] = useState(INITIAL_MONTH);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSnap, setDrawerSnap] = useState<DrawerSnap>('collapsed');

  useEffect(() => {
    if (params.period === 'monthly' || params.period === 'annual') setPeriod(params.period);
    if (params.year && Number.isFinite(Number(params.year))) setSelectedYear(Number(params.year));
    if (params.month && Number.isFinite(Number(params.month))) setSelectedMonth(Number(params.month));
    if (params.drawer === 'open') setDrawerOpen(true);
    if (params.snap === 'expanded' || params.snap === 'collapsed') setDrawerSnap(params.snap);
  }, [params.drawer, params.month, params.period, params.snap, params.year]);

  const yearOptions = getStatisticsYearOptions();
  const monthOptions = getStatisticsMonthOptions(selectedYear);
  const selectedMonthName = monthOptions[selectedMonth - 1].shortName;
  const stats = useMemo(
    () => period === 'monthly'
      ? getStatsForMonth(mockTrips, statisticsExpenses, selectedYear, selectedMonth)
      : getStatsForYear(mockTrips, statisticsExpenses, selectedYear),
    [period, selectedMonth, selectedYear],
  );
  const periodLabel = period === 'monthly'
    ? `${monthOptions[selectedMonth - 1].name}, ${selectedYear}`
    : String(selectedYear);

  const handlePeriodChange = (next: StatisticsPeriod) => {
    setPeriod(next);
    setPickerOpen(false);
    setDrawerOpen(false);
    setDrawerSnap('collapsed');
  };

  const openExpenseRecord = (record: TripExpenseRecord) => {
    router.push({
      pathname: '/stats/expense/[id]',
      params: {
        id: record.id,
        period,
        year: String(selectedYear),
        month: String(selectedMonth),
        drawer: 'open',
        snap: drawerSnap,
      },
    } as any);
  };

  return (
    <AppScreen bottomInset={0}>
      <View style={styles.root}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, drawerOpen && { paddingBottom: getStatisticsDrawerSnapPoints(height, period).collapsed + Spacing.xl }]}
        >
          <ContentContainer style={styles.content}>
            <Text style={styles.screenTitle}>{t('stats.title')}</Text>
            <SegmentedControl
              value={period}
              onChange={handlePeriodChange}
              options={[
                { value: 'monthly', label: t('stats.monthly') },
                { value: 'annual', label: t('stats.annual') },
              ]}
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
            <ExpenseSummaryCard
              stats={stats}
              periodLabel={periodLabel}
              drawerOpen={drawerOpen}
              onPress={() => {
                setDrawerOpen((current) => !current);
                setDrawerSnap('collapsed');
              }}
            />
            {period === 'monthly' ? (
              <MonthlyStats stats={stats} />
            ) : (
              <AnnualStats year={selectedYear} stats={stats} />
            )}
          </ContentContainer>
        </ScrollView>
        {drawerOpen ? (
          <ExpenseDrawer
            period={period}
            snap={drawerSnap}
            screenHeight={height}
            stats={stats}
            periodLabel={periodLabel}
            onSnapChange={setDrawerSnap}
            onDismiss={() => {
              setDrawerOpen(false);
              setDrawerSnap('collapsed');
            }}
            onOpenRecord={openExpenseRecord}
          />
        ) : null}
      </View>
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
  period: StatisticsPeriod;
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
  const { t } = useTranslation();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <View style={styles.periodPicker}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={period === 'monthly' ? t('calendar.selectMonth') : t('common.chooseMonth')}
        accessibilityState={{ expanded: open }}
        onPress={onToggle}
        style={styles.dateButton}
      >
        <Text style={styles.dateText}>{period === 'monthly' ? `${selectedMonthName} ${selectedYear}` : selectedYear}</Text>
        <SemanticIcon name={open ? 'chevron-up' : 'chevron-down'} size={18} color={palette.text} />
      </Pressable>
      {open ? (
        <SurfaceCard style={styles.pickerCard}>
          <Text style={styles.pickerTitle}>{period === 'monthly' ? t('calendar.selectMonth') : t('common.chooseMonth')}</Text>
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

function ExpenseSummaryCard({
  stats,
  periodLabel,
  drawerOpen,
  onPress,
}: {
  stats: StatisticsSummary;
  periodLabel: string;
  drawerOpen: boolean;
  onPress: () => void;
}) {
  const { mode } = useAppState();
  const { t } = useTranslation();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: drawerOpen }} onPress={onPress}>
      <SurfaceCard style={styles.expenseCard}>
        <View style={styles.expenseCopy}>
          <Text style={styles.cardTitle}>{t('stats.tripExpenses')}</Text>
          <Text style={styles.meta}>
            {periodLabel} | {t('stats.tripsCount', { count: stats.expenseRecords.length })}
          </Text>
        </View>
        <View style={styles.totalBlock}>
          <Text style={styles.meta}>{t('stats.total')}</Text>
          <Text style={styles.total}>¥{stats.expenseTotal.toFixed(2)}</Text>
        </View>
        <SemanticIcon name={drawerOpen ? 'chevron-up' : 'chevron-down'} size={23} color={palette.text} />
      </SurfaceCard>
    </Pressable>
  );
}

function MonthlyStats({ stats }: { stats: StatisticsSummary }) {
  const { mode } = useAppState();
  const { t } = useTranslation();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <>
      <SurfaceCard style={styles.monthlyInfoCard}>
        <StatIconBadge icon="airplane" />
        <View style={styles.monthlyInfoCopy}>
          <Text style={styles.monthlyInfoTitle}>{t('stats.travelDays')}</Text>
          <Text style={styles.monthlyInfoSubtitle}>{t('stats.travelDaysThisMonth', { count: stats.travelDays })}</Text>
        </View>
        <TravelDayRing percentage={stats.travelDayPercentage ?? 0} />
      </SurfaceCard>
      <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/location')}>
        <SurfaceCard style={styles.monthlyInfoCard}>
          <StatIconBadge icon="location" />
          <View style={styles.monthlyInfoCopy}>
            <Text style={styles.monthlyInfoTitle}>{t('stats.countriesCities')}</Text>
            <Text style={styles.monthlyInfoSubtitle}>{t('stats.traveledToCountries', { count: stats.countryCount })}</Text>
            <Text style={styles.monthlyInfoSubtitle}>{t('stats.traveledToCities', { count: stats.cityCount })}</Text>
          </View>
          <SemanticIcon name="chevron-forward" size={30} color={palette.text} />
        </SurfaceCard>
      </Pressable>
      <MoodCard title={t('stats.moodBar')} distribution={stats.moodDistribution} />
    </>
  );
}

function StatIconBadge({ icon }: { icon: 'airplane' | 'location' }) {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <View style={styles.statIconBadge}>
      <SemanticIcon name={icon} size={34} color="#FFFFFF" />
    </View>
  );
}

function AnnualStats({ year, stats }: { year: number; stats: StatisticsSummary }) {
  const { mode } = useAppState();
  const { t } = useTranslation();
  const styles = createStyles(AppPalette[mode]);
  const spend = useMemo(() => getMonthlyExpenseSeries(statisticsExpenses, year), [year]);
  const moodFlow = useMemo(() => getMonthlyMoodFlow(mockTrips, year), [year]);
  const frequentMood = stats.moodDistribution.find((mood) => mood.isDominant && mood.count > 0);

  return (
    <>
      <LineChartCard points={spend} />
      <View style={styles.metricsGrid}>
        <SurfaceCard style={styles.metricTile}>
          <Metric icon="calendar" value={String(stats.travelDays)} label={t('stats.traveledDays')} compact />
        </SurfaceCard>
        <SurfaceCard style={styles.metricTile}>
          <Metric icon="location" value={String(stats.cityCount)} label={t('stats.traveledCities')} compact />
        </SurfaceCard>
        <SurfaceCard style={styles.metricTile}>
          <Metric
            emotionId={frequentMood?.id}
            icon={!frequentMood ? 'happy' : undefined}
            value={frequentMood ? `${frequentMood.percentage}%` : '-'}
            label={t('stats.frequentMood')}
            compact
          />
        </SurfaceCard>
        <SurfaceCard style={styles.metricTile}>
          <Metric icon="book" value={String(stats.journalEntries)} label={t('stats.journalEntries')} compact />
        </SurfaceCard>
      </View>
      <MoodFlowCard points={moodFlow} />
    </>
  );
}

function TravelDayRing({ percentage }: { percentage: number }) {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const size = 64;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = Math.PI * 2 * radius;
  const dashOffset = circumference * (1 - percentage / 100);
  return (
    <View style={styles.ring}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={palette.cardMuted} strokeWidth={stroke} fill="transparent" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={palette.accentStrong}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={styles.ringValue}>{percentage}%</Text>
    </View>
  );
}

function MoodCard({ title, distribution }: { title: string; distribution: MoodDistributionItem[] }) {
  const { mode } = useAppState();
  const { t } = useTranslation();
  const styles = createStyles(AppPalette[mode]);
  const hasMoodData = distribution.some((mood) => mood.count > 0);
  return (
    <SurfaceCard style={styles.moodCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {hasMoodData ? (
        <>
          <View style={styles.moods}>
            {distribution.map((mood) => {
              const emotion = getEmotionConfig(mood.id);
              return (
                <View key={mood.id} style={[styles.moodItem, mood.isDominant && styles.moodItemDominant]}>
                  <Icon name={emotion.icon} size={mood.isDominant ? 38 : 31} />
                  <Text style={[styles.percent, { backgroundColor: withAlpha(emotion.color, 0.18) }]}>{mood.percentage}%</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.flow}>
            {distribution.map((mood) => (
              <View
                key={mood.id}
                style={[
                  styles.flowUnit,
                  { backgroundColor: mood.color, flex: mood.percentage || 0.01 },
                ]}
              />
            ))}
          </View>
        </>
      ) : (
        <Text style={styles.emptyText}>{t('stats.noMoodData')}</Text>
      )}
    </SurfaceCard>
  );
}

function LineChartCard({ points }: { points: ReturnType<typeof getMonthlyExpenseSeries> }) {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const width = 310;
  const height = 188;
  const paddingX = 18;
  const paddingTop = 18;
  const paddingBottom = 34;
  const max = Math.max(...points.map((point) => point.value), 1);
  const chartPoints = points.map((point, index) => {
    const x = paddingX + (index / 11) * (width - paddingX * 2);
    const y = height - paddingBottom - (point.value / max) * (height - paddingTop - paddingBottom);
    return { x, y, value: point.value, label: point.label };
  });
  const polyline = chartPoints.map((point) => `${point.x},${point.y}`).join(' ');
  const glowPolygon = `${paddingX},${height - paddingBottom} ${polyline} ${width - paddingX},${height - paddingBottom}`;

  return (
    <SurfaceCard style={styles.chart}>
      <Text style={styles.meta}>Unit: ¥</Text>
      <View style={styles.chartGlow}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {[0, 1, 2, 3, 4].map((line) => {
            const y = paddingTop + line * ((height - paddingTop - paddingBottom) / 4);
            return <Line key={`grid-h-${line}`} x1={paddingX} x2={width - paddingX} y1={y} y2={y} stroke={withAlpha(palette.secondaryText, 0.20)} strokeWidth={1} strokeDasharray="4 4" />;
          })}
          {points.map((point, index) => {
            const x = paddingX + (index / 11) * (width - paddingX * 2);
            return <Line key={`grid-v-${point.key}`} x1={x} x2={x} y1={paddingTop} y2={height - paddingBottom} stroke={withAlpha(palette.secondaryText, 0.14)} strokeWidth={1} strokeDasharray="4 4" />;
          })}
          <Polygon points={glowPolygon} fill={withAlpha(palette.accentStrong, 0.16)} />
          <Polyline points={polyline} fill="none" stroke={withAlpha(palette.accentStrong, 0.22)} strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" />
          <Polyline points={polyline} fill="none" stroke={palette.text} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
          {chartPoints.map((point) => (
            <Circle key={`${point.label}-${point.x}`} cx={point.x} cy={point.y} r={4} fill={palette.card} stroke={palette.text} strokeWidth={2} />
          ))}
          {points.map((point, index) => {
            const x = paddingX + (index / 11) * (width - paddingX * 2);
            return <SvgText key={`month-${point.key}`} x={x} y={height - 8} label={point.label} color={palette.secondaryText} />;
          })}
        </Svg>
      </View>
    </SurfaceCard>
  );
}

function SvgText({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <SvgTextNode
      x={x}
      y={y}
      textAnchor="middle"
      fill={color}
      fontSize="9"
      fontWeight="600"
    >
      {label}
    </SvgTextNode>
  );
}

function MoodFlowCard({ points }: { points: ReturnType<typeof getMonthlyMoodFlow> }) {
  const { mode } = useAppState();
  const { t } = useTranslation();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <SurfaceCard style={styles.moodCard}>
      <Text style={styles.cardTitle}>{t('stats.moodFlow')}</Text>
      <View style={styles.moodLegend}>
        {EMOTIONS.map((emotion) => (
          <View key={emotion.id} style={styles.moodLegendItem}>
            <Icon name={emotion.icon} size={18} />
            <Text style={styles.moodLegendText} numberOfLines={1}>{emotion.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.moodFlowBars}>
        {points.map((point) => (
          <View key={point.key} style={styles.moodFlowColumn}>
            <View style={styles.moodFlowTrack}>
              {point.total > 0 ? point.distribution.map((mood) => (
                <View
                  key={`${point.key}-${mood.id}`}
                  style={[
                    styles.moodFlowSegment,
                    {
                      flex: mood.percentage || 0.01,
                      backgroundColor: mood.isDominant ? mood.color : withAlpha(mood.color, 0.35),
                    },
                  ]}
                />
              )) : <RectPlaceholder color={palette.cardMuted} />}
            </View>
            <Text style={styles.monthLabel}>{point.label.slice(0, 1)}</Text>
          </View>
        ))}
      </View>
    </SurfaceCard>
  );
}

function RectPlaceholder({ color }: { color: string }) {
  return <View style={{ flex: 1, backgroundColor: color }} />;
}

function Metric({
  icon,
  emotionId,
  value,
  label,
  compact = false,
}: {
  icon?: string;
  emotionId?: string;
  value: string;
  label: string;
  compact?: boolean;
}) {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <View style={styles.metric}>
      {emotionId ? (
        <Icon name={getEmotionConfig(emotionId as any).icon} size={compact ? 22 : 27} />
      ) : (
        <SemanticIcon name={`${icon ?? 'document'}-outline`} size={compact ? 22 : 27} color={palette.accentStrong} />
      )}
      <View style={styles.metricCopy}>
        <Text style={[styles.metricValue, compact && styles.metricValueLarge]} numberOfLines={1}>{value}</Text>
        <Text style={styles.metricLabel} numberOfLines={2}>{label}</Text>
      </View>
    </View>
  );
}

function ExpenseDrawer({
  period,
  snap,
  screenHeight,
  stats,
  periodLabel,
  onSnapChange,
  onDismiss,
  onOpenRecord,
}: {
  period: StatisticsPeriod;
  snap: DrawerSnap;
  screenHeight: number;
  stats: StatisticsSummary;
  periodLabel: string;
  onSnapChange: (snap: DrawerSnap) => void;
  onDismiss: () => void;
  onOpenRecord: (record: TripExpenseRecord) => void;
}) {
  const { mode } = useAppState();
  const { t } = useTranslation();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const snapPoints = useMemo(() => getStatisticsDrawerSnapPoints(screenHeight, period), [period, screenHeight]);
  const height = useRef(new Animated.Value(snapPoints[snap])).current;
  const dragStart = useRef(snapPoints[snap]);

  useEffect(() => {
    Animated.timing(height, {
      toValue: snapPoints[snap],
      duration: 210,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    dragStart.current = snapPoints[snap];
  }, [height, snap, snapPoints]);

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 5,
    onPanResponderGrant: () => {
      dragStart.current = snapPoints[snap];
    },
    onPanResponderMove: (_, gesture) => {
      const next = clamp(dragStart.current - gesture.dy, snapPoints.collapsed * 0.72, snapPoints.expanded);
      height.setValue(next);
    },
    onPanResponderRelease: (_, gesture) => {
      const next = clamp(dragStart.current - gesture.dy, snapPoints.collapsed, snapPoints.expanded);
      const midpoint = (snapPoints.collapsed + snapPoints.expanded) / 2;
      if (snap === 'collapsed' && gesture.dy > 42) {
        Animated.timing(height, {
          toValue: snapPoints.collapsed * 0.72,
          duration: 160,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: false,
        }).start(onDismiss);
        return;
      }
      if (snap === 'expanded' && gesture.dy > 24) {
        onSnapChange('collapsed');
        return;
      }
      onSnapChange(gesture.vy < -0.35 || next > midpoint ? 'expanded' : 'collapsed');
    },
  }), [height, onDismiss, onSnapChange, snap, snapPoints]);

  return (
    <Animated.View style={[styles.drawer, { height }]} {...panResponder.panHandlers}>
      <BlurView
        tint={mode === 'dark' ? 'dark' : 'extraLight'}
        intensity={Platform.OS === 'android' ? 60 : 88}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.drawerTint]} />
      <View style={styles.handle} />
      <View style={styles.drawerHeader}>
        <View>
          <Text style={styles.drawerTitle}>{t('stats.selectTrips')}</Text>
          <Text style={styles.meta}>{periodLabel} | {t('stats.tripsCount', { count: stats.expenseRecords.length })}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={t('stats.addExpense')} onPress={() => router.push('/expenses/new')} style={styles.addButton}>
          <SemanticIcon name="add" size={23} color={palette.text} />
        </Pressable>
      </View>
      <FlatList
        data={stats.expenseRecords}
        keyExtractor={(record) => record.id}
        contentContainerStyle={styles.drawerList}
        ListEmptyComponent={<Text style={styles.emptyText}>{t('stats.noExpenses')}</Text>}
        renderItem={({ item }) => (
          <Pressable accessibilityRole="button" onPress={() => onOpenRecord(item)} style={styles.expenseRow}>
            <View style={styles.expenseRowBody}>
              <Text style={styles.expenseRowTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.expenseRowMeta} numberOfLines={1}>{formatDateRange(item.startDate, item.endDate)} · {item.route}</Text>
              <Text style={styles.expenseRowMeta}>{t('stats.itemsCount', { count: item.itemCount })}</Text>
            </View>
            <Text style={styles.expenseAmount}>{item.currency}{item.totalAmount.toFixed(2)}</Text>
            <SemanticIcon name="chevron-forward" size={20} color={palette.text} />
          </Pressable>
        )}
      />
    </Animated.View>
  );
}

function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate) return '';
  if (startDate === endDate) return startDate;
  return `${startDate} - ${endDate}`;
}

function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

const stylesVars = {
  mutedOption: '#72747a',
};

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { paddingBottom: NAV_GAP },
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
  expenseCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg },
  expenseCopy: { flex: 1 },
  cardTitle: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: palette.text },
  meta: { fontSize: Typography.fontSize.xs, color: palette.secondaryText, marginTop: 3 },
  totalBlock: { alignItems: 'flex-end' },
  total: { fontSize: 28, fontWeight: '600', color: palette.text },
  rowCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthlyInfoCard: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: 26,
  },
  statIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthlyInfoCopy: { flex: 1, gap: 7 },
  monthlyInfoTitle: { color: palette.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.4 },
  monthlyInfoSubtitle: { color: palette.text, fontSize: 17, lineHeight: 23, fontWeight: '500' },
  metric: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  metricCopy: { flex: 1 },
  metricValue: { fontSize: Typography.fontSize.md, fontWeight: '700', color: palette.text },
  metricValueLarge: { fontSize: 28 },
  metricLabel: { color: palette.text, fontSize: Typography.fontSize.sm, marginTop: 3 },
  ring: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  ringValue: { position: 'absolute', fontSize: 13, fontWeight: '800', color: palette.text },
  moodCard: { gap: Spacing.md },
  moods: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  moodItem: { alignItems: 'center', gap: Spacing.xs, minWidth: 43 },
  moodItemDominant: { transform: [{ translateY: -4 }] },
  percent: { fontSize: 11, color: palette.text, borderRadius: 8, paddingHorizontal: 7, overflow: 'hidden' },
  flow: { height: 36, borderRadius: BorderRadius.xl, overflow: 'hidden', flexDirection: 'row' },
  flowUnit: { height: '100%' },
  emptyText: { color: palette.secondaryText, fontSize: Typography.fontSize.sm, lineHeight: 20 },
  chart: {
    minHeight: 260,
    gap: Spacing.sm,
    borderRadius: 30,
    shadowColor: palette.accentStrong,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 6,
  },
  chartGlow: { borderRadius: BorderRadius.xl, paddingVertical: Spacing.xs, backgroundColor: withAlpha(palette.accentStrong, 0.05) },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.md, marginTop: -6 },
  monthLabel: { fontSize: 10, color: palette.secondaryText, textAlign: 'center' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  metricTile: { width: '47.5%', minHeight: 105, justifyContent: 'center', padding: Spacing.md },
  moodLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, alignItems: 'center' },
  moodLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  moodLegendText: { color: palette.text, fontSize: 13, fontWeight: '700', maxWidth: 82 },
  moodFlowBars: { height: 184, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: Spacing.sm },
  moodFlowColumn: { alignItems: 'center', gap: 8, width: 20 },
  moodFlowTrack: { height: 146, width: 16, borderRadius: 10, overflow: 'hidden', backgroundColor: palette.cardMuted, flexDirection: 'column-reverse' },
  moodFlowSegment: { width: '100%' },
  drawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 8,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: NAV_GAP,
    ...Shadows.medium,
  },
  drawerTint: { backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.84)' : 'rgba(255,255,255,0.88)' },
  handle: { alignSelf: 'center', width: 56, height: 4, borderRadius: 3, backgroundColor: withAlpha(palette.text, 0.32), marginBottom: Spacing.md },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  drawerTitle: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  addButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: withAlpha(palette.accentStrong, 0.22), alignItems: 'center', justifyContent: 'center' },
  drawerList: { paddingBottom: Spacing.xl },
  expenseRow: { minHeight: 86, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: palette.divider },
  expenseRowBody: { flex: 1, gap: 2 },
  expenseRowTitle: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '700' },
  expenseRowMeta: { color: palette.secondaryText, fontSize: Typography.fontSize.xs },
  expenseAmount: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '700' },
});
