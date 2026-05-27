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
import { getChecklistProgress, getDaysUntilDeparture } from '../plannedModel';

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
  const progress = getChecklistProgress(trip);
  const departureDays = getDaysUntilDeparture(trip.startDate, new Date());
  const dateRange = `${formatDate(trip.startDate, { month: 'short', day: 'numeric' })} - ${formatDate(trip.endDate, { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={trip.title}
        onPress={() => router.push(`/trip/${trip.id}` as any)}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <View style={styles.main}>
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
              <SemanticIcon name="checkmark-circle-outline" size={14} color={palette.text} />
              <Text style={styles.checklistLabel}>{t('planned.checklistProgress', {
                completed: progress.completed,
                total: progress.total,
              })}</Text>
            </View>
            <ProgressBar progress={progress} palette={palette} />
          </View>
          <View style={styles.departure}>
            <Text style={styles.departureLabel}>{t('planned.daysUntilDeparture')}</Text>
            <Text style={styles.departureValue}>
              {departureDays === 0 ? t('planned.departed') : t('planned.daysCount', { count: departureDays })}
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.signals}>
            <View style={styles.row}>
              <Icon name="date-unselected" size={13} color={palette.secondaryText} />
              <Text style={styles.meta}>{dateRange}</Text>
            </View>
            {trip.isSaved ? <Icon name="bookmarksmall-unselected" size={17} color={palette.secondaryText} /> : null}
            {trip.isLocked ? <Icon name="cardlock" size={17} color={palette.secondaryText} /> : null}
          </View>
          <Pressable
            ref={menuAnchor}
            accessibilityRole="button"
            accessibilityLabel={`${t('common.more')} ${trip.title}`}
            onPress={(event) => {
              event.stopPropagation();
              setMenuVisible(true);
            }}
            hitSlop={8}
            style={styles.menuButton}
          >
            <Icon name="threedotsSmaller" size={20} color={palette.text} />
          </Pressable>
        </View>
      </Pressable>
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
  track: { flexDirection: 'row', height: 7, width: '100%', borderRadius: 4, overflow: 'hidden', marginTop: 2 },
  segment: { height: '100%' },
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
  pressed: { opacity: 0.93 },
  main: { flexDirection: 'row', gap: Spacing.md, padding: Spacing.md, paddingBottom: Spacing.sm },
  copy: { flex: 1, minWidth: 0, gap: 5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flexShrink: 1, color: palette.text, fontWeight: '700', fontSize: 19, lineHeight: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  meta: { color: palette.secondaryText, fontSize: Typography.fontSize.xs, fontWeight: '500', flexShrink: 1 },
  checklistLabel: { color: palette.text, fontSize: Typography.fontSize.xs, flexShrink: 1 },
  departure: { minWidth: 100, alignItems: 'center', justifyContent: 'center', gap: 3 },
  departureLabel: { color: palette.secondaryText, fontSize: 10, textAlign: 'center' },
  departureValue: { color: palette.text, fontSize: Typography.fontSize.xl, fontWeight: '700', textAlign: 'center' },
  footer: {
    height: 48,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  signals: { flex: 1, minHeight: 32, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  menuButton: { width: 36, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: -Spacing.sm },
});
