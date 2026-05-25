import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';

export default function ReceiptScreen() {
  const { mode } = useAppState();
  const styles = createStyles(AppPalette[mode]);
  return (
    <AppScreen scroll>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Receipt" />
        <SurfaceCard style={styles.card}>
          <Text style={styles.title}>Hotel to Panda</Text>
          <Text style={styles.meta}>July 24, 2025 • Transportation</Text>
          <Image source={{ uri: 'https://picsum.photos/id/1060/700/1000' }} style={styles.receipt} />
          <Text style={styles.total}>Total  ¥36.00</Text>
        </SurfaceCard>
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.sm },
  card: { gap: Spacing.sm },
  title: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  meta: { color: palette.secondaryText, fontSize: Typography.fontSize.sm },
  receipt: { width: '100%', height: 430, borderRadius: 14, marginVertical: Spacing.md },
  total: { color: palette.text, textAlign: 'right', fontSize: Typography.fontSize.xl, fontWeight: '700' },
});
