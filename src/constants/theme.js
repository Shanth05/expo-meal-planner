import { Platform } from 'react-native';

export const colors = {
  background: '#f3ecdf',
  paper: '#fffaf2',
  surfaceMuted: '#efe4d2',
  border: '#ddcdb7',
  ink: '#1f1b18',
  muted: '#6f6457',
  accent: '#bd6a2f',
  accentDark: '#7e4218',
  forest: '#3e5c4e',
  success: '#46705a',
  rose: '#e8bea8',
  sun: '#e9ca7d',
  danger: '#a34a42',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const radii = {
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const fonts = {
  heading: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'serif',
  }),
  body: Platform.select({
    ios: 'Avenir Next',
    android: 'sans-serif',
    default: 'System',
  }),
  bodyBold: Platform.select({
    ios: 'Avenir Next Demi Bold',
    android: 'sans-serif-medium',
    default: 'System',
  }),
};

export const shadows = {
  soft: {
    shadowColor: '#5f4c34',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
};
