import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/theme/designSystem';
import { Icon } from '@/components/Icon';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

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
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { width: screenWidth } = Dimensions.get('window');

  useEffect(() => {
    if (visible && anchor) {
      // 计算菜单位置，基于anchor元素
      anchor.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        const yOffset = Platform.OS === 'android' ? -30 : 8; // Android上更贴近图标
        const menuHeight = 200; // 估算菜单高度
        const screenHeight = Dimensions.get('window').height;
        
        // 检查是否有足够空间在下方显示
        const spaceBelow = screenHeight - (pageY + height + yOffset + menuHeight);
        const spaceAbove = pageY + yOffset - menuHeight;
        
        let yPosition;
        if (spaceBelow >= 0) {
          // 有足够空间在下方显示
          yPosition = pageY + height + yOffset;
        } else if (spaceAbove >= 0) {
          // 没有足够空间在下方，但有空间在上方显示
          yPosition = pageY - menuHeight + yOffset;
        } else {
          // 上下都没有足够空间，优先显示在上方
          yPosition = Math.max(10, pageY - menuHeight + yOffset);
        }
        
        setMenuPosition({
          x: pageX + width - 250, // 右对齐，菜单宽度250
          y: yPosition,
        });
      });
    }
  }, [visible, anchor]);

  const handleDismiss = () => {
    onDismiss();
  };

  const handlePin = () => {
    onPin();
    handleDismiss();
  };

  const handleSave = () => {
    onSave();
    handleDismiss();
  };

  const handleLock = () => {
    onLock();
    handleDismiss();
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setDeleteModalVisible(false);
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
          {/* Pin */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handlePin}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>{isPinned ? 'Unpin' : 'Pin'}</Text>
              <View style={styles.iconPlaceholder}>
                <Icon name={isPinned ? "unpin" : "pin"} size={20} color={isPinned ? Colors.navbarUnselected : Colors.addButton} />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.itemDivider} />

          {/* Save */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleSave}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>{isSaved ? 'Unsave' : 'Save'}</Text>
              <View style={styles.iconPlaceholder}>
                <Icon name="cardsave" size={20} color={isSaved ? Colors.navbarUnselected : Colors.addButton} />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.itemDivider} />

          {/* Lock */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLock}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>{isLocked ? 'Unlock' : 'Lock'}</Text>
              <View style={styles.iconPlaceholder}>
                <Icon name="cardlock" size={20} color={isLocked ? Colors.navbarUnselected : Colors.addButton} />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.thickDivider} />

          {/* Delete */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleDelete}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.deleteText}>Delete</Text>
              <View style={styles.iconPlaceholder}>
                <Ionicons name="trash-outline" size={20} color="#C1221B" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onDismiss={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Alarm"
        message="Are you sure to delete this entry?"
      />
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
    minWidth: 250,
    maxWidth: 250,
  },
  menuItem: {
    minHeight: 44,
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
    fontWeight: '400',
    color: Colors.textPrimary,
    flex: 1,
  },
  deleteText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '400',
    color: '#C1221B', // 红色，与Figma设计一致
    flex: 1,
  },
  itemDivider: {
    backgroundColor: Colors.calendarGrid,
    height: 0.5,
    marginHorizontal: 0,
  },
  thickDivider: {
    backgroundColor: Colors.calendarGrid,
    height: 2,
    marginHorizontal: 0,
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
