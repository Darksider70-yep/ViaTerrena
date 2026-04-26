import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView from 'react-native-maps';
import { useAppStore } from '../store/useAppStore';
import { useNearbyServices } from '../hooks/useNearbyServices';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { SERVICE_CATEGORIES } from '../constants/serviceCategories';
import { CategoryPill } from '../components/CategoryPill';
import { OfflineBanner } from '../components/OfflineBanner';
import { ResultsCountBadge } from '../components/ResultsCountBadge';
import { NearbyPlace } from '../services/placesService';
import { useTheme } from '../hooks/useTheme';
import { CustomMapView } from '../components/MapView';
import { ServiceListItem } from '../components/ServiceListItem';
import SkeletonCard from '../components/SkeletonCard';

const RADIUS_OPTIONS = [
  { label: '5km', value: 5000 },
  { label: '10km', value: 10000 },
  { label: '25km', value: 25000 },
];

export default function NearbyScreen() {
  const { userCoords, selectedCategory, setSelectedCategory, cacheTimestamp } = useAppStore();
  const [radiusMeters, setRadiusMeters] = useState(10000);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const flashAnim = useRef(new Animated.Value(0)).current;

  const { theme, isDarkMode, colors } = useTheme();
  const { isOnline } = useNetworkStatus();
  const {
    places,
    loading,
    isRefreshing,
    refresh,
    isFromCache,
    locationMismatch,
    totalCount,
  } = useNearbyServices(radiusMeters);

  const mapRef = useRef<MapView>(null);
  const listRef = useRef<FlatList>(null);

  const PROMPT_CATEGORY_COLORS: Record<string, string> = {
    hospital: colors.hospital,
    ambulance: colors.ambulance,
    police: colors.police,
    towing: colors.towing,
    puncture_shop: colors.puncture,
    showroom: colors.showroom,
  };

  const getMarkerColor = useCallback((category: string) => {
    return PROMPT_CATEGORY_COLORS[category] || colors.primary;
  }, [colors]);

  const handleCall = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone}`);
  }, []);

  const handleDirections = useCallback((place: NearbyPlace) => {
    const url = Platform.select({
      ios: `maps:?daddr=${place.latitude},${place.longitude}`,
      android: `google.navigation:q=${place.latitude},${place.longitude}`,
    });
    if (url) Linking.openURL(url);
  }, []);

  const handleMarkerCalloutPress = useCallback((place: NearbyPlace) => {
    const index = places.findIndex(p => p.placeId === place.placeId);
    if (index !== -1 && listRef.current) {
      listRef.current.scrollToIndex({ index, animated: true });
      
      setHighlightedId(place.placeId);
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
        Animated.timing(flashAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
      ]).start(() => setHighlightedId(null));
    }
  }, [places, flashAnim]);

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.surface }]}>
      <View style={styles.headerTop}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Nearby Services</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Finding help around you</Text>
        </View>
        <View style={[styles.radiusSelector, { backgroundColor: theme.background }]}>
          {RADIUS_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setRadiusMeters(opt.value)}
              style={[
                styles.radiusBtn,
                radiusMeters === opt.value ? [styles.radiusBtnActive, { backgroundColor: theme.surface }] : null,
              ]}
              accessibilityLabel={`Set radius to ${opt.label}`}
              accessibilityRole="button"
            >
              <Text style={[
                styles.radiusText,
                { color: theme.textSecondary },
                radiusMeters === opt.value && { color: theme.textPrimary }
              ]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.pillContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillScroll}>
          <CategoryPill
            category="all"
            label="All"
            emoji="🔍"
            color={colors.textPrimary}
            isSelected={selectedCategory === 'all'}
            onPress={() => setSelectedCategory('all')}
          />
          {SERVICE_CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat.id}
              category={cat.id as any}
              label={cat.label}
              emoji={cat.emoji}
              color={cat.color}
              isSelected={selectedCategory === cat.id}
              count={places.filter(p => p.category === cat.id).length}
              onPress={() => setSelectedCategory(cat.id as any)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );

  if (!userCoords) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Locating you...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      {renderHeader()}
      
      <OfflineBanner 
        isFromCache={isFromCache} 
        cacheTimestamp={cacheTimestamp} 
        locationMismatch={locationMismatch}
      />
      
      <View style={[styles.mapContainer, { backgroundColor: theme.background }]}>
        <CustomMapView
          ref={mapRef}
          places={places}
          getMarkerColor={getMarkerColor}
          onMarkerCalloutPress={handleMarkerCalloutPress}
          initialRegion={{
            latitude: userCoords.latitude,
            longitude: userCoords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          userInterfaceStyle={isDarkMode ? 'dark' : 'light'}
        />
        <View style={styles.badgeWrapper}>
          <ResultsCountBadge totalCount={totalCount} loading={loading} />
          {isRefreshing && (
            <View style={styles.refreshBadge}>
              <ActivityIndicator size="small" color={colors.secondary} />
              <Text style={styles.refreshText}>Refreshing...</Text>
            </View>
          )}
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={loading ? [1, 2, 3, 4, 5] : places}
        keyExtractor={(item, index) => loading ? `skeleton-${index}` : (item as NearbyPlace).placeId}
        renderItem={({ item }) => loading ? (
          <SkeletonCard height={88} style={{ marginBottom: 12 }} />
        ) : (
          <ServiceListItem
            place={item as NearbyPlace}
            onCallPress={handleCall}
            onDirectionsPress={handleDirections}
            highlightedId={highlightedId}
            flashAnim={flashAnim}
            onPress={(p) => {
              mapRef.current?.animateToRegion({
                latitude: p.latitude,
                longitude: p.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
            }}
          />
        )}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No services found nearby</Text>
              <Text style={[styles.emptySub, { color: theme.textSecondary }]}>Try increasing the search radius</Text>
              <TouchableOpacity 
                style={[styles.retryBtn, { backgroundColor: colors.primary }]} 
                onPress={refresh}
                accessibilityLabel="Retry search"
                accessibilityRole="button"
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingVertical: 16,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  radiusSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 2,
  },
  radiusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  radiusBtnActive: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  radiusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pillContainer: {
    paddingVertical: 4,
  },
  pillScroll: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  mapContainer: {
    height: '26%',
    width: '100%',
    marginTop: -20,
  },
  badgeWrapper: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 100,
  },
  refreshBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  refreshText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BA7517',
    marginLeft: 6,
  },
  listContent: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '800' },
  emptySub: { fontSize: 15, marginTop: 6, textAlign: 'center', paddingHorizontal: 40 },
  retryBtn: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
