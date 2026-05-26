import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeOut,
  LinearTransition,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { AppPalette, AppScreen } from '@/components/layout/AppScreen';
import { ActionSheetModal, OverlayActionRow } from '@/components/ui/OverlaySurface';
import { getEmotionConfig } from '@/constants/emotions';
import { mockTrips, statisticsExpenses } from '@/data/mockApp';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Shadows, Spacing, Typography } from '@/theme/designSystem';
import { TRIP_UTILITY_TOOLBAR_HEIGHT, TripUtilityToolbar } from '@features/trip/TripUtilityToolbar';
import {
  formatTripTimestamp,
  getCompanionCluster,
  getTripById,
  getTripExpenseSummary,
  getTripFeatures,
  type TripFeatureId,
} from '../../features/trip/tripDetailModel';

const featureIcons: Record<TripFeatureId, React.ComponentProps<typeof Icon>['name']> = {
  photos: 'cardimage',
  location: 'location-unselected',
  audio: 'microphone',
  people: 'cardpeople',
};

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette, mode);
  const insets = useSafeAreaInsets();
  const [activeFeature, setActiveFeature] = useState<TripFeatureId | undefined>();
  const [expensesExpanded, setExpensesExpanded] = useState(false);
  const [moreVisible, setMoreVisible] = useState(false);
  const scrollY = useSharedValue(0);
  const trip = getTripById(mockTrips, id);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  const timestampStyle = useAnimatedStyle(() => ({
    height: interpolate(scrollY.value, [-72, 0], [40, 0], Extrapolation.CLAMP),
    opacity: interpolate(scrollY.value, [-52, -10], [1, 0], Extrapolation.CLAMP),
  }));
  const compactTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [62, 92], [0, 1], Extrapolation.CLAMP),
  }));

  if (!trip) {
    return (
      <AppScreen>
        <View style={styles.unavailable}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} style={styles.headerButton}>
            <Icon name="back" size={22} color={palette.text} />
          </Pressable>
          <Text style={styles.unavailableTitle}>Memory unavailable</Text>
          <Text style={styles.unavailableCopy}>This trip could not be found.</Text>
        </View>
      </AppScreen>
    );
  }

  const features = getTripFeatures(trip);
  const companions = getCompanionCluster(trip.companions);
  const expenseSummary = getTripExpenseSummary(statisticsExpenses, trip.id);
  const bottomReservedSpace = TRIP_UTILITY_TOOLBAR_HEIGHT + insets.bottom + 124;
  const mood = trip.mood ? getEmotionConfig(trip.mood) : undefined;

  const openFeature = (feature: TripFeatureId) => {
    if (activeFeature !== feature) {
      setActiveFeature(feature);
      return;
    }
    const destinations: Record<TripFeatureId, string> = {
      photos: `/trip/${trip.id}/media`,
      location: `/trip/${trip.id}/location`,
      audio: `/trip/${trip.id}/edit`,
      people: `/trip/${trip.id}/people`,
    };
    router.push(destinations[feature] as any);
  };

  return (
    <AppScreen
      contentContainerStyle={styles.screen}
      footerHeight={TRIP_UTILITY_TOOLBAR_HEIGHT}
      footer={(bottomInset) => (
        <TripUtilityToolbar
          bottomInset={bottomInset}
          actions={[
            { key: 'edit', icon: 'textformat', accessibilityLabel: 'Edit trip note', onPress: () => router.push(`/trip/${trip.id}/edit` as any) },
            { key: 'photos', icon: 'cardimage', accessibilityLabel: 'View photos', onPress: () => router.push(`/trip/${trip.id}/media` as any) },
            { key: 'camera', icon: 'camera', accessibilityLabel: 'Add a photo' },
            { key: 'audio', icon: 'microphone', accessibilityLabel: 'Record audio', onPress: () => router.push(`/trip/${trip.id}/edit` as any) },
            { key: 'share', icon: 'send', accessibilityLabel: 'Share trip', onPress: () => router.push(`/trip/${trip.id}/share` as any) },
            { key: 'add', icon: 'add', accessibilityLabel: 'Add trip item' },
          ]}
        />
      )}
    >
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back to memories" onPress={() => router.back()} style={styles.headerButton}>
          <Icon name="back" size={23} color={palette.text} />
        </Pressable>
        <Animated.View pointerEvents="none" style={[styles.compactTitle, compactTitleStyle]}>
          <Text numberOfLines={1} style={styles.compactTitleText}>{trip.title}</Text>
        </Animated.View>
        <View style={styles.headerActions}>
          <Pressable accessibilityRole="button" accessibilityLabel="More trip actions" onPress={() => setMoreVisible(true)} style={styles.headerButton}>
            <Icon name="threedotsSmaller" size={22} color={palette.text} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Share trip" onPress={() => router.push(`/trip/${trip.id}/share` as any)} style={styles.headerButton}>
            <Icon name="send" size={22} color={palette.text} />
          </Pressable>
        </View>
      </View>

      <Animated.ScrollView
        alwaysBounceVertical
        bounces
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: bottomReservedSpace }]}
      >
        <Animated.View style={[styles.timestampReveal, timestampStyle]}>
          <Text style={styles.timestamp}>{formatTripTimestamp(trip.displayDate)}</Text>
        </Animated.View>
        <View style={styles.identityRow}>
          <View style={styles.identityCopy}>
            <Text style={styles.title}>{trip.title}</Text>
            {mood ? (
              <View style={styles.moodLabel}>
                <Icon name={mood.icon} size={20} />
                <Text style={styles.moodText}>{mood.label}</Text>
              </View>
            ) : null}
          </View>
          <CompanionClusterButton
            label={companions.label}
            initials={companions.initials}
            overflow={companions.overflow}
            onPress={() => router.push(`/trip/${trip.id}/people` as any)}
            palette={palette}
            mode={mode}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featureRail}
        >
          {features.map((feature) => {
            const expanded = activeFeature === feature.id;
            return (
              <Animated.View key={feature.id} layout={LinearTransition.duration(180)}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${expanded ? 'Open' : 'Expand'} ${feature.label}, ${feature.value}`}
                  onPress={() => openFeature(feature.id)}
                  style={({ pressed }) => [
                    styles.feature,
                    expanded && styles.featureExpanded,
                    pressed && styles.pressed,
                  ]}
                >
                  <Icon name={featureIcons[feature.id]} size={21} color={expanded ? palette.accentStrong : palette.text} />
                  {expanded ? (
                    <Animated.Text entering={FadeIn.duration(150)} exiting={FadeOut.duration(100)} style={styles.featureValue}>
                      {feature.value}
                    </Animated.Text>
                  ) : null}
                </Pressable>
              </Animated.View>
            );
          })}
        </ScrollView>

        <View style={styles.noteArea}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notePlaceholder}>No journal note yet.</Text>
          <Pressable accessibilityRole="button" onPress={() => router.push(`/trip/${trip.id}/edit` as any)} style={styles.addNote}>
            <Text style={styles.addNoteText}>Add a note</Text>
          </Pressable>
        </View>
      </Animated.ScrollView>

      <ExpensesDisclosure
        expanded={expensesExpanded}
        label={expenseSummary.label}
        onToggle={() => setExpensesExpanded((current) => !current)}
        onOpen={() => router.push({ pathname: '/expenses', params: { tripId: trip.id } } as any)}
        palette={palette}
        mode={mode}
        bottom={TRIP_UTILITY_TOOLBAR_HEIGHT + insets.bottom + Spacing.md}
      />

      <ActionSheetModal visible={moreVisible} onDismiss={() => setMoreVisible(false)}>
        <Text style={styles.sheetTitle}>{trip.title}</Text>
        <OverlayActionRow
          label="Edit memory"
          leading={<Icon name="edit" size={20} color={palette.text} />}
          onPress={() => {
            setMoreVisible(false);
            router.push(`/trip/${trip.id}/edit` as any);
          }}
        />
        <OverlayActionRow
          label="Share memory"
          leading={<Icon name="send" size={20} color={palette.text} />}
          onPress={() => {
            setMoreVisible(false);
            router.push(`/trip/${trip.id}/share` as any);
          }}
        />
        <Pressable accessibilityRole="button" accessibilityLabel="Cancel" onPress={() => setMoreVisible(false)} style={styles.sheetCancel}>
          <Text style={styles.sheetCancelText}>Cancel</Text>
        </Pressable>
      </ActionSheetModal>
    </AppScreen>
  );
}

function CompanionClusterButton({
  label,
  initials,
  overflow,
  onPress,
  palette,
  mode,
}: {
  label: string;
  initials: string[];
  overflow: number;
  onPress: () => void;
  palette: typeof AppPalette.light | typeof AppPalette.dark;
  mode: 'light' | 'dark';
}) {
  const styles = createStyles(palette, mode);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`People, ${label}`} onPress={onPress} style={styles.peopleButton}>
      {initials.length ? initials.map((initial, index) => (
        <View key={`${initial}-${index}`} style={[styles.initialAvatar, index > 0 && styles.overlapAvatar]}>
          <Text style={styles.initialText}>{initial}</Text>
        </View>
      )) : <Icon name="profile-unselected" size={23} color={palette.text} />}
      {overflow ? (
        <View style={styles.peopleCount}><Text style={styles.peopleCountText}>+{overflow}</Text></View>
      ) : null}
    </Pressable>
  );
}

function ExpensesDisclosure({
  expanded,
  label,
  onToggle,
  onOpen,
  palette,
  mode,
  bottom,
}: {
  expanded: boolean;
  label: string;
  onToggle: () => void;
  onOpen: () => void;
  palette: typeof AppPalette.light | typeof AppPalette.dark;
  mode: 'light' | 'dark';
  bottom: number;
}) {
  const styles = createStyles(palette, mode);
  return (
    <Animated.View layout={LinearTransition.duration(180)} style={[styles.expensesFloat, { bottom }]}>
      {expanded ? (
        <Animated.View entering={FadeIn.duration(150)} style={styles.expensesPanel}>
          <View style={styles.expenseHeadingRow}>
            <Text style={styles.expenseHeading}>Expenses</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Collapse expenses" onPress={onToggle} style={styles.expenseCollapse}>
              <Icon name="chevrondown" size={17} color={palette.text} />
            </Pressable>
          </View>
          <Text style={styles.expenseValue}>{label}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="View expenses" onPress={onOpen} style={styles.expenseOpen}>
            <Text style={styles.expenseOpenText}>View expenses</Text>
            <Icon name="chevron" size={17} color={palette.text} />
          </Pressable>
        </Animated.View>
      ) : (
        <Pressable accessibilityRole="button" accessibilityLabel={`Expand expenses, ${label}`} onPress={onToggle} style={styles.expensesPill}>
          <Text style={styles.expensesPillText}>Expenses</Text>
          <Text style={styles.expensesPillValue}>{label}</Text>
          <Icon name="chevronup" size={17} color={palette.text} />
        </Pressable>
      )}
    </Animated.View>
  );
}

const createStyles = (
  palette: typeof AppPalette.light | typeof AppPalette.dark,
  mode: 'light' | 'dark',
) => StyleSheet.create({
  screen: { flex: 1 },
  header: {
    height: 58,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 3,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.cardMuted,
  },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
  compactTitle: { position: 'absolute', left: 74, right: 124, alignItems: 'center' },
  compactTitleText: { color: palette.text, fontSize: Typography.fontSize.md, lineHeight: 22, fontWeight: '700' },
  content: { paddingHorizontal: Spacing.lg, gap: Spacing.lg },
  timestampReveal: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  timestamp: { color: palette.secondaryText, fontSize: Typography.fontSize.sm, lineHeight: 20 },
  identityRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, paddingTop: Spacing.sm },
  identityCopy: { flex: 1, gap: Spacing.sm },
  title: { color: palette.text, fontSize: 30, lineHeight: 36, fontWeight: '700' },
  moodLabel: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  moodText: { color: palette.secondaryText, fontSize: Typography.fontSize.sm, fontWeight: '600' },
  peopleButton: {
    minWidth: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    ...(mode === 'light' ? Shadows.small : {}),
  },
  initialAvatar: {
    width: 34,
    height: 34,
    borderRadius: 18,
    backgroundColor: palette.accent,
    borderWidth: 2,
    borderColor: palette.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlapAvatar: { marginLeft: -10 },
  initialText: { color: '#24301e', fontWeight: '700', fontSize: Typography.fontSize.sm },
  peopleCount: { marginLeft: 3, paddingHorizontal: 4, minWidth: 23, height: 23, borderRadius: 12, backgroundColor: palette.cardMuted, alignItems: 'center', justifyContent: 'center' },
  peopleCountText: { color: palette.text, fontSize: 11, fontWeight: '700' },
  featureRail: { gap: Spacing.sm, paddingVertical: Spacing.xs },
  feature: {
    minHeight: 48,
    minWidth: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: 24,
    backgroundColor: palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  featureExpanded: { backgroundColor: palette.cardMuted, borderColor: palette.accentStrong },
  featureValue: { color: palette.text, fontSize: Typography.fontSize.sm, fontWeight: '600' },
  pressed: { opacity: 0.75 },
  noteArea: { minHeight: 410, paddingTop: Spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: palette.divider, gap: Spacing.md },
  sectionTitle: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  notePlaceholder: { color: palette.secondaryText, fontSize: Typography.fontSize.md, lineHeight: 23 },
  addNote: { alignSelf: 'flex-start', minHeight: 44, paddingHorizontal: Spacing.md, borderRadius: 22, backgroundColor: palette.card, alignItems: 'center', justifyContent: 'center' },
  addNoteText: { color: palette.accentStrong, fontSize: Typography.fontSize.sm, fontWeight: '700' },
  expensesFloat: { position: 'absolute', right: Spacing.lg, zIndex: 4, maxWidth: 278 },
  expensesPill: {
    minHeight: 50,
    borderRadius: 26,
    paddingHorizontal: Spacing.md,
    backgroundColor: palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.divider,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    ...(mode === 'light' ? Shadows.small : {}),
  },
  expensesPillText: { color: palette.text, fontSize: Typography.fontSize.sm, fontWeight: '700' },
  expensesPillValue: { color: palette.secondaryText, fontSize: Typography.fontSize.xs, fontWeight: '600' },
  expensesPanel: {
    width: 266,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.divider,
    ...(mode === 'light' ? Shadows.large : {}),
  },
  expenseHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expenseHeading: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '700' },
  expenseCollapse: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  expenseValue: { color: palette.secondaryText, fontSize: Typography.fontSize.sm },
  expenseOpen: { minHeight: 46, borderRadius: BorderRadius.lg, backgroundColor: palette.cardMuted, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md },
  expenseOpenText: { color: palette.text, fontSize: Typography.fontSize.sm, fontWeight: '700' },
  sheetTitle: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700', textAlign: 'center', marginBottom: Spacing.sm },
  sheetCancel: { minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.sm },
  sheetCancelText: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '600' },
  unavailable: { flex: 1, padding: Spacing.lg, gap: Spacing.md },
  unavailableTitle: { marginTop: Spacing.xxl, color: palette.text, fontSize: Typography.fontSize.xl, fontWeight: '700' },
  unavailableCopy: { color: palette.secondaryText, fontSize: Typography.fontSize.md },
});
