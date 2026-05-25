import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { AppPalette } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { Spacing } from '@/theme/designSystem';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { MaterialPopover, OverlayActionRow } from './OverlaySurface';

interface CardMenuProps {
  visible: boolean;
  onDismiss: () => void;
  anchor: any;
  onPin: () => void;
  onSave: () => void;
  onLock: () => void;
  onDelete: () => void;
  isPinned?: boolean;
  isSaved?: boolean;
  isLocked?: boolean;
}

export const CardMenu: React.FC<CardMenuProps> = ({
  visible,
  onDismiss,
  anchor,
  onPin,
  onSave,
  onLock,
  onDelete,
  isPinned = false,
  isSaved = false,
  isLocked = false,
}) => {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleAction = (action: () => void) => {
    action();
    onDismiss();
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    onDismiss();
  };

  const handleConfirmDelete = () => {
    onDelete();
    setDeleteModalVisible(false);
    onDismiss();
  };

  return (
    <>
      <MaterialPopover
        visible={visible && !deleteModalVisible}
        onDismiss={onDismiss}
        anchor={anchor}
        estimatedHeight={238}
      >
        <OverlayActionRow
          label={isPinned ? 'Unpin' : 'Pin'}
          selected={isPinned}
          leading={<Icon name={isPinned ? 'unpin' : 'pin'} size={19} color={palette.text} />}
          onPress={() => handleAction(onPin)}
        />
        <OverlayActionRow
          label={isSaved ? 'Unsave' : 'Save'}
          selected={isSaved}
          leading={<Icon name="cardsave" size={19} color={palette.text} />}
          onPress={() => handleAction(onSave)}
        />
        <OverlayActionRow
          label={isLocked ? 'Unlock' : 'Lock'}
          selected={isLocked}
          leading={<Icon name="cardlock" size={19} color={palette.text} />}
          onPress={() => handleAction(onLock)}
        />
        <View style={styles.divider} />
        <OverlayActionRow
          label="Delete"
          danger
          leading={<Icon name="trash" size={19} color="#ed5b55" />}
          onPress={handleDelete}
        />
      </MaterialPopover>

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onDismiss={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.divider,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
  },
});
