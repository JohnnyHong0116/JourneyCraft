import type { Trip, TripMood } from '../types/trip';
import type { Person } from '../types/person';
import type { PlannedTrip } from '../types/plannedTrip';

export interface PlannedDay {
  id: string;
  day: number;
  label: string;
  location: string;
  complete: boolean;
}

export interface ExpenseItem {
  id: string;
  tripId: string;
  label: string;
  category: 'Transportation' | 'Hotel' | 'Food' | 'Entertainment' | 'Shopping' | 'Others';
  amount: number;
  day: number;
  occurredOn: string;
  people: string[];
}

export interface MoodMetric {
  id: TripMood;
  percentage: number;
}

export interface StatisticsYearOption {
  year: number;
  hasRecords: boolean;
}

export interface StatisticsMonthOption {
  month: number;
  name: string;
  shortName: string;
  hasRecords: boolean;
}

export interface AnnualSpendPoint {
  key: string;
  month: number;
  label: string;
  value: number;
  hasRecords: boolean;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const people: Person[] = [
  { id: 'amily-zheng', displayName: 'Amily Zheng', avatarUri: 'https://picsum.photos/id/64/100/100' },
  { id: 'johnny-huang', displayName: 'Johnny Huang' },
  { id: 'zheng-chenchen', displayName: '郑晨辰', avatarUri: 'https://picsum.photos/id/91/100/100' },
  { id: 'sarah-miller', displayName: 'Sarah Miller' },
  { id: 'mike-carter', displayName: 'Mike Carter' },
  { id: 'lisa-chen', displayName: 'Lisa Chen' },
  { id: 'alex-rivera', displayName: 'Alex Rivera' },
  { id: 'family', displayName: 'Family' },
  { id: 'emma-wilson', displayName: 'Emma Wilson' },
  { id: 'ski-club', displayName: 'Ski Club' },
  { id: 'work-team', displayName: 'Work Team' },
  { id: 'best-friends', displayName: 'Best Friends' },
];

export const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'Morning Coffee Run',
    location: 'Madison, WI',
    createdAt: '2026-05-25T09:00:00Z',
    displayDate: '2026-05-25T09:00:00Z',
    photos: ['https://picsum.photos/id/1060/300/300'],
    audioCount: 0,
    videoCount: 0,
    mood: 'happy',
    isSaved: true,
    isLocked: false,
    isPinned: true,
    companions: ['Sarah'],
    peopleIds: ['sarah-miller'],
  },
  {
    id: '2',
    title: 'Evening Walk',
    location: 'Madison, WI',
    createdAt: '2026-05-24T18:00:00Z',
    displayDate: '2026-05-24T18:00:00Z',
    photos: [],
    audioCount: 1,
    videoCount: 0,
    mood: 'neutral',
    isSaved: false,
    isLocked: true,
    isPinned: false,
    companions: [],
    peopleIds: [],
  },
  {
    id: '3',
    title: 'Weekend Trip to Chicago',
    location: 'Chicago, IL',
    createdAt: '2025-01-15T10:00:00Z',
    displayDate: '2025-01-15T10:00:00Z',
    photos: ['https://picsum.photos/id/1015/300/300', 'https://picsum.photos/id/1016/300/300'],
    audioCount: 2,
    videoCount: 1,
    mood: 'overjoyed',
    isSaved: true,
    isLocked: false,
    companions: ['Mike', 'Lisa'],
    peopleIds: ['mike-carter', 'lisa-chen'],
  },
  {
    id: '4',
    title: 'Hiking Adventure',
    location: "Devil's Lake, WI",
    createdAt: '2025-01-10T08:00:00Z',
    displayDate: '2025-01-10T08:00:00Z',
    photos: ['https://picsum.photos/id/1018/300/300'],
    audioCount: 0,
    videoCount: 0,
    mood: 'happy',
    isSaved: true,
    isLocked: false,
    companions: ['Alex'],
    peopleIds: ['alex-rivera'],
  },
  {
    id: '5',
    title: 'Local Museum Visit',
    location: 'Madison, WI',
    createdAt: '2025-01-05T14:00:00Z',
    displayDate: '2025-01-05T14:00:00Z',
    photos: [],
    audioCount: 0,
    videoCount: 0,
    mood: 'sad',
    isSaved: false,
    isLocked: false,
    companions: [],
    peopleIds: [],
  },
  {
    id: '6',
    title: 'Summer Beach Trip',
    location: 'Miami, FL',
    createdAt: '2024-07-20T12:00:00Z',
    displayDate: '2024-07-20T12:00:00Z',
    photos: ['https://picsum.photos/id/1011/300/300', 'https://picsum.photos/id/1012/300/300'],
    audioCount: 3,
    videoCount: 2,
    mood: 'overjoyed',
    isSaved: true,
    isLocked: false,
    companions: ['Family'],
    peopleIds: ['family'],
  },
  {
    id: '7',
    title: 'Fall Colors Tour',
    location: 'Door County, WI',
    createdAt: '2024-10-15T09:00:00Z',
    displayDate: '2024-10-15T09:00:00Z',
    photos: ['https://picsum.photos/id/1035/300/300'],
    audioCount: 1,
    videoCount: 0,
    mood: 'happy',
    isSaved: true,
    isLocked: false,
    companions: ['Emma'],
    peopleIds: ['emma-wilson'],
  },
  {
    id: '8',
    title: 'Winter Ski Trip',
    location: 'Aspen, CO',
    createdAt: '2024-12-28T07:00:00Z',
    displayDate: '2024-12-28T07:00:00Z',
    photos: ['https://picsum.photos/id/1036/300/300'],
    audioCount: 0,
    videoCount: 1,
    mood: 'happy',
    isSaved: false,
    isLocked: true,
    companions: ['Ski Club'],
    peopleIds: ['ski-club'],
  },
  {
    id: '9',
    title: 'Business Conference',
    location: 'San Francisco, CA',
    createdAt: '2024-09-10T08:00:00Z',
    displayDate: '2024-09-10T08:00:00Z',
    photos: [],
    audioCount: 5,
    videoCount: 0,
    mood: 'depressed',
    isSaved: true,
    isLocked: true,
    companions: ['Work Team'],
    peopleIds: ['work-team'],
  },
  {
    id: '10',
    title: 'Road Trip to Yellowstone',
    location: 'Yellowstone, WY',
    createdAt: '2024-06-01T06:00:00Z',
    displayDate: '2024-06-01T06:00:00Z',
    photos: ['https://picsum.photos/id/1043/300/300'],
    audioCount: 2,
    videoCount: 3,
    mood: 'overjoyed',
    isSaved: true,
    isLocked: false,
    companions: ['Best Friends'],
    peopleIds: ['best-friends'],
  },
  {
    id: '11',
    title: 'Quiet Evening at Home',
    location: 'Madison, WI',
    createdAt: '2024-11-20T18:00:00Z',
    displayDate: '2024-11-20T18:00:00Z',
    photos: [],
    audioCount: 0,
    videoCount: 0,
    mood: 'neutral',
    isSaved: false,
    isLocked: false,
    companions: [],
    peopleIds: [],
  },
];

