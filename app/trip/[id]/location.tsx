import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Icon } from '@/components/Icon';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { mockTrips } from '@/data/mockApp';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';
import { getTripById } from '../../../features/trip/tripDetailModel';

export default function TripLocationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const trip = getTripById(mockTrips, id);

  return (
    <AppScreen>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Location" right={<Pressable onPress={() => router.back()}><Text style={styles.done}>Done</Text></Pressable>} />
        {trip ? (
          <>
            <Text style={styles.heading}>{trip.title}</Text>
            <SurfaceCard style={styles.locationCard}>
              <View style={styles.marker}>
                <Icon name="location-unselected" size={24} color={palette.accentStrong} />
              </View>
              <View style={styles.locationCopy}>
                <Text style={styles.locationLabel}>Saved location</Text>
                <Text style={styles.place}>{trip.location}</Text>
              </View>
            </SurfaceCard>
          </>
        ) : <Text style={styles.muted}>Memory unavailable.</Text>}
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.sm, gap: Spacing.lg },
  done: { color: palette.accentStrong, fontWeight: '700', fontSize: Typography.fontSize.md },
  heading: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  locationCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  marker: { width: 52, height: 52, borderRadius: 26, backgroundColor: palette.cardMuted, alignItems: 'center', justifyContent: 'center' },
  locationCopy: { flex: 1, gap: 4 },
  locationLabel: { color: palette.secondaryText, fontSize: Typography.fontSize.xs },
  place: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '700' },
  muted: { color: palette.secondaryText, fontSize: Typography.fontSize.md },
});
