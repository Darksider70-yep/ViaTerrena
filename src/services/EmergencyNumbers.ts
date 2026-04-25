import * as Location from 'expo-location';
import emergencyNumbersData from '../data/emergencyNumbers.json';

export interface EmergencyNumberSet {
  police?: string;
  fire?: string;
  ambulance?: string;
  emergency?: string;
  highway?: string;
  womenHelpline?: string;
}

const emergencyNumbers: Record<string, EmergencyNumberSet> = emergencyNumbersData;

export async function detectCountryCode(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (geocode && geocode.length > 0) {
      const countryCode = geocode[0].isoCountryCode;
      if (countryCode) {
        return countryCode.toUpperCase();
      }
    }
  } catch (error) {
    console.error('[ViaTerrena] detectCountryCode error', error);
  }
  return 'DEFAULT';
}

export function getEmergencyNumbers(countryCode: string): EmergencyNumberSet {
  return emergencyNumbers[countryCode] || emergencyNumbers['DEFAULT'];
}

export function getPrimaryEmergencyNumber(countryCode: string): string {
  const numbers = getEmergencyNumbers(countryCode);
  return numbers.emergency || numbers.police || numbers.ambulance || '112';
}