export const plannedDays: PlannedDay[] = [
  { id: 'planned-day-1', day: 1, label: 'Day 1 July 24', location: 'Tianfu Airport', complete: true },
  { id: 'planned-day-2', day: 2, label: 'Day 2 July 25', location: 'Chunxi Road', complete: false },
  { id: 'planned-day-3', day: 3, label: 'Day 3 July 26', location: 'Panda Base', complete: false },
  { id: 'planned-day-4', day: 4, label: 'Day 4 July 27', location: 'Kuanzhai Alley', complete: false },
];

export const plannedTripCards: PlannedTrip[] = [
  {
    id: 'planned-1',
    title: '成都西安到处吃',
    location: '成都 + 西安',
    route: '成都 - 西安',
    createdAt: '2026-07-24',
    displayDate: '2026-07-24',
    startDate: '2026-07-24',
    endDate: '2026-07-27',
    photos: [],
    audioCount: 0,
    videoCount: 0,
    mood: 'happy',
    isSaved: true,
    isLocked: false,
    isPinned: true,
    companions: ['Amily', 'Johnny'],
    peopleIds: ['amily-zheng', 'johnny-huang'],
    checklistItems: [
      { id: 'chengdu-passport', label: 'Passport', status: 'completed', userEntered: false },
      { id: 'chengdu-hotel', label: 'Hotel confirmation', status: 'completed', userEntered: false },
      { id: 'chengdu-flight', label: 'Flight confirmation', status: 'pending', userEntered: false },
      { id: 'chengdu-hotpot', label: '火锅预订', status: 'pending', userEntered: true },
      { id: 'chengdu-pack', label: 'Pack luggage', status: 'notStarted', userEntered: false },
    ],
    itineraryEntries: [
      { id: 'chengdu-day-1', date: '2026-07-24', dayNumber: 1, title: '抵达成都', type: 'flight', time: '10:30', location: '天府机场' },
      { id: 'chengdu-day-2', date: '2026-07-25', dayNumber: 2, title: '春熙路晚餐', type: 'restaurant', time: '18:30', location: '春熙路' },
      { id: 'chengdu-day-3', date: '2026-07-26', dayNumber: 3, title: '大熊猫基地', type: 'activity', time: '09:00', location: '成都大熊猫繁育研究基地' },
      { id: 'chengdu-day-4', date: '2026-07-27', dayNumber: 4, title: '前往西安', type: 'flight', time: '11:10', location: '成都东站' },
    ],
  },
  {
    id: 'planned-3',
    title: 'Chengdu Tea House Weekend',
    location: 'Chengdu, China',
    route: 'Chengdu East - Taikoo Li',
    createdAt: '2026-07-25',
    displayDate: '2026-07-25',
    startDate: '2026-07-25',
    endDate: '2026-07-26',
    photos: [],
    audioCount: 0,
    videoCount: 0,
    mood: 'happy',
    isSaved: false,
    isLocked: false,
    companions: ['Sarah'],
    peopleIds: ['sarah-miller'],
    checklistItems: [
      { id: 'teahouse-hotel', label: 'Hotel confirmation', status: 'completed', userEntered: false },
      { id: 'teahouse-table', label: 'Reserve tea table', status: 'pending', userEntered: true },
      { id: 'teahouse-pack', label: 'Pack camera', status: 'notStarted', userEntered: true },
    ],
    itineraryEntries: [
      { id: 'teahouse-day-1', date: '2026-07-25', dayNumber: 1, title: 'Check in near Taikoo Li', type: 'hotel', time: '15:00', location: 'Taikoo Li' },
      { id: 'teahouse-day-2', date: '2026-07-26', dayNumber: 2, title: 'Morning tea tasting', type: 'activity', time: '10:00', location: 'People Park' },
    ],
  },
  {
    id: 'planned-4',
    title: 'Xi\'an Museum Pass',
    location: 'Xi\'an, China',
    route: 'Chengdu - Xi\'an',
    createdAt: '2026-07-26',
    displayDate: '2026-07-26',
    startDate: '2026-07-26',
    endDate: '2026-07-28',
    photos: [],
    audioCount: 0,
    videoCount: 0,
    mood: 'neutral',
    isSaved: true,
    isLocked: true,
    companions: ['Johnny'],
    peopleIds: ['johnny-huang'],
    checklistItems: [
      { id: 'museum-rail', label: 'Train tickets', status: 'completed', userEntered: false },
      { id: 'museum-pass', label: 'Museum tickets', status: 'pending', userEntered: true },
      { id: 'museum-hotel', label: 'Hotel confirmation', status: 'notStarted', userEntered: false },
    ],
    itineraryEntries: [
      { id: 'museum-day-1', date: '2026-07-26', dayNumber: 1, title: 'Arrive in Xi\'an', type: 'flight', time: '19:15', location: 'Xi\'an North Station' },
      { id: 'museum-day-2', date: '2026-07-27', dayNumber: 2, title: 'Shaanxi History Museum', type: 'activity', time: '09:30', location: 'Yanta District' },
    ],
  },
  {
    id: 'planned-2',
    title: 'Tokyo Food Trip',
    location: 'Tokyo, Japan',
    route: 'Osaka - Tokyo',
    createdAt: '2026-08-14',
    displayDate: '2026-08-14',
    startDate: '2026-08-14',
    endDate: '2026-08-17',
    photos: [],
    audioCount: 0,
    videoCount: 0,
    mood: 'overjoyed',
    isSaved: false,
    isLocked: false,
    companions: ['Amily', 'Johnny'],
    peopleIds: ['amily-zheng', 'johnny-huang'],
    checklistItems: [
      { id: 'tokyo-hotel', label: 'Hotel confirmation', status: 'completed', userEntered: false },
      { id: 'tokyo-rail', label: 'Reserve rail pass', status: 'pending', userEntered: true },
      { id: 'tokyo-map', label: 'Download transit map', status: 'notStarted', userEntered: false },
    ],
    itineraryEntries: [
      { id: 'tokyo-day-1', date: '2026-08-14', dayNumber: 1, title: 'Check in at Shinjuku', type: 'hotel', time: '16:00', location: 'Shinjuku' },
      { id: 'tokyo-day-2', date: '2026-08-15', dayNumber: 2, title: 'Tsukiji breakfast', type: 'restaurant', time: '08:00', location: 'Tsukiji' },
    ],
  },
  {
    id: 'planned-5',
    title: 'Shanghai Design Expo',
    location: 'Shanghai, China',
    route: 'Hangzhou - Shanghai',
    createdAt: '2026-09-04',
    displayDate: '2026-09-04',
    startDate: '2026-09-04',
    endDate: '2026-09-06',
    photos: [],
    audioCount: 0,
    videoCount: 0,
    isSaved: true,
    isLocked: false,
    companions: ['Amily'],
    peopleIds: ['amily-zheng'],
    checklistItems: [
      { id: 'expo-ticket', label: 'Expo ticket', status: 'completed', userEntered: true },
      { id: 'expo-hotel', label: 'Hotel confirmation', status: 'pending', userEntered: false },
      { id: 'expo-notes', label: 'Prepare exhibit notes', status: 'notStarted', userEntered: true },
    ],
    itineraryEntries: [
      { id: 'expo-day-1', date: '2026-09-04', dayNumber: 1, title: 'Expo registration', type: 'activity', time: '09:30', location: 'West Bund' },
    ],
  },
  {
    id: 'planned-6',
    title: 'Hangzhou Lakeside Break',
    location: 'Hangzhou, China',
    route: 'Shanghai - Hangzhou',
    createdAt: '2026-10-02',
    displayDate: '2026-10-02',
    startDate: '2026-10-02',
    endDate: '2026-10-04',
    photos: [],
    audioCount: 0,
    videoCount: 0,
    isSaved: false,
    isLocked: false,
    companions: [],
    peopleIds: [],
    checklistItems: [
      { id: 'lake-rail', label: 'Rail tickets', status: 'completed', userEntered: false },
      { id: 'lake-hotel', label: 'Lakeside hotel', status: 'pending', userEntered: true },
    ],
    itineraryEntries: [
      { id: 'lake-day-1', date: '2026-10-02', dayNumber: 1, title: 'West Lake walk', type: 'activity', time: '17:00', location: 'West Lake' },
    ],
  },
];

