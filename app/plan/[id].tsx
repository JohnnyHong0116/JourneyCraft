import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Icon, SemanticIcon } from '@/components/Icon';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { plannedTripCards } from '@/data/mockApp';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/translations';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Shadows, Spacing, Typography } from '@/theme/designSystem';
import type { ChecklistItem, ChecklistStatus, ItineraryEntry, ItineraryEntryType } from '@/types/plannedTrip';
import { TRIP_UTILITY_TOOLBAR_HEIGHT, TripUtilityToolbar } from '@features/trip/TripUtilityToolbar';
import { getPeopleIconName, removeCompanion } from '../../features/people/peopleModel';
import { loadCompanionOverrides, saveCompanions } from '../../features/people/peopleStorage';
import { SwipeToDeleteRow } from '../../features/people/SwipeToDeleteRow';
import {
  addPlannedCompanion,
  createPlannedItineraryEntry,
  getChecklistProgress,
  getChecklistProgressPercent,
  getDaysUntilDeparture,
  getPlannedTripById,
} from '../../features/planned/plannedModel';

type PlanSection = 'checklist' | 'itinerary' | 'people';

const itineraryIcons: Record<ItineraryEntryType, React.ComponentProps<typeof SemanticIcon>['name']> = {
  flight: 'airplane-outline',
  hotel: 'bed-outline',
  activity: 'walk-outline',
  restaurant: 'restaurant-outline',
  note: 'document-text-outline',
};

