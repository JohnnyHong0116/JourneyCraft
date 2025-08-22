import React from 'react';
import { IconSvg } from '@/assets/icons';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color,
}) => {
  // 解析名称：支持 "key-selected" / "key-unselected"，否则默认 selected
  let iconKey = name as keyof typeof IconSvg | string;
  let state: 'selected' | 'unselected' = 'selected';

  if (name.includes('-')) {
    const parts = name.split('-');
    const maybeState = parts[parts.length - 1];
    if (maybeState === 'selected' || maybeState === 'unselected') {
      state = maybeState;
      iconKey = parts.slice(0, -1).join('-');
    }
  }

  // 取出对应的 SVG 组件
  // @ts-ignore 动态索引
  const pack = IconSvg[iconKey];
  const IconComponent = pack?.[state] ?? pack?.selected;

  if (!IconComponent) return null;

  // 关键：把 color 透传给 svg，使其被 currentColor 使用
  return <IconComponent width={size} height={size} color={color} />;
};

// 预定义的图标组件 - 使用新的命名方式（始终 selected，由颜色控制状态）
export const HomeIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="home-selected" {...props} />
);

export const StatsIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="stats-selected" {...props} />
);

export const SearchIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="search-selected" {...props} />
);

export const MoreIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="threedots" {...props} />
);

export const CalendarIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="date-selected" {...props} />
);

export const AddIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="add-selected" {...props} />
);

export const SaveIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="cardsave" {...props} />
);

export const LockIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="cardlock" {...props} />
);

export const PeopleGroupIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="cardpeople" {...props} />
);

export const ImageIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="cardimage" {...props} />
);

export const MicIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="cardmic" {...props} />
);

export const VideoIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="cardvideo" {...props} />
);

export const MapPinIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="pin-selected" {...props} />
);

export const LocationIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="pin-selected" {...props} />
);

export const ProfileIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="profile-selected" {...props} />
);
