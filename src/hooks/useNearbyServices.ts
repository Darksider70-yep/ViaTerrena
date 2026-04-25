import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../store/useAppStore';
import { fetchNearbyServices, NearbyPlace, ServiceCategory } from '../services/placesService';
import { calculateDistance } from '../utils/distance';

interface UseNearbyServicesResult {
  places: NearbyPlace[];           // filtered by selectedCategory
  allPlaces: NearbyPlace[];        // all categories combined
  loading: boolean;
  error: string | null;
  totalCount: number;              // total across all categories
  refresh: () => void;             // manual re-fetch
  isFromCache: boolean;            // true when serving offline cached data
  locationMismatch: boolean;       // true if cached location > 5km from current
}

const CATEGORIES_TO_FETCH: ServiceCategory[] = [
  'hospital',
  'ambulance',
  'police',
  'towing',
  'puncture_shop',
  'showroom',
];

const CACHE_STALE_TIME = 30 * 60 * 1000; // 30 minutes

export function useNearbyServices(radiusMeters: number = 10000): UseNearbyServicesResult {
  const {
    userCoords,
    isOnline,
    selectedCategory,
    cachedNearby,
    cacheTimestamp,
    setCachedNearby,
  } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [locationMismatch, setLocationMismatch] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!userCoords) return;

    setLoading(true);
    setError(null);
    setIsFromCache(false);

    try {
      const fetchPromises = CATEGORIES_TO_FETCH.map((cat) =>
        fetchNearbyServices(userCoords.latitude, userCoords.longitude, cat, radiusMeters)
          .catch((err) => {
            console.error(`[ViaTerrena] Failed to fetch ${cat}:`, err);
            return [] as NearbyPlace[];
          })
      );

      const results = await Promise.all(fetchPromises);
      
      // Update store and local cache
      const newCache: any = {};
      results.forEach((res, index) => {
        const cat = CATEGORIES_TO_FETCH[index];
        setCachedNearby(cat, res);
        newCache[cat] = res;
      });

      // Task 9: Custom cache strategy
      await AsyncStorage.setItem('nearby_cache', JSON.stringify({
        data: newCache,
        timestamp: Date.now(),
        coords: userCoords,
      }));

    } catch (err) {
      setError('Failed to fetch nearby services');
    } finally {
      setLoading(false);
    }
  }, [userCoords, radiusMeters, setCachedNearby]);

  const loadFromCache = useCallback(async () => {
    setIsFromCache(true);
    const cached = await AsyncStorage.getItem('nearby_cache');
    if (cached && userCoords) {
      const { coords } = JSON.parse(cached);
      const dist = calculateDistance(
        userCoords.latitude,
        userCoords.longitude,
        coords.latitude,
        coords.longitude
      );
      if (dist > 5) {
        setLocationMismatch(true);
      } else {
        setLocationMismatch(false);
      }
    }
  }, [userCoords]);

  useEffect(() => {
    if (!userCoords) return;

    const isStale = !cacheTimestamp || (Date.now() - cacheTimestamp > CACHE_STALE_TIME);

    if (isOnline && (isStale || loading === false)) {
       // Only auto-fetch if stale or if we haven't loaded yet
       if (isStale) fetchAll();
    } else if (!isOnline) {
      loadFromCache();
    }
  }, [isOnline, userCoords, cacheTimestamp, fetchAll, loadFromCache]);

  const allPlaces = useMemo(() => {
    return Object.values(cachedNearby).flat();
  }, [cachedNearby]);

  const filteredPlaces = useMemo(() => {
    const list = selectedCategory === 'all'
      ? allPlaces
      : allPlaces.filter((p) => p.category === selectedCategory);
    
    return [...list].sort((a, b) => a.distanceKm - b.distanceKm);
  }, [allPlaces, selectedCategory]);

  return {
    places: filteredPlaces,
    allPlaces,
    loading,
    error,
    totalCount: allPlaces.length,
    refresh: fetchAll,
    isFromCache,
    locationMismatch,
  };
}
