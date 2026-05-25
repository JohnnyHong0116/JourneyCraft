import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';

const recoveryOptions = [
  {
    title: 'Google Authenticator',
    value: '2FA is an identity and access management security method.',
  },
  { title: 'Email Address', value: 'jou***25@gmail.com' },
  { title: 'Phone Number', value: '+86 147*********' },
];

export default function ForgotPasswordScreen() {
  return (
    <AppScreen scroll contentContainerStyle={styles.scroll}>
      <ContentContainer>
        <ScreenHeader title="Forgot Password" />
        {recoveryOptions.map((option) => (
          <SurfaceCard key={option.title} style={styles.card}>
            <Text style={styles.title}>{option.title}</Text>
            <Text style={styles.value}>{option.value}</Text>
          </SurfaceCard>
        ))}
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: Spacing.xxl },
  card: { marginBottom: Spacing.lg, minHeight: 100, justifyContent: 'center' },
  title: { fontSize: Typography.fontSize.md, fontWeight: '700', color: AppPalette.light.text, marginBottom: Spacing.xs },
  value: { fontSize: Typography.fontSize.sm, color: AppPalette.light.secondaryText, lineHeight: 22 },
});
