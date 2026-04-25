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
    const location = await Location.getCurrentPositionAsync({});
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
