import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppPalette, AppScreen, ContentContainer, PrimaryButton, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppLanguage } from '@/i18n/translations';
import { router } from 'expo-router';

const languages: Array<{ id: AppLanguage; label: string }> = [
  { id: 'en', label: 'English (EN)' },
  { id: 'zh', label: '简体中文 (ZH)' },
];

export default function LanguageScreen() {
  const { mode, language, setLanguage } = useAppState();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<AppLanguage>(language);
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <AppScreen>
      <ContentContainer style={styles.content}>
        <ScreenHeader title={t('settings.language')} />
        <SurfaceCard>
          {languages.map((option) => (
            <Pressable key={option.id} onPress={() => setSelected(option.id)} style={styles.row}>
              <Text style={styles.label}>{option.label}</Text>
              <Ionicons name={option.id === selected ? 'radio-button-on' : 'radio-button-off'} size={22} color={palette.accent} />
            </Pressable>
          ))}
        </SurfaceCard>
        <PrimaryButton
          title={t('settings.saveSettings')}
          icon="checkmark"
          onPress={() => {
            void setLanguage(selected).then(() => router.back());
          }}
        />
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.sm, gap: Spacing.lg },
  row: { height: 57, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: palette.divider },
  label: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '600' },
});
