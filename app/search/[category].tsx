import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon, SemanticIcon } from '@/components/Icon';
import { router, useLocalSearchParams } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, SurfaceCard } from '@/components/layout/AppScreen';
import { EMOTIONS, getEmotionConfig } from '@/constants/emotions';
import { people } from '@/data/mockApp';
import type { TranslationKey } from '@/i18n/translations';
import { useTranslation } from '@/i18n/useTranslation';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Spacing, Typography } from '@/theme/designSystem';
import type { Trip, TripMood } from '@/types/trip';
import { PeopleSelector } from '../../features/search/components/PeopleSelector';
import {
  filterHomeTrips,
  getHomeTimelineReturnParams,
  getHomeSearchTrips,
  getSearchCategoriesForMode,
  resolveHomeTimelineMode,
  type HomeSearchCategory,
  type HomeTimelineMode,
} from '../../features/search/homeSearchModel';
import {
  formatPersonDisplayName,
  getPeopleForTrip,
} from '../../features/search/peopleSearchModel';

const CATEGORY_DETAILS: Record<HomeSearchCategory, { label: TranslationKey; icon: string; placeholder: TranslationKey }> = {
  photos: { label: 'search.filter.photos', icon: 'images-outline', placeholder: 'search.input.photos' },
  audio: { label: 'search.filter.audio', icon: 'mic-outline', placeholder: 'search.input.audio' },
  text: { label: 'search.filter.text', icon: 'document-text-outline', placeholder: 'search.input.text' },
  date: { label: 'search.filter.date', icon: 'calendar-outline', placeholder: 'search.input.date' },
  location: { label: 'search.filter.location', icon: 'location-outline', placeholder: 'search.input.location' },
  saved: { label: 'search.filter.saved', icon: 'heart-outline', placeholder: 'search.input.saved' },
  people: { label: 'search.filter.people', icon: 'person-outline', placeholder: 'search.input.people' },
  emotion: { label: 'search.filter.emotion', icon: 'happy', placeholder: 'search.input.emotion' },
};

function resolveCategory(value?: string): HomeSearchCategory {
  return value && value in CATEGORY_DETAILS ? value as HomeSearchCategory : 'text';
}

export default function SearchResultScreen() {
  const { mode } = useAppState();
  const { t } = useTranslation();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const params = useLocalSearchParams<{ category?: string; timelineMode?: HomeTimelineMode; query?: string }>();
  const timelineMode = resolveHomeTimelineMode(params.timelineMode);
  const requestedCategory = resolveCategory(params.category);
  const category = getSearchCategoriesForMode(timelineMode).includes(requestedCategory)
    ? requestedCategory
    : 'text';
  const timelineLabel = t(timelineMode === 'planned' ? 'common.planned' : 'common.visited');
  const detail = CATEGORY_DETAILS[category];
  const [query, setQuery] = useState(params.query ?? '');
  const [selectedEmotion, setSelectedEmotion] = useState<TripMood>('happy');
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);
  const results = useMemo(
    () => filterHomeTrips(getHomeSearchTrips(timelineMode), {
      category,
      query,
      emotionId: category === 'emotion' ? selectedEmotion : undefined,
      selectedPersonIds: category === 'people' ? selectedPersonIds : undefined,
    }),
    [category, query, selectedEmotion, selectedPersonIds, timelineMode],
  );

  const togglePerson = (personId: string) => {
    setSelectedPersonIds((current) => current.includes(personId)
      ? current.filter((id) => id !== personId)
      : [...current, personId]);
  };

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
              <Text style={styles.query}>{t(detail.label)}</Text>
            ) : (
              <>
                {category === 'people' ? (
                  <View style={styles.peopleToken}>
                    <SemanticIcon name="people-outline" size={17} color="#ffffff" />
                    <Text style={styles.peopleTokenText}>{t('search.filter.people')}</Text>
                  </View>
                ) : null}
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder={category === 'text' && timelineMode === 'planned'
                    ? t('search.input.plannedText')
                    : t(detail.placeholder)}
                  placeholderTextColor={palette.secondaryText}
                  style={styles.input}
                />
              </>
            )}
            {category !== 'emotion' && query.length > 0 ? (
              <Pressable onPress={() => setQuery('')}>
                <SemanticIcon name="close-circle" size={18} color={palette.secondaryText} />
              </Pressable>
            ) : null}
          </View>
          <Pressable onPress={() => router.replace({
            pathname: '/(tabs)/home',
            params: getHomeTimelineReturnParams(timelineMode),
          })}>
            <Text style={styles.cancel}>{t('search.cancel')}</Text>
          </Pressable>
        </View>

        <Text style={styles.heading}>{t('search.inTimeline', { filter: t(detail.label), timeline: timelineLabel })}</Text>

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

        {category === 'people' ? (
          <PeopleSelector
            people={people}
            selectedPersonIds={selectedPersonIds}
            onTogglePerson={togglePerson}
          />
        ) : null}

        {category === 'people' && results.length > 0 ? (
          <Text style={styles.resultCount}>{t('common.entriesCount', { count: results.length })}</Text>
        ) : null}

        {results.length > 0 ? (
          <View style={styles.results}>
            {results.map((trip) => (
              <SearchTripResult
                key={trip.id}
                trip={trip}
                category={category}
                timelineMode={timelineMode}
                selectedPersonIds={selectedPersonIds}
              />
            ))}
          </View>
        ) : (
          <SurfaceCard style={styles.empty}>
            {category === 'emotion' ? (
              <Icon name={getEmotionConfig(selectedEmotion).icon} size={34} />
            ) : (
              <SemanticIcon name={detail.icon} size={30} color={palette.secondaryText} />
            )}
            <Text style={styles.emptyTitle}>{t('search.noFound', { filter: t(detail.label).toLowerCase() })}</Text>
            <Text style={styles.emptyCopy}>{t('search.noMatches', { timeline: timelineLabel.toLowerCase() })}</Text>
          </SurfaceCard>
        )}
      </ContentContainer>
    </AppScreen>
  );
}

