import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon, SemanticIcon } from '@/components/Icon';
import { router, useLocalSearchParams } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, SurfaceCard } from '@/components/layout/AppScreen';
import { EMOTIONS, getEmotionConfig } from '@/constants/emotions';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Spacing, Typography } from '@/theme/designSystem';
import type { Trip, TripMood } from '@/types/trip';
import {
  filterHomeTrips,
  formatTripSearchDate,
  getHomeSearchTrips,
  type HomeSearchCategory,
  type HomeTimelineMode,
} from '../../features/search/homeSearchModel';

const CATEGORY_DETAILS: Record<HomeSearchCategory, { label: string; icon: string; placeholder: string }> = {
  photos: { label: 'Photos', icon: 'images-outline', placeholder: 'Filter photos by title or place' },
  audio: { label: 'Recorded Audio', icon: 'mic-outline', placeholder: 'Filter audio cards' },
  text: { label: 'Text', icon: 'document-text-outline', placeholder: 'Search titles, places or people' },
  date: { label: 'Date', icon: 'calendar-outline', placeholder: 'Search date, e.g. July 24, 2025' },
  location: { label: 'Location', icon: 'location-outline', placeholder: 'Search a location' },
  saved: { label: 'Saved', icon: 'heart-outline', placeholder: 'Filter saved cards' },
  people: { label: 'People', icon: 'person-outline', placeholder: 'Search companion names' },
  emotion: { label: 'Emotion', icon: 'happy', placeholder: 'Choose an emotion below' },
};

function resolveCategory(value?: string): HomeSearchCategory {
  return value && value in CATEGORY_DETAILS ? value as HomeSearchCategory : 'text';
}

