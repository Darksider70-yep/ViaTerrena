import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { VehicleServiceCard } from '../components/VehicleServiceCard';
import { NearbyPlace } from '../services/placesService';
import { useNavigation } from '@react-navigation/native';

type VehicleTab = 'towing' | 'puncture_shop' | 'showroom';

const VEHICLE_TABS: { id: VehicleTab; label: string; emoji: string }[] = [
  { id: 'towing', label: 'Towing', emoji: '🚗' },
  { id: 'puncture_shop', label: 'Tyre Repair', emoji: '🔧' },
  { id: 'showroom', label: 'Showrooms', emoji: '🏪' },
];

export default function VehicleHelpScreen() {
  const [activeTab, setActiveTab] = useState<VehicleTab>('towing');
  const { theme, colors } = useTheme();
  const navigation = useNavigation<any>();
  const cachedNearby = useAppStore((s) => s.cachedNearby);

  const data = useMemo(() => {
    return cachedNearby[activeTab] || [];
  }, [cachedNearby, activeTab]);

  const handleCall = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  }, []);

  const handleDirections = useCallback((place: NearbyPlace) => {
    const url = Platform.select({
      ios: `maps:?daddr=${place.latitude},${place.longitude}`,
      android: `google.navigation:q=${place.latitude},${place.longitude}`,
    });
    if (url) Linking.openURL(url);
  }, []);

  const renderTab = ({ id, label, emoji }: { id: VehicleTab; label: string; emoji: string }) => {
    const isActive = activeTab === id;
    return (
      <TouchableOpacity
        key={id}
        style={[styles.tab, isActive && { borderBottomColor: '#BA7517' }]}
        onPress={() => setActiveTab(id)}
      >
        <Text style={[styles.tabEmoji, !isActive && { opacity: 0.6 }]}>{emoji}</Text>
        <Text style={[styles.tabLabel, { color: isActive ? '#BA7517' : theme.textSecondary }, isActive && styles.tabLabelActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Vehicle Help</Text>
        <View style={styles.tabBar}>
          {VEHICLE_TABS.map(renderTab)}
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.placeId}
        renderItem={({ item }) => (
          <VehicleServiceCard
            place={item}
            onCallPress={handleCall}
            onDirectionsPress={handleDirections}
            onPress={(p) => handleDirections(p)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{VEHICLE_TABS.find(t => t.id === activeTab)?.emoji}</Text>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No vehicle services loaded yet</Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
              Go to the Nearby tab and your location will be searched automatically.
            </Text>
            <TouchableOpacity 
              style={[styles.nearbyBtn, { backgroundColor: colors.secondary }]}
              onPress={() => navigation.navigate('Nearby')}
            >
              <Text style={styles.nearbyBtnText}>Open Nearby Tab →</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    paddingHorizontal: 24,
    marginBottom: 16,
    letterSpacing: -1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabLabelActive: {
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  nearbyBtn: {
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  nearbyBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});
