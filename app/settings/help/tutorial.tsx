import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';

const steps = [
  ['add-circle-outline', 'Create a trip', 'Use the plus button to capture your destination and story.'],
  ['calendar-outline', 'Plan days', 'Switch to Planned and calendar view for an itinerary.'],
  ['wallet-outline', 'Track expenses', 'Group travel costs by day, category or companion.'],
];

export default function TutorialScreen() {
  return (
    <AppScreen mode="dark" scroll>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Guides & Tutorials" mode="dark" />
        {steps.map(([icon, title, message], index) => (
          <SurfaceCard mode="dark" key={title} style={styles.step}>
            <View style={styles.badge}><Text style={styles.index}>{index + 1}</Text></View>
            <Ionicons name={icon as any} size={29} color={AppPalette.dark.accent} />
            <View style={styles.body}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
            </View>
          </SurfaceCard>
        ))}
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.sm, gap: Spacing.md },
  step: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, minHeight: 104 },
  badge: { backgroundColor: '#393942', height: 27, width: 27, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  index: { color: AppPalette.dark.text, fontWeight: '700' },
  body: { flex: 1, gap: 4 },
  title: { color: AppPalette.dark.text, fontSize: Typography.fontSize.md, fontWeight: '700' },
  message: { color: AppPalette.dark.secondaryText, fontSize: Typography.fontSize.sm, lineHeight: 21 },
});
