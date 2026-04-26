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
import SkeletonCard from './SkeletonCard';

interface VehicleServiceTabProps {
  category: 'towing' | 'puncture_shop' | 'showroom';
  loading?: boolean;
}

const VehicleServiceTab: React.FC<VehicleServiceTabProps> = ({ category, loading = false }) => {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { cachedNearby } = useAppStore();
  
  const services = cachedNearby[category] || [];
  
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

  if (loading) {
    return (
      <View style={styles.listContent}>
        {[1, 2, 3].map(i => <SkeletonCard key={i} height={100} style={{ marginBottom: 16 }} />)}
      </View>
    );
  }

  if (services.length === 0) {
    const label = category === 'puncture_shop' ? 'Tyre repair shops' : category + ' services';
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🔍</Text>
        <Text style={styles.emptyTitle}>No {label} found nearby</Text>
        <Text style={styles.emptySub}>
          Open the Nearby tab to fetch services for your current location.
        </Text>
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
    marginTop: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 10,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    paddingHorizontal: 20,
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
