export const HOME_TIMELINE_STICKY_SECTION_HEADERS = false;

export function getSectionHeaderMaterial(mode: 'light' | 'dark') {
  return mode === 'dark'
    ? {
        tint: 'dark' as const,
        intensity: 70,
        washColor: 'rgba(30, 30, 30, 0.42)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
      }
    : {
        tint: 'systemUltraThinMaterial' as const,
        intensity: 72,
        washColor: 'rgba(255, 255, 255, 0.26)',
        borderColor: 'rgba(24, 32, 26, 0.08)',
      };
}
