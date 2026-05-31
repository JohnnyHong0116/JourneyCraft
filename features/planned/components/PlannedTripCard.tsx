import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, SemanticIcon } from '@/components/Icon';
import { AppPalette } from '@/components/layout/AppScreen';
import { CardMenu } from '@/components/ui/CardMenu';
import { useTranslation } from '@/i18n/useTranslation';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Shadows, Spacing, Typography } from '@/theme/designSystem';
import type { PlannedTrip } from '@/types/plannedTrip';
import {
  getChecklistProgress,
  getChecklistProgressPercent,
  getDaysUntilDeparture,
  getNextItineraryEntry,
} from '../plannedModel';

type PlanUtility = 'checklist' | 'itinerary' | 'people';

interface PlannedTripCardProps {
  trip: PlannedTrip;
  onPinToggle?: (tripId: string) => void;
  onSaveToggle?: (tripId: string) => void;
  onLockToggle?: (tripId: string) => void;
  onDelete?: (tripId: string) => void;
}

export function PlannedTripCard({
  trip,
  onPinToggle,
  onSaveToggle,
  onLockToggle,
  onDelete,
}: PlannedTripCardProps) {
  const { mode } = useAppState();
  const { t, formatDate } = useTranslation();
  const palette = AppPalette[mode];
  const styles = createStyles(palette, mode);
  const menuAnchor = useRef<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeUtility, setActiveUtility] = useState<PlanUtility>();
  const progress = getChecklistProgress(trip);
  const completionPercent = getChecklistProgressPercent(trip);
  const nextEntry = getNextItineraryEntry(trip);
  const departureDays = getDaysUntilDeparture(trip.startDate, new Date());
  const dateRange = `${formatDate(trip.startDate, { month: 'short', day: 'numeric' })} - ${formatDate(trip.endDate, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  const openPlan = () => router.push(`/plan/${trip.id}` as any);

  const toggleUtility = (utility: PlanUtility) => {
    setActiveUtility((current) => current === utility ? undefined : utility);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open plan ${trip.title}`}
          onPress={openPlan}
          style={({ pressed }) => [styles.main, pressed && styles.pressed]}
        >
          <View style={styles.copy}>
            <View style={styles.titleRow}>
              {trip.isPinned ? <Icon name="pin" size={14} color={palette.accentStrong} /> : null}
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{trip.title}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="location-unselected" size={13} color={palette.secondaryText} />
              <Text style={styles.meta} numberOfLines={1}>{trip.route || trip.location}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="date-unselected" size={13} color={palette.secondaryText} />
              <Text style={styles.meta} numberOfLines={1}>{dateRange}</Text>
            </View>
            <View style={styles.row}>
              <SemanticIcon name="checkmark-circle-outline" size={14} color={palette.text} />
              <Text style={styles.checklistLabel}>{t('planned.checklistProgress', {
                completed: progress.completed,
                total: progress.total,
              })}</Text>
              <Text style={styles.progressPercent}>{completionPercent}%</Text>
            </View>
            <ProgressBar progress={progress} palette={palette} />
          </View>
          <View style={styles.departure}>
            <Text style={styles.departureLabel}>{t('planned.daysUntilDeparture')}</Text>
            <Text style={styles.departureValue}>
              {departureDays === 0 ? t('planned.departed') : t('planned.daysCount', { count: departureDays })}
            </Text>
          </View>
        </Pressable>

        {nextEntry ? (
          <Pressable accessibilityRole="button" accessibilityLabel={t('planned.openItinerary')} onPress={openPlan} style={styles.nextStop}>
            <View style={styles.nextStopIcon}>
              <SemanticIcon name="navigate-outline" size={15} color={palette.accentStrong} />
            </View>
            <View style={styles.nextStopCopy}>
              <Text style={styles.nextStopLabel}>{t('planned.nextStop')}</Text>
              <Text style={styles.nextStopTitle} numberOfLines={1}>{nextEntry.title}</Text>
            </View>
            <Text style={styles.nextStopTime}>{nextEntry.time ?? t('planned.dayNumber', { count: nextEntry.dayNumber })}</Text>
          </Pressable>
        ) : null}

        <View style={styles.utilityBar}>
          <UtilityButton
            label={t('planned.openChecklist')}
            icon="checkmark-circle-outline"
            active={activeUtility === 'checklist'}
            onPress={() => toggleUtility('checklist')}
            palette={palette}
          />
          <UtilityButton
            label={t('planned.openItinerary')}
            icon="calendar-outline"
            active={activeUtility === 'itinerary'}
            onPress={() => toggleUtility('itinerary')}
            palette={palette}
          />
          <UtilityButton
            label={t('planned.openPeople')}
            icon="people-outline"
            active={activeUtility === 'people'}
            onPress={() => toggleUtility('people')}
            palette={palette}
          />
          <UtilityButton
            label={trip.isSaved ? t('menu.unsave') : t('menu.save')}
            icon={trip.isSaved ? 'bookmark' : 'bookmark-outline'}
            active={trip.isSaved}
            onPress={() => onSaveToggle?.(trip.id)}
            palette={palette}
          />
          <Pressable
            ref={menuAnchor}
            accessibilityRole="button"
            accessibilityLabel={`${t('common.more')} ${trip.title}`}
            onPress={() => setMenuVisible(true)}
            hitSlop={8}
            style={styles.utilityButton}
          >
            <Icon name="threedotsSmaller" size={20} color={palette.text} />
          </Pressable>
        </View>

        {activeUtility ? (
          <UtilityPreview utility={activeUtility} trip={trip} onOpen={openPlan} palette={palette} />
        ) : null}
      </View>
      <CardMenu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={menuAnchor.current}
        onPin={() => onPinToggle?.(trip.id)}
        onSave={() => onSaveToggle?.(trip.id)}
        onLock={() => onLockToggle?.(trip.id)}
        onDelete={() => onDelete?.(trip.id)}
        isPinned={trip.isPinned}
        isSaved={trip.isSaved}
        isLocked={trip.isLocked}
      />
    </View>
  );
}

