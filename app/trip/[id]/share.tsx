import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { mockTrips } from '@/data/mockApp';
import { useAppState } from '@/state/AppStateContext';
import { SemanticIcon } from '@/components/Icon';
import { Spacing, Typography } from '@/theme/designSystem';
import { getTripById } from '../../../features/trip/tripDetailModel';

export default function ShareTripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const trip = getTripById(mockTrips, id);

  return (
    <AppScreen>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Share Memory" />
        <SurfaceCard style={styles.shareCard}>
          <SemanticIcon name="paper-plane-outline" size={36} color={palette.accentStrong} />
          <Text style={styles.title}>{trip?.title ?? 'Memory unavailable'}</Text>
          <Text style={styles.caption}>Share your journal, photos and highlights with friends.</Text>
          {['Copy Link', 'Share as Story', 'Invite Collaborators'].map((action) => (
            <Pressable
              key={action}
              style={styles.row}
              onPress={() => action === 'Invite Collaborators' && trip && router.push(`/trip/${trip.id}/people` as any)}
            >
              <Text style={styles.rowText}>{action}</Text>
              <SemanticIcon name="chevron-forward" size={20} color={palette.text} />
            </Pressable>
          ))}
        </SurfaceCard>
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.sm },
  shareCard: { marginTop: Spacing.xl, alignItems: 'center', gap: Spacing.md },
  title: { color: palette.text, fontSize: Typography.fontSize.xl, fontWeight: '700' },
  caption: { color: palette.secondaryText, fontSize: Typography.fontSize.sm, textAlign: 'center', lineHeight: 21, marginBottom: Spacing.md },
  row: { width: '100%', minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: StyleSheet.hairlineWidth, borderColor: palette.divider },
  rowText: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '600' },
});