function SearchTripResult({
  trip,
  category,
  timelineMode,
  selectedPersonIds,
}: {
  trip: Trip;
  category: HomeSearchCategory;
  timelineMode: HomeTimelineMode;
  selectedPersonIds: readonly string[];
}) {
  const { mode } = useAppState();
  const { t, formatDate } = useTranslation();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const emotion = trip.mood ? getEmotionConfig(trip.mood) : undefined;
  const matchedPeople = category === 'people'
    ? getPeopleForTrip(trip, people).filter((person) => (
      selectedPersonIds.length === 0 || selectedPersonIds.includes(person.id)
    ))
    : [];
  const audioResultCount = category === 'audio' && timelineMode === 'visited' && trip.audioCount > 0
    ? t('search.audioCount', { count: trip.audioCount })
    : undefined;
  const displayDate = formatDate(trip.displayDate, { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <Pressable onPress={() => router.push(`/trip/${trip.id}` as any)}>
      <SurfaceCard style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardCopy}>
            <Text style={styles.title}>{trip.title}</Text>
            <Text style={styles.subtitle}>{displayDate} • {trip.location}</Text>
            {category === 'photos' ? (
              <View style={styles.match}>
                <SemanticIcon name="images-outline" size={16} color={palette.accentStrong} />
                <Text style={styles.matchText}>{t('search.attachedPhotos', {
                  count: trip.photos.length,
                  label: t(trip.photos.length === 1 ? 'search.photo.one' : 'search.photo.other'),
                })}</Text>
              </View>
            ) : null}
            {category === 'emotion' && emotion ? (
              <View style={styles.match}>
                <Icon name={emotion.icon} size={20} />
                <Text style={styles.matchText}>{t('search.emotionMatch', { emotion: emotion.label })}</Text>
              </View>
            ) : null}
            {category === 'date' ? (
              <View style={styles.match}>
                <SemanticIcon name="calendar-outline" size={16} color={palette.accentStrong} />
                <Text style={styles.matchText}>{t('search.matchedDate', { date: displayDate })}</Text>
              </View>
            ) : null}
            {category === 'people' && matchedPeople.length > 0 ? (
              <View style={styles.match}>
                <SemanticIcon name="people-outline" size={16} color={palette.accentStrong} />
                <Text numberOfLines={1} style={styles.matchText}>
                  {t('search.withPeople', { people: matchedPeople.map((person) => formatPersonDisplayName(person.displayName)).join(', ') })}
                </Text>
              </View>
            ) : null}
            {audioResultCount ? (
              <View style={styles.match}>
                <SemanticIcon name="mic-outline" size={16} color={palette.accentStrong} />
                <Text style={styles.matchText}>{audioResultCount}</Text>
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
  peopleToken: { height: 30, paddingHorizontal: Spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 7, backgroundColor: '#39413d' },
  peopleTokenText: { color: '#ffffff', fontSize: Typography.fontSize.sm, fontWeight: '600' },
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
  resultCount: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: palette.divider, paddingTop: Spacing.lg, color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
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