function UtilityButton({
  label,
  icon,
  active,
  onPress,
  palette,
}: {
  label: string;
  icon: React.ComponentProps<typeof SemanticIcon>['name'];
  active?: boolean;
  onPress: () => void;
  palette: typeof AppPalette.light | typeof AppPalette.dark;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.utilityButton}>
      <SemanticIcon name={icon} size={19} color={active ? palette.accentStrong : palette.secondaryText} />
    </Pressable>
  );
}

function UtilityPreview({
  utility,
  trip,
  onOpen,
  palette,
}: {
  utility: PlanUtility;
  trip: PlannedTrip;
  onOpen: () => void;
  palette: typeof AppPalette.light | typeof AppPalette.dark;
}) {
  const { t } = useTranslation();
  const previewItems = utility === 'checklist'
    ? trip.checklistItems.slice(0, 3).map((item) => ({
      id: item.id,
      icon: item.status === 'completed' ? 'checkmark-circle' : item.status === 'pending' ? 'time-outline' : 'ellipse-outline',
      label: item.label,
    }))
    : utility === 'itinerary'
      ? trip.itineraryEntries.slice(0, 2).map((entry) => ({
        id: entry.id,
        icon: 'navigate-outline',
        label: `${t('planned.dayNumber', { count: entry.dayNumber })} · ${entry.title}${entry.time ? ` · ${entry.time}` : ''}`,
      }))
    : (trip.companions ?? []).map((person) => ({
        id: person,
        icon: 'person-outline',
        label: person,
      }));
  const title = utility === 'checklist'
    ? t('planned.tripPreparationChecklist')
    : utility === 'itinerary'
      ? t('planned.itinerary')
      : t('planned.travelers');

  return (
    <View style={[previewStyles.preview, { backgroundColor: palette.cardMuted }]}>
      <View style={previewStyles.previewHeader}>
        <Text style={[previewStyles.previewTitle, { color: palette.text }]}>{title}</Text>
        <Pressable accessibilityRole="button" onPress={onOpen}>
          <Text style={[previewStyles.previewAction, { color: palette.accentStrong }]}>{t('planned.viewPlan')}</Text>
        </Pressable>
      </View>
      {previewItems.length ? previewItems.map((item) => (
        <View key={item.id} style={previewStyles.previewRow}>
          <SemanticIcon name={item.icon} size={16} color={palette.secondaryText} />
          <Text style={[previewStyles.previewText, { color: palette.text }]} numberOfLines={1}>{item.label}</Text>
        </View>
      )) : (
        <Text style={[previewStyles.previewEmpty, { color: palette.secondaryText }]}>{t('planned.nothingAdded')}</Text>
      )}
    </View>
  );
}

