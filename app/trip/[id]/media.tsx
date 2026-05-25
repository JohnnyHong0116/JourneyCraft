import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader } from '@/components/layout/AppScreen';
import { galleryImages } from '@/data/mockApp';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';

export default function TripMediaScreen() {
  const { mode } = useAppState();
  const styles = createStyles(AppPalette[mode]);
  return (
    <AppScreen scroll>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Trip Photos" />
        <Text style={styles.subtitle}>Trip to Chengdu • 3 photos</Text>
        <Image source={{ uri: galleryImages[3] }} style={styles.hero} />
        <View style={styles.row}>
          {galleryImages.slice(0, 3).map((image) => <Image key={image} source={{ uri: image }} style={styles.thumbnail} />)}
        </View>
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.sm, gap: Spacing.md },
  subtitle: { color: palette.secondaryText, fontSize: Typography.fontSize.sm },
  hero: { width: '100%', aspectRatio: 0.88, borderRadius: 16 },
  row: { flexDirection: 'row', gap: Spacing.sm },
  thumbnail: { flex: 1, height: 105, borderRadius: 12 },
});
