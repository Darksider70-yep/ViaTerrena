import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../hooks/useTheme';
import { ServiceCategory } from '../services/placesService';

interface CategoryPillProps {
  category: ServiceCategory | 'all';
  label: string;
  emoji: string;
  color: string;
  isSelected: boolean;
  count?: number;
  onPress: () => void;
}

export const CategoryPill = ({
  category,
  label,
  emoji,
  color,
  isSelected,
  count,
  onPress,
}: CategoryPillProps) => {
  const { theme, isDarkMode } = useTheme();

  const selectedBg = category === 'all' 
    ? (isDarkMode ? '#F8FAFC' : '#0F172A')
    : color;

  const selectedText = category === 'all'
    ? (isDarkMode ? '#0F172A' : '#FFFFFF')
    : '#FFFFFF';

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        styles.pill,
        isSelected
          ? { backgroundColor: selectedBg, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }
          : { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border },
      ]}
      accessibilityLabel={`${label} filter — ${count !== undefined ? count : ''} services found`}
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected }}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, { color: isSelected ? selectedText : theme.textSecondary }]}>{label}</Text>
      
      {count !== undefined ? (
        <View style={[styles.badge, isSelected ? { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' } : { backgroundColor: theme.divider }]}>
          <Text style={[styles.badgeText, isSelected ? { color: selectedText } : { color: theme.textPrimary }]}>
            {count}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  emoji: {
    fontSize: 14,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
  },
});
