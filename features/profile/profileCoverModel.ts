export function getRevealProgress(scrollY: number, collapseDistance: number): number {
  'worklet';
  if (collapseDistance <= 0) return 0;
  return Math.max(0, Math.min(1, 1 - Math.max(scrollY, 0) / collapseDistance));
}

export function getProfileCoverHeight({
  scrollY,
  baseHeight,
  expandedHeight,
  revealProgress,
}: {
  scrollY: number;
  baseHeight: number;
  expandedHeight: number;
  revealProgress: number;
}): number {
  'worklet';
  const pullDistance = Math.max(-scrollY, 0);
  const revealDelta = Math.max(expandedHeight - baseHeight, 0) * Math.max(0, Math.min(1, revealProgress));
  return Math.max(baseHeight, baseHeight + pullDistance + revealDelta);
}

export function shouldTriggerRevealHaptic(scrollY: number, threshold: number, alreadyTriggered: boolean): boolean {
  'worklet';
  return !alreadyTriggered && scrollY <= -threshold;
}

export function getClosedCoverUri(croppedCoverUri: string | null, currentCoverUri: string): string {
  return croppedCoverUri ?? currentCoverUri;
}
