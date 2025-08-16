// 图标资源导出文件
// 按照 Figma 设计规范，每个图标都有 Light 和 Dark 两种模式
// 注意：实际图标文件需要从 Figma 下载并放置到 src/assets/icons/ 目录下

export const Icons = {
  // TabBar 图标
  // homeLight: require('./icons/home-light.png'),
  // homeDark: require('./icons/home-dark.png'),
  // statsLight: require('./icons/stats-light.png'),
  // statsDark: require('./icons/stats-dark.png'),

  // 功能图标
  // searchLight: require('./icons/search-light.png'),
  // searchDark: require('./icons/search-dark.png'),
  // settingsLight: require('./icons/settings-light.png'),
  // settingsDark: require('./icons/settings-dark.png'),

  // 卡片左侧竖排图标
  // saveLight: require('./icons/save-light.png'),
  // saveDark: require('./icons/save-dark.png'),
  // lockLight: require('./icons/lock-light.png'),
  // lockDark: require('./icons/lock-dark.png'),
  // peopleGroupLight: require('./icons/people-group-light.png'),
  // peopleGroupDark: require('./icons/people-group-dark.png'),

  // 卡片左下横排图标
  // imageLight: require('./icons/image-light.png'),
  // imageDark: require('./icons/image-dark.png'),
  // micLight: require('./icons/mic-light.png'),
  // micDark: require('./icons/mic-dark.png'),
  // videoLight: require('./icons/video-light.png'),
  // videoDark: require('./icons/video-dark.png'),

  // 其他零散图标
  // addLight: require('./icons/add-light.png'),
  // addDark: require('./icons/add-dark.png'),
  // moreLight: require('./icons/more-light.png'),
  // moreDark: require('./icons/more-dark.png'),
  // calendarLight: require('./icons/calendar-light.png'),
  // calendarDark: require('./icons/calendar-dark.png'),
  // mapPinLight: require('./icons/map-pin-light.png'),
  // mapPinDark: require('./icons/map-pin-dark.png'),
  
  // Bottom Navigation Bar 图标
  // locationLight: require('./icons/location-light.png'),
  // locationDark: require('./icons/location-dark.png'),
  // profileLight: require('./icons/profile-light.png'),
  // profileDark: require('./icons/profile-dark.png'),
} as const;

// 图标类型定义
export type IconName = keyof typeof Icons;

// 根据主题获取图标的辅助函数
export function getIcon(name: IconName, theme: 'light' | 'dark' = 'light') {
  // 暂时返回 null，等待图标文件添加
  return null;
}

// 常用图标组合
export const IconSets = {
  // TabBar 图标集
  tabBar: {
    home: {
      light: null, // Icons.homeLight,
      dark: null, // Icons.homeDark,
    },
    location: {
      light: null, // Icons.locationLight,
      dark: null, // Icons.locationDark,
    },
    stats: {
      light: null, // Icons.statsLight,
      dark: null, // Icons.statsDark,
    },
    profile: {
      light: null, // Icons.profileLight,
      dark: null, // Icons.profileDark,
    },
  },

  // 卡片图标集
  card: {
    save: {
      light: null, // Icons.saveLight,
      dark: null, // Icons.saveDark,
    },
    lock: {
      light: null, // Icons.lockLight,
      dark: null, // Icons.lockDark,
    },
    peopleGroup: {
      light: null, // Icons.peopleGroupLight,
      dark: null, // Icons.peopleGroupDark,
    },
    image: {
      light: null, // Icons.imageLight,
      dark: null, // Icons.imageDark,
    },
    mic: {
      light: null, // Icons.micLight,
      dark: null, // Icons.micDark,
    },
    video: {
      light: null, // Icons.videoLight,
      dark: null, // Icons.videoDark,
    },
  },

  // 功能图标集
  functional: {
    search: {
      light: null, // Icons.searchLight,
      dark: null, // Icons.searchDark,
    },
    settings: {
      light: null, // Icons.settingsLight,
      dark: null, // Icons.settingsDark,
    },
    add: {
      light: null, // Icons.addLight,
      dark: null, // Icons.addDark,
    },
  },
} as const;