export default function SearchResultScreen() {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const params = useLocalSearchParams<{ category?: string; timelineMode?: HomeTimelineMode; query?: string }>();
  const category = resolveCategory(params.category);
  const timelineMode: HomeTimelineMode = params.timelineMode === 'planned' ? 'planned' : 'visited';
  const timelineLabel = timelineMode === 'planned' ? 'Planned' : 'Visited';
  const detail = CATEGORY_DETAILS[category];
  const [query, setQuery] = useState(params.query ?? '');
  const [selectedEmotion, setSelectedEmotion] = useState<TripMood>('happy');
  const results = useMemo(
    () => filterHomeTrips(getHomeSearchTrips(timelineMode), {
      category,
      query,
      emotionId: category === 'emotion' ? selectedEmotion : undefined,
    }),
    [category, query, selectedEmotion, timelineMode],
  );

  return (
    <AppScreen scroll bottomInset={Spacing.xxl}>
      <ContentContainer style={styles.content}>
        <View style={styles.searchRow}>
          <Pressable onPress={() => router.back()}>
            <SemanticIcon name="chevron-back" size={25} color={palette.text} />
          </Pressable>
          <View style={styles.search}>
            <SemanticIcon name="search" size={19} color={palette.secondaryText} />
            {category === 'emotion' ? (
              <Text style={styles.query}>{detail.label}</Text>
            ) : (
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={detail.placeholder}
                placeholderTextColor={palette.secondaryText}
                style={styles.input}
              />
            )}
            {category !== 'emotion' && query.length > 0 ? (
              <Pressable onPress={() => setQuery('')}>
                <SemanticIcon name="close-circle" size={18} color={palette.secondaryText} />
              </Pressable>
            ) : null}
          </View>
          <Pressable onPress={() => router.replace('/(tabs)/home')}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </View>

        <Text style={styles.heading}>{detail.label} in {timelineLabel}</Text>

        {category === 'emotion' ? (
          <View style={styles.emotionPicker}>
            {EMOTIONS.map((emotion) => (
              <Pressable
                key={emotion.id}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${emotion.label}`}
                accessibilityState={{ selected: emotion.id === selectedEmotion }}
                onPress={() => setSelectedEmotion(emotion.id)}
                style={[styles.emotionOption, emotion.id === selectedEmotion && styles.selectedEmotion]}
              >
                <Icon name={emotion.icon} size={32} />
              </Pressable>
            ))}
          </View>
        ) : null}

        {results.length > 0 ? (
          <View style={styles.results}>
            {results.map((trip) => (
              <SearchTripResult key={trip.id} trip={trip} category={category} />
            ))}
          </View>
        ) : (
          <SurfaceCard style={styles.empty}>
            {category === 'emotion' ? (
              <Icon name={getEmotionConfig(selectedEmotion).icon} size={34} />
            ) : (
              <SemanticIcon name={detail.icon} size={30} color={palette.secondaryText} />
            )}
            <Text style={styles.emptyTitle}>No {detail.label.toLowerCase()} found</Text>
            <Text style={styles.emptyCopy}>There are no matching cards in {timelineLabel.toLowerCase()} entries.</Text>
          </SurfaceCard>
        )}
      </ContentContainer>
    </AppScreen>
  );
}

function SearchTripResult({ trip, category }: { trip: Trip; category: HomeSearchCategory }) {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const emotion = trip.mood ? getEmotionConfig(trip.mood) : undefined;

  return (
    <Pressable onPress={() => router.push(`/trip/${trip.id}` as any)}>
      <SurfaceCard style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardCopy}>
            <Text style={styles.title}>{trip.title}</Text>
            <Text style={styles.subtitle}>{formatTripSearchDate(trip.displayDate)} • {trip.location}</Text>
            {category === 'photos' ? (
              <View style={styles.match}>
                <SemanticIcon name="images-outline" size={16} color={palette.accentStrong} />
                <Text style={styles.matchText}>{trip.photos.length} attached {trip.photos.length === 1 ? 'photo' : 'photos'}</Text>
              </View>
            ) : null}
            {category === 'emotion' && emotion ? (
              <View style={styles.match}>
                <Icon name={emotion.icon} size={20} />
                <Text style={styles.matchText}>{emotion.label} emotion match</Text>
              </View>
            ) : null}
            {category === 'date' ? (
              <View style={styles.match}>
                <SemanticIcon name="calendar-outline" size={16} color={palette.accentStrong} />
                <Text style={styles.matchText}>Matched date: {formatTripSearchDate(trip.displayDate)}</Text>
              </View>
            ) : null}
          </View>
          {category === 'photos' ? (
            <Image source={{ uri: trip.photos[0] }} style={styles.thumbnail} />
          ) : null}
        </View>
      </SurfaceCard>
    </Pressable>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.sm, gap: Spacing.lg },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  search: { flex: 1, minHeight: 40, flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 10, backgroundColor: palette.cardMuted, paddingHorizontal: Spacing.sm },
  query: { flex: 1, fontSize: Typography.fontSize.md, color: palette.text },
  input: { flex: 1, paddingVertical: 0, fontSize: Typography.fontSize.sm, color: palette.text },
  cancel: { fontSize: Typography.fontSize.sm, color: '#3366ff' },
  heading: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: palette.text },
  emotionPicker: {
    minHeight: 62,
    padding: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    backgroundColor: palette.card,
  },
  emotionOption: { width: 48, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.lg },
  selectedEmotion: { borderWidth: 2, borderColor: palette.accentStrong },
  results: { gap: Spacing.md },
  card: { padding: Spacing.md },
  cardContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  cardCopy: { flex: 1, gap: 5 },
  title: { fontSize: Typography.fontSize.md, fontWeight: '700', color: palette.text },
  subtitle: { fontSize: Typography.fontSize.sm, color: palette.secondaryText },
  match: { marginTop: Spacing.xs, flexDirection: 'row', alignItems: 'center', gap: 6 },
  matchText: { color: palette.accentStrong, fontSize: Typography.fontSize.xs, fontWeight: '600' },
  thumbnail: { width: 66, height: 66, borderRadius: BorderRadius.md },
  empty: { marginTop: Spacing.lg, alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xxl },
  emptyTitle: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  emptyCopy: { color: palette.secondaryText, textAlign: 'center', fontSize: Typography.fontSize.sm },
});
