import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { AppPalette, AppScreen, ContentContainer, PrimaryButton, ScreenHeader } from '@/components/layout/AppScreen';
import { SettingsRow } from '../../features/settings/SettingsRow';
import { Spacing, Typography } from '@/theme/designSystem';

export default function NotificationScreen() {
  const [states, setStates] = useState([true, true, false]);
  const rows = [
    ['Trip reminders', 'Alerts before planned activities'],
    ['Expense updates', 'Notifications when expenses are shared'],
    ['Memory highlights', 'Weekly recap notifications'],
  ];
  return (
    <AppScreen mode="dark">
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Notifications" mode="dark" />
        <Text style={styles.intro}>Choose the alerts you would like to receive.</Text>
        {rows.map(([label, description], index) => (
          <SettingsRow
            key={label}
            label={label}
            description={description}
            icon="notifications-outline"
            toggle
            enabled={states[index]}
            onPress={() => setStates((current) => current.map((value, i) => i === index ? !value : value))}
          />
        ))}
        <PrimaryButton mode="dark" title="Save Settings" icon="checkmark" />
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.sm, gap: Spacing.md },
  intro: { color: AppPalette.dark.secondaryText, fontSize: Typography.fontSize.sm, lineHeight: 21, marginBottom: Spacing.sm },
});
