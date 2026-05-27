import type { Trip, TripSection } from '../types/trip.ts';
import type { PlannedTrip } from '../types/plannedTrip.ts';
import { formatAppDate, translate, type AppLanguage } from '../i18n/translations.ts';

export function isToday(date: string): boolean {
  const today = new Date();
  const targetDate = new Date(date);
  return (
    today.getFullYear() === targetDate.getFullYear() &&
    today.getMonth() === targetDate.getMonth() &&
    today.getDate() === targetDate.getDate()
  );
}

export function isYesterday(date: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const targetDate = new Date(date);
  return (
    yesterday.getFullYear() === targetDate.getFullYear() &&
    yesterday.getMonth() === targetDate.getMonth() &&
    yesterday.getDate() === targetDate.getDate()
  );
}

export function monthLabel(date: string, language: AppLanguage = 'en'): string {
  const targetDate = new Date(date);
  const now = new Date();
  return formatAppDate(targetDate, language, targetDate.getFullYear() !== now.getFullYear()
    ? { month: 'long', year: 'numeric' }
    : { month: 'long' });
}

export function formatDisplayDate(date: string): string {
  const targetDate = new Date(date);
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const month = monthNames[targetDate.getMonth()];
  const day = targetDate.getDate();
  const year = targetDate.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

function isPlannedTrip(trip: Trip): trip is PlannedTrip {
  return 'startDate' in trip && typeof trip.startDate === 'string';
}

export function getTripSortDate(trip: Trip, sortBy: 'edited' | 'created'): string {
  if (sortBy === 'created') return trip.createdAt;
  return isPlannedTrip(trip) ? trip.startDate : trip.displayDate;
}

export function groupTripsBySection(
  trips: Trip[],
  sortBy: 'edited' | 'created' = 'edited',
  order: 'asc' | 'desc' = 'desc',
  language: AppLanguage = 'en',
): TripSection[] {
  const sortedTrips = [...trips].sort((a, b) => {
    const dateA = new Date(getTripSortDate(a, sortBy));
    const dateB = new Date(getTripSortDate(b, sortBy));
    
    if (order === 'asc') {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });
  
  const sections: TripSection[] = [];
  let currentSection: TripSection | null = null;
  
  sortedTrips.forEach(trip => {
    const sectionDate = isPlannedTrip(trip) ? trip.startDate : trip.displayDate;
    let sectionTitle: string;
    
    if (isToday(sectionDate)) {
      sectionTitle = translate(language, 'common.today');
    } else if (isYesterday(sectionDate)) {
      sectionTitle = translate(language, 'common.yesterday');
    } else {
      sectionTitle = monthLabel(sectionDate, language);
    }
    
    if (!currentSection || currentSection.title !== sectionTitle) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: sectionTitle,
        data: []
      };
    }
    
    currentSection.data.push(trip);
  });
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}
