import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SemanticIcon } from '@/components/Icon';
import { router } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, SurfaceCard } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';

const pins = [
  { label: 'Madison', top: '32%' as const, left: '25%' as const },
  { label: 'Chicago', top: '41%' as const, left: '67%' as const },
  { label: 'Chengdu', top: '58%' as const, left: '48%' as const },
];

export default function LocationTab() {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <AppScreen bottomInset={116}>
      <ContentContainer style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Map</Text>
          <Pressable style={styles.search} onPress={() => router.push('/search')}>
            <SemanticIcon name="search" size={19} color={palette.secondaryText} />
            <Text style={styles.searchText}>Search places and entries</Text>
          </Pressable>
        </View>
        <View style={styles.map}>
          <View style={styles.roadHorizontal} />
          <View style={styles.roadVertical} />
          {pins.map((pin) => (
            <View key={pin.label} style={[styles.marker, { top: pin.top, left: pin.left }]}>
              <SemanticIcon name="location" size={26} color={palette.accentStrong} />
              <Text style={styles.markerLabel}>{pin.label}</Text>
            </View>
          ))}
        </View>
        <SurfaceCard style={styles.preview}>
          <Text style={styles.previewTitle}>Chengdu Summer Escape</Text>
          <Text style={styles.previewSubtitle}>3 journal entries nearby</Text>
          <Pressable onPress={() => router.push('/trip/1')} style={styles.openRow}>
            <Text style={styles.openText}>View trip memories</Text>
            <SemanticIcon name="chevron-forward" size={19} color={palette.text} />
          </Pressable>
        </SurfaceCard>
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { flex: 1, paddingTop: Spacing.lg, gap: Spacing.md },
  header: { gap: Spacing.md },
  title: { fontSize: Typography.fontSize.xxl, color: palette.text, fontWeight: '700' },
  search: { minHeight: 44, borderRadius: 12, backgroundColor: palette.cardMuted, flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, gap: Spacing.sm },
  searchText: { fontSize: Typography.fontSize.md, color: palette.secondaryText },
  map: { flex: 1, minHeight: 340, borderRadius: 22, backgroundColor: palette.cardMuted, overflow: 'hidden', position: 'relative' },
  roadHorizontal: { position: 'absolute', left: 0, right: 0, top: '48%', height: 10, backgroundColor: palette.card, transform: [{ rotate: '-9deg' }] },
  roadVertical: { position: 'absolute', top: 0, bottom: 0, left: '60%', width: 9, backgroundColor: palette.card, transform: [{ rotate: '12deg' }] },
  marker: { position: 'absolute', alignItems: 'center' },
  markerLabel: { backgroundColor: palette.card, color: palette.text, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6, fontSize: 10, fontWeight: '600' },
  preview: { marginBottom: 102, gap: Spacing.xs },
  previewTitle: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: palette.text },
  previewSubtitle: { color: palette.secondaryText, fontSize: Typography.fontSize.sm },
  openRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.sm },
  openText: { fontSize: Typography.fontSize.sm, color: palette.accentStrong, fontWeight: '600' },
});
