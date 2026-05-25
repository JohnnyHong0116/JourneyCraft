import type { Trip } from '../types/trip';

export interface PlannedDay {
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
  label: string;
  percentage: number;
  color: string;
  icon: string;
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
  },
];

export const plannedDays: PlannedDay[] = [
  { day: 1, label: 'Day 1 July 24', location: 'Tianfu Airport', complete: true },
  { day: 2, label: 'Day 2 July 25', location: 'Chunxi Road', complete: false },
  { day: 3, label: 'Day 3 July 26', location: 'Panda Base', complete: false },
  { day: 4, label: 'Day 4 July 27', location: 'Kuanzhai Alley', complete: false },
];

export const plannedTripCards: Trip[] = [
  {
    id: 'planned-1',
    title: 'Chengdu Summer Escape',
    location: 'Chengdu, China',
    createdAt: '2026-07-24T09:00:00Z',
    displayDate: '2026-07-24T09:00:00Z',
    photos: [],
    audioCount: 0,
    videoCount: 0,
    mood: 'happy',
    isSaved: true,
    isLocked: false,
    isPinned: true,
    companions: ['Amily', 'Johnny'],
  },
  {
    id: 'planned-2',
    title: 'Panda Base Visit',
    location: 'Chenghua District',
    createdAt: '2026-07-25T09:00:00Z',
    displayDate: '2026-07-25T09:00:00Z',
    photos: [],
    audioCount: 0,
    videoCount: 0,
    mood: 'overjoyed',
    isSaved: false,
    isLocked: false,
    companions: ['Amily', 'Johnny'],
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
  { label: 'Overjoyed', percentage: 10, color: '#facd19', icon: 'happy-outline' },
  { label: 'Happy', percentage: 40, color: '#9bb167', icon: 'happy-outline' },
  { label: 'Neutral', percentage: 20, color: '#c0a091', icon: 'remove-circle-outline' },
  { label: 'Sad', percentage: 10, color: '#ef8834', icon: 'sad-outline' },
  { label: 'Depressed', percentage: 20, color: '#a688fd', icon: 'sad-outline' },
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
  { label: 'Photos', icon: 'images-outline' as const },
  { label: 'Recorded Audio', icon: 'mic-outline' as const },
  { label: 'Text Only', icon: 'document-text-outline' as const },
  { label: 'Location', icon: 'location-outline' as const },
  { label: 'Saved', icon: 'heart-outline' as const },
  { label: 'People', icon: 'person-outline' as const },
  { label: 'Emotion', icon: 'happy-outline' as const },
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
