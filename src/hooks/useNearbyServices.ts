import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../store/useAppStore';
import { fetchNearbyServices, NearbyPlace, ServiceCategory } from '../services/placesService';
import { calculateDistance } from '../utils/distance';

interface UseNearbyServicesResult {
  places: NearbyPlace[];
  allPlaces: NearbyPlace[];
  loading: boolean;
  isRefreshing: boolean;
  error: string | null;
  totalCount: number;
  refresh: () => void;
  isFromCache: boolean;
  locationMismatch: boolean;
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
const DISTANCE_THRESHOLD_KM = 5;

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [locationMismatch, setLocationMismatch] = useState(false);
  const lastCoordsRef = useRef<{ latitude: number; longitude: number } | null>(null);

  const fetchAll = useCallback(async (isSilent = false) => {
    if (!userCoords) return;

    if (isSilent) setIsRefreshing(true);
    else setLoading(true);
    
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
      
      const newCache: any = {};
      results.forEach((res, index) => {
        const cat = CATEGORIES_TO_FETCH[index];
        setCachedNearby(cat, res);
        newCache[cat] = res;
      });

      await AsyncStorage.setItem('nearby_cache', JSON.stringify({
        data: newCache,
        timestamp: Date.now(),
        coords: userCoords,
      }));
      
      lastCoordsRef.current = userCoords;

    } catch (err) {
      setError('Failed to fetch nearby services');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
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
      setLocationMismatch(dist > DISTANCE_THRESHOLD_KM);
    }
  }, [userCoords]);

  useEffect(() => {
    if (!userCoords) return;

    const checkStale = async () => {
      const cached = await AsyncStorage.getItem('nearby_cache');
      let stale = true;
      let distMismatch = false;

      if (cached) {
        const { timestamp, coords } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        const dist = calculateDistance(
          userCoords.latitude,
          userCoords.longitude,
          coords.latitude,
          coords.longitude
        );
        stale = age > CACHE_STALE_TIME;
        distMismatch = dist > DISTANCE_THRESHOLD_KM;
      }

      if (isOnline) {
        if (stale || distMismatch) {
          // Silent refresh if we already have some data, otherwise full loading
          const hasData = Object.keys(cachedNearby).length > 0;
          fetchAll(!hasData);
        }
      } else {
        loadFromCache();
      }
    };

    checkStale();
  }, [isOnline, userCoords]);

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
    isRefreshing,
    error,
    totalCount: allPlaces.length,
    refresh: () => fetchAll(false),
    isFromCache,
    locationMismatch,
  };
}
