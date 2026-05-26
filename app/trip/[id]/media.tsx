import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Icon } from '@/components/Icon';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { mockTrips } from '@/data/mockApp';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';
import { getTripById } from '../../../features/trip/tripDetailModel';

export default function TripMediaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const trip = getTripById(mockTrips, id);
  const photos = trip?.photos ?? [];

  return (
    <AppScreen scroll>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Photos" />
        <Text style={styles.subtitle}>
          {trip ? `${trip.title} | ${photos.length} photo${photos.length === 1 ? '' : 's'}` : 'Memory unavailable'}
        </Text>
        {photos.length ? (
          <>
            <Image source={{ uri: photos[0] }} style={styles.hero} />
            {photos.length > 1 ? (
              <View style={styles.row}>
                {photos.slice(1).map((image) => <Image key={image} source={{ uri: image }} style={styles.thumbnail} />)}
              </View>
            ) : null}
          </>
        ) : (
          <SurfaceCard style={styles.empty}>
            <Icon name="cardimage" size={30} color={palette.secondaryText} />
            <Text style={styles.emptyTitle}>No photos yet</Text>
            <Text style={styles.emptyCopy}>Photos saved to this memory will appear here.</Text>
          </SurfaceCard>
        )}
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.sm, gap: Spacing.md },
  subtitle: { color: palette.secondaryText, fontSize: Typography.fontSize.sm },
  hero: { width: '100%', aspectRatio: 0.94, borderRadius: 16 },
  row: { flexDirection: 'row', gap: Spacing.sm },
  thumbnail: { flex: 1, height: 105, borderRadius: 12 },
  empty: { minHeight: 180, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  emptyTitle: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '700' },
  emptyCopy: { color: palette.secondaryText, fontSize: Typography.fontSize.sm, textAlign: 'center' },
});
