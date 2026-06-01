import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, SemanticIcon } from '@/components/Icon';
import { AppPalette } from '@/components/layout/AppScreen';
import { CardMenu } from '@/components/ui/CardMenu';
import { EMOTIONS, getEmotionConfig } from '@/constants/emotions';
import { useTranslation } from '@/i18n/useTranslation';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Shadows, Spacing, Typography } from '@/theme/designSystem';
import type { Trip, TripMood } from '@/types/trip';
import { getPeopleIconName } from '../../people/peopleModel';
import { getTripCoverUri } from './tripCardModel';

type VisitedUtility = 'mood' | 'media' | 'people';

interface TripCardProps {
  trip: Trip;
  showGroupLabel?: boolean;
  groupLabel?: string;
  onPinToggle?: (tripId: string) => void;
  onSaveToggle?: (tripId: string) => void;
  onLockToggle?: (tripId: string) => void;
  onMoodChange?: (tripId: string, mood: TripMood) => void;
  onDelete?: (tripId: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  showGroupLabel = false,
  groupLabel,
  onPinToggle,
  onSaveToggle,
  onLockToggle,
  onMoodChange,
  onDelete,
}) => {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const { formatDate, t } = useTranslation();
  const styles = createStyles(palette, mode);
  const [cardMenuVisible, setCardMenuVisible] = useState(false);
  const [activeUtility, setActiveUtility] = useState<VisitedUtility>();
  const moreButtonRef = useRef<any>(null);
  const [localIsSaved, setLocalIsSaved] = useState(trip.isSaved || false);
  const [localIsLocked, setLocalIsLocked] = useState(trip.isLocked || false);
  const [localMood, setLocalMood] = useState(trip.mood);

  useEffect(() => {
    setLocalIsSaved(trip.isSaved || false);
    setLocalIsLocked(trip.isLocked || false);
    setLocalMood(trip.mood);
  }, [trip.isSaved, trip.isLocked, trip.mood]);

  const coverUri = getTripCoverUri(trip.photos);
  const displayDate = formatDate(trip.displayDate, { month: 'short', day: 'numeric', year: 'numeric' });
  const mood = localMood ? getEmotionConfig(localMood) : undefined;
  const openTrip = () => router.push(`/trip/${trip.id}` as any);
  const toggleUtility = (utility: VisitedUtility) => {
    setActiveUtility((current) => current === utility ? undefined : utility);
  };

  return (
    <View style={styles.container}>
      {showGroupLabel && groupLabel ? (
        <View style={styles.groupLabelContainer}><Text style={styles.groupLabel}>{groupLabel}</Text></View>
      ) : null}

      <View style={styles.card}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Open ${trip.title}`} onPress={openTrip} style={({ pressed }) => pressed && styles.cardPressed}>
          <View style={styles.summary}>
            <View style={styles.copy}>
              <View style={styles.titleRow}>
                {trip.isPinned ? <Icon name="pin" size={14} color={palette.accentStrong} /> : null}
                <Text style={styles.title} numberOfLines={1}>{trip.title}</Text>
                {localIsLocked ? <Icon name="cardlock" size={15} color={palette.secondaryText} /> : null}
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
            {coverUri ? <Image source={{ uri: coverUri }} style={styles.coverImage} resizeMode="cover" /> : null}
          </View>
        </Pressable>

        <View style={styles.utilityBar}>
          <Pressable accessibilityRole="button" accessibilityLabel="Change mood" onPress={() => toggleUtility('mood')} style={styles.utilityButton}>
            {mood ? <Icon name={mood.icon} size={23} color={palette.text} /> : <SemanticIcon name="sparkles-outline" size={20} color={palette.secondaryText} />}
          </Pressable>
          <UtilityButton label="View media" icon="images-outline" active={activeUtility === 'media'} onPress={() => toggleUtility('media')} palette={palette} />
          <UtilityButton label="View people" icon={getPeopleIconName(trip.companions)} active={activeUtility === 'people'} onPress={() => toggleUtility('people')} palette={palette} />
          <UtilityButton
            label={localIsSaved ? t('menu.unsave') : t('menu.save')}
            icon={localIsSaved ? 'heart' : 'heart-outline'}
            active={localIsSaved}
            activeColor="#de5b68"
            onPress={() => {
              setLocalIsSaved((current) => !current);
              onSaveToggle?.(trip.id);
            }}
            palette={palette}
          />
          <Pressable ref={moreButtonRef} accessibilityRole="button" accessibilityLabel={`${t('common.more')} ${trip.title}`} onPress={() => setCardMenuVisible(true)} style={styles.utilityButton}>
            <Icon name="threedotsSmaller" size={20} color={palette.text} />
          </Pressable>
        </View>

        {activeUtility === 'mood' ? (
          <View style={styles.preview}>
            <Text style={styles.previewTitle}>Mood</Text>
            <View style={styles.moodRow}>
              {EMOTIONS.map((emotion) => (
                <Pressable
                  key={emotion.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Set mood to ${emotion.label}`}
                  onPress={() => {
                    setLocalMood(emotion.id);
                    onMoodChange?.(trip.id, emotion.id);
                  }}
                  style={[styles.moodOption, localMood === emotion.id && { backgroundColor: palette.card }]}
                >
                  <Icon name={emotion.icon} size={25} color={palette.text} />
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
        {activeUtility === 'media' ? (
          <PreviewPanel title="Media" action="Open gallery" onOpen={() => router.push(`/trip/${trip.id}/media` as any)} palette={palette}>
            <PreviewItem icon="images-outline" label={`${trip.photos.length} photo${trip.photos.length === 1 ? '' : 's'}`} palette={palette} />
            <PreviewItem icon="mic-outline" label={`${trip.audioCount} recording${trip.audioCount === 1 ? '' : 's'}`} palette={palette} />
            {trip.videoCount ? <PreviewItem icon="videocam-outline" label={`${trip.videoCount} video${trip.videoCount === 1 ? '' : 's'}`} palette={palette} /> : null}
          </PreviewPanel>
        ) : null}
        {activeUtility === 'people' ? (
          <PreviewPanel title="People" action="Edit" onOpen={() => router.push(`/trip/${trip.id}/people` as any)} palette={palette}>
            {trip.companions?.length
              ? trip.companions.slice(0, 3).map((person) => <PreviewItem key={person} icon="cardperson" label={person} palette={palette} />)
              : <Text style={styles.previewEmpty}>Add people to this memory.</Text>}
          </PreviewPanel>
        ) : null}
      </View>

      <CardMenu
        visible={cardMenuVisible}
        onDismiss={() => setCardMenuVisible(false)}
        anchor={moreButtonRef.current}
        onPin={() => onPinToggle?.(trip.id)}
        onSave={() => {
          setLocalIsSaved((current) => !current);
          onSaveToggle?.(trip.id);
        }}
        onLock={() => {
          setLocalIsLocked((current) => !current);
          onLockToggle?.(trip.id);
        }}
        onDelete={() => onDelete?.(trip.id)}
        isPinned={trip.isPinned}
        isSaved={localIsSaved}
        isLocked={localIsLocked}
      />
    </View>
  );
};

