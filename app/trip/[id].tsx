import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppPalette, AppScreen, Chip, ContentContainer, IconCircleButton, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';
import { TRIP_UTILITY_TOOLBAR_HEIGHT, TripUtilityToolbar } from '@features/trip/TripUtilityToolbar';
import { Icon, SemanticIcon } from '@/components/Icon';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);

  return (
    <AppScreen
      scroll
      bottomInset={Spacing.md}
      footerHeight={TRIP_UTILITY_TOOLBAR_HEIGHT}
      footer={(bottomInset) => (
        <TripUtilityToolbar
          bottomInset={bottomInset}
          actions={[
            { key: 'edit', icon: 'textformat', accessibilityLabel: 'Edit trip note', onPress: () => router.push(`/trip/${id}/edit` as any) },
            { key: 'photos', icon: 'cardimage', accessibilityLabel: 'View photos', onPress: () => router.push(`/trip/${id}/media` as any) },
            { key: 'camera', icon: 'camera', accessibilityLabel: 'Add a photo' },
            { key: 'audio', icon: 'microphone', accessibilityLabel: 'Record audio' },
            { key: 'share', icon: 'send', accessibilityLabel: 'Share trip', onPress: () => router.push(`/trip/${id}/share` as any) },
            { key: 'add', icon: 'add', accessibilityLabel: 'Add trip item' },
          ]}
        />
      )}
    >
      <ContentContainer>
        <ScreenHeader
          title="Home"
          backLabel="Home"
          onBack={() => router.back()}
          right={
            <View style={styles.actions}>
              <IconCircleButton icon="ellipsis-horizontal" />
              <IconCircleButton icon="menu" onPress={() => router.push(`/trip/${id}/share` as any)} />
            </View>
          }
        />
        <Text style={styles.timestamp}>July 24, 2025 at 5:20pm</Text>
        <Text style={styles.title}>Trip to Chengdu</Text>
        <View style={styles.contentHeader}>
          <Text style={styles.subheading}>Main page</Text>
          <View style={styles.avatar}><Icon name="profile-selected" size={37} color="#f4f3ee" /></View>
        </View>
        <View style={styles.chips}>
          <Chip icon="images-outline" label="Photos  3" onPress={() => router.push(`/trip/${id}/media` as any)} />
          <Chip icon="location-outline" label="Location  Chengdu" onPress={() => router.push(`/trip/${id}/location` as any)} />
          <Chip icon="mic-outline" label="Recorded Audio  3" onPress={() => router.push(`/trip/${id}/edit` as any)} />
          <Chip icon="people-outline" label="People" onPress={() => router.push(`/trip/${id}/people` as any)} />
        </View>
        <Text style={styles.body}>content</Text>
        <Pressable onPress={() => router.push('/expenses')} style={styles.expenseLink}>
          <SurfaceCard style={styles.expenseCard}>
            <View>
              <Text style={styles.expenseTitle}>Expenses</Text>
              <Text style={styles.expenseSubtitle}>View Chengdu trip summary</Text>
            </View>
            <SemanticIcon name="chevron-forward" size={22} color={palette.text} />
          </SurfaceCard>
        </Pressable>
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  actions: { flexDirection: 'row', gap: Spacing.sm },
  timestamp: { textAlign: 'center', color: palette.secondaryText, fontSize: Typography.fontSize.sm },
  title: { color: palette.text, fontSize: 26, fontWeight: '700', marginTop: Spacing.sm },
  contentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  subheading: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  avatar: { height: 55, width: 55, borderRadius: 28, backgroundColor: palette.accent, alignItems: 'center', justifyContent: 'center' },
  chips: { alignItems: 'flex-start', gap: Spacing.md },
  body: { color: palette.text, fontSize: Typography.fontSize.lg, marginTop: Spacing.lg, minHeight: 160 },
  expenseLink: { marginTop: Spacing.lg },
  expenseCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expenseTitle: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  expenseSubtitle: { color: palette.secondaryText, fontSize: Typography.fontSize.sm, marginTop: 4 },
});
