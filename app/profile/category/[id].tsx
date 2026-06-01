import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppPalette, AppScreen } from '@/components/layout/AppScreen';
import { Icon } from '@/components/Icon';
import { mockTrips, profileMemoryCategories } from '@/data/appData';
import { useTranslation } from '@/i18n/useTranslation';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Spacing } from '@/theme/designSystem';

export default function ProfileCategoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mode } = useAppState();
  const { t } = useTranslation();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const category = profileMemoryCategories.find((item) => item.id === id);
  const trips = useMemo(() => {
    if (!category) return [];
    const ids = new Set(category.relatedCardIds);
    return mockTrips.filter((trip) => ids.has(trip.id));
  }, [category]);

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
          <Icon name="back" size={22} color={palette.text} />
        </Pressable>
        <Text style={styles.title}>{category ? `${category.emoji} ${category.name}` : t('profile.addCategory')}</Text>
      </View>
      {trips.length ? (
        <View style={styles.grid}>
          {trips.flatMap((trip) => (trip.photos.length ? trip.photos : [category?.coverImageUri]).filter(Boolean).map((uri, index) => (
            <Pressable key={`${trip.id}-${index}`} onPress={() => router.push(`/trip/${trip.id}` as any)} style={styles.card}>
              <Image source={{ uri: uri as string }} style={styles.image} />
              <Text style={styles.cardTitle} numberOfLines={1}>{trip.title}</Text>
            </Pressable>
          )))}
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>{category?.emoji ?? '🧺'}</Text>
          <Text style={styles.emptyText}>{t('profile.noCategoryItems')}</Text>
        </View>
      )}
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { padding: Spacing.lg, gap: Spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  back: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.card },
  title: { flex: 1, fontSize: 24, fontWeight: '800', color: palette.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  card: { width: '48%', borderRadius: BorderRadius.lg, overflow: 'hidden', backgroundColor: palette.card },
  image: { width: '100%', aspectRatio: 1, backgroundColor: palette.cardMuted },
  cardTitle: { padding: Spacing.sm, color: palette.text, fontWeight: '700' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: Spacing.sm },
  emptyEmoji: { fontSize: 42 },
  emptyText: { color: palette.secondaryText, fontSize: 15, fontWeight: '600' },
});
