import { colors } from '../constants/colors';

export function useTheme() {
  return {
    isDarkMode: false,
    colors,
    theme: colors,
  };
}
