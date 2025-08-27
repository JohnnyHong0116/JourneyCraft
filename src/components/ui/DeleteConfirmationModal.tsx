import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/theme/designSystem';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  onDismiss,
  onConfirm,
  title = 'Alarm',
  message = 'Are you sure to delete this entry?',
}) => {
  const handleCancel = () => {
    onDismiss();
  };

  const handleDelete = () => {
    onConfirm();
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Dialog details */}
          <View style={styles.dialogDetails}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{message}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    width: 270,
    ...Shadows.large,
    elevation: 8,
  },
  dialogDetails: {
    padding: Spacing.lg,
    gap: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
  },
  title: {
    fontSize: Typography.fontSize.md,
    fontWeight: '590',
    color: Colors.textPrimary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: -0.4,
  },
  description: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '510',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.08,
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 44,
  },
  cancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0, 0, 0, 0.15)',
  },
  cancelText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '400',
    color: Colors.navbarSelected, // Green color for cancel
    textTransform: 'uppercase',
    letterSpacing: -0.4,
  },
  deleteText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '510',
    color: '#C1221B', // Red color for delete
    textTransform: 'uppercase',
    letterSpacing: -0.4,
  },
});
