import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { useLocation } from './src/hooks/useLocation';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import { useAppStore } from './src/store/useAppStore';
import { OfflineBanner } from './src/components/OfflineBanner';

function AppContent() {
  const { loading: locationLoading, countryCode, coords } = useLocation();
  const { loading: networkLoading, isOnline } = useNetworkStatus();

  useEffect(() => {
    if (!locationLoading && !networkLoading) {
      console.log(`[ViaTerrena] Initialized. Country Code: ${countryCode}. Online: ${isOnline}`);
      
      if (coords && isOnline) {
         import('./src/services/placesService').then(({ fetchNearbyServices }) => {
            console.log('[ViaTerrena] Running Day 1 Smoke Test fetchNearbyServices...');
            fetchNearbyServices(coords.latitude, coords.longitude, 'hospital')
              .then(res => {
                console.log(`[ViaTerrena] Places API Result Count: ${res.length}`);
                if (res.length > 0) {
                  console.log('[ViaTerrena] First Place:', res[0].name, 'Dist:', res[0].distanceKm.toFixed(2), 'km');
                }
              })
              .catch(err => console.error('[ViaTerrena] Places API Error:', err));
         });
      }
    }
  }, [locationLoading, networkLoading, coords, countryCode, isOnline]);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <OfflineBanner />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return <AppContent />;
}
