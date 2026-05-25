import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { SemanticIcon } from '@/components/Icon';
import { Spacing, Typography } from '@/theme/designSystem';

export default function TripLocationScreen() {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <AppScreen>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Locations" right={<Pressable onPress={() => router.back()}><Text style={styles.done}>Cancel</Text></Pressable>} />
        <View style={styles.search}>
          <SemanticIcon name="search" color={palette.text} size={21} />
          <Text style={styles.placeholder}>Search</Text>
          <SemanticIcon name="close-circle" color={palette.secondaryText} size={20} />
        </View>
        {['Chengdu, China', 'Tianfu Airport', 'Panda Research Base'].map((place, index) => (
          <Pressable key={place} style={styles.row} onPress={() => router.back()}>
            <Text style={styles.place}>{place}</Text>
            <Text style={styles.day}>Day {Math.min(index + 1, 2)}</Text>
          </Pressable>
        ))}
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.sm },
  done: { color: palette.accentStrong, fontWeight: '600', fontSize: Typography.fontSize.md },
  search: { height: 42, borderRadius: 10, backgroundColor: palette.card, flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.sm, alignItems: 'center', marginBottom: Spacing.lg },
  placeholder: { flex: 1, color: palette.text, fontSize: Typography.fontSize.md },
  row: { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: palette.divider, paddingVertical: Spacing.md },
  place: { color: palette.text, fontSize: Typography.fontSize.md },
  day: { color: palette.secondaryText, fontSize: Typography.fontSize.sm, marginTop: 3 },
});
