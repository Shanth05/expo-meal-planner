import { Platform } from 'react-native';

export const colors = {
  background: '#f4f8f2',
  paper: '#ffffff',
  surfaceSoft: '#fbfdf9',
  surfaceMuted: '#e9f4ed',
  border: '#cfe1d4',
  ink: '#17332c',
  muted: '#5e726a',
  accent: '#1b8a6b',
  accentDark: '#0e5a45',
  forest: '#163f33',
  success: '#4ca86f',
  rose: '#f7d7cc',
  sun: '#f5c768',
  sky: '#d8f0ee',
  danger: '#c85c48',
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
    shadowColor: '#0d4c3b',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
};
