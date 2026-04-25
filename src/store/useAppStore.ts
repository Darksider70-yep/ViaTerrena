import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServiceCategory, NearbyPlace } from '../services/placesService';

interface AppState {
  // Location
  userCoords: { latitude: number; longitude: number } | null;
  countryCode: string; // ISO code, default 'IN'
  locationError: string | null;

  // UI state
  selectedCategory: ServiceCategory | 'all';
  isOnline: boolean;
  isDarkMode: boolean;

  // Cache
  cachedNearby: Record<ServiceCategory, NearbyPlace[]>;
  cacheTimestamp: number | null;

  // Actions
  setUserCoords: (coords: { latitude: number; longitude: number }) => void;
  setCountryCode: (code: string) => void;
  setLocationError: (error: string | null) => void;
  setSelectedCategory: (cat: ServiceCategory | 'all') => void;
  setOnline: (online: boolean) => void;
  setCachedNearby: (category: ServiceCategory, places: NearbyPlace[]) => void;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userCoords: null,
      countryCode: 'IN',
      locationError: null,
      selectedCategory: 'all',
      isOnline: true,
      cachedNearby: {
        hospital: [],
        ambulance: [],
        police: [],
        towing: [],
        puncture_shop: [],
        showroom: [],
        pharmacy: [],
      },
      cacheTimestamp: null,
      isDarkMode: false,

      setUserCoords: (coords) => set({ userCoords: coords }),
      setCountryCode: (code) => set({ countryCode: code }),
      setLocationError: (error) => set({ locationError: error }),
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      setOnline: (online) => set({ isOnline: online }),
      setCachedNearby: (category, places) =>
        set((state) => ({
          cachedNearby: {
            ...state.cachedNearby,
            [category]: places,
          },
          cacheTimestamp: Date.now(),
        })),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'via-terrena-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        cachedNearby: state.cachedNearby,
        countryCode: state.countryCode,
        cacheTimestamp: state.cacheTimestamp,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);
