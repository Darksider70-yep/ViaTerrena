import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NearbyPlace } from '../services/placesService';
import { formatDistance } from '../utils/distance';
import { useTheme } from '../hooks/useTheme';

interface VehicleServiceCardProps {
  place: NearbyPlace;
  onCallPress: (phoneNumber: string) => void;
  onDirectionsPress: (place: NearbyPlace) => void;
  onPress: (place: NearbyPlace) => void;
  style?: ViewStyle;
}

const AMBER = '#BA7517';

export const VehicleServiceCard = React.memo(({
  place,
  onCallPress,
  onDirectionsPress,
  onPress,
  style,
}: VehicleServiceCardProps) => {
  const { theme, colors } = useTheme();
  
  const showDirections = place.distanceKm <= 50;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }, style]}
      onPress={() => onPress(place)}
      activeOpacity={0.9}
    >
      <View style={styles.mainContent}>
        <View style={[styles.iconBox, { backgroundColor: AMBER + '10' }]}>
          <Text style={styles.emoji}>🚗</Text>
        </View>
        
        <View style={styles.details}>
          <View style={styles.titleRow}>
            <Text style={[styles.name, { color: theme.textPrimary }]} numberOfLines={1}>{place.name}</Text>
            <Text style={[styles.distance, { color: AMBER }]}>
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
                  style={[styles.miniAction, { backgroundColor: AMBER + '15' }]}
                  onPress={() => onCallPress(place.phoneNumber!)}
                >
                  <Ionicons name="call" size={16} color={AMBER} />
                </TouchableOpacity>
              )}
              {showDirections && (
                <TouchableOpacity
                  style={[styles.miniAction, { backgroundColor: colors.info + '15' }]}
                  onPress={() => onDirectionsPress(place)}
                >
                  <Ionicons name="navigate" size={16} color={colors.info} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  mainContent: {
    flexDirection: 'row',
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 28,
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
  },
  distance: {
    fontSize: 12,
    fontWeight: '800',
  },
  address: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 10,
    opacity: 0.7,
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
    gap: 8,
  },
  miniAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
