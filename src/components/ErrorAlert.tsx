import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/designSystem';

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
};

const ErrorAlert: React.FC<Props> = ({ visible, title = 'Invalid Email', message = 'Please enter a valid email address.', onClose }) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="alert-circle" size={36} color={Colors.error} style={{ marginBottom: Spacing.sm }} />
          <Text style={styles.title}>{title}</Text>
          {!!message && <Text style={styles.message}>{message}</Text>}
          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.9}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  card: { width: 320, backgroundColor: Colors.white, borderRadius: BorderRadius.xl, paddingVertical: Spacing.xl, paddingHorizontal: Spacing.xl, alignItems: 'center', ...Shadows.small, borderWidth: 1, borderColor: Colors.errorBorder },
  title: { fontSize: Typography.fontSize.lg, fontWeight: 'bold', color: Colors.black, textAlign: 'center', marginBottom: Spacing.sm },
  message: { fontSize: Typography.fontSize.md, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.lg },
  button: { backgroundColor: Colors.addButton, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xxl, borderRadius: BorderRadius.round },
  buttonText: { color: Colors.white, fontSize: Typography.fontSize.md, fontWeight: 'bold' },
});

export default ErrorAlert;


