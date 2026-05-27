import type { Trip } from './trip';

export type ChecklistStatus = 'completed' | 'pending' | 'notStarted';
export type ItineraryEntryType = 'flight' | 'hotel' | 'activity' | 'restaurant' | 'note';

export interface ChecklistItem {
  id: string;
  label: string;
  status: ChecklistStatus;
  userEntered: boolean;
}

export interface ItineraryEntry {
  id: string;
  date: string;
  dayNumber: number;
  title: string;
  type: ItineraryEntryType;
  time?: string;
  location?: string;
  note?: string;
}

export interface PlannedTrip extends Trip {
  route: string;
  startDate: string;
  endDate: string;
  checklistItems: ChecklistItem[];
  itineraryEntries: ItineraryEntry[];
}
