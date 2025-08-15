// Design system constants based on Figma variables
export const Colors = {
  // Primary colors
  black: '#000000',
  white: '#ffffff',
  
  // Background colors
  backgroundDefault: '#ffffff',
  backgroundGreen: '#d8ead0',
  backgroundTop: '#f3f2ed',
  
  // Input colors
  inputSearchBackground: '#e3e3e5',
  cardTheme: '#ffffff',
  
  // Button colors
  addButton: '#b7d58c',
  
  // Border colors
  borderBrandTertiary: '#757575',
  calendarGrid: '#6c6c6c66',
  
  // Text colors
  textPrimary: '#000000',
  textSecondary: '#757575',
  textLight: '#6c6c6c',
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
