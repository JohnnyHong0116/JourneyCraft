import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader } from '@/components/layout/AppScreen';
import { SettingsRow } from '../../../features/settings/SettingsRow';
import { Spacing, Typography } from '@/theme/designSystem';

export default function HelpCenterScreen() {
  return (
    <AppScreen mode="dark">
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Help Center" mode="dark" />
        <SettingsRow label="FAQs" icon="help-circle-outline" description="We have already answered most of your questions." onPress={() => router.push('/settings/help/faq')} />
        <SettingsRow label="Guides & Tutorials" icon="chatbubble-ellipses-outline" description="We'll guide you through the app." onPress={() => router.push('/settings/help/tutorial')} />
        <SettingsRow label="Support" icon="call-outline" description="Available anytime from 10:30 AM - 1:30 PM PST" onPress={() => router.push('/settings/help/support')} />
        <Text style={styles.help}>Still need help?{'\n'}Then email us at <Text style={styles.link}>journeycraft@gmail.com</Text></Text>
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.lg, paddingTop: Spacing.sm },
  help: { textAlign: 'center', color: AppPalette.dark.text, fontSize: Typography.fontSize.sm, lineHeight: 28, marginTop: Spacing.md, fontWeight: '600' },
  link: { color: AppPalette.dark.accent, textDecorationLine: 'underline' },
});
