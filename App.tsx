import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import RootNavigator from './src/navigation/RootNavigator';
import { useLocation } from './src/hooks/useLocation';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import { fetchNearbyServices } from './src/services/placesService';

// Disable native screens to prevent RN 0.81 strict property casting crash
enableScreens(false);

function AppContent() {
  const { loading: locLoading, countryCode, coords } = useLocation();
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (!locLoading) {
      console.log('[ViaTerrena] Ready. Country:', countryCode, 'Online:', isOnline);
      
      // Run the Day 1 Smoke Test if we have location and network
      if (coords && isOnline) {
        console.log('[ViaTerrena] Running Day 1 Smoke Test fetchNearbyServices...');
        fetchNearbyServices(coords.latitude, coords.longitude, 'hospital')
          .then(res => {
            console.log(`[ViaTerrena] Places API Result Count: ${res.length}`);
            if (res.length > 0) {
              console.log('[ViaTerrena] First Place:', res[0].name, 'Dist:', res[0].distanceKm.toFixed(2), 'km');
            }
          })
          .catch(err => console.error('[ViaTerrena] Places API Error:', err));
      }
    }
  }, [locLoading, countryCode, isOnline, coords]);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
