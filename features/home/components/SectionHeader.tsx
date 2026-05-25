import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { BorderRadius, Typography, Spacing } from '@/theme/designSystem';
import { AppPalette } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { getSectionHeaderMaterial } from './homeTimelineModel';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  const { mode } = useAppState();
  const material = getSectionHeaderMaterial(mode);
  const styles = createStyles(AppPalette[mode]);
  return (
    <View style={styles.container}>
      <BlurView
        tint={material.tint}
        intensity={material.intensity}
        style={[styles.material, { borderColor: material.borderColor }]}
      >
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: material.washColor }]}
        />
        <Text style={styles.title}>{title}</Text>
      </BlurView>
    </View>
  );
};

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  material: {
    alignSelf: 'flex-start',
    minHeight: 38,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  title: {
    fontSize: Typography.fontSize.lg,
    lineHeight: 23,
    fontWeight: '700',
    color: palette.text,
    textTransform: 'capitalize',
  },
});
