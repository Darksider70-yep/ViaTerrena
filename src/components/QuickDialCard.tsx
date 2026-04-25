import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../hooks/useTheme';

interface QuickDialCardProps {
  label: string;
  number: string;
  description: string;
  color: string;
  icon?: any;
}

export const QuickDialCard = ({ label, number, description, color, icon = 'alert-circle' }: QuickDialCardProps) => {
  const { theme } = useTheme();

  const handlePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const cleanNumber = number.replace(/\s/g, '');
    Linking.openURL(`tel:${cleanNumber}`);
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>{label}</Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>{description}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.number, { color: color }]}>{number}</Text>
        <Ionicons name="chevron-forward" size={16} color={theme.textHint} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  number: {
    fontSize: 16,
    fontWeight: '800',
    marginRight: 8,
  },
});