export const expenseItems: ExpenseItem[] = [
  { id: 'e1', tripId: 'chengdu', label: 'Airport transfer', category: 'Transportation', amount: 36, day: 1, occurredOn: '2025-07-24', people: ['AZ', 'JH'] },
  { id: 'e2', tripId: 'chengdu', label: 'Hotel to Panda', category: 'Hotel', amount: 58, day: 1, occurredOn: '2025-07-24', people: ['AZ', 'JH'] },
  { id: 'e3', tripId: 'chengdu', label: 'Hotpot dinner', category: 'Food', amount: 42, day: 2, occurredOn: '2025-07-25', people: ['AZ', 'JH', 'ML'] },
  { id: 'e4', tripId: 'chengdu', label: 'Lantern show', category: 'Entertainment', amount: 24, day: 2, occurredOn: '2025-07-25', people: ['AZ'] },
  { id: 'e5', tripId: 'chengdu', label: 'Souvenir market', category: 'Shopping', amount: 20, day: 3, occurredOn: '2025-07-26', people: ['JH'] },
  { id: 'e6', tripId: 'chengdu', label: 'Other supplies', category: 'Others', amount: 20, day: 4, occurredOn: '2025-07-27', people: ['AZ', 'JH'] },
];

const historicalExpenses: ExpenseItem[] = [
  { id: 'h1', tripId: '3', label: 'Train tickets', category: 'Transportation', amount: 92, day: 1, occurredOn: '2025-01-15', people: ['AZ'] },
  { id: 'h2', tripId: 'spring', label: 'Spring hotel', category: 'Hotel', amount: 58, day: 1, occurredOn: '2025-04-08', people: ['AZ'] },
  { id: 'h3', tripId: 'lake', label: 'Lake rental', category: 'Entertainment', amount: 76, day: 1, occurredOn: '2025-06-12', people: ['AZ'] },
  { id: 'h4', tripId: 'autumn', label: 'Museum tickets', category: 'Entertainment', amount: 73, day: 1, occurredOn: '2025-09-21', people: ['AZ'] },
  { id: 'h5', tripId: 'winter', label: 'Holiday rail', category: 'Transportation', amount: 69, day: 1, occurredOn: '2025-11-13', people: ['AZ'] },
];

