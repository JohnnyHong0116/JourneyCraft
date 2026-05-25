import React, { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { AppPalette, AppScreen, ContentContainer, FormField, PrimaryButton, ScreenHeader } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';

export default function FeedbackScreen() {
  const [message, setMessage] = useState('');
  return (
    <AppScreen mode="dark" keyboardSafe>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Send Feedback" mode="dark" />
        <Text style={styles.description}>Tell us what could make JourneyCraft better.</Text>
        <FormField mode="dark" label="Subject" icon="chatbubble-outline" placeholder="Feedback subject" />
        <Text style={styles.label}>Message</Text>
        <TextInput
          multiline
          value={message}
          onChangeText={setMessage}
          placeholder="Write your feedback..."
          placeholderTextColor={AppPalette.dark.secondaryText}
          style={styles.message}
        />
        <PrimaryButton mode="dark" title="Submit Feedback" icon="send-outline" />
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.sm, gap: Spacing.md },
  description: { color: AppPalette.dark.secondaryText, fontSize: Typography.fontSize.sm },
  label: { color: AppPalette.dark.text, fontSize: Typography.fontSize.md, fontWeight: '700' },
  message: { minHeight: 160, color: AppPalette.dark.text, backgroundColor: AppPalette.dark.card, borderRadius: 15, padding: Spacing.lg, textAlignVertical: 'top', fontSize: Typography.fontSize.md },
});
