import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppPalette, AppScreen, ContentContainer, PrimaryButton, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';

const languages = ['English (EN)', '简体中文 (ZH)', 'Español (ES)', 'Français (FR)', '日本語 (JA)'];

export default function LanguageScreen() {
  const [selected, setSelected] = useState(languages[0]);
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <AppScreen>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Language" />
        <SurfaceCard>
          {languages.map((language) => (
            <Pressable key={language} onPress={() => setSelected(language)} style={styles.row}>
              <Text style={styles.label}>{language}</Text>
              <Ionicons name={language === selected ? 'radio-button-on' : 'radio-button-off'} size={22} color={palette.accent} />
            </Pressable>
          ))}
        </SurfaceCard>
        <PrimaryButton title="Save Settings" icon="checkmark" />
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.sm, gap: Spacing.lg },
  row: { height: 57, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: palette.divider },
  label: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '600' },
});
