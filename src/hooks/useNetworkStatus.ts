import { useEffect, useState } from 'react';
import * as Network from 'expo-network';
import { useAppStore } from '../store/useAppStore';

export function useNetworkStatus() {
  const { isOnline, setOnline } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkNetwork() {
      try {
        const state = await Network.getNetworkStateAsync();
        if (mounted) {
          const isConnected = !!state.isConnected && !!state.isInternetReachable;
          setOnline(isConnected);
          setLoading(false);
        }
      } catch (error) {
        console.error('[ViaTerrena] Network check error', error);
        if (mounted) setLoading(false);
      }
    }

    checkNetwork();

    return () => {
      mounted = false;
    };
  }, []);

  return { isOnline, loading };
}
