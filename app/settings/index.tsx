import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader } from '@/components/layout/AppScreen';
import { settingsSections } from '@/data/mockApp';
import { SettingsRow } from '../../features/settings/SettingsRow';
import { Spacing, Typography } from '@/theme/designSystem';
import { useAppState } from '@/state/AppStateContext';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const { logout } = useAppState();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/sign-in');
  };
  return (
    <AppScreen mode="dark" scroll bottomInset={Spacing.xxl}>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Settings" mode="dark" />
        {settingsSections[0].items.map((item) => (
          <SettingsRow key={item.label} label={item.label} icon={item.icon} detail={'value' in item ? item.value : undefined} onPress={() => router.push(item.route as any)} />
        ))}
        <SettingsRow label="Dark Mode" icon="moon-outline" toggle enabled={darkMode} onPress={() => setDarkMode((current) => !current)} />
        <SettingsRow label="Submit Feedback" icon="chatbubble-ellipses-outline" onPress={() => router.push('/settings/feedback')} />
        <Text style={styles.section}>Security & Privacy</Text>
        {settingsSections[1].items.map((item) => (
          <SettingsRow key={item.label} label={item.label} icon={item.icon} onPress={() => router.push(item.route as any)} />
        ))}
        <Text style={styles.section}>Danger Zone</Text>
        <SettingsRow label="Close Account" icon="trash-outline" danger />
        <Text style={styles.section}>Log Out</Text>
        <SettingsRow label="Log Out" icon="log-out-outline" onPress={handleLogout} />
        <Text style={styles.footer}>JourneyCraft v1{'\n'}All Rights Reserved 2025</Text>
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.sm, gap: Spacing.md },
  section: { color: AppPalette.dark.text, fontWeight: '700', fontSize: Typography.fontSize.md, marginTop: Spacing.lg },
  footer: { color: AppPalette.dark.secondaryText, textAlign: 'center', lineHeight: 26, marginVertical: Spacing.xl },
});