export const statisticsExpenses = [...expenseItems, ...historicalExpenses];

export const moods: MoodMetric[] = [
  { id: 'overjoyed', percentage: 10 },
  { id: 'happy', percentage: 40 },
  { id: 'neutral', percentage: 20 },
  { id: 'sad', percentage: 10 },
  { id: 'depressed', percentage: 20 },
];

function yearMonth(date: string): string {
  return date.slice(0, 7);
}

function hasRecordsForPeriod(year: number, month?: number): boolean {
  const prefix = month ? `${year}-${String(month).padStart(2, '0')}` : `${year}-`;
  return (
    mockTrips.some((trip) => trip.displayDate.startsWith(prefix)) ||
    statisticsExpenses.some((expense) => expense.occurredOn.startsWith(prefix))
  );
}

export function getStatisticsYearOptions(): StatisticsYearOption[] {
  return [2026, 2025, 2024, 2023].map((year) => ({
    year,
    hasRecords: hasRecordsForPeriod(year),
  }));
}

export function getStatisticsMonthOptions(year: number): StatisticsMonthOption[] {
  return MONTH_NAMES.map((name, index) => ({
    month: index + 1,
    name,
    shortName: name.slice(0, 3),
    hasRecords: hasRecordsForPeriod(year, index + 1),
  }));
}

