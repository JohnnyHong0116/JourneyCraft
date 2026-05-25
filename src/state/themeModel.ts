export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedThemeMode = 'light' | 'dark';

export const THEME_TRANSITION_REVEAL_MS = 220;

export function resolveThemeMode(
  preference: ThemePreference,
  systemScheme: ResolvedThemeMode | null | undefined,
): ResolvedThemeMode {
  return preference === 'system' ? systemScheme ?? 'light' : preference;
}

export function getThemeTransitionPlan(
  currentMode: ResolvedThemeMode,
  nextMode: ResolvedThemeMode,
): {
  shouldAnimate: boolean;
  strategy: 'snapshot' | 'none';
} {
  return {
    shouldAnimate: currentMode !== nextMode,
    strategy: currentMode === nextMode ? 'none' : 'snapshot',
  };
}
