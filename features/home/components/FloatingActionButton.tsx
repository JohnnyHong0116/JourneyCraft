import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { AddIcon } from '@/components/Icon';
import { Colors, Spacing, BorderRadius, Shadows } from '@/theme/designSystem';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.button}>
        <AddIcon size={30} style={{ tintColor: Colors.white }} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100, // 避免被底部导航栏遮挡
    right: Spacing.lg,
    zIndex: 1000,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.addButton,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
});
