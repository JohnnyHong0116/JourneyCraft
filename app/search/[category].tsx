import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, SurfaceCard } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';

const results = [
  { title: 'Trip to Chengdu', subtitle: 'July 24, 2025 • Chengdu, China' },
  { title: 'Panda Base Visit', subtitle: 'July 25, 2025 • Amily and Johnny' },
  { title: 'Hotpot Evening', subtitle: 'July 26, 2025 • Happy' },
];

export default function SearchResultScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const label = (category ?? 'results').split('-').map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`).join(' ');
  const mapMode = ['location', 'saved', 'people'].includes(category ?? '');

  return (
    <AppScreen scroll bottomInset={Spacing.xxl}>
      <ContentContainer style={styles.content}>
        <View style={styles.searchRow}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={25} color={AppPalette.light.text} />
          </Pressable>
          <View style={styles.search}>
            <Ionicons name="search" size={19} color={AppPalette.light.secondaryText} />
            <Text style={styles.query}>{label}</Text>
          </View>
          <Pressable onPress={() => router.replace('/(tabs)/home')}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </View>
        <Text style={styles.heading}>{label}</Text>
        {mapMode ? (
          <View style={styles.map}>
            <View style={styles.road} />
            {results.map((entry, index) => (
              <Pressable
                key={entry.title}
                onPress={() => router.push('/trip/1')}
                style={[styles.pin, { top: 70 + index * 88, left: 52 + index * 76 }]}
              >
                <Ionicons name="location" size={30} color={AppPalette.light.accentStrong} />
              </Pressable>
            ))}
          </View>
        ) : null}
        <View style={styles.results}>
          {results.map((entry) => (
            <Pressable key={entry.title} onPress={() => router.push('/trip/1')}>
              <SurfaceCard style={styles.card}>
                <Text style={styles.title}>{entry.title}</Text>
                <Text style={styles.subtitle}>{entry.subtitle}</Text>
              </SurfaceCard>
            </Pressable>
          ))}
        </View>
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.sm, gap: Spacing.lg },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  search: { flex: 1, height: 38, flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 10, backgroundColor: '#e3e3e5', paddingHorizontal: Spacing.sm },
  query: { fontSize: Typography.fontSize.md, color: AppPalette.light.text },
  cancel: { fontSize: Typography.fontSize.sm, color: '#3366ff' },
  heading: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: AppPalette.light.text },
  map: { height: 280, borderRadius: 20, backgroundColor: '#d9e2d3', overflow: 'hidden' },
  road: { position: 'absolute', width: '120%', height: 13, backgroundColor: '#f4f2ed', top: '50%', left: '-10%', transform: [{ rotate: '-18deg' }] },
  pin: { position: 'absolute' },
  results: { gap: Spacing.md },
  card: { padding: Spacing.md },
  title: { fontSize: Typography.fontSize.md, fontWeight: '700', color: AppPalette.light.text },
  subtitle: { marginTop: 4, fontSize: Typography.fontSize.sm, color: AppPalette.light.secondaryText },
});
