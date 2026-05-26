import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, SemanticIcon } from '@/components/Icon';
import { AppPalette, AppScreen, ContentContainer, SegmentedControl, SurfaceCard } from '@/components/layout/AppScreen';
import { ActionSheetModal } from '@/components/ui/OverlaySurface';
import { EMOTIONS, getEmotionConfig } from '@/constants/emotions';
import { mockTrips, plannedDays } from '@/data/mockApp';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Shadows, Spacing, Typography } from '@/theme/designSystem';
import type { TripMood } from '@/types/trip';
import {
  dateFromKey,
  dateHasCards,
  formatMonthTitle,
  formatSelectedRangeLabel,
  getAnchoredDrawerLayout,
  getAllowedMonthStarts,
  getCalendarMoodForDate,
  getCardsForDateRange,
  getDateSelectionPresentation,
  getMajorityEmotionForDate,
  getMoodEditorDate,
  getMonthCells,
  getSelectedRange,
  monthStart,
  toDateKey,
  toMonthKey,
  updateDateSelection,
  type DateKey,
  type MoodOverrides,
} from '../../features/calendar/visitedCalendarModel';

type TimelineMode = 'visited' | 'planned';

const DAILY_MOOD_STORAGE_KEY = 'journeycraft.calendar.daily-mood-overrides.v1';
const weekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const plannedDates = Array.from({ length: 35 }, (_, index) => index - 3);

export default function CalendarTab() {
  const params = useLocalSearchParams<{ mode?: TimelineMode }>();
  const [mode, setMode] = useState<TimelineMode>(params.mode === 'planned' ? 'planned' : 'visited');
  const { mode: themeMode } = useAppState();
  const palette = AppPalette[themeMode];
  const styles = createStyles(palette);

  return (
    <AppScreen>
      <ContentContainer style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.title}>JourneyCraft</Text>
          <Pressable style={styles.circle} onPress={() => router.replace('/(tabs)/home')}>
            <SemanticIcon name="list-outline" size={22} color={palette.text} />
          </Pressable>
        </View>
        <SegmentedControl
          value={mode}
          onChange={setMode}
          options={[{ value: 'visited', label: 'Visited' }, { value: 'planned', label: 'Planned' }]}
        />
        {mode === 'visited' ? (
          <VisitedCalendar palette={palette} />
        ) : (
          <PlannedCalendar palette={palette} />
        )}
      </ContentContainer>
    </AppScreen>
  );
}

