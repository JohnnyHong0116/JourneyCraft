import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer } from '@/components/layout/AppScreen';
import { searchCategories } from '@/data/mockApp';
import { Spacing, Typography } from '@/theme/designSystem';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  return (
    <AppScreen>
      <ContentContainer style={styles.content}>
        <View style={styles.searchRow}>
          <View style={styles.searchField}>
            <Ionicons name="search" size={20} color={AppPalette.light.secondaryText} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              autoFocus
              placeholder="Search"
              placeholderTextColor={AppPalette.light.secondaryText}
              style={styles.input}
            />
            {query.length > 0 ? (
              <Pressable onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={19} color={AppPalette.light.secondaryText} />
              </Pressable>
            ) : null}
          </View>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </View>
        <Text style={styles.heading}>Categories</Text>
        {searchCategories.map((category) => (
          <Pressable
            key={category.label}
            onPress={() => router.push({ pathname: '/search/[category]', params: { category: category.label.toLowerCase().replace(' ', '-') } })}
            style={styles.row}
          >
            <Ionicons name={category.icon} size={23} color={AppPalette.light.text} />
            <Text style={styles.rowLabel}>{category.label}</Text>
            <Ionicons name="chevron-forward" size={17} color={AppPalette.light.secondaryText} />
          </Pressable>
        ))}
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingTop: Spacing.sm },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#e3e3e5',
    height: 38,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
  },
  input: { flex: 1, fontSize: Typography.fontSize.md, color: AppPalette.light.text, paddingVertical: 0 },
  cancel: { color: '#3366ff', fontSize: Typography.fontSize.md },
  heading: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: AppPalette.light.text, marginBottom: Spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 48,
    borderBottomColor: AppPalette.light.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: { flex: 1, fontSize: Typography.fontSize.md, color: AppPalette.light.text, fontWeight: '500' },
});
