import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { AppPalette, AppScreen, Chip, ContentContainer, IconCircleButton, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <AppScreen mode="dark" scroll bottomInset={86}>
      <ContentContainer>
        <ScreenHeader
          title="Home"
          backLabel="Home"
          mode="dark"
          onBack={() => router.replace('/(tabs)/home')}
          right={
            <View style={styles.actions}>
              <IconCircleButton mode="dark" icon="ellipsis-horizontal" />
              <IconCircleButton mode="dark" icon="menu" onPress={() => router.push(`/trip/${id}/share` as any)} />
            </View>
          }
        />
        <Text style={styles.timestamp}>July 24, 2025 at 5:20pm</Text>
        <Text style={styles.title}>Trip to Chengdu</Text>
        <View style={styles.contentHeader}>
          <Text style={styles.subheading}>Main page</Text>
          <View style={styles.avatar}><Ionicons name="person" size={37} color="#f4f3ee" /></View>
        </View>
        <View style={styles.chips}>
          <Chip mode="dark" icon="images-outline" label="Photos  3" onPress={() => router.push(`/trip/${id}/media` as any)} />
          <Chip mode="dark" icon="location-outline" label="Location  Chengdu" onPress={() => router.push(`/trip/${id}/location` as any)} />
          <Chip mode="dark" icon="mic-outline" label="Recorded Audio  3" onPress={() => router.push(`/trip/${id}/edit` as any)} />
          <Chip mode="dark" icon="people-outline" label="People" onPress={() => router.push(`/trip/${id}/people` as any)} />
        </View>
        <Text style={styles.body}>content</Text>
        <Pressable onPress={() => router.push('/expenses')} style={styles.expenseLink}>
          <SurfaceCard mode="dark" style={styles.expenseCard}>
            <View>
              <Text style={styles.expenseTitle}>Expenses</Text>
              <Text style={styles.expenseSubtitle}>View Chengdu trip summary</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={AppPalette.dark.text} />
          </SurfaceCard>
        </Pressable>
      </ContentContainer>
      <View style={styles.toolbar}>
        <Pressable onPress={() => router.push(`/trip/${id}/edit` as any)}><Ionicons name="text-outline" size={24} color="#fff" /></Pressable>
        <Ionicons name="image-outline" size={24} color="#fff" />
        <Ionicons name="camera-outline" size={24} color="#fff" />
        <Ionicons name="mic-outline" size={24} color="#fff" />
        <Pressable onPress={() => router.push(`/trip/${id}/share` as any)}><Ionicons name="send-outline" size={24} color="#fff" /></Pressable>
        <Ionicons name="add-circle-outline" size={27} color="#fff" />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: Spacing.sm },
  timestamp: { textAlign: 'center', color: AppPalette.dark.secondaryText, fontSize: Typography.fontSize.sm },
  title: { color: AppPalette.dark.text, fontSize: 26, fontWeight: '700', marginTop: Spacing.sm },
  contentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  subheading: { color: AppPalette.dark.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  avatar: { height: 55, width: 55, borderRadius: 28, backgroundColor: AppPalette.dark.accent, alignItems: 'center', justifyContent: 'center' },
  chips: { alignItems: 'flex-start', gap: Spacing.md },
  body: { color: AppPalette.dark.text, fontSize: Typography.fontSize.lg, marginTop: Spacing.lg, minHeight: 160 },
  expenseLink: { marginTop: Spacing.lg },
  expenseCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expenseTitle: { color: AppPalette.dark.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  expenseSubtitle: { color: AppPalette.dark.secondaryText, fontSize: Typography.fontSize.sm, marginTop: 4 },
  toolbar: { backgroundColor: '#302f2f', height: 66, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: Spacing.sm, marginTop: Spacing.xl },
});