export function getAnnualSpend(year: number): AnnualSpendPoint[] {
  return getStatisticsMonthOptions(year).map((month) => ({
    key: `${year}-${String(month.month).padStart(2, '0')}`,
    month: month.month,
    label: month.shortName.charAt(0),
    hasRecords: month.hasRecords,
    value: statisticsExpenses
      .filter((expense) => yearMonth(expense.occurredOn) === `${year}-${String(month.month).padStart(2, '0')}`)
      .reduce((total, expense) => total + expense.amount, 0),
  }));
}

export function getStatisticsSummary(year: number, month?: number) {
  const prefix = month ? `${year}-${String(month).padStart(2, '0')}` : `${year}-`;
  const expenses = statisticsExpenses.filter((expense) => expense.occurredOn.startsWith(prefix));
  const trips = mockTrips.filter((trip) => trip.displayDate.startsWith(prefix));
  const tripIds = new Set([...trips.map((trip) => trip.id), ...expenses.map((expense) => expense.tripId)]);
  const travelDays = new Set([...trips.map((trip) => trip.displayDate.slice(0, 10)), ...expenses.map((expense) => expense.occurredOn)]);
  return {
    total: expenses.reduce((total, expense) => total + expense.amount, 0),
    tripCount: tripIds.size,
    travelDays: travelDays.size,
    cityCount: new Set(trips.map((trip) => trip.location)).size,
  };
}

export function getProfileMetrics() {
  return {
    posts: mockTrips.length,
    days: new Set(mockTrips.map((trip) => trip.displayDate.slice(0, 10))).size,
    places: new Set(mockTrips.map((trip) => trip.location)).size,
  };
}

export const galleryImages = [
  'https://picsum.photos/id/1018/500/500',
  'https://picsum.photos/id/1015/500/500',
  'https://picsum.photos/id/1011/500/500',
  'https://picsum.photos/id/1025/500/700',
  'https://picsum.photos/id/1035/500/500',
  'https://picsum.photos/id/1043/500/500',
  'https://picsum.photos/id/1040/500/500',
  'https://picsum.photos/id/1050/500/500',
  'https://picsum.photos/id/1067/500/500',
];

export const searchCategories = [
  { id: 'photos', label: 'Photos', icon: 'images-outline' as const },
  { id: 'audio', label: 'Recorded Audio', icon: 'mic-outline' as const },
  { id: 'text', label: 'Text', icon: 'document-text-outline' as const },
  { id: 'date', label: 'Date', icon: 'calendar-outline' as const },
  { id: 'location', label: 'Location', icon: 'location-outline' as const },
  { id: 'saved', label: 'Saved', icon: 'heart-outline' as const },
  { id: 'people', label: 'People', icon: 'person-outline' as const },
  { id: 'emotion', label: 'Emotion', icon: 'happy-outline' as const },
];

export const settingsSections = [
  {
    title: '',
    items: [
      { label: 'Notifications', icon: 'notifications-outline' as const, route: '/settings/notifications' },
      { label: 'Personal Information', icon: 'person-outline' as const, route: '/settings/profile' },
      { label: 'Language', icon: 'flag-outline' as const, route: '/settings/language', value: 'English (EN)' },
    ],
  },
  {
    title: 'Security & Privacy',
    items: [
      { label: 'Security', icon: 'lock-closed-outline' as const, route: '/settings/security' },
      { label: 'Help Center', icon: 'chatbox-outline' as const, route: '/settings/help' },
    ],
  },
];
