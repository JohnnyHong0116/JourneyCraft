import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { AppScreen, ContentContainer, PrimaryButton, ScreenHeader } from '@/components/layout/AppScreen';
import { SettingsRow } from '../../features/settings/SettingsRow';
import { Spacing } from '@/theme/designSystem';

export default function SecurityScreen() {
  const [faceId, setFaceId] = useState(true);
  return (
    <AppScreen mode="dark">
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Security" mode="dark" />
        <SettingsRow label="2FA" icon="shield-checkmark-outline" description="2FA is an identity and access management security method." />
        <SettingsRow label="Face ID" icon="scan-outline" description="Face ID lets you securely unlock your device." toggle enabled={faceId} onPress={() => setFaceId((state) => !state)} />
        <SettingsRow label="View Logged-in Devices" icon="phone-portrait-outline" />
        <PrimaryButton mode="dark" title="Save Settings" icon="checkmark" />
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({ content: { paddingTop: Spacing.sm, gap: Spacing.md } });
