// 新的 SVG 图标系统（selected/unselected 两态）
// 注意：本映射与 src/assets/icons 目录中的实际文件名保持一致（扁平化目录）

export type TwoStateSvg = {
  selected: React.ComponentType<any>;
  unselected: React.ComponentType<any>;
};

export const IconSvg = {
  // Tab / 导航类（有两态）
  home: {
    selected: require('./icons/home-selected.svg').default,
    unselected: require('./icons/home-unselected.svg').default,
  } as TwoStateSvg,
  map: {
    selected: require('./icons/map-selected.svg').default,
    unselected: require('./icons/map-unselected.svg').default,
  } as TwoStateSvg,
  stats: {
    selected: require('./icons/stats-selected.svg').default,
    unselected: require('./icons/stats-unselected.svg').default,
  } as TwoStateSvg,
  profile: {
    selected: require('./icons/profile-selected.svg').default,
    unselected: require('./icons/profile-unselected.svg').default,
  } as TwoStateSvg,

  // 常用功能（有两态）
  search: {
    selected: require('./icons/search-selected.svg').default,
    unselected: require('./icons/search-unselected.svg').default,
  } as TwoStateSvg,
  setting: {
    selected: require('./icons/setting-selected.svg').default,
    unselected: require('./icons/setting-unselected.svg').default,
  } as TwoStateSvg,
  filter: {
    selected: require('./icons/filter-selected.svg').default,
    unselected: require('./icons/filter-unselected.svg').default,
  } as TwoStateSvg,

  // 媒体与标记（有两态）
  photo: {
    selected: require('./icons/photo-selected.svg').default,
    unselected: require('./icons/photo-unselected.svg').default,
  } as TwoStateSvg,
  pin: {
    selected: require('./icons/pin-selected.svg').default,
    unselected: require('./icons/pin-unselected.svg').default,
  } as TwoStateSvg,

  // 时间/状态（有两态）
  date: {
    selected: require('./icons/date-selected.svg').default,
    unselected: require('./icons/date-unselected.svg').default,
  } as TwoStateSvg,
  hourglass: {
    selected: require('./icons/hourglass-selected.svg').default,
    unselected: require('./icons/hourglass-unselected.svg').default,
  } as TwoStateSvg,
  bell: {
    selected: require('./icons/bell-selected.svg').default,
    unselected: require('./icons/bell-unselected.svg').default,
  } as TwoStateSvg,

  // 收藏（有两态）
  bookmark: {
    selected: require('./icons/bookmark-selected.svg').default,
    unselected: require('./icons/bookmark-unselected.svg').default,
  } as TwoStateSvg,
  bookmarksmall: {
    selected: require('./icons/bookmarksmall-selected.svg').default,
    unselected: require('./icons/bookmarksmall-unselected.svg').default,
  } as TwoStateSvg,

  // 常用功能（单态 → 两态同源）
  add: {
    selected: require('./icons/add.svg').default,
    unselected: require('./icons/add.svg').default,
  } as TwoStateSvg,

  // 卡片内容/操作（单态 → 两态同源）
  cardimage: {
    selected: require('./icons/cardimage.svg').default,
    unselected: require('./icons/cardimage.svg').default,
  } as TwoStateSvg,
  cardlock: {
    selected: require('./icons/cardlock.svg').default,
    unselected: require('./icons/cardlock.svg').default,
  } as TwoStateSvg,
  cardmic: {
    selected: require('./icons/cardmic.svg').default,
    unselected: require('./icons/cardmic.svg').default,
  } as TwoStateSvg,
  cardpeople: {
    selected: require('./icons/cardpeople.svg').default,
    unselected: require('./icons/cardpeople.svg').default,
  } as TwoStateSvg,
  cardsave: {
    selected: require('./icons/cardsave.svg').default,
    unselected: require('./icons/cardsave.svg').default,
  } as TwoStateSvg,
  cardvideo: {
    selected: require('./icons/cardvideo.svg').default,
    unselected: require('./icons/cardvideo.svg').default,
  } as TwoStateSvg,
  cardview: {
    selected: require('./icons/cardview.svg').default,
    unselected: require('./icons/cardview.svg').default,
  } as TwoStateSvg,
  edit: {
    selected: require('./icons/edit.svg').default,
    unselected: require('./icons/edit.svg').default,
  } as TwoStateSvg,
  sorting: {
    selected: require('./icons/sorting.svg').default,
    unselected: require('./icons/sorting.svg').default,
  } as TwoStateSvg,
  piechart: {
    selected: require('./icons/piechart.svg').default,
    unselected: require('./icons/piechart.svg').default,
  } as TwoStateSvg,
  threedots: {
    selected: require('./icons/threedots.svg').default,
    unselected: require('./icons/threedots.svg').default,
  } as TwoStateSvg,
  threedotsSmaller: {
    selected: require('./icons/threedots-smaller.svg').default,
    unselected: require('./icons/threedots-smaller.svg').default,
  } as TwoStateSvg,
  redooutline: {
    selected: require('./icons/redooutline.svg').default,
    unselected: require('./icons/redooutline.svg').default,
  } as TwoStateSvg,
  undooutline: {
    selected: require('./icons/undooutline.svg').default,
    unselected: require('./icons/undooutline.svg').default,
  } as TwoStateSvg,

  // 心情状态（单态）
  overjoyed: {
    selected: require('./icons/overjoyed.svg').default,
    unselected: require('./icons/overjoyed.svg').default,
  } as TwoStateSvg,
  happy: {
    selected: require('./icons/happy.svg').default,
    unselected: require('./icons/happy.svg').default,
  } as TwoStateSvg,
  neutral: {
    selected: require('./icons/neural.svg').default,
    unselected: require('./icons/neural.svg').default,
  } as TwoStateSvg,
  sad: {
    selected: require('./icons/sad.svg').default,
    unselected: require('./icons/sad.svg').default,
  } as TwoStateSvg,
  depressed: {
    selected: require('./icons/depressed.svg').default,
    unselected: require('./icons/depressed.svg').default,
  } as TwoStateSvg,

  // 圆形功能类（单态）
  circlecalendarview: {
    selected: require('./icons/circlecalendarview.svg').default,
    unselected: require('./icons/circlecalendarview.svg').default,
  } as TwoStateSvg,
  circlecardview: {
    selected: require('./icons/circlecardview.svg').default,
    unselected: require('./icons/circlecardview.svg').default,
  } as TwoStateSvg,
  circleclose: {
    selected: require('./icons/circleclose.svg').default,
    unselected: require('./icons/circleclose.svg').default,
  } as TwoStateSvg,
  circledelete: {
    selected: require('./icons/circledelete.svg').default,
    unselected: require('./icons/circledelete.svg').default,
  } as TwoStateSvg,
  circlefilter: {
    selected: require('./icons/circlefilter.svg').default,
    unselected: require('./icons/circlefilter.svg').default,
  } as TwoStateSvg,
  circlemenu: {
    selected: require('./icons/circlemenu.svg').default,
    unselected: require('./icons/circlemenu.svg').default,
  } as TwoStateSvg,
  circlephoto: {
    selected: require('./icons/circlephoto.svg').default,
    unselected: require('./icons/circlephoto.svg').default,
  } as TwoStateSvg,
  circlepin: {
    selected: require('./icons/circlepin.svg').default,
    unselected: require('./icons/circlepin.svg').default,
  } as TwoStateSvg,
  circleredo: {
    selected: require('./icons/circleredo.svg').default,
    unselected: require('./icons/circleredo.svg').default,
  } as TwoStateSvg,
  circlesave: {
    selected: require('./icons/circlesave.svg').default,
    unselected: require('./icons/circlesave.svg').default,
  } as TwoStateSvg,
  circlesearch: {
    selected: require('./icons/circlesearch.svg').default,
    unselected: require('./icons/circlesearch.svg').default,
  } as TwoStateSvg,
  circleshare: {
    selected: require('./icons/circleshare.svg').default,
    unselected: require('./icons/circleshare.svg').default,
  } as TwoStateSvg,
  circlesharenew: {
    selected: require('./icons/circlesharenew.svg').default,
    unselected: require('./icons/circlesharenew.svg').default,
  } as TwoStateSvg,
  circlesort: {
    selected: require('./icons/circlesort.svg').default,
    unselected: require('./icons/circlesort.svg').default,
  } as TwoStateSvg,
  circlethreedots: {
    selected: require('./icons/circlethreedots.svg').default,
    unselected: require('./icons/circlethreedots.svg').default,
  } as TwoStateSvg,
  circleundo: {
    selected: require('./icons/circleundo.svg').default,
    unselected: require('./icons/circleundo.svg').default,
  } as TwoStateSvg,
  circleunpin: {
    selected: require('./icons/circleunpin.svg').default,
    unselected: require('./icons/circleunpin.svg').default,
  } as TwoStateSvg,
  circleunsave: {
    selected: require('./icons/circleunsave.svg').default,
    unselected: require('./icons/circleunsave.svg').default,
  } as TwoStateSvg,

  // 人物（数量态，单态）
  people0: {
    selected: require('./icons/people0.svg').default,
    unselected: require('./icons/people0.svg').default,
  } as TwoStateSvg,
  people1: {
    selected: require('./icons/people1.svg').default,
    unselected: require('./icons/people1.svg').default,
  } as TwoStateSvg,
  people2: {
    selected: require('./icons/people2.svg').default,
    unselected: require('./icons/people2.svg').default,
  } as TwoStateSvg,
  peoplemulti: {
    selected: require('./icons/peoplemulti.svg').default,
    unselected: require('./icons/peoplemulti.svg').default,
  } as TwoStateSvg,
} as const;

export type IconKey = keyof typeof IconSvg;
