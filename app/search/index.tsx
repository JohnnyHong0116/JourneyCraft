import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SemanticIcon } from '@/components/Icon';
import { router, useLocalSearchParams } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer } from '@/components/layout/AppScreen';
import { searchCategories } from '@/data/mockApp';
import { useTranslation } from '@/i18n/useTranslation';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';
import type { TranslationKey } from '@/i18n/translations';
import {
  getHomeTimelineReturnParams,
  getSearchCategoriesForMode,
  resolveHomeTimelineMode,
  type HomeSearchCategory,
  type HomeTimelineMode,
} from '../../features/search/homeSearchModel';

const CATEGORY_LABEL_KEYS: Record<HomeSearchCategory, TranslationKey> = {
  photos: 'search.filter.photos',
  audio: 'search.filter.audio',
  text: 'search.filter.text',
  date: 'search.filter.date',
  location: 'search.filter.location',
  saved: 'search.filter.saved',
  people: 'search.filter.people',
  emotion: 'search.filter.emotion',
};

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const params = useLocalSearchParams<{ timelineMode?: HomeTimelineMode }>();
  const timelineMode = resolveHomeTimelineMode(params.timelineMode);
  const { mode } = useAppState();
  const { t } = useTranslation();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const timelineLabel = t(timelineMode === 'planned' ? 'common.planned' : 'common.visited');
  const allowedCategories = getSearchCategoriesForMode(timelineMode);
  const visibleCategories = searchCategories.filter((category) => (
    allowedCategories.includes(category.id as HomeSearchCategory)
  ));

  const startTextSearch = () => {
    router.push({
      pathname: '/search/[category]',
      params: { category: 'text', timelineMode, query: query.trim() },
    });
  };

  return (
    <AppScreen>
      <ContentContainer style={styles.content}>
        <View style={styles.searchRow}>
          <View style={styles.searchField}>
            <SemanticIcon name="search" size={20} color={palette.secondaryText} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              autoFocus
              placeholder={t(timelineMode === 'planned' ? 'search.placeholder.planned' : 'search.placeholder.visited')}
              placeholderTextColor={palette.secondaryText}
              style={styles.input}
              returnKeyType="search"
              onSubmitEditing={startTextSearch}
            />
            {query.length > 0 ? (
              <Pressable onPress={() => setQuery('')}>
                <SemanticIcon name="close-circle" size={19} color={palette.secondaryText} />
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
        <Text style={styles.heading}>{t('search.heading', { timeline: timelineLabel })}</Text>
        {visibleCategories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => router.push({
              pathname: '/search/[category]',
              params: { category: category.id, timelineMode },
            })}
            style={styles.row}
          >
            <SemanticIcon name={category.icon} size={23} color={palette.text} />
            <Text style={styles.rowLabel}>{t(CATEGORY_LABEL_KEYS[category.id as HomeSearchCategory])}</Text>
            <SemanticIcon name="chevron-forward" size={17} color={palette.secondaryText} />
          </Pressable>
        ))}
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { flex: 1, paddingTop: Spacing.sm },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: palette.cardMuted,
    height: 38,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
  },
  input: { flex: 1, fontSize: Typography.fontSize.md, color: palette.text, paddingVertical: 0 },
  cancel: { color: '#3366ff', fontSize: Typography.fontSize.md },
  heading: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: palette.text, marginBottom: Spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 48,
    borderBottomColor: palette.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: { flex: 1, fontSize: Typography.fontSize.md, color: palette.text, fontWeight: '500' },
});
