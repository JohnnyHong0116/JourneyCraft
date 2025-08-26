import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/theme/designSystem';

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
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const { width: screenWidth } = Dimensions.get('window');

  useEffect(() => {
    if (visible && anchor) {
      // 计算菜单位置，基于anchor元素
      anchor.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        const yOffset = Platform.OS === 'android' ? -30 : 8; // Android上更贴近图标，甚至重叠一点
        setMenuPosition({
          x: pageX + width - 240, // 右对齐，菜单宽度240
          y: pageY + height + yOffset, // 在按钮下方，Android更贴近
        });
      });
    }
  }, [visible, anchor]);

  const handleDismiss = () => {
    onDismiss();
  };

  const handleSortByChange = (newSortBy: 'edited' | 'created') => {
    onSortByChange(newSortBy);
    handleDismiss();
  };

  const handleOrderChange = (newOrder: 'asc' | 'desc') => {
    onOrderChange(newOrder);
    handleDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleDismiss}
      >
        <View style={[styles.menuContent, { left: menuPosition.x, top: menuPosition.y }]}>
                {/* Sort By Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sort By</Text>
        <View style={styles.itemDivider} />
        
        <TouchableOpacity
          style={[styles.menuItem, styles.tallerMenuItem]}
          onPress={() => handleSortByChange('edited')}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Date Edited</Text>
            <View style={styles.iconPlaceholder}>
              {sortBy === 'edited' && (
                <Ionicons name="checkmark" size={24} color={Colors.addButton} />
              )}
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.itemDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleSortByChange('created')}
        >
          <View style={styles.menuItemContent}>
            <Text style={[styles.menuItemText, styles.dateCreatedText]}>Date Created (Default)</Text>
            <View style={styles.iconPlaceholder}>
              {sortBy === 'created' && (
                <Ionicons name="checkmark" size={24} color={Colors.addButton} />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Order Section */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.menuItem, styles.ascendingMenuItem]}
          onPress={() => handleOrderChange('asc')}
        >
          <View style={styles.menuItemContent}>
            <Text style={[styles.menuItemText, styles.ascendingText]}>Ascending</Text>
            <View style={styles.iconPlaceholder}>
              {order === 'asc' && (
                <Ionicons name="checkmark" size={24} color={Colors.addButton} />
              )}
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.itemDivider} />

        <TouchableOpacity
          style={[styles.menuItem, styles.tallerMenuItem]}
          onPress={() => handleOrderChange('desc')}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Descending (Default)</Text>
            <View style={styles.iconPlaceholder}>
              {order === 'desc' && (
                <Ionicons name="checkmark" size={24} color={Colors.addButton} />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuContent: {
    position: 'absolute',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
    elevation: 8,
    minWidth: 240,
    maxWidth: 240,
  },
  section: {
    paddingVertical: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    minHeight: 38,
    justifyContent: 'center',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  menuItemText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '500',
    color: Colors.textPrimary,
    flex: 1,
  },
  divider: {
    backgroundColor: Colors.calendarGrid,
    marginVertical: Spacing.xs,
    height: 4,
  },
  itemDivider: {
    backgroundColor: Colors.calendarGrid,
    height: 1,
    marginHorizontal: Spacing.xs,
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tallerMenuItem: {
    minHeight: 50,
  },
  dateCreatedText: {
    marginTop: 6,
  },
  ascendingText: {
    marginTop: -6,
  },
  ascendingMenuItem: {
    minHeight: 42,
  },
});

export default SortMenu;