function ProgressBar({
  progress,
  palette,
}: {
  progress: ReturnType<typeof getChecklistProgress>;
  palette: typeof AppPalette.light | typeof AppPalette.dark;
}) {
  const empty = progress.total === 0;
  return (
    <View style={progressStyles.track}>
      {progress.completed > 0 ? <View style={[progressStyles.segment, { flex: progress.completed, backgroundColor: palette.accentStrong }]} /> : null}
      {progress.pending > 0 ? <View style={[progressStyles.segment, { flex: progress.pending, backgroundColor: '#efc72f' }]} /> : null}
      {progress.notStarted > 0 || empty ? <View style={[progressStyles.segment, { flex: empty ? 1 : progress.notStarted, backgroundColor: '#9b9b9b' }]} /> : null}
    </View>
  );
}

const progressStyles = StyleSheet.create({
  track: { flexDirection: 'row', height: 6, width: '100%', borderRadius: 4, overflow: 'hidden', marginTop: 2 },
  segment: { height: '100%' },
});

const styles = StyleSheet.create({
  utilityButton: { width: 42, height: 38, alignItems: 'center', justifyContent: 'center' },
});

const previewStyles = StyleSheet.create({
  preview: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.md },
  previewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  previewTitle: { fontSize: Typography.fontSize.xs, fontWeight: '700' },
  previewAction: { fontSize: Typography.fontSize.xs, fontWeight: '700' },
  previewRow: { minHeight: 25, flexDirection: 'row', alignItems: 'center', gap: 7 },
  previewText: { flex: 1, fontSize: Typography.fontSize.xs, fontWeight: '500' },
  previewEmpty: { fontSize: Typography.fontSize.xs, paddingVertical: Spacing.xs },
});

const createStyles = (
  palette: typeof AppPalette.light | typeof AppPalette.dark,
  mode: 'light' | 'dark',
) => StyleSheet.create({
  container: { width: '100%', marginBottom: Spacing.md },
  card: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.divider,
    marginHorizontal: Spacing.lg,
    ...(mode === 'light' ? Shadows.small : {}),
  },
  pressed: { opacity: 0.92 },
  main: { flexDirection: 'row', gap: Spacing.md, padding: Spacing.md, paddingBottom: Spacing.sm },
  copy: { flex: 1, minWidth: 0, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flexShrink: 1, color: palette.text, fontWeight: '700', fontSize: 19, lineHeight: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  meta: { color: palette.secondaryText, fontSize: Typography.fontSize.xs, fontWeight: '500', flexShrink: 1 },
  checklistLabel: { color: palette.text, fontSize: Typography.fontSize.xs, flexShrink: 1 },
  progressPercent: { marginLeft: 'auto', color: palette.secondaryText, fontSize: 11, fontWeight: '700' },
  departure: { width: 90, alignItems: 'center', justifyContent: 'center', gap: 3 },
  departureLabel: { color: palette.secondaryText, fontSize: 10, textAlign: 'center' },
  departureValue: { color: palette.text, fontSize: Typography.fontSize.xl, fontWeight: '700', textAlign: 'center' },
  nextStop: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.divider,
  },
  nextStopIcon: { width: 25, height: 25, borderRadius: 13, backgroundColor: palette.cardMuted, alignItems: 'center', justifyContent: 'center' },
  nextStopCopy: { flex: 1, minWidth: 0 },
  nextStopLabel: { color: palette.secondaryText, fontSize: 10, fontWeight: '600' },
  nextStopTitle: { color: palette.text, fontSize: Typography.fontSize.xs, fontWeight: '600' },
  nextStopTime: { color: palette.secondaryText, fontSize: Typography.fontSize.xs, fontWeight: '700' },
  utilityBar: {
    minHeight: 44,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.sm,
  },
  utilityButton: styles.utilityButton,
});
