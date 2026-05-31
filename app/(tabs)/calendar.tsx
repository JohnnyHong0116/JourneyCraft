import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
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
import { mockTrips, plannedTripCards } from '@/data/mockApp';
import { getDateLocale } from '@/i18n/translations';
import { useTranslation } from '@/i18n/useTranslation';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Shadows, Spacing, Typography } from '@/theme/designSystem';
import type { TripMood } from '@/types/trip';
import type { PlannedTrip } from '@/types/plannedTrip';
import {
  PLANNED_DRAWER_STACK_OVERLAP,
  getChecklistProgress,
  getPlannedCalendarRange,
  getPlannedDateMarker,
  getPlannedDrawerStackLayer,
  getPlannedMonthCells,
  getPlannedTripsForDateRange,
} from '../../features/planned/plannedModel';
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

function getWeekdays(language: 'en' | 'zh'): string[] {
  if (language === 'en') return weekdays;
  return ['日', '一', '二', '三', '四', '五', '六'];
}

export default function CalendarTab() {
  const params = useLocalSearchParams<{ mode?: TimelineMode }>();
  const [mode, setMode] = useState<TimelineMode>(params.mode === 'planned' ? 'planned' : 'visited');
  const { mode: themeMode } = useAppState();
  const palette = AppPalette[themeMode];
  const styles = createStyles(palette);
  const { t } = useTranslation();

  return (
    <AppScreen>
      <ContentContainer style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.title}>JourneyCraft</Text>
          <Pressable style={styles.circle} onPress={() => router.back()}>
            <SemanticIcon name="list-outline" size={22} color={palette.text} />
          </Pressable>
        </View>
        <SegmentedControl
          value={mode}
          onChange={setMode}
          options={[{ value: 'visited', label: t('common.visited') }, { value: 'planned', label: t('common.planned') }]}
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
  const { language, t, formatDate } = useTranslation();
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
        t('calendar.changeMoodTitle'),
        t('calendar.changeMoodBody', { emotion: getEmotionConfig(cardMajority).label }),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('calendar.changeMoodAction'), onPress: () => persistMoodOverride(selectedMoodDate, mood) },
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
              <Text style={styles.monthText}>{formatDate(visibleMonth, { month: 'long', year: 'numeric' })}</Text>
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
            {getWeekdays(language).map((day) => <Text key={day} style={styles.weekLabel}>{day}</Text>)}
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
        <Text style={styles.range}>{formatSelectedRangeLabel(anchors, language)}</Text>
        {selectedMoodDate ? (
          <>
            <Text style={styles.moodPrompt}>
              {t('calendar.dailyMoodFor', { date: formatDate(dateFromKey(selectedMoodDate), { month: 'short', day: 'numeric' }) })}
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
            <Text style={styles.emptyText}>{t('calendar.noCardsForDate')}</Text>
          ) : selectedCards.map((trip) => (
            <SurfaceCard key={trip.id} style={styles.drawerCard}>
              <View style={styles.drawerCardHeader}>
                <Text numberOfLines={1} style={styles.drawerCardTitle}>{trip.title}</Text>
                {trip.mood ? <Icon name={getEmotionConfig(trip.mood).icon} size={22} /> : null}
              </View>
              <Text style={styles.drawerCardDate}>
                {formatDate(trip.displayDate, {
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
        <Text style={styles.pickerTitle}>{t('common.chooseMonth')}</Text>
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
                <Text style={[styles.pickerText, active && styles.pickerTextActive]}>{formatDate(month, { month: 'long', year: 'numeric' })}</Text>
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
  const insets = useSafeAreaInsets();
  const { language, t, formatDate } = useTranslation();
  const allowedMonths = useMemo(() => getPlannedCalendarRange(plannedTripCards, new Date()), []);
  const initialDate = plannedTripCards[0]?.startDate.slice(0, 10) ?? toDateKey(new Date());
  const [anchors, setAnchors] = useState<DateKey[]>([initialDate]);
  const [visibleMonth, setVisibleMonth] = useState(allowedMonths[0] ?? monthStart(new Date()));
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [calendarHeight, setCalendarHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const drawerHeight = useRef(new Animated.Value(0)).current;
  const dragStartHeight = useRef(0);
  const drawerLayout = getAnchoredDrawerLayout({
    containerHeight,
    calendarHeight,
    collapsedGap: Spacing.md,
    bottomCoverage: insets.bottom,
  });
  const expandedDrawerHeight = Math.max(
    drawerLayout.collapsedHeight,
    drawerLayout.expandedHeight - 92 - Spacing.md,
  );
  const monthIndex = allowedMonths.findIndex((month) => toMonthKey(month) === toMonthKey(visibleMonth));
  const selectedRange = getSelectedRange(anchors);
  const latestSelectedDate = anchors.at(-1) ?? initialDate;
  const selectedPlans = selectedRange
    ? getPlannedTripsForDateRange(plannedTripCards, selectedRange.start, selectedRange.end)
    : [];
  const cells = getPlannedMonthCells(visibleMonth);

  useEffect(() => {
    const nextHeight = expanded ? expandedDrawerHeight : drawerLayout.collapsedHeight;
    drawerHeight.setValue(nextHeight);
    dragStartHeight.current = nextHeight;
  }, [drawerHeight, drawerLayout.collapsedHeight, expandedDrawerHeight, expanded]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_event, gesture) => Math.abs(gesture.dy) > 4,
    onPanResponderGrant: () => {
      drawerHeight.stopAnimation((height) => {
        dragStartHeight.current = height;
      });
    },
    onPanResponderMove: (_event, gesture) => {
      drawerHeight.setValue(Math.max(
        drawerLayout.collapsedHeight,
        Math.min(expandedDrawerHeight, dragStartHeight.current - gesture.dy),
      ));
    },
    onPanResponderRelease: (_event, gesture) => {
      const height = Math.max(
        drawerLayout.collapsedHeight,
        Math.min(expandedDrawerHeight, dragStartHeight.current - gesture.dy),
      );
      const shouldExpand = gesture.vy < -0.2
        || (gesture.vy <= 0.2 && height > (drawerLayout.collapsedHeight + expandedDrawerHeight) / 2);
      setExpanded(shouldExpand);
      Animated.spring(drawerHeight, {
        toValue: shouldExpand ? expandedDrawerHeight : drawerLayout.collapsedHeight,
        useNativeDriver: false,
        damping: 22,
        stiffness: 210,
        mass: 0.8,
      }).start();
    },
  }), [drawerHeight, drawerLayout.collapsedHeight, expandedDrawerHeight]);

  const compactDates = Array.from({ length: 7 }, (_, offset) => {
    const center = dateFromKey(latestSelectedDate);
    return new Date(center.getFullYear(), center.getMonth(), center.getDate() + offset - 3);
  });

  return (
    <View style={styles.visitedArea} onLayout={(event) => setContainerHeight(event.nativeEvent.layout.height)}>
      <View onLayout={(event) => setCalendarHeight(event.nativeEvent.layout.height)}>
        {expanded ? (
          <SurfaceCard style={styles.compactCalendar}>
            <Text style={styles.compactMonth}>{formatDate(dateFromKey(latestSelectedDate), { month: 'long', year: 'numeric' })}</Text>
            <View style={styles.compactWeek}>
              {compactDates.map((date) => {
                const key = toDateKey(date);
                const selectionPresentation = getDateSelectionPresentation(key, anchors);
                const isRangeEndpoint = selectionPresentation === 'rangeStart' || selectionPresentation === 'rangeEnd';
                const marker = getPlannedDateMarker(plannedTripCards, key);
                return (
                  <Pressable
                    key={key}
                    onPress={() => setAnchors((current) => updateDateSelection(current, key))}
                    style={[
                      styles.compactDay,
                      selectionPresentation === 'single' && styles.selectedDay,
                      isRangeEndpoint && styles.rangeEndpointDay,
                      selectionPresentation === 'rangeMiddle' && styles.rangeMiddleDay,
                    ]}
                  >
                    <Text style={styles.compactWeekLabel}>{date.toLocaleDateString(getDateLocale(language), { weekday: 'short' })}</Text>
                    <Text style={[styles.dayText, isRangeEndpoint && styles.rangeEndpointText]}>{date.getDate()}</Text>
                    <PlannedMarker marker={marker} styles={styles} />
                  </Pressable>
                );
              })}
            </View>
          </SurfaceCard>
        ) : (
          <SurfaceCard style={styles.calendar}>
            <View style={styles.month}>
              <Pressable
                accessibilityLabel={t('calendar.previousMonth')}
                disabled={monthIndex <= 0}
                onPress={() => setVisibleMonth(allowedMonths[monthIndex - 1]!)}
                style={styles.monthButton}
              >
                <SemanticIcon name="chevron-back" size={23} color={monthIndex > 0 ? palette.text : palette.secondaryText} />
              </Pressable>
              <Pressable accessibilityLabel={t('calendar.selectMonth')} onPress={() => setMonthPickerVisible(true)}>
                <Text style={styles.monthText}>{formatDate(visibleMonth, { month: 'long', year: 'numeric' })}</Text>
              </Pressable>
              <Pressable
                accessibilityLabel={t('calendar.nextMonth')}
                disabled={monthIndex < 0 || monthIndex >= allowedMonths.length - 1}
                onPress={() => setVisibleMonth(allowedMonths[monthIndex + 1]!)}
                style={styles.monthButton}
              >
                <SemanticIcon name="chevron-forward" size={23} color={monthIndex >= 0 && monthIndex < allowedMonths.length - 1 ? palette.text : palette.secondaryText} />
              </Pressable>
            </View>
            <View style={styles.week}>
              {getWeekdays(language).map((day) => <Text key={day} style={styles.weekLabel}>{day}</Text>)}
            </View>
            <View style={styles.grid}>
              {cells.map((cell) => {
                if (!cell.inMonth) return <View key={cell.key} style={styles.day} />;
                const marker = getPlannedDateMarker(plannedTripCards, cell.key);
                const selectionPresentation = getDateSelectionPresentation(cell.key, anchors);
                const isRangeEndpoint = selectionPresentation === 'rangeStart' || selectionPresentation === 'rangeEnd';
                return (
                  <Pressable
                    key={cell.key}
                    accessibilityLabel={formatDate(cell.date, { month: 'long', day: 'numeric', year: 'numeric' })}
                    accessibilityState={{ selected: selectionPresentation !== 'none' }}
                    onPress={() => setAnchors((current) => updateDateSelection(current, cell.key))}
                    style={[
                      styles.day,
                      selectionPresentation === 'single' && styles.selectedDay,
                      isRangeEndpoint && styles.rangeEndpointDay,
                      selectionPresentation === 'rangeMiddle' && styles.rangeMiddleDay,
                    ]}
                  >
                    <Text style={[styles.dayText, isRangeEndpoint && styles.rangeEndpointText]}>{cell.dayNumber}</Text>
                    <PlannedMarker marker={marker} styles={styles} />
                  </Pressable>
                );
              })}
            </View>
          </SurfaceCard>
        )}
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
        <LinearGradient
          pointerEvents="none"
          colors={palette.card === AppPalette.light.card
            ? ['#FFFFFF', '#FFFFFF', '#EEF6E9']
            : [palette.card, palette.card, '#22342D']}
          locations={[0, 0.58, 1]}
          style={styles.plannedDrawerGradient}
        />
        <View accessibilityLabel={t('calendar.dragPlannedDrawer')} style={styles.dragRegion} {...panResponder.panHandlers}>
          <View style={styles.dragHandle} />
        </View>
        <Text style={styles.range}>{formatSelectedRangeLabel(anchors, language)}</Text>
        <ScrollView style={styles.drawerScroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.plannedDrawerList}>
          {selectedPlans.length === 0 ? (
            <Text style={styles.emptyText}>{t('planned.noPlansForDate')}</Text>
          ) : selectedPlans.map((trip, index) => {
            const layer = getPlannedDrawerStackLayer(index);
            return (
              <View
                key={trip.id}
                style={[
                  styles.planStackItem,
                  layer.overlapsPrevious && styles.planStackFollowing,
                  { zIndex: layer.zIndex },
                ]}
              >
                <PlannedDrawerTrip
                  trip={trip}
                  selectedRange={selectedRange!}
                  palette={palette}
                  isOverlayCard={layer.isOverlayCard}
                />
              </View>
            );
          })}
        </ScrollView>
      </Animated.View>
      <ActionSheetModal visible={monthPickerVisible} onDismiss={() => setMonthPickerVisible(false)}>
        <Text style={styles.pickerTitle}>{t('common.chooseMonth')}</Text>
        <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={false}>
          {allowedMonths.map((month) => {
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
                <Text style={[styles.pickerText, active && styles.pickerTextActive]}>{formatDate(month, { month: 'long', year: 'numeric' })}</Text>
                {active ? <SemanticIcon name="checkmark" size={18} color={palette.accentStrong} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </ActionSheetModal>
    </View>
  );
}

function PlannedMarker({
  marker,
  styles,
}: {
  marker: ReturnType<typeof getPlannedDateMarker>;
  styles: ReturnType<typeof createStyles>;
}) {
  if (marker === 'none') return <View style={styles.plannedMarkerSpace} />;
  return <View style={[styles.plannedMarker, marker === 'endpoint' ? styles.plannedEndpointMarker : styles.plannedMiddleMarker]} />;
}

function PlannedDrawerTrip({
  trip,
  selectedRange,
  palette,
  isOverlayCard,
}: {
  trip: PlannedTrip;
  selectedRange: { start: DateKey; end: DateKey };
  palette: typeof AppPalette.light | typeof AppPalette.dark;
  isOverlayCard: boolean;
}) {
  const styles = createStyles(palette);
  const { t, formatDate } = useTranslation();
  const progress = getChecklistProgress(trip);
  const matchingEntries = trip.itineraryEntries.filter((entry) => (
    entry.date.slice(0, 10) >= selectedRange.start && entry.date.slice(0, 10) <= selectedRange.end
  ));
  const isLightPalette = palette.card === AppPalette.light.card;
  return (
    <View style={[
      styles.planSummary,
      isOverlayCard ? styles.planSummaryOverlay : styles.planSummaryBase,
    ]}>
      <LinearGradient
        colors={isLightPalette
          ? (isOverlayCard ? ['#FFFFFF', '#FFFFFF', '#F1F8EC'] : ['#FFFFFF', '#FFFFFF', '#F7FBF4'])
          : (isOverlayCard ? [palette.card, palette.card, '#293A32'] : [palette.card, palette.card, '#26352E'])}
        locations={[0, 0.66, 1]}
        style={styles.planSummaryGradient}
      >
        <Text style={styles.planTitle} numberOfLines={1}>{trip.title}</Text>
        <Text style={styles.location} numberOfLines={1}>{trip.route}</Text>
        <Text style={styles.planDateRange}>
          {formatDate(trip.startDate, { month: 'short', day: 'numeric' })} - {formatDate(trip.endDate, { month: 'short', day: 'numeric', year: 'numeric' })}
        </Text>
        <View style={styles.planChecklistRow}>
          <SemanticIcon name="checkmark-circle-outline" size={15} color={palette.text} />
          <Text style={styles.planChecklistText}>{t('planned.checklistProgress', { completed: progress.completed, total: progress.total })}</Text>
          <View style={styles.planProgress}>
            {progress.completed > 0 ? <View style={[styles.planProgressPiece, { flex: progress.completed, backgroundColor: palette.accentStrong }]} /> : null}
            {progress.pending > 0 ? <View style={[styles.planProgressPiece, { flex: progress.pending, backgroundColor: '#efc72f' }]} /> : null}
            {progress.notStarted > 0 ? <View style={[styles.planProgressPiece, { flex: progress.notStarted, backgroundColor: '#9b9b9b' }]} /> : null}
          </View>
        </View>
        {matchingEntries.map((entry) => (
          <View key={entry.id} style={styles.planRow}>
            <View style={styles.planText}>
              <Text style={styles.planTitle}>{t('planned.dayNumber', { count: entry.dayNumber })}  {entry.title}</Text>
              {entry.location ? <Text style={styles.location}>{entry.time ? `${entry.time}  ` : ''}{entry.location}</Text> : null}
            </View>
          </View>
        ))}
      </LinearGradient>
    </View>
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
  plannedMarkerSpace: { height: 8, marginTop: 5 },
  plannedMarker: { width: 18, height: 5, borderRadius: 3, marginTop: 5 },
  plannedEndpointMarker: { backgroundColor: palette.accentStrong },
  plannedMiddleMarker: { backgroundColor: '#a6a6a6' },
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
  plannedDrawerGradient: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
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
  plannedDrawerList: { paddingTop: Spacing.xs, paddingBottom: 86, overflow: 'visible' },
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
  compactCalendar: { paddingHorizontal: Spacing.xs, paddingVertical: Spacing.sm, borderWidth: 1, borderColor: palette.divider },
  compactMonth: { paddingHorizontal: Spacing.sm, paddingBottom: Spacing.sm, fontSize: Typography.fontSize.md, fontWeight: '700', color: palette.text },
  compactWeek: { flexDirection: 'row', gap: 3 },
  compactDay: { flex: 1, minHeight: 54, alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.md, gap: 2 },
  compactWeekLabel: { color: palette.secondaryText, fontSize: 10 },
  itinerary: { gap: Spacing.md },
  planStackItem: { width: '100%', position: 'relative' },
  planStackFollowing: { marginTop: -PLANNED_DRAWER_STACK_OVERLAP },
  planSummary: {
    borderRadius: BorderRadius.xxl,
    backgroundColor: palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.divider,
  },
  planSummaryGradient: {
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  planSummaryBase: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.11,
    shadowRadius: 9,
    elevation: 3,
  },
  planSummaryOverlay: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.17,
    shadowRadius: 12,
    elevation: 7,
  },
  planDateRange: { fontSize: Typography.fontSize.xs, color: palette.secondaryText },
  planChecklistRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingBottom: Spacing.xs },
  planChecklistText: { color: palette.text, fontSize: Typography.fontSize.xs },
  planProgress: { flex: 1, flexDirection: 'row', height: 7, borderRadius: 4, overflow: 'hidden', marginLeft: Spacing.sm },
  planProgressPiece: { height: '100%' },
  planRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: palette.divider },
  planText: { flex: 1 },
  planTitle: { fontSize: Typography.fontSize.md, fontWeight: '700', color: palette.text },
  location: { fontSize: Typography.fontSize.xs, color: palette.secondaryText, marginTop: 3 },
});
