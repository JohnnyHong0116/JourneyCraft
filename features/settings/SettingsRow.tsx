import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SemanticIcon } from '@/components/Icon';
import { AppPalette } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';
import { useAppState } from '@/state/AppStateContext';

interface SettingsRowProps {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  detail?: string;
  description?: string;
  danger?: boolean;
  toggle?: boolean;
  enabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SettingsRow({
  label,
  icon,
  detail,
  description,
  danger = false,
  toggle = false,
  enabled = false,
  onPress,
  style,
}: SettingsRowProps) {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: palette.card }, style]}>
      <View style={[styles.icon, { backgroundColor: palette.cardMuted }, danger && styles.dangerIcon]}>
        <SemanticIcon name={icon} size={25} color={danger ? '#111' : palette.text} />
      </View>
      <View style={styles.text}>
        <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
        {description ? <Text style={[styles.description, { color: palette.secondaryText }]}>{description}</Text> : null}
      </View>
      {detail ? <Text style={[styles.detail, { color: palette.secondaryText }]}>{detail}</Text> : null}
      {toggle ? (
        <View style={[styles.toggle, enabled && { backgroundColor: palette.accent }]}>
          <View style={[styles.knob, { backgroundColor: mode === 'dark' ? '#31343a' : '#ffffff' }, enabled && styles.knobActive]} />
        </View>
      ) : (
        <SemanticIcon name="chevron-forward" size={25} color={palette.text} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 74,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerIcon: { backgroundColor: '#f0746c' },
  text: { flex: 1, gap: 5 },
  label: { fontSize: Typography.fontSize.md, fontWeight: '700' },
  description: { fontSize: Typography.fontSize.sm, lineHeight: 21 },
  detail: { fontSize: Typography.fontSize.sm },
  toggle: { width: 54, height: 29, borderRadius: 15, backgroundColor: '#6d7073', padding: 3 },
  knob: { width: 23, height: 23, borderRadius: 12, backgroundColor: '#31343a' },
  knobActive: { alignSelf: 'flex-end' },
});
