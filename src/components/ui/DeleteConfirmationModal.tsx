import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { AppPalette } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Spacing, Typography } from '@/theme/designSystem';
import { ActionSheetModal } from './OverlaySurface';
import { useTranslation } from '@/i18n/useTranslation';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  onDismiss,
  onConfirm,
}) => {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const { t } = useTranslation();

  return (
    <ActionSheetModal visible={visible} onDismiss={onDismiss} dismissOnBackdrop={false}>
      <Text style={styles.title}>{t('menu.deleteMemoryTitle')}</Text>
      <Text style={styles.description}>{t('menu.deleteMemoryDescription')}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={t('menu.deleteMemory')} style={styles.deleteButton} onPress={onConfirm}>
        <Text style={styles.deleteText}>{t('menu.deleteMemory')}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={t('common.cancel')} style={styles.cancelButton} onPress={onDismiss}>
        <Text style={styles.cancelText}>{t('common.cancel')}</Text>
      </Pressable>
    </ActionSheetModal>
  );
};

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  title: {
    color: palette.text,
    fontSize: Typography.fontSize.xl,
    lineHeight: 27,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    color: palette.secondaryText,
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  deleteButton: {
    minHeight: 52,
    borderRadius: BorderRadius.lg,
    borderCurve: 'continuous',
    backgroundColor: '#d9463f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#ffffff',
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
  },
  cancelButton: {
    minHeight: 48,
    borderRadius: BorderRadius.lg,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: palette.text,
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
  },
});
