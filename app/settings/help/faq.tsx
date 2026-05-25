import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';

const questions = [
  ['How do I create a new trip?', 'Tap the green plus button from the bottom navigation and start adding photos or notes.'],
  ['Can I share expenses?', 'Open a trip, choose Expenses, then People to assign shared costs.'],
  ['Where are my saved memories?', 'Use Search and choose Saved or review your profile gallery.'],
  ['Can I change notification settings?', 'Settings includes a Notifications screen with individual switches.'],
];

export default function FaqScreen() {
  return (
    <AppScreen mode="dark" scroll>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="FAQs" mode="dark" />
        {questions.map(([question, answer]) => (
          <SurfaceCard key={question} mode="dark" style={styles.card}>
            <Text style={styles.question}>{question}</Text>
            <Text style={styles.answer}>{answer}</Text>
          </SurfaceCard>
        ))}
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.sm, gap: Spacing.md },
  card: { gap: Spacing.sm },
  question: { color: AppPalette.dark.text, fontSize: Typography.fontSize.md, fontWeight: '700' },
  answer: { color: AppPalette.dark.secondaryText, lineHeight: 22, fontSize: Typography.fontSize.sm },
});
