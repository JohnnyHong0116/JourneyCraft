import React from 'react';
import { Image, ImageStyle, ViewStyle } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface IconProps {
  name: string;
  size?: number;
  style?: ImageStyle | ViewStyle;
  theme?: 'light' | 'dark';
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  style, 
  theme,
  color,
}) => {
  const systemColorScheme = useColorScheme();
  const currentTheme = theme || systemColorScheme || 'light';
  
  // 暂时使用 Ionicons 作为占位符，等待自定义图标文件添加
  const getIoniconName = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      // TabBar 图标
      'homeLight': 'home',
      'homeDark': 'home',
      'locationLight': 'location',
      'locationDark': 'location',
      'statsLight': 'stats-chart',
      'statsDark': 'stats-chart',
      'profileLight': 'person',
      'profileDark': 'person',
      
      // 功能图标
      'searchLight': 'search',
      'searchDark': 'search',
      'moreLight': 'ellipsis-horizontal',
      'moreDark': 'ellipsis-horizontal',
      'calendarLight': 'calendar',
      'calendarDark': 'calendar',
      'addLight': 'add',
      'addDark': 'add',
      
      // 卡片图标
      'saveLight': 'heart',
      'saveDark': 'heart',
      'lockLight': 'lock-closed',
      'lockDark': 'lock-closed',
      'peopleGroupLight': 'people',
      'peopleGroupDark': 'people',
      'imageLight': 'image',
      'imageDark': 'image',
      'micLight': 'mic',
      'micDark': 'mic',
      'videoLight': 'videocam',
      'videoDark': 'videocam',
      
      // 其他图标
      'mapPinLight': 'location',
      'mapPinDark': 'location',
    };
    
    return iconMap[iconName] || 'help-circle';
  };

  return (
    <Ionicons 
      name={getIoniconName(name) as any} 
      size={size} 
      color={color ?? (currentTheme === 'light' ? '#000000' : '#FFFFFF')} 
      style={style}
    />
  );
};

// 预定义的图标组件
export const HomeIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="homeLight" {...props} />
);

export const StatsIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="statsLight" {...props} />
);

export const SearchIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="searchLight" {...props} />
);

export const MoreIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="moreLight" {...props} />
);

export const CalendarIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="calendarLight" {...props} />
);

export const AddIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="addLight" {...props} />
);

export const SaveIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="saveLight" {...props} />
);

export const LockIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="lockLight" {...props} />
);

export const PeopleGroupIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="peopleGroupLight" {...props} />
);

export const ImageIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="imageLight" {...props} />
);

export const MicIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="micLight" {...props} />
);

export const VideoIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="videoLight" {...props} />
);

export const MapPinIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="mapPinLight" {...props} />
);

export const LocationIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="locationLight" {...props} />
);

export const ProfileIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="profileLight" {...props} />
);
