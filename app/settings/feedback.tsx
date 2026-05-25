import React, { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { AppPalette, AppScreen, ContentContainer, FormField, PrimaryButton, ScreenHeader } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';

export default function FeedbackScreen() {
  const [message, setMessage] = useState('');
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <AppScreen keyboardSafe>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Send Feedback" />
        <Text style={styles.description}>Tell us what could make JourneyCraft better.</Text>
        <FormField label="Subject" icon="chatbubble-outline" placeholder="Feedback subject" />
        <Text style={styles.label}>Message</Text>
        <TextInput
          multiline
          value={message}
          onChangeText={setMessage}
          placeholder="Write your feedback..."
          placeholderTextColor={palette.secondaryText}
          style={styles.message}
        />
        <PrimaryButton title="Submit Feedback" icon="send-outline" />
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.sm, gap: Spacing.md },
  description: { color: palette.secondaryText, fontSize: Typography.fontSize.sm },
  label: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '700' },
  message: { minHeight: 160, color: palette.text, backgroundColor: palette.card, borderRadius: 15, padding: Spacing.lg, textAlignVertical: 'top', fontSize: Typography.fontSize.md },
});
