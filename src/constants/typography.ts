import { Platform } from 'react-native';

export const typography = {
  fonts: {
    regular: Platform.select({ ios: 'System', android: 'sans-serif' }),
    medium: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
    bold: Platform.select({ ios: 'System', android: 'sans-serif-bold' }),
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    h1: 32,
    h2: 24,
    h3: 20,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};
