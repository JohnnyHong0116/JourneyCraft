import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SemanticIcon } from '@/components/Icon';
import { router, useLocalSearchParams } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, SurfaceCard } from '@/components/layout/AppScreen';
import { searchCategories } from '@/data/mockApp';
import { useTranslation } from '@/i18n/useTranslation';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';
import type { TranslationKey } from '@/i18n/translations';
import {
  getSearchReturnHref,
  getSearchCategoriesForMode,
  resolveSearchOrigin,
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
  const params = useLocalSearchParams<{ timelineMode?: HomeTimelineMode; origin?: string }>();
  const timelineMode = resolveHomeTimelineMode(params.timelineMode);
  const origin = resolveSearchOrigin(params.origin);
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
      params: { category: 'text', timelineMode, origin, query: query.trim() },
    });
  };

  return (
    <AppScreen keyboardSafe>
      <ContentContainer style={styles.chrome}>
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
          <Pressable accessibilityRole="button" onPress={() => router.dismissTo(getSearchReturnHref(origin, timelineMode) as any)}>
            <Text style={styles.cancel}>{t('search.cancel')}</Text>
          </Pressable>
        </View>
      </ContentContainer>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ContentContainer>
          <Text style={styles.heading}>{t('search.heading', { timeline: timelineLabel })}</Text>
          <SurfaceCard style={styles.filterPanel}>
            {visibleCategories.map((category, index) => (
              <Pressable
                key={category.id}
                onPress={() => router.push({
                  pathname: '/search/[category]',
                  params: { category: category.id, timelineMode, origin },
                })}
                style={[styles.row, index < visibleCategories.length - 1 && styles.rowDivider]}
              >
                <View style={styles.iconBubble}>
                  <SemanticIcon name={category.icon} size={20} color={palette.accentStrong} />
                </View>
                <Text style={styles.rowLabel}>{t(CATEGORY_LABEL_KEYS[category.id as HomeSearchCategory])}</Text>
                <SemanticIcon name="chevron-forward" size={17} color={palette.secondaryText} />
              </Pressable>
            ))}
          </SurfaceCard>
        </ContentContainer>
      </ScrollView>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  chrome: { paddingTop: Spacing.sm, paddingBottom: Spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.divider },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 26,
    backgroundColor: palette.card,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.divider,
  },
  input: { flex: 1, fontSize: Typography.fontSize.md, color: palette.text, paddingVertical: 0 },
  cancel: { color: palette.accentStrong, fontSize: Typography.fontSize.sm, fontWeight: '700' },
  scrollContent: { paddingTop: Spacing.lg, paddingBottom: Spacing.xxl },
  heading: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: palette.text, marginBottom: Spacing.md },
  filterPanel: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 58,
  },
  rowDivider: { borderBottomColor: palette.divider, borderBottomWidth: StyleSheet.hairlineWidth },
  iconBubble: { width: 34, height: 34, borderRadius: 17, backgroundColor: palette.cardMuted, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: Typography.fontSize.md, color: palette.text, fontWeight: '500' },
});
