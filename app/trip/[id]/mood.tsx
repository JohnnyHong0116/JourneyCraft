import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { moods } from '@/data/mockApp';
import { Spacing, Typography } from '@/theme/designSystem';

const emoji = ['😄', '🙂', '😐', '☹', '😣'];

export default function MoodPickerScreen() {
  return (
    <AppScreen mode="dark">
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Choose Emotion" mode="dark" />
        <SurfaceCard mode="dark" style={styles.card}>
          <Text style={styles.title}>How did this moment feel?</Text>
          <View style={styles.options}>
            {moods.map((mood, index) => (
              <Pressable key={mood.label} onPress={() => router.back()} style={styles.option}>
                <Text style={styles.emoji}>{emoji[index]}</Text>
                <Text style={styles.label}>{mood.label}</Text>
              </Pressable>
            ))}
          </View>
        </SurfaceCard>
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.sm },
  card: { marginTop: Spacing.xl, gap: Spacing.xl },
  title: { color: AppPalette.dark.text, textAlign: 'center', fontWeight: '700', fontSize: Typography.fontSize.lg },
  options: { gap: Spacing.md },
  option: { minHeight: 55, flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: AppPalette.dark.divider },
  emoji: { fontSize: 30 },
  label: { color: AppPalette.dark.text, fontSize: Typography.fontSize.md, fontWeight: '600' },
});
