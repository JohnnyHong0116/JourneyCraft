import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppPalette } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';

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
  return (
    <Pressable onPress={onPress} style={[styles.card, style]}>
      <View style={[styles.icon, danger && styles.dangerIcon]}>
        <Ionicons name={icon} size={25} color={danger ? '#111' : AppPalette.dark.text} />
      </View>
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
      {toggle ? (
        <View style={[styles.toggle, enabled && styles.toggleActive]}>
          <View style={[styles.knob, enabled && styles.knobActive]} />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={25} color={AppPalette.dark.text} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 74,
    backgroundColor: AppPalette.dark.card,
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
    backgroundColor: '#32313d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerIcon: { backgroundColor: '#f0746c' },
  text: { flex: 1, gap: 5 },
  label: { color: AppPalette.dark.text, fontSize: Typography.fontSize.md, fontWeight: '700' },
  description: { color: AppPalette.dark.secondaryText, fontSize: Typography.fontSize.sm, lineHeight: 21 },
  detail: { color: AppPalette.dark.secondaryText, fontSize: Typography.fontSize.sm },
  toggle: { width: 54, height: 29, borderRadius: 15, backgroundColor: '#6d7073', padding: 3 },
  toggleActive: { backgroundColor: AppPalette.dark.accent },
  knob: { width: 23, height: 23, borderRadius: 12, backgroundColor: '#31343a' },
  knobActive: { alignSelf: 'flex-end' },
});
