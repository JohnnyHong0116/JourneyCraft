import React, { useEffect, useState } from 'react';
import {
  Keyboard,
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing, Typography } from '@/theme/designSystem';
import { useAppState } from '@/state/AppStateContext';
import { SemanticIcon } from '@/components/Icon';
import { getFooterBottomInset, getFooterVisualHeight, getScrollBottomInset } from './appScreenModel';

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

function useResolvedMode(explicitMode?: AppThemeMode): AppThemeMode {
  const { mode } = useAppState();
  return explicitMode ?? mode;
}

interface AppScreenProps {
  children: React.ReactNode;
  mode?: AppThemeMode;
  scroll?: boolean;
  keyboardSafe?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  bottomInset?: number;
  footer?: (bottomInset: number) => React.ReactNode;
  footerHeight?: number;
}

export function AppScreen({
  children,
  mode,
  scroll = false,
  keyboardSafe = false,
  contentContainerStyle,
  bottomInset = 20,
  footer,
  footerHeight = 0,
}: AppScreenProps) {
  const resolvedMode = useResolvedMode(mode);
  const colors = AppPalette[resolvedMode];
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (!keyboardSafe) return undefined;
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardSafe]);

  const footerBottomInset = footer
    ? getFooterBottomInset(insets.bottom, keyboardSafe && keyboardVisible)
    : 0;
  const visualFooterHeight = footer
    ? getFooterVisualHeight(footerHeight, footerBottomInset)
    : 0;
  const contentBottomInset = getScrollBottomInset(bottomInset, visualFooterHeight);
  const content = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: contentBottomInset },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentContainerStyle]}>{children}</View>
  );
  const body = footer ? (
    <View style={styles.flex}>
      {content}
      <View style={styles.footer}>{footer(footerBottomInset)}</View>
    </View>
  ) : content;

  return (
    <LinearGradient colors={[colors.backgroundTop, colors.backgroundBottom]} style={styles.flex}>
      <SafeAreaView
        style={styles.flex}
        edges={footer ? ['top', 'left', 'right'] : ['top', 'left', 'right', 'bottom']}
      >
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
  mode,
  backLabel,
  onBack,
  right,
}: ScreenHeaderProps) {
  const resolvedMode = useResolvedMode(mode);
  const colors = AppPalette[resolvedMode];
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={backLabel ?? 'Back'}
        onPress={onBack ?? (() => router.back())}
        style={styles.headerSide}
      >
        <SemanticIcon name="chevron-back" size={25} color={colors.text} />
        {backLabel ? <Text style={[styles.backLabel, { color: colors.text }]}>{backLabel}</Text> : null}
      </Pressable>
      <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
      <View style={[styles.headerSide, styles.headerRight]}>{right}</View>
    </View>
  );
}

export function IconCircleButton({
  icon,
  mode,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  mode?: AppThemeMode;
  onPress?: () => void;
}) {
  const resolvedMode = useResolvedMode(mode);
  const colors = AppPalette[resolvedMode];
  return (
    <Pressable onPress={onPress} style={[styles.iconCircle, { backgroundColor: colors.cardMuted }]}>
      <SemanticIcon name={icon} size={20} color={colors.text} />
    </Pressable>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  mode,
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  mode?: AppThemeMode;
}) {
  const resolvedMode = useResolvedMode(mode);
  const colors = AppPalette[resolvedMode];
  return (
    <View style={[styles.segmented, { backgroundColor: resolvedMode === 'light' ? '#e5e1e0' : '#393939' }]}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.segment,
              active && {
                backgroundColor: resolvedMode === 'light' ? colors.card : '#646668',
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
  mode,
  style,
}: {
  children: React.ReactNode;
  mode?: AppThemeMode;
  style?: StyleProp<ViewStyle>;
}) {
  const resolvedMode = useResolvedMode(mode);
  const colors = AppPalette[resolvedMode];
  return (
    <View style={[styles.surfaceCard, { backgroundColor: colors.card }, resolvedMode === 'light' && Shadows.small, style]}>
      {children}
    </View>
  );
}

export function Chip({
  label,
  icon,
  active = false,
  mode,
  onPress,
}: {
  label: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  active?: boolean;
  mode?: AppThemeMode;
  onPress?: () => void;
}) {
  const resolvedMode = useResolvedMode(mode);
  const colors = AppPalette[resolvedMode];
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: active ? colors.accent : colors.card },
      ]}
    >
      {icon ? <SemanticIcon name={icon} size={17} color={resolvedMode === 'dark' && !active ? colors.text : '#27252a'} /> : null}
      <Text style={[styles.chipText, { color: active || resolvedMode === 'light' ? '#27252a' : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

export function PrimaryButton({
  title,
  onPress,
  mode,
  icon,
}: {
  title: string;
  onPress?: () => void;
  mode?: AppThemeMode;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}) {
  const resolvedMode = useResolvedMode(mode);
  const colors = AppPalette[resolvedMode];
  return (
    <Pressable onPress={onPress} style={[styles.primaryButton, { backgroundColor: colors.accent }]}>
      <Text style={styles.primaryText}>{title}</Text>
      {icon ? <SemanticIcon name={icon} size={19} color="#253021" /> : null}
    </Pressable>
  );
}

interface FormFieldProps extends TextInputProps {
  label?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  mode?: AppThemeMode;
  right?: React.ReactNode;
}

export function FormField({ label, icon, mode, right, style, ...props }: FormFieldProps) {
  const resolvedMode = useResolvedMode(mode);
  const colors = AppPalette[resolvedMode];
  return (
    <View style={styles.fieldGroup}>
      {label ? <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text> : null}
      <View style={[styles.field, { backgroundColor: colors.input }]}>
        {icon ? <SemanticIcon name={icon} color={colors.text} size={23} /> : null}
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
  mode,
  icon = 'images-outline',
}: {
  title: string;
  message: string;
  mode?: AppThemeMode;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}) {
  const resolvedMode = useResolvedMode(mode);
  const colors = AppPalette[resolvedMode];
  return (
    <SurfaceCard mode={mode} style={styles.statePanel}>
      <SemanticIcon name={icon} size={32} color={colors.accentStrong} />
      <Text style={[styles.stateTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.stateMessage, { color: colors.secondaryText }]}>{message}</Text>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0 },
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
