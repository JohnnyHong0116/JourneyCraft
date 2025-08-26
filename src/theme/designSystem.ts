import { colors, ColorScheme } from '@/tokens';

const hexToRgb = (hex: string) => {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const withAlpha = (hex: string, alpha: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const scheme: ColorScheme = 'light';
const c = colors[scheme];

// Colors derived strictly from tokens.ts
export const Colors = {
  // Primary
  black: c.utilities,
  white: '#ffffff',

  // Semantic
  error: c.red,
  errorBg: withAlpha(c.red, 0.08),
  errorBorder: withAlpha(c.red, 0.45),

  // Background
  backgroundDefault: c.background,
  backgroundGreen: c.backgroundGreen,
  backgroundTop: c.backgroundTop,

  // Inputs / Surfaces
  inputSearchBackground: c.inputSearchBg,
  cardTheme: c.surfaceCard,

  // Buttons
  addButton: c.addButton,

  // Navigation
  navbarSelected: c.navbarSelected,
  navbarUnselected: c.navbarUnselected,

  // Borders
  borderBrandTertiary: c.grayBar,
  calendarGrid: c.calendar.grid,

  // Text
  textPrimary: c.utilities,
  textSecondary: c.inputText,
  textLight: c.inputText,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 10,
  xl: 15,
  xxl: 20,
  round: 100,
};

export const Typography = {
  // Font families (using system fonts for React Native)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 32,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.3,
    relaxed: 1.5,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.64,
    normal: -0.48,
    wide: -0.32,
    wider: -0.14,
    widest: -0.12,
  },
};

export const Shadows = {
  small: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
};


