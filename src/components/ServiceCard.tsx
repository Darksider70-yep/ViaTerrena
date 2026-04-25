import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { NearbyPlace } from '../services/placesService';
import { formatDistance } from '../utils/distance';

interface ServiceCardProps {
  place: NearbyPlace;
  onPress?: () => void;
  onCallPress?: () => void;
}

export const ServiceCard = ({ place, onPress, onCallPress }: ServiceCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{place.name}</Text>
          <Text style={styles.distance}>{formatDistance(place.distanceKm)}</Text>
        </View>
        
        <Text style={styles.address} numberOfLines={2}>{place.vicinity}</Text>
        
        <View style={styles.footer}>
          {place.rating && (
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{place.rating}</Text>
            </View>
          )}
          
          {place.phoneNumber && (
            <TouchableOpacity 
              style={styles.callButton} 
              onPress={onCallPress}
            >
              <Ionicons name="call" size={16} color="#FFFFFF" />
              <Text style={styles.callText}>Call</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  distance: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  callButton: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  callText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
