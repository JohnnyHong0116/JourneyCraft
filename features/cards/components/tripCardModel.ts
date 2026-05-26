export function getTripCoverUri(photos: readonly string[]): string | undefined {
  return photos[0] || undefined;
}
