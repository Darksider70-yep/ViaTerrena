import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NearbyPlace } from '../services/placesService';
import { formatDistance } from '../utils/distance';
import { SERVICE_CATEGORIES } from '../constants/serviceCategories';
import { useTheme } from '../hooks/useTheme';

interface ServiceCardProps {
  place: NearbyPlace;
  onCallPress: (phoneNumber: string) => void;
  onDirectionsPress: (place: NearbyPlace) => void;
  onPress: (place: NearbyPlace) => void;
  style?: ViewStyle;
}

export const ServiceCard = React.memo(({
  place,
  onCallPress,
  onDirectionsPress,
  onPress,
  style,
}: ServiceCardProps) => {
  const { theme, colors, isDarkMode } = useTheme();
  
  const catInfo = SERVICE_CATEGORIES.find(c => c.id === place.category) || {
    color: colors.primary,
    emoji: '📍'
  };

  return (
    <TouchableOpacity
      style={[
        styles.card, 
        { 
          backgroundColor: theme.surface, 
          borderColor: theme.border,
          shadowColor: isDarkMode ? 'transparent' : '#000' // Kill shadow in dark mode if it leaks
        }, 
        style
      ]}
      onPress={() => onPress(place)}
      activeOpacity={0.9}
    >
      <View style={styles.mainContent}>
        <View style={[styles.iconBox, { backgroundColor: catInfo.color + (isDarkMode ? '25' : '10') }]}>
          <Text style={styles.emoji}>{catInfo.emoji}</Text>
        </View>
        
        <View style={styles.details}>
          <View style={styles.titleRow}>
            <Text style={[styles.name, { color: theme.textPrimary }]} numberOfLines={1}>{place.name}</Text>
            <Text style={[styles.distance, { color: catInfo.color }]}>
              {formatDistance(place.distanceKm)}
            </Text>
          </View>
          
          <Text style={[styles.address, { color: theme.textSecondary }]} numberOfLines={1}>
            {place.vicinity}
          </Text>

          <View style={styles.bottomMeta}>
            {place.openNow !== undefined && (
              <View style={[styles.statusTag, { backgroundColor: place.openNow ? colors.success + '15' : colors.danger + '15' }]}>
                <View style={[styles.statusDot, { backgroundColor: place.openNow ? colors.success : colors.danger }]} />
                <Text style={[styles.statusText, { color: place.openNow ? colors.success : colors.danger }]}>
                  {place.openNow ? 'OPEN NOW' : 'CLOSED'}
                </Text>
              </View>
            )}
            <View style={styles.flexSpacer} />
            <View style={styles.actionRow}>
              {place.phoneNumber && (
                <TouchableOpacity
                  style={[styles.miniAction, { backgroundColor: colors.secondary + (isDarkMode ? '25' : '15') }]}
                  onPress={() => onCallPress(place.phoneNumber!)}
                >
                  <Ionicons name="call" size={16} color={colors.secondary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.miniAction, { backgroundColor: colors.warning + (isDarkMode ? '25' : '15') }]}
                onPress={() => onDirectionsPress(place)}
              >
                <Ionicons name="navigate" size={16} color={colors.warning} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    // On Android, elevation can cause a white shadow on dark backgrounds
    // We'll use very subtle settings or just borders for Dark Mode
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  mainContent: {
    flexDirection: 'row',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 26,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
    letterSpacing: -0.3,
  },
  distance: {
    fontSize: 12,
    fontWeight: '800',
  },
  address: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 12,
    opacity: 0.8,
  },
  bottomMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  flexSpacer: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  miniAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
