export type TripMood = 'overjoyed' | 'happy' | 'neutral' | 'sad' | 'depressed';

export interface Trip {
  id: string;
  title: string;
  location: string;          // "Madison, WI"
  createdAt: string;         // ISO
  displayDate: string;       // ISO, 可被用户修改，默认 = createdAt
  photos: string[];          // 第一张用于卡片封面
  audioCount: number;        // 有则点亮 mic
  videoCount: number;        // 有则点亮 video
  mood?: TripMood;          // 无则不显示圆点
  isSaved?: boolean;
  isLocked?: boolean;
  isPinned?: boolean;        // 是否置顶
  companions?: string[];     // 有元素则显示 people 图标
}

export interface TripSection {
  title: string;
  data: Trip[];
}
