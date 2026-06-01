export type CompanionOverrides = Record<string, string[]>;

export function addCompanion(companions: readonly string[] | undefined, draft: string): string[] {
  const current = [...(companions ?? [])];
  const name = draft.trim();
  if (!name || current.some((person) => person.toLowerCase() === name.toLowerCase())) return current;
  return [...current, name];
}

export function removeCompanion(companions: readonly string[] | undefined, name: string): string[] {
  return (companions ?? []).filter((person) => person !== name);
}

export function getPeopleIconName(companions: readonly string[] | undefined): 'cardperson' | 'cardpeople' {
  return (companions?.length ?? 0) <= 1 ? 'cardperson' : 'cardpeople';
}

export function applyCompanionOverrides<T extends { id: string; companions?: string[] }>(
  trips: readonly T[],
  overrides: CompanionOverrides,
): T[] {
  return trips.map((trip) => (
    Object.prototype.hasOwnProperty.call(overrides, trip.id)
      ? { ...trip, companions: [...overrides[trip.id]!] }
      : trip
  ));
}
