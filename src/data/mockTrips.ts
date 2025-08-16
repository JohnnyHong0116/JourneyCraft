import { Trip } from '@/types/trip';

export const mockTrips: Trip[] = [
  // 今日的卡片
  {
    id: '1',
    title: 'Morning Coffee Run',
    location: 'Madison, WI',
    createdAt: new Date().toISOString(),
    displayDate: new Date().toISOString(),
    photos: ['https://example.com/coffee.jpg'],
    audioCount: 0,
    videoCount: 0,
    mood: 'happy',
    isSaved: true,
    isLocked: false,
    companions: ['Sarah']
  },
  
  // 昨日的卡片
  {
    id: '2',
    title: 'Evening Walk',
    location: 'Madison, WI',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    displayDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    photos: [],
    audioCount: 1,
    videoCount: 0,
    mood: 'neutral',
    isSaved: false,
    isLocked: true,
    companions: []
  },
  
  // 今年其他月份
  {
    id: '3',
    title: 'Weekend Trip to Chicago',
    location: 'Chicago, IL',
    createdAt: '2025-01-15T10:00:00Z',
    displayDate: '2025-01-15T10:00:00Z',
    photos: ['https://example.com/chicago1.jpg', 'https://example.com/chicago2.jpg'],
    audioCount: 2,
    videoCount: 1,
    mood: 'overjoyed',
    isSaved: true,
    isLocked: false,
    companions: ['Mike', 'Lisa']
  },
  
  {
    id: '4',
    title: 'Hiking Adventure',
    location: 'Devil\'s Lake, WI',
    createdAt: '2025-01-10T08:00:00Z',
    displayDate: '2025-01-10T08:00:00Z',
    photos: ['https://example.com/hiking.jpg'],
    audioCount: 0,
    videoCount: 0,
    mood: 'happy',
    isSaved: true,
    isLocked: false,
    companions: ['Alex']
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
    mood: 'neutral',
    isSaved: false,
    isLocked: false,
    companions: []
  },
  
  // 往年月份
  {
    id: '6',
    title: 'Summer Beach Trip',
    location: 'Miami, FL',
    createdAt: '2024-07-20T12:00:00Z',
    displayDate: '2024-07-20T12:00:00Z',
    photos: ['https://example.com/beach1.jpg', 'https://example.com/beach2.jpg', 'https://example.com/beach3.jpg'],
    audioCount: 3,
    videoCount: 2,
    mood: 'overjoyed',
    isSaved: true,
    isLocked: false,
    companions: ['Family']
  },
  
  {
    id: '7',
    title: 'Fall Colors Tour',
    location: 'Door County, WI',
    createdAt: '2024-10-15T09:00:00Z',
    displayDate: '2024-10-15T09:00:00Z',
    photos: ['https://example.com/fall.jpg'],
    audioCount: 1,
    videoCount: 0,
    mood: 'happy',
    isSaved: true,
    isLocked: false,
    companions: ['Emma']
  },
  
  {
    id: '8',
    title: 'Winter Ski Trip',
    location: 'Aspen, CO',
    createdAt: '2024-12-28T07:00:00Z',
    displayDate: '2024-12-28T07:00:00Z',
    photos: ['https://example.com/ski1.jpg', 'https://example.com/ski2.jpg'],
    audioCount: 0,
    videoCount: 1,
    mood: 'happy',
    isSaved: false,
    isLocked: true,
    companions: ['Ski Club']
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
    mood: 'neutral',
    isSaved: true,
    isLocked: true,
    companions: ['Work Team']
  },
  
  {
    id: '10',
    title: 'Road Trip to Yellowstone',
    location: 'Yellowstone, WY',
    createdAt: '2024-06-01T06:00:00Z',
    displayDate: '2024-06-01T06:00:00Z',
    photos: ['https://example.com/yellowstone1.jpg', 'https://example.com/yellowstone2.jpg'],
    audioCount: 2,
    videoCount: 3,
    mood: 'overjoyed',
    isSaved: true,
    isLocked: false,
    companions: ['Best Friends']
  }
];
