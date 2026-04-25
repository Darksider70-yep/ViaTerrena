import { colors as baseColors } from '../constants/colors';

export function useTheme() {
  const safeColors = baseColors || {
    primary: '#FF3B30',
    secondary: '#007AFF',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    textPrimary: '#1C1C1E',
    textSecondary: '#8E8E93',
    textHint: '#C7C7CC',
    border: '#E5E5EA',
  };

  return {
    isDarkMode: false,
    colors: safeColors,
    theme: safeColors,
  };
}
