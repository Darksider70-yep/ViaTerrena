import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAppStore } from '../store/useAppStore';

export function useNetworkStatus(): { isOnline: boolean } {
  const isOnline = useAppStore((state) => state.isOnline);
  const setOnline = useAppStore((state) => state.setOnline);

  useEffect(() => {
    // Subscription to NetInfo
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });

    // Initial check on mount
    NetInfo.fetch().then((state) => {
      setOnline(!!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, [setOnline]);

  return { isOnline };
}
