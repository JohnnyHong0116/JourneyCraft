import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader } from '@/components/layout/AppScreen';
import { settingsSections } from '@/data/mockApp';
import { SettingsRow } from '../../features/settings/SettingsRow';
import { Spacing, Typography } from '@/theme/designSystem';
import { useAppState } from '@/state/AppStateContext';

export default function SettingsScreen() {
  const { logout, mode, themePreference, setThemePreference } = useAppState();
  const palette = AppPalette[mode];

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/sign-in');
  };
  return (
    <AppScreen bottomInset={0}>
      <ContentContainer style={styles.header}>
        <ScreenHeader title="Settings" />
      </ContentContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ContentContainer style={styles.content}>
        {settingsSections[0].items.map((item) => (
          <SettingsRow key={item.label} label={item.label} icon={item.icon} detail={'value' in item ? item.value : undefined} onPress={() => router.push(item.route as any)} />
        ))}
        <SettingsRow label="Dark Mode" icon="moon-outline" toggle enabled={mode === 'dark'} onPress={() => setThemePreference(mode === 'dark' ? 'light' : 'dark')} />
        <SettingsRow label="Use System Appearance" icon="phone-portrait-outline" detail={themePreference === 'system' ? 'On' : 'Off'} onPress={() => setThemePreference('system')} />
        <SettingsRow label="Submit Feedback" icon="chatbubble-ellipses-outline" onPress={() => router.push('/settings/feedback')} />
        <Text style={[styles.section, { color: palette.text }]}>Security & Privacy</Text>
        {settingsSections[1].items.map((item) => (
          <SettingsRow key={item.label} label={item.label} icon={item.icon} onPress={() => router.push(item.route as any)} />
        ))}
        <Text style={[styles.section, { color: palette.text }]}>Danger Zone</Text>
        <SettingsRow label="Close Account" icon="trash-outline" danger />
        <Text style={[styles.section, { color: palette.text }]}>Log Out</Text>
        <SettingsRow label="Log Out" icon="log-out-outline" onPress={handleLogout} />
        <Text style={[styles.footer, { color: palette.secondaryText }]}>JourneyCraft v1{'\n'}All Rights Reserved 2025</Text>
        </ContentContainer>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: Spacing.sm },
  scroll: { paddingBottom: Spacing.xxl },
  content: { paddingTop: Spacing.sm, gap: Spacing.md },
  section: { fontWeight: '700', fontSize: Typography.fontSize.md, marginTop: Spacing.lg },
  footer: { textAlign: 'center', lineHeight: 26, marginVertical: Spacing.xl },
});
