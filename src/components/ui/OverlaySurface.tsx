import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SemanticIcon } from '@/components/Icon';
import { AppPalette } from '@/components/layout/AppScreen';
import { BorderRadius, Spacing, Typography } from '@/theme/designSystem';
import { useAppState } from '@/state/AppStateContext';
import { getOverlayMaterial, getPopoverPosition } from './overlayModel';

interface MaterialPopoverProps {
  visible: boolean;
  onDismiss: () => void;
  anchor: any;
  width?: number;
  estimatedHeight: number;
  children: React.ReactNode;
}

export function MaterialPopover({
  visible,
  onDismiss,
  anchor,
  width = 248,
  estimatedHeight,
  children,
}: MaterialPopoverProps) {
  const { mode } = useAppState();
  const material = getOverlayMaterial(mode);
  const viewport = useWindowDimensions();
  const [position, setPosition] = useState<ReturnType<typeof getPopoverPosition> | null>(null);

  useEffect(() => {
    if (!visible) {
      setPosition(null);
      return;
    }

    if (!anchor?.measure) return;

    anchor.measure((
      _x: number,
      _y: number,
      anchorWidth: number,
      anchorHeight: number,
      anchorX: number,
      anchorY: number,
    ) => {
      setPosition(getPopoverPosition({
        anchorX,
        anchorY,
        anchorWidth,
        anchorHeight,
        panelWidth: width,
        panelHeight: estimatedHeight,
        viewportWidth: viewport.width,
        viewportHeight: viewport.height,
      }));
    });
  }, [anchor, estimatedHeight, viewport.height, viewport.width, visible, width]);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onDismiss}>
      <View style={styles.modalRoot}>
        <Animated.View
          entering={FadeIn.duration(130)}
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: material.backdropColor }]}
        />
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss menu" style={StyleSheet.absoluteFill} onPress={onDismiss} />
        {position ? (
          <Animated.View
            entering={FadeIn.duration(140)}
            style={[styles.popoverFrame, { left: position.left, top: position.top, width }]}
          >
            <BlurView
              tint={material.tint}
              intensity={82}
              style={[styles.materialSurface, { borderColor: material.borderColor }]}
            >
              <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: material.surfaceWash }]} />
              <Pressable onPress={(event) => event.stopPropagation()} style={styles.surfaceContent}>
                {children}
              </Pressable>
            </BlurView>
          </Animated.View>
        ) : null}
      </View>
    </Modal>
  );
}

interface ActionSheetModalProps {
  visible: boolean;
  onDismiss: () => void;
  dismissOnBackdrop?: boolean;
  children: React.ReactNode;
}

export function ActionSheetModal({
  visible,
  onDismiss,
  dismissOnBackdrop = true,
  children,
}: ActionSheetModalProps) {
  const { mode } = useAppState();
  const material = getOverlayMaterial(mode);
  const insets = useSafeAreaInsets();
  const startY = useRef(0);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onDismiss}>
      <View style={styles.modalRoot}>
        <Animated.View
          entering={FadeIn.duration(150)}
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: material.backdropColor }]}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss sheet"
          disabled={!dismissOnBackdrop}
          style={StyleSheet.absoluteFill}
          onPress={dismissOnBackdrop ? onDismiss : undefined}
        />
        <Animated.View
          entering={FadeInUp.duration(200)}
          style={styles.sheetFrame}
          onTouchStart={(event) => {
            startY.current = event.nativeEvent.pageY;
          }}
          onStartShouldSetResponder={() => false}
          onMoveShouldSetResponder={() => true}
          onResponderRelease={(event) => {
            if (event.nativeEvent.pageY - startY.current > 70) onDismiss();
          }}
        >
          <BlurView
            tint={material.tint}
            intensity={88}
            style={[
              styles.sheetSurface,
              {
                borderColor: material.borderColor,
                paddingBottom: Math.max(insets.bottom, Spacing.lg),
              },
            ]}
          >
            <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: material.sheetWash }]} />
            <View style={styles.grabber} />
            <View style={styles.sheetContent}>{children}</View>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
}

interface OverlayActionRowProps {
  label: string;
  onPress: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  selected?: boolean;
  danger?: boolean;
  accessibilityLabel?: string;
}

export function OverlayActionRow({
  label,
  onPress,
  leading,
  trailing,
  selected = false,
  danger = false,
  accessibilityLabel = label,
}: OverlayActionRowProps) {
  const { mode } = useAppState();
  const material = getOverlayMaterial(mode);
  const palette = AppPalette[mode];
  const color = danger ? '#ed5b55' : palette.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionRow,
        selected && { backgroundColor: material.selectedWash },
        pressed && { backgroundColor: material.selectedWash },
      ]}
    >
      {leading ? <View style={styles.rowIcon}>{leading}</View> : null}
      <Text style={[styles.actionLabel, { color }]}>{label}</Text>
      {trailing ?? (selected ? <SemanticIcon name="checkmark" size={18} color={palette.accentStrong} /> : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  popoverFrame: {
    position: 'absolute',
  },
  materialSurface: {
    borderRadius: BorderRadius.xl,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  surfaceContent: {
    padding: Spacing.sm,
  },
  sheetFrame: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheetSurface: {
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderCurve: 'continuous',
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  grabber: {
    alignSelf: 'center',
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(152, 152, 160, 0.58)',
    marginBottom: Spacing.lg,
  },
  sheetContent: {
    gap: Spacing.sm,
  },
  actionRow: {
    minHeight: 48,
    borderRadius: BorderRadius.lg,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rowIcon: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    fontWeight: '500',
  },
});
