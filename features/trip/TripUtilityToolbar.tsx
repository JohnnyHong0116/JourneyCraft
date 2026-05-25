import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { AppIconName } from '@/components/iconModel';
import { AppPalette } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { Spacing } from '@/theme/designSystem';

export const TRIP_UTILITY_TOOLBAR_HEIGHT = 68;

export interface TripUtilityAction {
  key: string;
  icon: AppIconName;
  accessibilityLabel: string;
  active?: boolean;
  onPress?: () => void;
}

export function TripUtilityToolbar({
  actions,
  bottomInset = 0,
}: {
  actions: TripUtilityAction[];
  bottomInset?: number;
}) {
  const { mode } = useAppState();
  const palette = AppPalette[mode];

  return (
    <View
      style={[
        styles.toolbar,
        {
          backgroundColor: palette.card,
          borderTopColor: palette.divider,
          height: TRIP_UTILITY_TOOLBAR_HEIGHT + bottomInset,
          paddingBottom: bottomInset,
        },
      ]}
    >
      {actions.map((action) => (
        <Pressable
          key={action.key}
          accessibilityRole="button"
          accessibilityLabel={action.accessibilityLabel}
          onPress={action.onPress}
          style={({ pressed }) => [
            styles.action,
            (pressed || action.active) && { backgroundColor: palette.cardMuted },
          ]}
        >
          <Icon
            name={action.icon}
            size={action.icon === 'add' ? 27 : 22}
            color={action.active ? palette.accentStrong : palette.text}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.sm,
  },
  action: {
    height: 44,
    width: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
