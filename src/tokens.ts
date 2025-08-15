export const colors = {
  light: {
    // core
    background: '#f3f2ed',
    backgroundTop: '#f3f2ed',
    backgroundGreen: '#d8ead0',
    surfaceCard: '#ffffff',
    navbar: '#ffffff',
    navbarSelected: '#5faf70',
    navbarUnselected: '#cacbcf',
    addButton: '#b7d58c',
    buttonBg: '#e5e1e0',
    utilities: '#000000',
    red: '#c1221b',
    shadowTint: '#00000040',
    graphGrid: '#00001a26',
    segmentedLine: '#000000b3',
    dropdownGlass: '#ffffffcc',
    searchCategoryBg: '#383e3a',
    inputText: '#5d5d63',
    inputSearchBg: '#e3e3e5',
    grayBar: '#919090',

    // calendar
    calendar: {
      background: '#ffffff', // = Card theme
      grid: '#6c6c6c66',
      dayDisabledBg: '#6c6c6c80',
      dateText: '#000000',
      locationText: '#373737',
      dayDisabledText: '#c9c9c9',
      todayBg: '#5faf7080',
      contentBar: '#cdff87',
      dropdownBg: '#d5e9cf',
      dropdownGreen: '#8dbb77',
      greenPoint: '#4e7b48',
      stroke: '#373737',
    },

    // states / mood
    states: {
      sad: '#ef8834',
      depressed: '#a688fd',
      neutral: '#c0a091',
      happy: '#9bb167',
      overjoyed: '#facc15',
      overjoyed25: '#facc1540',
      happy25: '#9bb16740',
      neutral25: '#c0a09140',
      depressed25: '#a688fd40',
      sad25: '#ef883440',
    },

    // misc
    avatarBg: '#cdeec7',
  },

  dark: {
    // core
    background: '#121212',
    backgroundTop: '#0e0e0e',
    backgroundGreen: '#163227',
    surfaceCard: '#2c2c2c',
    navbar: '#1e1e1e',
    navbarSelected: '#62ad74',
    navbarUnselected: '#6b7073',
    addButton: '#b7d58d',
    buttonBg: '#2e2d35',
    utilities: '#ffffff',
    red: '#ed7368',
    shadowTint: '#ffffff33',
    graphGrid: '#f5f5f726',
    segmentedLine: '#cececeb3',
    dropdownGlass: '#2c2c2ccc',
    searchCategoryBg: '#dcdfe9',
    inputText: '#afafb7',
    inputSearchBg: '#262629',
    grayBar: '#b8b8b8',

    // calendar
    calendar: {
      background: '#2c2c2c', // = Card theme
      grid: '#8b8b8b66',
      dayDisabledBg: '#6c6c6c80',
      dateText: '#ffffff',
      locationText: '#efebeb',
      dayDisabledText: '#737373',
      todayBg: '#62ad7480',
      contentBar: '#cdff87',
      dropdownBg: '#627958',
      dropdownGreen: '#273324',
      greenPoint: '#b9e98e',
      stroke: '#8c8b8b',
    },

    // states / mood
    states: {
      sad: '#ef8834',
      depressed: '#a688fd',
      neutral: '#c0a091',
      happy: '#9bb167',
      overjoyed: '#facc15',
      overjoyed25: '#facc1540',
      happy25: '#9bb16740',
      neutral25: '#c0a09140',
      depressed25: '#a688fd40',
      sad25: '#ef883440',
    },

    // misc
    avatarBg: '#4c7b57',
  },
} as const;

export type ColorScheme = keyof typeof colors; // 'light' | 'dark'

export function getColor(path: string, scheme: ColorScheme = 'light') {
  // 支持 "calendar.background" 这种点路径读取
  const parts = path.split('.');
  // @ts-ignore
  return parts.reduce((acc, k) => acc?.[k], colors[scheme]);
}
