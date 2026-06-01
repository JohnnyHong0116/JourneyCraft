import React, { useMemo, useRef } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { SemanticIcon } from '@/components/Icon';
import { AppPalette } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';

const ACTION_WIDTH = 78;

export function SwipeToDeleteRow({
  name,
  onDelete,
  palette,
}: {
  name: string;
  onDelete: () => void;
  palette: typeof AppPalette.light | typeof AppPalette.dark;
}) {
  const offset = useRef(new Animated.Value(0)).current;
  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderMove: (_, gesture) => offset.setValue(Math.max(-ACTION_WIDTH, Math.min(0, gesture.dx))),
    onPanResponderRelease: (_, gesture) => {
      Animated.spring(offset, {
        toValue: gesture.dx < -32 ? -ACTION_WIDTH : 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    },
    onPanResponderTerminate: () => {
      Animated.spring(offset, { toValue: 0, useNativeDriver: true, bounciness: 0 }).start();
    },
  }), [offset]);

  return (
    <View style={styles.shell}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${name}`} onPress={onDelete} style={styles.delete}>
        <SemanticIcon name="trash-outline" size={18} color="#ffffff" />
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.row, { backgroundColor: palette.card, transform: [{ translateX: offset }] }]}
      >
        <View style={[styles.avatar, { backgroundColor: palette.accent }]}>
          <Text style={styles.avatarText}>{name.slice(0, 1).toUpperCase()}</Text>
        </View>
        <Text style={[styles.name, { color: palette.text }]} numberOfLines={1}>{name}</Text>
        <SemanticIcon name="reorder-two-outline" size={18} color={palette.secondaryText} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { height: 54, overflow: 'hidden', borderRadius: 12 },
  delete: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH,
    backgroundColor: '#df554f',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  deleteText: { color: '#ffffff', fontSize: 10, fontWeight: '700' },
  row: {
    height: 54,
    paddingHorizontal: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#253021', fontSize: Typography.fontSize.sm, fontWeight: '700' },
  name: { flex: 1, fontSize: Typography.fontSize.sm, fontWeight: '600' },
});
