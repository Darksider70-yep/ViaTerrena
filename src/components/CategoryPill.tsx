import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';

interface CategoryPillProps {
  label: string;
  emoji: string;
  active: boolean;
  onPress: () => void;
  activeColor?: string;
}

export const CategoryPill = ({ 
  label, 
  emoji, 
  active, 
  onPress, 
  activeColor = colors.secondary 
}: CategoryPillProps) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        active && { backgroundColor: activeColor, borderColor: activeColor }
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emoji: {
    fontSize: 14,
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  activeLabel: {
    color: '#FFFFFF',
  },
});
