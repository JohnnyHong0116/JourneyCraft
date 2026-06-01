import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CompanionOverrides } from './peopleModel';

const COMPANION_OVERRIDES_KEY = 'journeycraft.companion-overrides.v1';

export async function loadCompanionOverrides(): Promise<CompanionOverrides> {
  try {
    const stored = await AsyncStorage.getItem(COMPANION_OVERRIDES_KEY);
    return stored ? JSON.parse(stored) as CompanionOverrides : {};
  } catch {
    return {};
  }
}

export async function saveCompanions(tripId: string, companions: readonly string[]): Promise<void> {
  const overrides = await loadCompanionOverrides();
  await AsyncStorage.setItem(COMPANION_OVERRIDES_KEY, JSON.stringify({
    ...overrides,
    [tripId]: [...companions],
  }));
}
