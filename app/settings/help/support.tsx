import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppPalette, AppScreen, ContentContainer, PrimaryButton, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';

export default function SupportScreen() {
  return (
    <AppScreen mode="dark">
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Support" mode="dark" />
        <SurfaceCard mode="dark" style={styles.card}>
          <View style={styles.icon}><Ionicons name="headset-outline" size={38} color={AppPalette.dark.accent} /></View>
          <Text style={styles.title}>We are here to help</Text>
          <Text style={styles.message}>Our team is available from 10:30 AM - 1:30 PM PST. You can also email journeycraft@gmail.com.</Text>
          <PrimaryButton mode="dark" title="Contact Support" icon="mail-outline" />
        </SurfaceCard>
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.sm },
  card: { alignItems: 'center', gap: Spacing.lg, marginTop: Spacing.xl },
  icon: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#383940', alignItems: 'center', justifyContent: 'center' },
  title: { color: AppPalette.dark.text, fontSize: Typography.fontSize.xl, fontWeight: '700' },
  message: { color: AppPalette.dark.secondaryText, textAlign: 'center', lineHeight: 23, fontSize: Typography.fontSize.sm },
});
