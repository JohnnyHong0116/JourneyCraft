// 新的 SVG 图标系统（selected/unselected 两态）
// 说明：每个图标按功能位分目录，导出 selected 与 unselected 两种形态。

export type TwoStateSvg = {
  selected: React.ComponentType<any>;
  unselected: React.ComponentType<any>;
};

// 注意：以下仅为声明导出路径；请将实际 SVG 文件按 README 约定放入对应目录
// 例：src/assets/icons/tab/home/selected.svg

export const IconSvg = {
  tab: {
    home: {
      // @ts-ignore - 资源落盘后请移除忽略
      selected: require('./icons/tab/home/selected.svg').default,
      // @ts-ignore
      unselected: require('./icons/tab/home/unselected.svg').default,
    } as TwoStateSvg,
    location: {
      // @ts-ignore
      selected: require('./icons/tab/location/selected.svg').default,
      // @ts-ignore
      unselected: require('./icons/tab/location/unselected.svg').default,
    } as TwoStateSvg,
    stats: {
      // @ts-ignore
      selected: require('./icons/tab/stats/selected.svg').default,
      // @ts-ignore
      unselected: require('./icons/tab/stats/unselected.svg').default,
    } as TwoStateSvg,
    profile: {
      // @ts-ignore
      selected: require('./icons/tab/profile/selected.svg').default,
      // @ts-ignore
      unselected: require('./icons/tab/profile/unselected.svg').default,
    } as TwoStateSvg,
  },
  functional: {
    search: {
      // @ts-ignore
      selected: require('./icons/functional/search/selected.svg').default,
      // @ts-ignore
      unselected: require('./icons/functional/search/unselected.svg').default,
    } as TwoStateSvg,
    more: {
      // @ts-ignore
      selected: require('./icons/functional/more/selected.svg').default,
      // @ts-ignore
      unselected: require('./icons/functional/more/unselected.svg').default,
    } as TwoStateSvg,
    calendar: {
      // @ts-ignore
      selected: require('./icons/functional/calendar/selected.svg').default,
      // @ts-ignore
      unselected: require('./icons/functional/calendar/unselected.svg').default,
    } as TwoStateSvg,
    add: {
      // @ts-ignore
      selected: require('./icons/functional/add/selected.svg').default,
      // @ts-ignore
      unselected: require('./icons/functional/add/unselected.svg').default,
    } as TwoStateSvg,
  },
  card: {
    save: {
      // @ts-ignore
      selected: require('./icons/card/save/selected.svg').default,
      // @ts-ignore
      unselected: require('./icons/card/save/unselected.svg').default,
    } as TwoStateSvg,
    lock: {
      // @ts-ignore
      selected: require('./icons/card/lock/selected.svg').default,
      // @ts-ignore
      unselected: require('./icons/card/lock/unselected.svg').default,
    } as TwoStateSvg,
    people: {
      // @ts-ignore
      selected: require('./icons/card/people/selected.svg').default,
      // @ts-ignore
      unselected: require('./icons/card/people/unselected.svg').default,
    } as TwoStateSvg,
  },
  media: {
    image: {
      // @ts-ignore
      selected: require('./icons/media/image/selected.svg').default,
      // @ts-ignore
      unselected: require('./icons/media/image/unselected.svg').default,
    } as TwoStateSvg,
    mic: {
      // @ts-ignore
      selected: require('./icons/media/mic/selected.svg').default,
      // @ts-ignore
      unselected: require('./icons/media/mic/unselected.svg').default,
    } as TwoStateSvg,
    video: {
      // @ts-ignore
      selected: require('./icons/media/video/selected.svg').default,
      // @ts-ignore
      unselected: require('./icons/media/video/unselected.svg').default,
    } as TwoStateSvg,
  },
} as const;

export type IconCategory = keyof typeof IconSvg;
export type TabIconKey = keyof typeof IconSvg.tab;
