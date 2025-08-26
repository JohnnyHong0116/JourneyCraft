import { Trip, TripSection } from '@/types/trip';

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

export function monthLabel(date: string): string {
  const targetDate = new Date(date);
  const now = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const month = monthNames[targetDate.getMonth()];
  
  // 如果不是今年，显示年份
  if (targetDate.getFullYear() !== now.getFullYear()) {
    return `${month} ${targetDate.getFullYear()}`;
  }
  
  return month;
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

export function groupTripsBySection(trips: Trip[], sortBy: 'edited' | 'created' = 'edited', order: 'asc' | 'desc' = 'desc'): TripSection[] {
  // 根据传入的排序参数排序
  const sortedTrips = [...trips].sort((a, b) => {
    let dateA: Date;
    let dateB: Date;
    
    if (sortBy === 'edited') {
      dateA = new Date(a.displayDate);
      dateB = new Date(b.displayDate);
    } else {
      dateA = new Date(a.createdAt);
      dateB = new Date(b.createdAt);
    }
    
    if (order === 'asc') {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });
  
  const sections: TripSection[] = [];
  let currentSection: TripSection | null = null;
  
  sortedTrips.forEach(trip => {
    let sectionTitle: string;
    
    if (isToday(trip.displayDate)) {
      sectionTitle = 'Today';
    } else if (isYesterday(trip.displayDate)) {
      sectionTitle = 'Yesterday';
    } else {
      sectionTitle = monthLabel(trip.displayDate);
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
