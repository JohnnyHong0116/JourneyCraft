import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';

export default function ReceiptScreen() {
  return (
    <AppScreen mode="dark" scroll>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Receipt" mode="dark" />
        <SurfaceCard mode="dark" style={styles.card}>
          <Text style={styles.title}>Hotel to Panda</Text>
          <Text style={styles.meta}>July 24, 2025 • Transportation</Text>
          <Image source={{ uri: 'https://picsum.photos/id/1060/700/1000' }} style={styles.receipt} />
          <Text style={styles.total}>Total  ¥36.00</Text>
        </SurfaceCard>
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.sm },
  card: { gap: Spacing.sm },
  title: { color: AppPalette.dark.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  meta: { color: AppPalette.dark.secondaryText, fontSize: Typography.fontSize.sm },
  receipt: { width: '100%', height: 430, borderRadius: 14, marginVertical: Spacing.md },
  total: { color: AppPalette.dark.text, textAlign: 'right', fontSize: Typography.fontSize.xl, fontWeight: '700' },
});
