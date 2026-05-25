export type AppIconName =
  | 'add'
  | 'back'
  | 'bookmarksmall-unselected'
  | 'camera'
  | 'cardimage'
  | 'cardlock'
  | 'cardmic'
  | 'cardpeople'
  | 'cardvideo'
  | 'check'
  | 'chevron'
  | 'chevrondown'
  | 'chevronup'
  | 'close'
  | 'date-unselected'
  | 'location-unselected'
  | 'map-unselected'
  | 'menu'
  | 'microphone'
  | 'profile-unselected'
  | 'search-unselected'
  | 'send'
  | 'setting-unselected'
  | 'sparkle'
  | 'sort'
  | 'textformat'
  | 'threedotsSmaller'
  | 'trash'
  | 'edit';

const semanticIconMap: Record<string, AppIconName> = {
  add: 'add',
  'add-circle-outline': 'add',
  'add-outline': 'add',
  'camera-outline': 'camera',
  'calendar-outline': 'date-unselected',
  'calendar': 'date-unselected',
  checkmark: 'check',
  'chevron-back': 'back',
  'chevron-forward': 'chevron',
  'chevron-down': 'chevrondown',
  'chevron-up': 'chevronup',
  'close-circle': 'close',
  'color-wand-outline': 'sparkle',
  'ellipsis-horizontal': 'threedotsSmaller',
  'ellipsis-horizontal-circle': 'threedotsSmaller',
  'image-outline': 'cardimage',
  'images-outline': 'cardimage',
  'lock-closed-outline': 'cardlock',
  'location-outline': 'location-unselected',
  location: 'location-unselected',
  menu: 'menu',
  'mic-outline': 'microphone',
  'list-outline': 'menu',
  'map-outline': 'map-unselected',
  'paper-plane-outline': 'send',
  'people-outline': 'cardpeople',
  'person-outline': 'profile-unselected',
  'search-outline': 'search-unselected',
  search: 'search-unselected',
  'send-outline': 'send',
  'share-outline': 'send',
  'pencil-outline': 'edit',
  'settings-outline': 'setting-unselected',
  'text-outline': 'textformat',
  'trash-outline': 'trash',
  'videocam-outline': 'cardvideo',
};

export function resolveAppIconName(name: string): AppIconName | undefined {
  return semanticIconMap[name];
}
