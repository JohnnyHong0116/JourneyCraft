import type { Person } from '../../src/types/person.ts';
import type { Trip } from '../../src/types/trip.ts';

export const PERSON_LABEL_MAX_LENGTH = 12;

const chinesePattern = /[\u3400-\u9fff]/u;

function truncateLabel(value: string): string {
  const characters = Array.from(value);
  return characters.length > PERSON_LABEL_MAX_LENGTH
    ? `${characters.slice(0, PERSON_LABEL_MAX_LENGTH).join('')}…`
    : value;
}

export function formatPersonDisplayName(name?: string): string {
  const trimmed = name?.trim() ?? '';
  if (!trimmed) return 'Unknown';
  if (chinesePattern.test(trimmed)) return truncateLabel(trimmed);

  const words = trimmed.split(/\s+/u);
  const displayName = words.length > 1
    ? `${words[0]} ${words[words.length - 1].charAt(0).toUpperCase()}.`
    : words[0];
  return truncateLabel(displayName);
}

export function getPersonInitials(name?: string): string {
  const trimmed = name?.trim() ?? '';
  if (!trimmed) return '?';
  if (chinesePattern.test(trimmed.charAt(0))) return trimmed.charAt(0);

  const latinWords = trimmed.match(/[A-Za-z][A-Za-z'-]*/gu) ?? [];
  if (latinWords.length > 1) {
    return `${latinWords[0]!.charAt(0)}${latinWords[latinWords.length - 1]!.charAt(0)}`.toUpperCase();
  }
  return latinWords[0]?.slice(0, 2).toUpperCase() ?? trimmed.charAt(0).toUpperCase();
}

export function getPeopleForTrip(trip: Trip, allPeople: readonly Person[]): Person[] {
  const byId = new Map(allPeople.map((person) => [person.id, person]));
  return (trip.peopleIds ?? []).flatMap((id) => {
    const person = byId.get(id);
    return person ? [person] : [];
  });
}

export function personMatchesQuery(person: Person, query?: string): boolean {
  const normalizedQuery = query?.trim().toLowerCase() ?? '';
  return normalizedQuery.length === 0 || person.displayName.toLowerCase().includes(normalizedQuery);
}

export function tripMatchesPeople(
  trip: Trip,
  allPeople: readonly Person[],
  selectedPersonIds: readonly string[] = [],
  query?: string,
): boolean {
  const tripPeople = getPeopleForTrip(trip, allPeople);
  if (tripPeople.length === 0) return false;
  if (selectedPersonIds.length > 0 && !tripPeople.some((person) => selectedPersonIds.includes(person.id))) {
    return false;
  }
  return tripPeople.some((person) => personMatchesQuery(person, query));
}

export function formatAudioResultCount(count: number): string | undefined {
  if (count <= 0) return undefined;
  return `${count} ${count === 1 ? 'recording' : 'recordings'}`;
}
