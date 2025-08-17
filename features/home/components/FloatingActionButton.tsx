import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { AddIcon } from '@/components/Icon';
import { Colors, Spacing, BorderRadius, Shadows } from '@/theme/designSystem';

interface FloatingActionButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.button}>
        <AddIcon size={30} style={{ tintColor: Colors.white }} />
      </View>
    </TouchableOpacity>
  );
};

const SIZE = 72;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '50%',
    marginLeft: -SIZE / 2,
    zIndex: 1000,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: Colors.addButton,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
});
