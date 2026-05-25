import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';

export default function TripLocationScreen() {
  return (
    <AppScreen mode="dark">
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Locations" mode="dark" right={<Pressable onPress={() => router.back()}><Text style={styles.done}>Cancel</Text></Pressable>} />
        <View style={styles.search}>
          <Ionicons name="search" color={AppPalette.dark.text} size={21} />
          <Text style={styles.placeholder}>Search</Text>
          <Ionicons name="close-circle" color={AppPalette.dark.secondaryText} size={20} />
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

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.sm },
  done: { color: AppPalette.dark.accentStrong, fontWeight: '600', fontSize: Typography.fontSize.md },
  search: { height: 42, borderRadius: 10, backgroundColor: AppPalette.dark.card, flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.sm, alignItems: 'center', marginBottom: Spacing.lg },
  placeholder: { flex: 1, color: AppPalette.dark.text, fontSize: Typography.fontSize.md },
  row: { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: AppPalette.dark.divider, paddingVertical: Spacing.md },
  place: { color: AppPalette.dark.text, fontSize: Typography.fontSize.md },
  day: { color: AppPalette.dark.secondaryText, fontSize: Typography.fontSize.sm, marginTop: 3 },
});
