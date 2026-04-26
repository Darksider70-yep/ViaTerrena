import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { requestLocationPermission, getCurrentLocation, watchLocation } from '../services/LocationService';
import { LocationSubscription } from 'expo-location';
import { detectCountryCode } from '../services/emergencyNumbers';

export function useLocation() {
  const { setUserCoords, setCountryCode, setLocationError, userCoords, countryCode, locationError } = useAppStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

      // 1. Get initial location
      const location = await getCurrentLocation();
      if (location && mounted) {
        setUserCoords({ latitude: location.latitude, longitude: location.longitude });
        const code = await detectCountryCode(location.latitude, location.longitude);
        setCountryCode(code);
        setLoading(false);
      }

      // 2. Start watching for changes
      subscription = await watchLocation((coords) => {
        if (mounted) {
          setUserCoords(coords);
          // Optional: update country code if they move between borders
          detectCountryCode(coords.latitude, coords.longitude).then(c => setCountryCode(c));
        }
      });
    }

    initLocation();

    return () => {
      mounted = false;
      if (subscription) subscription.remove();
    };
  }, []);

  return { coords: userCoords, countryCode, loading, error: locationError };
}
