import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAppStore } from '../store/useAppStore';
import { ServiceCard } from './ServiceCard';
import { colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList } from '../navigation/RootNavigator';
import { NearbyPlace } from '../services/placesService';

interface VehicleServiceTabProps {
  category: 'towing' | 'puncture_shop' | 'showroom';
}

const VehicleServiceTab: React.FC<VehicleServiceTabProps> = ({ category }) => {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { cachedNearby } = useAppStore();
  
  const services = cachedNearby[category] || [];
  
  // Sort by distance if available
  const sortedServices = [...services].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

  const handleCall = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  }, []);

  const handleDirections = useCallback((place: NearbyPlace) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${place.name}@${place.latitude},${place.longitude}`,
      android: `geo:0,0?q=${place.latitude},${place.longitude}(${place.name})`,
    });
    if (url) Linking.openURL(url);
  }, []);

  if (services.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons 
          name={category === 'towing' ? 'car-outline' : category === 'puncture_shop' ? 'construct-outline' : 'business-outline'} 
          size={64} 
          color={colors.textHint} 
        />
        <Text style={styles.emptyTitle}>No {category.replace('_', ' ')} found</Text>
        <Text style={styles.emptySub}>Open the Nearby tab to search and refresh services near you.</Text>
        <TouchableOpacity 
          style={styles.refreshBtn}
          onPress={() => navigation.navigate('Nearby')}
        >
          <Text style={styles.refreshBtnText}>Go to Nearby →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={sortedServices}
      keyExtractor={(item) => item.placeId}
      renderItem={({ item }) => (
        <ServiceCard 
          place={item} 
          onCallPress={handleCall}
          onDirectionsPress={handleDirections}
          onPress={handleDirections}
        />
      )}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 20,
    textTransform: 'capitalize',
  },
  emptySub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  refreshBtn: {
    marginTop: 24,
    backgroundColor: colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  refreshBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default React.memo(VehicleServiceTab);
