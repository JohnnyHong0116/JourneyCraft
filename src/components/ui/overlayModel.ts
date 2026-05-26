export type OverlayMode = 'light' | 'dark';

export function getOverlayMaterial(mode: OverlayMode) {
  return mode === 'dark'
    ? {
        tint: 'dark' as const,
        backdropColor: 'rgba(0, 0, 0, 0.34)',
        surfaceWash: 'rgba(36, 36, 38, 0.58)',
        sheetWash: 'rgba(24, 24, 26, 0.74)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        selectedWash: 'rgba(98, 173, 116, 0.18)',
      }
    : {
        tint: 'systemMaterialLight' as const,
        backdropColor: 'rgba(13, 17, 15, 0.18)',
        surfaceWash: 'rgba(255, 255, 255, 0.34)',
        sheetWash: 'rgba(246, 247, 243, 0.82)',
        borderColor: 'rgba(20, 28, 22, 0.09)',
        selectedWash: 'rgba(95, 175, 112, 0.13)',
      };
}

export function getPopoverPosition(input: {
  anchorX: number;
  anchorY: number;
  anchorWidth: number;
  anchorHeight: number;
  panelWidth: number;
  panelHeight: number;
  viewportWidth: number;
  viewportHeight: number;
}) {
  const margin = 12;
  const gap = 8;
  const bottomGuard = 104;
  const left = Math.min(
    Math.max(input.anchorX + input.anchorWidth - input.panelWidth, margin),
    input.viewportWidth - input.panelWidth - margin,
  );
  const below = input.anchorY + input.anchorHeight + gap;

  if (below + input.panelHeight <= input.viewportHeight - bottomGuard) {
    return { left, top: below, placement: 'below' as const };
  }

  return {
    left,
    top: Math.max(margin, input.anchorY - input.panelHeight - gap),
    placement: 'above' as const,
  };
}