function UtilityButton({
  label,
  icon,
  active,
  activeColor,
  onPress,
  palette,
}: {
  label: string;
  icon: React.ComponentProps<typeof SemanticIcon>['name'];
  active?: boolean;
  activeColor?: string;
  onPress: () => void;
  palette: typeof AppPalette.light | typeof AppPalette.dark;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={sharedStyles.utilityButton}>
      <SemanticIcon name={icon} size={19} color={active ? activeColor ?? palette.accentStrong : palette.secondaryText} />
    </Pressable>
  );
}

function PreviewPanel({
  title,
  action,
  onOpen,
  palette,
  children,
}: React.PropsWithChildren<{
  title: string;
  action: string;
  onOpen: () => void;
  palette: typeof AppPalette.light | typeof AppPalette.dark;
}>) {
  return (
    <View style={[sharedStyles.preview, { backgroundColor: palette.cardMuted }]}>
      <View style={sharedStyles.previewHeader}>
        <Text style={[sharedStyles.previewTitle, { color: palette.text }]}>{title}</Text>
        <Pressable accessibilityRole="button" onPress={onOpen}><Text style={[sharedStyles.previewAction, { color: palette.accentStrong }]}>{action}</Text></Pressable>
      </View>
      {children}
    </View>
  );
}

function PreviewItem({ icon, label, palette }: { icon: string; label: string; palette: typeof AppPalette.light | typeof AppPalette.dark }) {
  return (
    <View style={sharedStyles.previewItem}>
      <SemanticIcon name={icon} size={16} color={palette.secondaryText} />
      <Text style={[sharedStyles.previewText, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

const sharedStyles = StyleSheet.create({
  utilityButton: { width: 42, height: 40, alignItems: 'center', justifyContent: 'center' },
  preview: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.md },
  previewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  previewTitle: { fontSize: Typography.fontSize.xs, fontWeight: '700' },
  previewAction: { fontSize: Typography.fontSize.xs, fontWeight: '700' },
  previewItem: { minHeight: 25, flexDirection: 'row', alignItems: 'center', gap: 7 },
  previewText: { flex: 1, fontSize: Typography.fontSize.xs, fontWeight: '500' },
});

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark, mode: 'light' | 'dark') => StyleSheet.create({
  container: { width: '100%', marginBottom: Spacing.md },
  groupLabelContainer: { marginBottom: Spacing.sm, paddingHorizontal: Spacing.lg },
  groupLabel: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: palette.text, textTransform: 'capitalize' },
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
  summary: { flexDirection: 'row', gap: Spacing.md, padding: Spacing.md, paddingBottom: Spacing.sm },
  copy: { flex: 1, justifyContent: 'center', gap: 7, minHeight: 78 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flexShrink: 1, color: palette.text, fontSize: 19, lineHeight: 24, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  meta: { flexShrink: 1, color: palette.secondaryText, fontSize: 13, fontWeight: '500' },
  coverImage: { width: 78, height: 78, borderRadius: BorderRadius.lg },
  utilityBar: { minHeight: 44, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: palette.divider, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: Spacing.sm },
  utilityButton: sharedStyles.utilityButton,
  preview: { ...sharedStyles.preview, backgroundColor: palette.cardMuted },
  previewTitle: { ...sharedStyles.previewTitle, color: palette.text },
  previewEmpty: { color: palette.secondaryText, fontSize: Typography.fontSize.xs, paddingVertical: Spacing.xs },
  moodRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  moodOption: { width: 42, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
});
