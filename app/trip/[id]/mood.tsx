import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Icon } from '@/components/Icon';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { EMOTIONS } from '@/constants/emotions';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';

export default function MoodPickerScreen() {
  const { mode } = useAppState();
  const styles = createStyles(AppPalette[mode]);
  return (
    <AppScreen>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Choose Emotion" />
        <SurfaceCard style={styles.card}>
          <Text style={styles.title}>How did this moment feel?</Text>
          <View style={styles.options}>
            {EMOTIONS.map((emotion) => (
              <Pressable key={emotion.id} onPress={() => router.back()} style={styles.option}>
                <Icon name={emotion.icon} size={30} />
                <Text style={styles.label}>{emotion.label}</Text>
              </Pressable>
            ))}
          </View>
        </SurfaceCard>
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.sm },
  card: { marginTop: Spacing.xl, gap: Spacing.xl },
  title: { color: palette.text, textAlign: 'center', fontWeight: '700', fontSize: Typography.fontSize.lg },
  options: { gap: Spacing.md },
  option: { minHeight: 55, flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: palette.divider },
  label: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '600' },
});
