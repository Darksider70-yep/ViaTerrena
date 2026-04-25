import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { requestLocationPermission, getCurrentLocation } from '../services/LocationService';
import { detectCountryCode } from '../services/emergencyNumbers';

export function useLocation() {
  const { setUserCoords, setCountryCode, setLocationError, userCoords, countryCode, locationError } = useAppStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    
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

      const location = await getCurrentLocation();
      if (!location) {
        if (mounted) {
          setLocationError('Failed to get location');
          setLoading(false);
        }
        return;
      }

      if (mounted) {
        setUserCoords({ latitude: location.latitude, longitude: location.longitude });
        
        const code = await detectCountryCode(location.latitude, location.longitude);
        setCountryCode(code);
        setLoading(false);
      }
    }

    initLocation();

    return () => {
      mounted = false;
    };
  }, []);

  return { coords: userCoords, countryCode, loading, error: locationError };
}