export default function PlannedTripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mode } = useAppState();
  const { t, formatDate } = useTranslation();
  const palette = AppPalette[mode];
  const styles = createStyles(palette, mode);
  const sourcePlan = getPlannedTripById(plannedTripCards, id);
  const [section, setSection] = useState<PlanSection>('checklist');
  const [items, setItems] = useState<ChecklistItem[]>(() => sourcePlan?.checklistItems ?? []);
  const [itineraryEntries, setItineraryEntries] = useState<ItineraryEntry[]>(() => sourcePlan?.itineraryEntries ?? []);
  const [companions, setCompanions] = useState<string[]>(() => sourcePlan?.companions ?? []);
  const [addingTask, setAddingTask] = useState(false);
  const [taskDraft, setTaskDraft] = useState('');
  const [addingStop, setAddingStop] = useState(false);
  const [stopTitle, setStopTitle] = useState('');
  const [stopDate, setStopDate] = useState(() => sourcePlan?.startDate ?? '');
  const [stopTime, setStopTime] = useState('');
  const [stopLocation, setStopLocation] = useState('');
  const [addingTraveler, setAddingTraveler] = useState(false);
  const [travelerDraft, setTravelerDraft] = useState('');
  const plan = useMemo(() => sourcePlan ? {
    ...sourcePlan,
    checklistItems: items,
    itineraryEntries,
    companions,
  } : undefined, [companions, itineraryEntries, items, sourcePlan]);

  useEffect(() => {
    if (!id) return;
    void loadCompanionOverrides().then((overrides) => {
      if (Object.prototype.hasOwnProperty.call(overrides, id)) setCompanions(overrides[id] ?? []);
    });
  }, [id]);

  if (!plan) {
    return (
      <AppScreen>
        <ContentContainer>
          <ScreenHeader title={t('common.planned')} />
          <SurfaceCard>
            <Text style={styles.missingTitle}>Plan unavailable</Text>
            <Text style={styles.missingCopy}>This planned trip could not be found.</Text>
          </SurfaceCard>
        </ContentContainer>
      </AppScreen>
    );
  }

  const progress = getChecklistProgress(plan);
  const completionPercent = getChecklistProgressPercent(plan);
  const departureDays = getDaysUntilDeparture(plan.startDate, new Date());
  const dateRange = `${formatDate(plan.startDate, { month: 'short', day: 'numeric' })} - ${formatDate(plan.endDate, { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const updateTask = (taskId: string) => {
    setItems((current) => current.map((item) => (
      item.id === taskId ? { ...item, status: nextTaskStatus(item.status) } : item
    )));
  };

  const addTask = () => {
    const label = taskDraft.trim();
    if (!label) return;
    setItems((current) => [...current, {
      id: `task-${Date.now()}`,
      label,
      status: 'notStarted',
      userEntered: true,
    }]);
    setTaskDraft('');
    setAddingTask(false);
  };

  const activateAddTask = () => {
    setSection('checklist');
    setAddingTask(true);
  };

  const addStop = () => {
    const entry = createPlannedItineraryEntry(plan, `stop-${Date.now()}`, {
      title: stopTitle,
      date: stopDate,
      time: stopTime,
      location: stopLocation,
    });
    if (!entry) return;
    setItineraryEntries((current) => [...current, entry].sort((left, right) => `${left.date}-${left.time ?? ''}`.localeCompare(`${right.date}-${right.time ?? ''}`)));
    setStopTitle('');
    setStopTime('');
    setStopLocation('');
    setAddingStop(false);
  };

  const addTraveler = () => {
    const nextCompanions = addPlannedCompanion(companions, travelerDraft);
    if (nextCompanions.length === companions.length) return;
    setCompanions(nextCompanions);
    void saveCompanions(plan.id, nextCompanions);
    setTravelerDraft('');
    setAddingTraveler(false);
  };

  const removeTraveler = (name: string) => {
    const nextCompanions = removeCompanion(companions, name);
    setCompanions(nextCompanions);
    void saveCompanions(plan.id, nextCompanions);
  };

  const activateAdd = () => {
    if (section === 'checklist') {
      activateAddTask();
    } else if (section === 'itinerary') {
      setAddingStop(true);
    } else {
      setAddingTraveler(true);
    }
  };

  return (
    <AppScreen
      scroll
      keyboardSafe
      bottomInset={Spacing.xxl}
      footerHeight={TRIP_UTILITY_TOOLBAR_HEIGHT}
      footer={(bottomInset) => (
        <TripUtilityToolbar
          bottomInset={bottomInset}
          actions={[
            { key: 'checklist', icon: 'check', accessibilityLabel: t('planned.openChecklist'), active: section === 'checklist', onPress: () => setSection('checklist') },
            { key: 'itinerary', icon: 'date-unselected', accessibilityLabel: t('planned.openItinerary'), active: section === 'itinerary', onPress: () => setSection('itinerary') },
            { key: 'people', icon: getPeopleIconName(plan.companions), accessibilityLabel: t('planned.openPeople'), active: section === 'people', onPress: () => setSection('people') },
            { key: 'add', icon: 'add', accessibilityLabel: section === 'itinerary' ? t('planned.addStop') : section === 'people' ? t('planned.addTraveler') : t('planned.addTask'), onPress: activateAdd },
          ]}
        />
      )}
    >
      <ContentContainer style={styles.content}>
        <ScreenHeader title={t('common.planned')} />

        <SurfaceCard style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.heroCopy}>
              <Text style={styles.title}>{plan.title}</Text>
              <View style={styles.metaRow}>
                <Icon name="location-unselected" size={15} color={palette.secondaryText} />
                <Text style={styles.metaText}>{plan.route || plan.location}</Text>
              </View>
              <View style={styles.metaRow}>
                <Icon name="date-unselected" size={15} color={palette.secondaryText} />
                <Text style={styles.metaText}>{dateRange}</Text>
              </View>
            </View>
            <View style={styles.countdown}>
              <Text style={styles.countdownLabel}>{t('planned.daysUntilDeparture')}</Text>
              <Text style={styles.countdownValue}>
                {departureDays === 0 ? t('planned.departed') : t('planned.daysCount', { count: departureDays })}
              </Text>
            </View>
          </View>
          <View style={styles.progressHeading}>
            <Text style={styles.progressTitle}>{t('planned.preparation')}</Text>
            <Text style={styles.progressPercent}>{completionPercent}%</Text>
          </View>
          <ProgressBar plan={plan} palette={palette} />
        </SurfaceCard>

        <View style={sharedStyles.sectionTabs}>
          <SectionTab label={t('planned.checklist')} active={section === 'checklist'} onPress={() => setSection('checklist')} palette={palette} />
          <SectionTab label={t('planned.itinerary')} active={section === 'itinerary'} onPress={() => setSection('itinerary')} palette={palette} />
          <SectionTab label={t('planned.travelers')} active={section === 'people'} onPress={() => setSection('people')} palette={palette} />
        </View>

        {section === 'checklist' ? (
          <SurfaceCard style={styles.panel}>
            <View style={styles.panelHeader}>
              <View>
                <Text style={styles.panelTitle}>{t('planned.tripPreparationChecklist')}</Text>
                <Text style={styles.panelSubtitle}>{t('planned.checklistProgress', { completed: progress.completed, total: progress.total })}</Text>
              </View>
              <Text style={styles.panelPercent}>{completionPercent}%</Text>
            </View>
            <View style={sharedStyles.taskList}>
              {items.map((item) => (
                <TaskRow key={item.id} item={item} onPress={() => updateTask(item.id)} palette={palette} t={t} />
              ))}
            </View>
            {addingTask ? (
              <View style={styles.taskComposer}>
                <TextInput
                  autoFocus
                  value={taskDraft}
                  onChangeText={setTaskDraft}
                  onSubmitEditing={addTask}
                  placeholder={t('planned.newTaskPlaceholder')}
                  placeholderTextColor={palette.secondaryText}
                  style={styles.taskInput}
                  returnKeyType="done"
                />
                <Pressable accessibilityRole="button" accessibilityLabel={t('planned.saveTask')} onPress={addTask} style={styles.addTaskIcon}>
                  <Icon name="add" size={22} color="#253021" />
                </Pressable>
              </View>
            ) : (
              <Pressable accessibilityRole="button" onPress={() => setAddingTask(true)} style={styles.addTask}>
                <Icon name="add" size={18} color={palette.accentStrong} />
                <Text style={styles.addTaskText}>{t('planned.addTask')}</Text>
              </Pressable>
            )}
          </SurfaceCard>
        ) : null}

        {section === 'itinerary' ? (
          <SurfaceCard style={styles.panel}>
            <Text style={styles.panelTitle}>{t('planned.itinerary')}</Text>
            {plan.itineraryEntries.length ? plan.itineraryEntries.map((entry) => (
              <View key={entry.id} style={styles.itineraryRow}>
                <View style={styles.itineraryIcon}>
                  <SemanticIcon name={itineraryIcons[entry.type]} size={19} color={palette.accentStrong} />
                </View>
                <View style={styles.itineraryCopy}>
                  <Text style={styles.itineraryDay}>{t('planned.dayNumber', { count: entry.dayNumber })}{entry.time ? ` · ${entry.time}` : ''}</Text>
                  <Text style={styles.itineraryTitle}>{entry.title}</Text>
                  {entry.location ? <Text style={styles.metaText}>{entry.location}</Text> : null}
                </View>
              </View>
            )) : <Text style={styles.emptyText}>{t('planned.noItinerary')}</Text>}
            {addingStop ? (
              <View style={styles.composer}>
                <TextInput autoFocus value={stopTitle} onChangeText={setStopTitle} placeholder={t('planned.newStopPlaceholder')} placeholderTextColor={palette.secondaryText} style={styles.composerInput} />
                <TextInput value={stopDate} onChangeText={setStopDate} placeholder={t('planned.stopDatePlaceholder')} placeholderTextColor={palette.secondaryText} style={styles.composerInput} />
                <View style={styles.composerRow}>
                  <TextInput value={stopTime} onChangeText={setStopTime} placeholder={t('planned.stopTimePlaceholder')} placeholderTextColor={palette.secondaryText} style={[styles.composerInput, styles.composerRowInput]} />
                  <TextInput value={stopLocation} onChangeText={setStopLocation} placeholder={t('planned.stopLocationPlaceholder')} placeholderTextColor={palette.secondaryText} style={[styles.composerInput, styles.composerRowInput]} />
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel={t('planned.saveStop')} onPress={addStop} style={styles.inlineAddButton}>
                  <Icon name="add" size={18} color="#253021" />
                  <Text style={styles.inlineAddButtonText}>{t('planned.addStop')}</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable accessibilityRole="button" onPress={() => setAddingStop(true)} style={styles.addTask}>
                <Icon name="add" size={18} color={palette.accentStrong} />
                <Text style={styles.addTaskText}>{t('planned.addStop')}</Text>
              </Pressable>
            )}
          </SurfaceCard>
        ) : null}

        {section === 'people' ? (
          <SurfaceCard style={styles.panel}>
            <Text style={styles.panelTitle}>{t('planned.travelers')}</Text>
            <Text style={styles.peopleHelper}>Swipe a traveler left to remove them.</Text>
            {(plan.companions ?? []).length ? (plan.companions ?? []).map((person) => (
              <SwipeToDeleteRow key={person} name={person} onDelete={() => removeTraveler(person)} palette={palette} />
            )) : <Text style={styles.emptyText}>{t('planned.nothingAdded')}</Text>}
            {addingTraveler ? (
              <View style={styles.taskComposer}>
                <TextInput
                  autoFocus
                  value={travelerDraft}
                  onChangeText={setTravelerDraft}
                  onSubmitEditing={addTraveler}
                  placeholder={t('planned.newTravelerPlaceholder')}
                  placeholderTextColor={palette.secondaryText}
                  style={styles.taskInput}
                  returnKeyType="done"
                />
                <Pressable accessibilityRole="button" accessibilityLabel={t('planned.saveTraveler')} onPress={addTraveler} style={styles.addTaskIcon}>
                  <Icon name="add" size={22} color="#253021" />
                </Pressable>
              </View>
            ) : (
              <Pressable accessibilityRole="button" onPress={() => setAddingTraveler(true)} style={styles.addTask}>
                <Icon name="add" size={18} color={palette.accentStrong} />
                <Text style={styles.addTaskText}>{t('planned.addTraveler')}</Text>
              </Pressable>
            )}
          </SurfaceCard>
        ) : null}
      </ContentContainer>
    </AppScreen>
  );
}

function TaskRow({
  item,
  onPress,
  palette,
  t,
}: {
  item: ChecklistItem;
  onPress: () => void;
  palette: typeof AppPalette.light | typeof AppPalette.dark;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}) {
  const state = taskState[item.status];
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: item.status === 'completed' }} onPress={onPress} style={sharedStyles.taskRow}>
      <View style={[sharedStyles.taskState, { backgroundColor: state.color }]}>
        <SemanticIcon name={state.icon} size={18} color="#ffffff" />
      </View>
      <Text style={[sharedStyles.taskLabel, { color: palette.text }]}>{item.label}</Text>
      <Text style={[sharedStyles.taskStatus, { color: state.color }]}>{t(state.label)}</Text>
    </Pressable>
  );
}

function SectionTab({
  label,
  active,
  onPress,
  palette,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  palette: typeof AppPalette.light | typeof AppPalette.dark;
}) {
  return (
    <Pressable onPress={onPress} style={[sharedStyles.sectionTab, { backgroundColor: active ? palette.accent : palette.card }]}>
      <Text style={[sharedStyles.sectionTabText, { color: active ? '#253021' : palette.text }]} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

function ProgressBar({
  plan,
  palette,
}: {
  plan: NonNullable<ReturnType<typeof getPlannedTripById>>;
  palette: typeof AppPalette.light | typeof AppPalette.dark;
}) {
  const progress = getChecklistProgress(plan);
  return (
    <View style={sharedStyles.progressTrack}>
      {progress.completed > 0 ? <View style={[sharedStyles.progressSegment, { flex: progress.completed, backgroundColor: palette.accentStrong }]} /> : null}
      {progress.pending > 0 ? <View style={[sharedStyles.progressSegment, { flex: progress.pending, backgroundColor: '#efc72f' }]} /> : null}
      {progress.notStarted > 0 ? <View style={[sharedStyles.progressSegment, { flex: progress.notStarted, backgroundColor: '#9b9b9b' }]} /> : null}
    </View>
  );
}

function nextTaskStatus(status: ChecklistStatus): ChecklistStatus {
  if (status === 'notStarted') return 'pending';
  if (status === 'pending') return 'completed';
  return 'notStarted';
}

const taskState: Record<ChecklistStatus, { icon: React.ComponentProps<typeof SemanticIcon>['name']; color: string; label: TranslationKey }> = {
  completed: { icon: 'checkmark', color: '#5faf70', label: 'planned.taskDone' },
  pending: { icon: 'time-outline', color: '#efb52f', label: 'planned.taskPending' },
  notStarted: { icon: 'close', color: '#a6a6ad', label: 'planned.taskNotStarted' },
};

const sharedStyles = StyleSheet.create({
  sectionTabs: { flexDirection: 'row', gap: Spacing.sm },
  sectionTab: { flex: 1, minWidth: 0, minHeight: 40, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xs },
  sectionTabText: { fontSize: 11, fontWeight: '700' },
  taskList: { gap: Spacing.sm },
  taskRow: { minHeight: 46, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(128,128,128,0.32)', borderRadius: BorderRadius.xl, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.sm },
  taskState: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  taskLabel: { flex: 1, minWidth: 0, fontSize: Typography.fontSize.sm, fontWeight: '600' },
  taskStatus: { fontSize: 10, fontWeight: '700' },
  progressTrack: { height: 7, flexDirection: 'row', borderRadius: 4, overflow: 'hidden', backgroundColor: '#9b9b9b' },
  progressSegment: { height: '100%' },
});

const createStyles = (
  palette: typeof AppPalette.light | typeof AppPalette.dark,
  mode: 'light' | 'dark',
) => StyleSheet.create({
  content: { gap: Spacing.lg },
  hero: { gap: Spacing.md, ...(mode === 'light' ? Shadows.small : {}) },
  heroTop: { flexDirection: 'row', gap: Spacing.sm },
  heroCopy: { flex: 1, minWidth: 0, gap: Spacing.xs },
  title: { color: palette.text, fontSize: Typography.fontSize.xl, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { flexShrink: 1, color: palette.secondaryText, fontSize: Typography.fontSize.xs, fontWeight: '500' },
  countdown: { width: 88, alignItems: 'center', justifyContent: 'center' },
  countdownLabel: { color: palette.secondaryText, fontSize: 10, textAlign: 'center' },
  countdownValue: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700', textAlign: 'center' },
  progressHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressTitle: { color: palette.text, fontSize: Typography.fontSize.xs, fontWeight: '700' },
  progressPercent: { color: palette.secondaryText, fontSize: Typography.fontSize.xs, fontWeight: '700' },
  panel: { gap: Spacing.md },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  panelTitle: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  panelSubtitle: { color: palette.secondaryText, fontSize: Typography.fontSize.xs, paddingTop: 3 },
  panelPercent: { color: palette.accentStrong, fontSize: Typography.fontSize.md, fontWeight: '700' },
  taskComposer: { minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  taskInput: { flex: 1, minHeight: 44, borderRadius: BorderRadius.xl, backgroundColor: palette.cardMuted, color: palette.text, paddingHorizontal: Spacing.md, fontSize: Typography.fontSize.sm },
  composer: { gap: Spacing.sm, paddingTop: Spacing.xs },
  composerRow: { flexDirection: 'row', gap: Spacing.sm },
  composerInput: { minHeight: 44, borderRadius: BorderRadius.xl, backgroundColor: palette.cardMuted, color: palette.text, paddingHorizontal: Spacing.md, fontSize: Typography.fontSize.sm },
  composerRowInput: { flex: 1, minWidth: 0 },
  inlineAddButton: { minHeight: 42, borderRadius: BorderRadius.xl, backgroundColor: palette.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs },
  inlineAddButtonText: { color: '#253021', fontSize: Typography.fontSize.sm, fontWeight: '700' },
  addTaskIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: palette.accent, alignItems: 'center', justifyContent: 'center' },
  addTask: { minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  addTaskText: { color: palette.accentStrong, fontSize: Typography.fontSize.sm, fontWeight: '700' },
  itineraryRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: Spacing.xs },
  itineraryIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: palette.cardMuted, alignItems: 'center', justifyContent: 'center' },
  itineraryCopy: { flex: 1, minWidth: 0, gap: 2 },
  itineraryDay: { color: palette.accentStrong, fontSize: Typography.fontSize.xs, fontWeight: '700' },
  itineraryTitle: { color: palette.text, fontSize: Typography.fontSize.sm, fontWeight: '700' },
  peopleHelper: { color: palette.secondaryText, fontSize: Typography.fontSize.xs },
  emptyText: { color: palette.secondaryText, fontSize: Typography.fontSize.sm },
  missingTitle: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  missingCopy: { color: palette.secondaryText, fontSize: Typography.fontSize.sm, paddingTop: Spacing.sm },
});
