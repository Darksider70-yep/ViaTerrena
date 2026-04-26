import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { requestLocationPermission, getCurrentLocation, watchLocation } from '../services/LocationService';
import { LocationSubscription } from 'expo-location';
import { detectCountryCode } from '../services/emergencyNumbers';

export function useLocation() {
  const { setUserCoords, setCountryCode, setLocationError, userCoords, countryCode, locationError } = useAppStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    let subscription: LocationSubscription | null = null;
    
    async function initLocation() {
      setLoading(true);
      setLocationError(null);
      
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        if (mounted) {
          setLocationError('Location permission denied');
          setLoading(false);
        }
        return;
      }

      // 1. Get initial location (try last known first - optimized in LocationService)
      getCurrentLocation().then(location => {
        if (location && mounted) {
          setUserCoords({ latitude: location.latitude, longitude: location.longitude });
          detectCountryCode(location.latitude, location.longitude).then(code => {
            if (mounted) setCountryCode(code);
          });
          setLoading(false);
        }
      });

      // 2. Start watching for changes immediately
      watchLocation((coords) => {
        if (mounted) {
          setUserCoords(coords);
          detectCountryCode(coords.latitude, coords.longitude).then(c => {
            if (mounted) setCountryCode(c);
          });
        }
      }).then(sub => {
        subscription = sub;
      });
    }

    initLocation();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return { coords: userCoords, countryCode, loading, error: locationError };
}
