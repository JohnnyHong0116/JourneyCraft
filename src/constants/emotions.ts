import type { TripMood } from '../types/trip';

export interface EmotionConfig {
  id: TripMood;
  label: string;
  icon: TripMood;
  color: string;
  keywords: readonly string[];
}

export const EMOTIONS: readonly EmotionConfig[] = [
  {
    id: 'overjoyed',
    label: 'Overjoyed',
    icon: 'overjoyed',
    color: '#FACC15',
    keywords: ['overjoyed', 'joyful', 'delighted', 'excited'],
  },
  {
    id: 'happy',
    label: 'Happy',
    icon: 'happy',
    color: '#9BB167',
    keywords: ['happy', 'good', 'smiling', 'content'],
  },
  {
    id: 'neutral',
    label: 'Neutral',
    icon: 'neutral',
    color: '#C0A091',
    keywords: ['neutral', 'okay', 'calm'],
  },
  {
    id: 'sad',
    label: 'Sad',
    icon: 'sad',
    color: '#EF8834',
    keywords: ['sad', 'unhappy', 'low'],
  },
  {
    id: 'depressed',
    label: 'Depressed',
    icon: 'depressed',
    color: '#A688FD',
    keywords: ['depressed', 'awful', 'upset'],
  },
];

export const EMOTION_BY_ID: Record<TripMood, EmotionConfig> = EMOTIONS.reduce(
  (lookup, emotion) => {
    lookup[emotion.id] = emotion;
    return lookup;
  },
  {} as Record<TripMood, EmotionConfig>,
);

export function getEmotionConfig(id: TripMood): EmotionConfig {
  return EMOTION_BY_ID[id];
}