function VisitedCalendar({ palette }: { palette: typeof AppPalette.light | typeof AppPalette.dark }) {
  const styles = createStyles(palette);
  const insets = useSafeAreaInsets();
  const [today] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const todayKey = toDateKey(today);
  const latestCardKey = useMemo(() => (
    mockTrips
      .map((trip) => toDateKey(trip.displayDate))
      .filter((key) => key <= todayKey)
      .sort()
      .at(-1) ?? todayKey
  ), [todayKey]);
  const allowedMonths = useMemo(() => getAllowedMonthStarts(mockTrips, today), [today]);
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart(dateFromKey(latestCardKey)));
  const [anchors, setAnchors] = useState<DateKey[]>([latestCardKey]);
  const [overrides, setOverrides] = useState<MoodOverrides>({});
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [calendarHeight, setCalendarHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const drawerHeight = useRef(new Animated.Value(0)).current;
  const currentDrawerHeight = useRef(0);
  const isDrawerExpanded = useRef(false);

  useEffect(() => {
    let active = true;
    void AsyncStorage.getItem(DAILY_MOOD_STORAGE_KEY).then((stored) => {
      if (!active || !stored) return;
      const parsed = JSON.parse(stored) as Record<string, TripMood>;
      const validOverrides = Object.fromEntries(
        Object.entries(parsed).filter(([, mood]) => EMOTIONS.some((emotion) => emotion.id === mood)),
      ) as MoodOverrides;
      setOverrides(validOverrides);
    }).catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const drawerLayout = getAnchoredDrawerLayout({
    containerHeight,
    calendarHeight,
    collapsedGap: Spacing.md,
    bottomCoverage: insets.bottom,
  });

  useEffect(() => {
    const targetHeight = isDrawerExpanded.current
      ? drawerLayout.expandedHeight
      : drawerLayout.collapsedHeight;
    currentDrawerHeight.current = targetHeight;
    drawerHeight.setValue(targetHeight);
  }, [drawerHeight, drawerLayout.collapsedHeight, drawerLayout.expandedHeight]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_event, gesture) => Math.abs(gesture.dy) > 4,
    onPanResponderGrant: () => {
      drawerHeight.stopAnimation((value) => {
        currentDrawerHeight.current = value;
      });
    },
    onPanResponderMove: (_event, gesture) => {
      const nextHeight = Math.max(
        drawerLayout.collapsedHeight,
        Math.min(drawerLayout.expandedHeight, currentDrawerHeight.current - gesture.dy),
      );
      drawerHeight.setValue(nextHeight);
    },
    onPanResponderRelease: (_event, gesture) => {
      const releasedHeight = Math.max(
        drawerLayout.collapsedHeight,
        Math.min(drawerLayout.expandedHeight, currentDrawerHeight.current - gesture.dy),
      );
      const middleHeight = (drawerLayout.collapsedHeight + drawerLayout.expandedHeight) / 2;
      const expanded = gesture.vy < -0.25 || (gesture.vy <= 0.25 && releasedHeight > middleHeight);
      const targetHeight = expanded ? drawerLayout.expandedHeight : drawerLayout.collapsedHeight;
      isDrawerExpanded.current = expanded;
      currentDrawerHeight.current = targetHeight;
      Animated.spring(drawerHeight, {
        toValue: targetHeight,
        useNativeDriver: false,
        damping: 22,
        stiffness: 210,
        mass: 0.8,
      }).start();
    },
  }), [drawerHeight, drawerLayout.collapsedHeight, drawerLayout.expandedHeight]);

  const cells = getMonthCells(visibleMonth, today);
  const range = getSelectedRange(anchors);
  const selectedCards = range ? getCardsForDateRange(mockTrips, range.start, range.end) : [];
  const selectedMoodDate = getMoodEditorDate(anchors);
  const selectedMood = selectedMoodDate
    ? getCalendarMoodForDate(mockTrips, overrides, selectedMoodDate)
    : undefined;
  const monthIndex = allowedMonths.findIndex((month) => toMonthKey(month) === toMonthKey(visibleMonth));
  const canVisitPreviousMonth = monthIndex > 0;
  const canVisitNextMonth = monthIndex >= 0 && monthIndex < allowedMonths.length - 1;

  const persistMoodOverride = (dateKey: DateKey, mood: TripMood) => {
    setOverrides((current) => {
      const updated = { ...current, [dateKey]: mood };
      void AsyncStorage.setItem(DAILY_MOOD_STORAGE_KEY, JSON.stringify(updated)).catch(() => undefined);
      return updated;
    });
  };

  const selectMood = (mood: TripMood) => {
    if (!selectedMoodDate) return;
    const cardMajority = getMajorityEmotionForDate(mockTrips, selectedMoodDate);
    if (cardMajority && cardMajority !== mood) {
      Alert.alert(
        'Change daily mood?',
        `Most cards for this day are ${getEmotionConfig(cardMajority).label}. Are you sure you want to change the displayed daily mood?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Change Mood', onPress: () => persistMoodOverride(selectedMoodDate, mood) },
        ],
      );
      return;
    }
    persistMoodOverride(selectedMoodDate, mood);
  };

  return (
    <View style={styles.visitedArea} onLayout={(event) => setContainerHeight(event.nativeEvent.layout.height)}>
      <View onLayout={(event) => setCalendarHeight(event.nativeEvent.layout.height)}>
        <SurfaceCard style={styles.calendar}>
          <View style={styles.month}>
            <Pressable
              accessibilityLabel="Previous month"
              disabled={!canVisitPreviousMonth}
              onPress={() => setVisibleMonth(allowedMonths[monthIndex - 1])}
              style={styles.monthButton}
            >
              <SemanticIcon
                name="chevron-back"
                size={23}
                color={canVisitPreviousMonth ? palette.text : palette.secondaryText}
              />
            </Pressable>
            <Pressable accessibilityLabel="Select month and year" onPress={() => setMonthPickerVisible(true)}>
              <Text style={styles.monthText}>{formatMonthTitle(visibleMonth)}</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Next month"
              disabled={!canVisitNextMonth}
              onPress={() => setVisibleMonth(allowedMonths[monthIndex + 1])}
              style={styles.monthButton}
            >
              <SemanticIcon
                name="chevron-forward"
                size={23}
                color={canVisitNextMonth ? palette.text : palette.secondaryText}
              />
            </Pressable>
          </View>
          <View style={styles.week}>
            {weekdays.map((day) => <Text key={day} style={styles.weekLabel}>{day}</Text>)}
          </View>
          <View style={styles.grid}>
            {cells.map((cell) => {
              if (!cell.inMonth) return <View key={cell.key} style={styles.day} />;
              const selectionPresentation = getDateSelectionPresentation(cell.key, anchors);
              const isRangeEndpoint = selectionPresentation === 'rangeStart' || selectionPresentation === 'rangeEnd';
              const emotion = cell.selectable ? getCalendarMoodForDate(mockTrips, overrides, cell.key) : undefined;
              const hasCards = cell.selectable && dateHasCards(mockTrips, cell.key);
              return (
                <Pressable
                  key={cell.key}
                  accessibilityLabel={`Select ${cell.date.toLocaleDateString('en-US')}`}
                  accessibilityState={{ selected: selectionPresentation !== 'none', disabled: !cell.selectable }}
                  disabled={!cell.selectable}
                  onPress={() => setAnchors((current) => updateDateSelection(current, cell.key))}
                  style={({ pressed }) => [
                    styles.day,
                    selectionPresentation === 'single' && styles.selectedDay,
                    isRangeEndpoint && styles.rangeEndpointDay,
                    selectionPresentation === 'rangeMiddle' && styles.rangeMiddleDay,
                    pressed && cell.selectable && styles.pressedDay,
                  ]}
                >
                  <Text style={[
                    styles.dayText,
                    !cell.selectable && styles.disabled,
                    isRangeEndpoint && styles.rangeEndpointText,
                  ]}>{cell.dayNumber}</Text>
                  <View style={styles.mood}>
                    {emotion ? <Icon name={getEmotionConfig(emotion).icon} size={18} /> : null}
                  </View>
                  <View style={[
                    styles.recordBar,
                    isRangeEndpoint && styles.rangeEndpointRecordBar,
                    !hasCards && styles.invisible,
                  ]} />
                </Pressable>
              );
            })}
          </View>
        </SurfaceCard>
      </View>
      <Animated.View
        style={[
          styles.drawer,
          {
            bottom: -insets.bottom,
            height: drawerHeight,
            paddingBottom: Spacing.lg + insets.bottom,
          },
        ]}
      >
        <View
          accessible
          accessibilityLabel="Drag calendar records drawer"
          style={styles.dragRegion}
          {...panResponder.panHandlers}
        >
          <View style={styles.dragHandle} />
        </View>
        <Text style={styles.range}>{formatSelectedRangeLabel(anchors)}</Text>
        {selectedMoodDate ? (
          <>
            <Text style={styles.moodPrompt}>
              {`Daily mood for ${dateFromKey(selectedMoodDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            </Text>
            <View style={styles.moodRow}>
              {EMOTIONS.map((emotion) => (
                <Pressable
                  key={emotion.id}
                  accessibilityLabel={`Set mood to ${emotion.label}`}
                  onPress={() => selectMood(emotion.id)}
                  style={[styles.moodButton, selectedMood === emotion.id && styles.moodButtonSelected]}
                >
                  <Icon name={emotion.icon} size={30} />
                </Pressable>
              ))}
            </View>
          </>
        ) : null}
        <ScrollView
          style={styles.drawerScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.drawerList}
        >
          {selectedCards.length === 0 ? (
            <Text style={styles.emptyText}>No cards recorded for this date.</Text>
          ) : selectedCards.map((trip) => (
            <SurfaceCard key={trip.id} style={styles.drawerCard}>
              <View style={styles.drawerCardHeader}>
                <Text numberOfLines={1} style={styles.drawerCardTitle}>{trip.title}</Text>
                {trip.mood ? <Icon name={getEmotionConfig(trip.mood).icon} size={22} /> : null}
              </View>
              <Text style={styles.drawerCardDate}>
                {new Date(trip.displayDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </SurfaceCard>
          ))}
        </ScrollView>
      </Animated.View>
      <ActionSheetModal visible={monthPickerVisible} onDismiss={() => setMonthPickerVisible(false)}>
        <Text style={styles.pickerTitle}>Choose month</Text>
        <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={false}>
          {[...allowedMonths].reverse().map((month) => {
            const active = toMonthKey(month) === toMonthKey(visibleMonth);
            return (
              <Pressable
                key={toMonthKey(month)}
                onPress={() => {
                  setVisibleMonth(month);
                  setMonthPickerVisible(false);
                }}
                style={[styles.pickerRow, active && styles.pickerRowActive]}
              >
                <Text style={[styles.pickerText, active && styles.pickerTextActive]}>{formatMonthTitle(month)}</Text>
                {active ? <SemanticIcon name="checkmark" size={18} color={palette.accentStrong} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </ActionSheetModal>
    </View>
  );
}

function PlannedCalendar({ palette }: { palette: typeof AppPalette.light | typeof AppPalette.dark }) {
  const styles = createStyles(palette);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.plannedContent}>
      <SurfaceCard style={styles.calendar}>
        <View style={styles.month}>
          <SemanticIcon name="chevron-back" size={23} color={palette.text} />
          <Text style={styles.monthText}>July 2025</Text>
          <SemanticIcon name="chevron-forward" size={23} color={palette.text} />
        </View>
        <View style={styles.week}>
          {weekdays.map((day) => <Text key={day} style={styles.weekLabel}>{day}</Text>)}
        </View>
        <View style={styles.grid}>
          {plannedDates.map((date, index) => {
            const current = date > 0 && date < 32;
            const selected = current && [3, 16, 17, 24, 27].includes(date);
            return (
              <View key={`${date}-${index}`} style={[styles.day, selected && styles.selectedDay]}>
                <Text style={[styles.dayText, !current && styles.disabled]}>
                  {current ? date : date <= 0 ? 27 + date : date - 31}
                </Text>
              </View>
            );
          })}
        </View>
      </SurfaceCard>
      <SurfaceCard style={styles.itinerary}>
        <Text style={styles.range}>Tuesday, 24 July - 27 July, 2025</Text>
        {plannedDays.map((day) => (
          <View key={day.id} style={styles.planRow}>
            <View style={styles.planText}>
              <Text style={styles.planTitle}>{day.label}</Text>
              <Text style={styles.location}>{day.location}</Text>
            </View>
            <Ionicons name={day.complete ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={palette.accentStrong} />
          </View>
        ))}
      </SurfaceCard>
    </ScrollView>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { flex: 1, paddingTop: Spacing.lg, paddingBottom: Spacing.xs, gap: Spacing.lg },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: Typography.fontSize.xxl, fontWeight: '700', color: palette.text },
  circle: { backgroundColor: palette.cardMuted, width: 34, height: 34, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  visitedArea: { flex: 1, position: 'relative' },
  calendar: { padding: Spacing.md, borderWidth: 2, borderColor: palette.divider },
  month: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs },
  monthButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  monthText: { fontSize: Typography.fontSize.md, fontWeight: '700', color: palette.text },
  week: { flexDirection: 'row', marginTop: Spacing.sm },
  weekLabel: { width: `${100 / 7}%`, textAlign: 'center', fontSize: 10, color: palette.secondaryText },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: Spacing.sm },
  day: { width: `${100 / 7}%`, height: 45, alignItems: 'center', justifyContent: 'flex-start', borderRadius: BorderRadius.md, paddingTop: 3 },
  selectedDay: { backgroundColor: palette.accent },
  rangeEndpointDay: { backgroundColor: palette.accentStrong },
  rangeMiddleDay: { backgroundColor: 'rgba(183, 213, 141, 0.34)' },
  rangeEndpointText: { color: '#ffffff' },
  pressedDay: { opacity: 0.72 },
  dayText: { fontSize: Typography.fontSize.xs, lineHeight: 15, color: palette.text, fontWeight: '600' },
  disabled: { color: palette.secondaryText, opacity: 0.45 },
  mood: { height: 19, alignItems: 'center', justifyContent: 'center' },
  recordBar: { width: 18, height: 3, marginTop: 2, borderRadius: 2, backgroundColor: palette.accentStrong },
  rangeEndpointRecordBar: { backgroundColor: palette.card },
  invisible: { opacity: 0 },
  drawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: palette.card,
    zIndex: 4,
    ...Shadows.large,
  },
  dragRegion: { height: 28, alignItems: 'center', justifyContent: 'center' },
  dragHandle: { width: 42, height: 5, borderRadius: 3, backgroundColor: palette.secondaryText, opacity: 0.55 },
  range: { fontSize: Typography.fontSize.sm, color: palette.text, fontWeight: '700', marginBottom: Spacing.xs },
  moodPrompt: { fontSize: Typography.fontSize.xs, color: palette.secondaryText },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
  moodButton: {
    width: 46,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  moodButtonSelected: { borderColor: palette.accentStrong, backgroundColor: palette.cardMuted },
  drawerScroll: { flex: 1 },
  drawerList: { gap: Spacing.sm, paddingTop: Spacing.xs, paddingBottom: 86 },
  drawerCard: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.xs },
  drawerCardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  drawerCardTitle: { flex: 1, fontSize: Typography.fontSize.md, fontWeight: '700', color: palette.text },
  drawerCardDate: { fontSize: Typography.fontSize.xs, color: palette.secondaryText },
  emptyText: { color: palette.secondaryText, fontSize: Typography.fontSize.sm, paddingVertical: Spacing.md },
  pickerTitle: { color: palette.text, fontWeight: '700', fontSize: Typography.fontSize.lg, marginBottom: Spacing.sm },
  pickerList: { maxHeight: 360 },
  pickerRow: { height: 46, paddingHorizontal: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: BorderRadius.lg },
  pickerRowActive: { backgroundColor: palette.cardMuted },
  pickerText: { color: palette.text, fontSize: Typography.fontSize.md },
  pickerTextActive: { color: palette.accentStrong, fontWeight: '700' },
  plannedContent: { gap: Spacing.lg, paddingBottom: 100 },
  itinerary: { gap: Spacing.md },
  planRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: palette.divider },
  planText: { flex: 1 },
  planTitle: { fontSize: Typography.fontSize.md, fontWeight: '700', color: palette.text },
  location: { fontSize: Typography.fontSize.xs, color: palette.secondaryText, marginTop: 3 },
});
