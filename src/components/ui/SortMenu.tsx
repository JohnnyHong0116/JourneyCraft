import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppPalette } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';
import { MaterialPopover, OverlayActionRow } from './OverlaySurface';

interface SortMenuProps {
  visible: boolean;
  onDismiss: () => void;
  anchor: any;
  sortBy: 'edited' | 'created';
  order: 'asc' | 'desc';
  onSortByChange: (sortBy: 'edited' | 'created') => void;
  onOrderChange: (order: 'asc' | 'desc') => void;
}

export const SortMenu: React.FC<SortMenuProps> = ({
  visible,
  onDismiss,
  anchor,
  sortBy,
  order,
  onSortByChange,
  onOrderChange,
}) => {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);

  const handleSortByChange = (nextSort: 'edited' | 'created') => {
    onSortByChange(nextSort);
    onDismiss();
  };

  const handleOrderChange = (nextOrder: 'asc' | 'desc') => {
    onOrderChange(nextOrder);
    onDismiss();
  };

  return (
    <MaterialPopover visible={visible} onDismiss={onDismiss} anchor={anchor} estimatedHeight={292}>
      <Text style={styles.heading}>Sort trips</Text>
      <Text style={styles.groupLabel}>Date</Text>
      <OverlayActionRow
        label="Date edited"
        selected={sortBy === 'edited'}
        onPress={() => handleSortByChange('edited')}
      />
      <OverlayActionRow
        label="Date created"
        selected={sortBy === 'created'}
        onPress={() => handleSortByChange('created')}
      />
      <View style={styles.groupDivider} />
      <Text style={styles.groupLabel}>Order</Text>
      <OverlayActionRow
        label="Newest first"
        selected={order === 'desc'}
        onPress={() => handleOrderChange('desc')}
      />
      <OverlayActionRow
        label="Oldest first"
        selected={order === 'asc'}
        onPress={() => handleOrderChange('asc')}
      />
    </MaterialPopover>
  );
};

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  heading: {
    color: palette.text,
    fontSize: Typography.fontSize.md,
    lineHeight: 22,
    fontWeight: '700',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  groupLabel: {
    color: palette.secondaryText,
    fontSize: Typography.fontSize.xs,
    lineHeight: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
  },
  groupDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.divider,
    marginVertical: Spacing.xs,
    marginHorizontal: Spacing.md,
  },
});

export default SortMenu;
