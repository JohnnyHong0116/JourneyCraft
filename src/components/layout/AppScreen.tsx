import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing, Typography } from '@/theme/designSystem';

export type AppThemeMode = 'light' | 'dark';

export const AppPalette = {
  light: {
    backgroundTop: '#f3f2ed',
    backgroundBottom: '#d8ead0',
    text: '#101010',
    secondaryText: '#65646b',
    card: '#ffffff',
    cardMuted: '#e5e1e0',
    divider: 'rgba(0,0,0,0.15)',
    accent: '#b7d58d',
    accentStrong: '#5faf70',
    input: '#ffffff',
  },
  dark: {
    backgroundTop: '#0e0e0e',
    backgroundBottom: '#102d25',
    text: '#ffffff',
    secondaryText: '#b8b5bf',
    card: '#2c2c2c',
    cardMuted: '#34343c',
    divider: 'rgba(255,255,255,0.2)',
    accent: '#b7d58d',
    accentStrong: '#62ad74',
    input: '#2c2c2c',
  },
} as const;

interface AppScreenProps {
  children: React.ReactNode;
  mode?: AppThemeMode;
  scroll?: boolean;
  keyboardSafe?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  bottomInset?: number;
}

export function AppScreen({
  children,
  mode = 'light',
  scroll = false,
  keyboardSafe = false,
  contentContainerStyle,
  bottomInset = 20,
}: AppScreenProps) {
  const colors = AppPalette[mode];
  const body = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: bottomInset },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentContainerStyle]}>{children}</View>
  );

  return (
    <LinearGradient colors={[colors.backgroundTop, colors.backgroundBottom]} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right', 'bottom']}>
        {keyboardSafe ? (
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {body}
          </KeyboardAvoidingView>
        ) : body}
      </SafeAreaView>
    </LinearGradient>
  );
}

export function ContentContainer({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.contentContainer, style]}>{children}</View>;
}

interface ScreenHeaderProps {
  title: string;
  mode?: AppThemeMode;
  backLabel?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function ScreenHeader({
  title,
  mode = 'light',
  backLabel,
  onBack,
  right,
}: ScreenHeaderProps) {
  const colors = AppPalette[mode];
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={backLabel ?? 'Back'}
        onPress={onBack ?? (() => router.back())}
        style={styles.headerSide}
      >
        <Ionicons name="chevron-back" size={25} color={colors.text} />
        {backLabel ? <Text style={[styles.backLabel, { color: colors.text }]}>{backLabel}</Text> : null}
      </Pressable>
      <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
      <View style={[styles.headerSide, styles.headerRight]}>{right}</View>
    </View>
  );
}

export function IconCircleButton({
  icon,
  mode = 'light',
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  mode?: AppThemeMode;
  onPress?: () => void;
}) {
  const colors = AppPalette[mode];
  return (
    <Pressable onPress={onPress} style={[styles.iconCircle, { backgroundColor: colors.cardMuted }]}>
      <Ionicons name={icon} size={20} color={colors.text} />
    </Pressable>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  mode = 'light',
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  mode?: AppThemeMode;
}) {
  const colors = AppPalette[mode];
  return (
    <View style={[styles.segmented, { backgroundColor: mode === 'light' ? '#e5e1e0' : '#393939' }]}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.segment,
              active && {
                backgroundColor: mode === 'light' ? colors.card : '#646668',
              },
            ]}
          >
            <Text style={[styles.segmentText, { color: colors.text }]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function SurfaceCard({
  children,
  mode = 'light',
  style,
}: {
  children: React.ReactNode;
  mode?: AppThemeMode;
  style?: StyleProp<ViewStyle>;
}) {
  const colors = AppPalette[mode];
  return (
    <View style={[styles.surfaceCard, { backgroundColor: colors.card }, mode === 'light' && Shadows.small, style]}>
      {children}
    </View>
  );
}

export function Chip({
  label,
  icon,
  active = false,
  mode = 'light',
  onPress,
}: {
  label: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  active?: boolean;
  mode?: AppThemeMode;
  onPress?: () => void;
}) {
  const colors = AppPalette[mode];
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: active ? colors.accent : colors.card },
      ]}
    >
      {icon ? <Ionicons name={icon} size={17} color={mode === 'dark' && !active ? colors.text : '#27252a'} /> : null}
      <Text style={[styles.chipText, { color: active || mode === 'light' ? '#27252a' : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

export function PrimaryButton({
  title,
  onPress,
  mode = 'light',
  icon,
}: {
  title: string;
  onPress?: () => void;
  mode?: AppThemeMode;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}) {
  const colors = AppPalette[mode];
  return (
    <Pressable onPress={onPress} style={[styles.primaryButton, { backgroundColor: colors.accent }]}>
      <Text style={styles.primaryText}>{title}</Text>
      {icon ? <Ionicons name={icon} size={19} color="#253021" /> : null}
    </Pressable>
  );
}

interface FormFieldProps extends TextInputProps {
  label?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  mode?: AppThemeMode;
  right?: React.ReactNode;
}

export function FormField({ label, icon, mode = 'light', right, style, ...props }: FormFieldProps) {
  const colors = AppPalette[mode];
  return (
    <View style={styles.fieldGroup}>
      {label ? <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text> : null}
      <View style={[styles.field, { backgroundColor: colors.input }]}>
        {icon ? <Ionicons name={icon} color={colors.text} size={23} /> : null}
        <TextInput
          {...props}
          placeholderTextColor={colors.secondaryText}
          style={[styles.fieldInput, { color: colors.text }, style]}
        />
        {right}
      </View>
    </View>
  );
}

export function StatePanel({
  title,
  message,
  mode = 'light',
  icon = 'images-outline',
}: {
  title: string;
  message: string;
  mode?: AppThemeMode;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}) {
  const colors = AppPalette[mode];
  return (
    <SurfaceCard mode={mode} style={styles.statePanel}>
      <Ionicons name={icon} size={32} color={colors.accentStrong} />
      <Text style={[styles.stateTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.stateMessage, { color: colors.secondaryText }]}>{message}</Text>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  contentContainer: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
  },
  header: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  headerSide: {
    width: 92,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: { justifyContent: 'flex-end' },
  backLabel: { fontSize: Typography.fontSize.md, fontWeight: '500' },
  headerTitle: { fontSize: Typography.fontSize.xl, fontWeight: '700' },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmented: {
    borderRadius: BorderRadius.lg,
    padding: 2,
    flexDirection: 'row',
    minHeight: 38,
  },
  segment: {
    flex: 1,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  segmentText: { fontSize: Typography.fontSize.sm, fontWeight: '700' },
  surfaceCard: {
    width: '100%',
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
  },
  chip: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  chipText: { fontSize: Typography.fontSize.sm, fontWeight: '600' },
  primaryButton: {
    minHeight: 54,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  primaryText: { fontSize: Typography.fontSize.md, color: '#253021', fontWeight: '700' },
  fieldGroup: { gap: Spacing.sm, marginBottom: Spacing.md },
  fieldLabel: { fontSize: Typography.fontSize.md, fontWeight: '700' },
  field: {
    minHeight: 54,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  fieldInput: { flex: 1, fontSize: Typography.fontSize.md, fontWeight: '600', paddingVertical: Spacing.sm },
  statePanel: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    gap: Spacing.sm,
  },
  stateTitle: { fontSize: Typography.fontSize.lg, fontWeight: '700' },
  stateMessage: { fontSize: Typography.fontSize.sm, lineHeight: 20, textAlign: 'center' },
});
