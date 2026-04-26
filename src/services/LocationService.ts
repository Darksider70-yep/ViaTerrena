import * as Location from 'expo-location';
import { LocationSubscription } from 'expo-location';

export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('[ViaTerrena] requestLocationPermission error', error);
    return false;
  }
}

export async function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number | null;
} | null> {
  try {
    // 1. Try to get last known position first (nearly instant)
    const lastKnown = await Location.getLastKnownPositionAsync({});
    if (lastKnown) {
      return {
        latitude: lastKnown.coords.latitude,
        longitude: lastKnown.coords.longitude,
        accuracy: lastKnown.coords.accuracy,
      };
    }

    // 2. If no last known, request current position with balanced accuracy (faster than highest)
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
    };
  } catch (error) {
    console.error('[ViaTerrena] getCurrentLocation error', error);
    return null;
  }
}

export async function watchLocation(
  callback: (coords: { latitude: number; longitude: number }) => void
): Promise<LocationSubscription | null> {
  try {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 50,
      },
      (location) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    );
    return subscription;
  } catch (error) {
    console.error('[ViaTerrena] watchLocation error', error);
    return null;
  }
}
