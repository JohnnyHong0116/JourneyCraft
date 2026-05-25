import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Icon } from '@/components/Icon';
import { AppPalette } from '@/components/layout/AppScreen';
import { CardMenu } from '@/components/ui/CardMenu';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Shadows, Spacing, Typography } from '@/theme/designSystem';
import { Trip } from '@/types/trip';

interface TripCardProps {
  trip: Trip;
  showGroupLabel?: boolean;
  groupLabel?: string;
  onPinToggle?: (tripId: string) => void;
  onDelete?: (tripId: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  showGroupLabel = false,
  groupLabel,
  onPinToggle,
  onDelete,
}) => {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette, mode);
  const [cardMenuVisible, setCardMenuVisible] = useState(false);
  const moreButtonRef = useRef<any>(null);
  const [localIsSaved, setLocalIsSaved] = useState(trip.isSaved || false);
  const [localIsLocked, setLocalIsLocked] = useState(trip.isLocked || false);

  useEffect(() => {
    setLocalIsSaved(trip.isSaved || false);
    setLocalIsLocked(trip.isLocked || false);
  }, [trip.isSaved, trip.isLocked, trip.isPinned]);

  const hasCompanions = Boolean(trip.companions?.length);
  const showMood = Boolean(trip.mood);
  const displayDate = new Date(trip.displayDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      {showGroupLabel && groupLabel ? (
        <View style={styles.groupLabelContainer}>
          <Text style={styles.groupLabel}>{groupLabel}</Text>
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${trip.title}`}
        onPress={() => router.push(`/trip/${trip.id}` as any)}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.summary}>
          <View style={styles.copy}>
            <View style={styles.titleRow}>
              {trip.isPinned ? <Icon name="pin" size={14} color={palette.accentStrong} /> : null}
              <Text style={styles.title} numberOfLines={1}>{trip.title}</Text>
            </View>
            <View style={styles.metaRow}>
              <Icon name="date-unselected" size={14} color={palette.secondaryText} />
              <Text style={styles.meta}>{displayDate}</Text>
            </View>
            <View style={styles.metaRow}>
              <Icon name="location-unselected" size={14} color={palette.secondaryText} />
              <Text style={styles.meta} numberOfLines={1}>{trip.location}</Text>
            </View>
          </View>

          <View style={styles.cover}>
            {trip.photos.length > 0 ? (
              <Image source={{ uri: trip.photos[0] }} style={styles.coverImage} resizeMode="cover" />
            ) : (
              <View style={styles.coverPlaceholder}>
                <Icon name="cardimage" size={22} color={palette.secondaryText} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.signals}>
            {showMood && trip.mood ? (
              <View style={styles.mood}>
                <Icon name={trip.mood} size={23} color={palette.text} />
              </View>
            ) : null}
            {localIsSaved ? <Icon name="bookmarksmall-unselected" size={17} color={palette.secondaryText} /> : null}
            {localIsLocked ? <Icon name="cardlock" size={17} color={palette.secondaryText} /> : null}
            {hasCompanions ? <Icon name="cardpeople" size={17} color={palette.secondaryText} /> : null}
          </View>
          <View style={styles.actions}>
            {trip.photos.length > 0 ? <Icon name="cardimage" size={18} color={palette.text} /> : null}
            {trip.audioCount > 0 ? <Icon name="cardmic" size={18} color={palette.text} /> : null}
            {trip.videoCount > 0 ? <Icon name="cardvideo" size={18} color={palette.text} /> : null}
            <Pressable
              ref={moreButtonRef}
              accessibilityRole="button"
              accessibilityLabel={`More options for ${trip.title}`}
              hitSlop={8}
              onPress={(event) => {
                event.stopPropagation();
                setCardMenuVisible(true);
              }}
              style={styles.moreButton}
            >
              <Icon name="threedotsSmaller" size={20} color={palette.text} />
            </Pressable>
          </View>
        </View>
      </Pressable>

      <CardMenu
        visible={cardMenuVisible}
        onDismiss={() => setCardMenuVisible(false)}
        anchor={moreButtonRef.current}
        onPin={() => {
          onPinToggle?.(trip.id);
          console.log('Pin/Unpin trip:', trip.id);
        }}
        onSave={() => {
          setLocalIsSaved(!localIsSaved);
          console.log('Save/Unsave trip:', trip.id, !localIsSaved);
        }}
        onLock={() => {
          setLocalIsLocked(!localIsLocked);
          console.log('Lock/Unlock trip:', trip.id, !localIsLocked);
        }}
        onDelete={() => {
          onDelete?.(trip.id);
          console.log('Delete trip:', trip.id);
        }}
        isPinned={trip.isPinned}
        isSaved={localIsSaved}
        isLocked={localIsLocked}
      />
    </View>
  );
};

const createStyles = (
  palette: typeof AppPalette.light | typeof AppPalette.dark,
  mode: 'light' | 'dark',
) => StyleSheet.create({
  container: { width: '100%', marginBottom: Spacing.md },
  groupLabelContainer: { marginBottom: Spacing.sm, paddingHorizontal: Spacing.lg },
  groupLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: palette.text,
    textTransform: 'capitalize',
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: BorderRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.divider,
    marginHorizontal: Spacing.lg,
    overflow: 'hidden',
    ...(mode === 'light' ? Shadows.small : {}),
  },
  cardPressed: { opacity: 0.92 },
  summary: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  copy: { flex: 1, justifyContent: 'center', gap: 7, minHeight: 78 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: {
    flexShrink: 1,
    color: palette.text,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '700',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  meta: { flexShrink: 1, color: palette.secondaryText, fontSize: 13, fontWeight: '500' },
  cover: {
    width: 78,
    height: 78,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  coverImage: { width: '100%', height: '100%' },
  coverPlaceholder: {
    flex: 1,
    backgroundColor: palette.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    height: 48,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  signals: { minHeight: 32, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  mood: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: palette.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  moreButton: {
    width: 36,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -Spacing.sm,
  },
});
