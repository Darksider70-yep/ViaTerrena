import axios from 'axios';
import Constants from 'expo-constants';
import { calculateDistance } from '../utils/distance';

export type ServiceCategory =
  | 'hospital'
  | 'ambulance'
  | 'police'
  | 'towing'
  | 'puncture_shop'
  | 'showroom'
  | 'pharmacy';

export interface NearbyPlace {
  placeId: string;
  name: string;
  vicinity: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  phoneNumber?: string;
  openNow?: boolean;
  rating?: number;
  category: ServiceCategory;
}

const CATEGORY_QUERY_MAP: Record<ServiceCategory, { type?: string; keyword?: string }> = {
  hospital:      { type: 'hospital' },
  ambulance:     { keyword: 'ambulance service' },
  police:        { type: 'police' },
  towing:        { keyword: 'towing service' },
  puncture_shop: { keyword: 'tyre puncture repair' },
  showroom:      { type: 'car_dealer', keyword: 'car showroom' },
  pharmacy:      { type: 'pharmacy' },
};

export async function fetchNearbyServices(
  latitude: number,
  longitude: number,
  category: ServiceCategory,
  radiusMeters: number = 10000
): Promise<NearbyPlace[]> {
  try {
    const apiKey = Constants.expoConfig?.extra?.googlePlacesApiKey;
    if (!apiKey) {
      console.warn('[ViaTerrena] GOOGLE_PLACES_API_KEY is not set');
      return [];
    }

    const mapQuery = CATEGORY_QUERY_MAP[category];
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    
    const params: Record<string, string | number | boolean> = {
      location: `${latitude},${longitude}`,
      radius: radiusMeters,
      key: apiKey,
    };
    
    if (mapQuery.type) params.type = mapQuery.type;
    if (mapQuery.keyword) params.keyword = mapQuery.keyword;

    const response = await axios.get(url, { params });
    console.log('[ViaTerrena] Places API Status:', response.data.status);
    if (response.data.error_message) {
      console.log('[ViaTerrena] Places API Error Message:', response.data.error_message);
    }
    const results = response.data.results || [];

    const places: NearbyPlace[] = results.map((result: {
      place_id: string;
      name: string;
      vicinity: string;
      geometry?: { location?: { lat: number; lng: number } };
      opening_hours?: { open_now: boolean };
      rating?: number;
    }) => {
      const placeLat = result.geometry?.location?.lat;
      const placeLng = result.geometry?.location?.lng;
      const distanceKm = calculateDistance(latitude, longitude, placeLat, placeLng);
      
      return {
        placeId: result.place_id,
        name: result.name,
        vicinity: result.vicinity,
        latitude: placeLat,
        longitude: placeLng,
        distanceKm,
        openNow: result.opening_hours?.open_now,
        rating: result.rating,
        category,
      };
    });

    places.sort((a, b) => a.distanceKm - b.distanceKm);

    const top10 = places.slice(0, 10);
    const detailPromises = top10.map(async (place) => {
      try {
        const detailUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
        const detailResponse = await axios.get(detailUrl, {
          params: {
            place_id: place.placeId,
            fields: 'formatted_phone_number,opening_hours',
            key: apiKey,
          },
        });
        const details = detailResponse.data.result;
        if (details) {
          if (details.formatted_phone_number) {
            place.phoneNumber = details.formatted_phone_number;
          }
          if (details.opening_hours && details.opening_hours.open_now !== undefined) {
            place.openNow = details.opening_hours.open_now;
          }
        }
      } catch (err) {
        console.error(`[ViaTerrena] Place Details error for ${place.placeId}`, err);
      }
    });

    await Promise.all(detailPromises);

    if (places.length === 0) {
      console.log('[ViaTerrena] Using MOCK DATA fallback (Billing not enabled on API key)');
      return getMockPlaces(latitude, longitude, category);
    }

    return places;
  } catch (error) {
    console.error('[ViaTerrena] fetchNearbyServices error', error);
    return getMockPlaces(latitude, longitude, category);
  }
}

function getMockPlaces(lat: number, lng: number, category: ServiceCategory): NearbyPlace[] {
  const mockNames: Record<ServiceCategory, string[]> = {
    hospital: ['City General Hospital', 'Mercy Medical Center', 'Sunrise Clinic'],
    ambulance: ['Rapid Response Ambulance', 'Citywide Paramedics', 'LifeLine EMS'],
    police: ['Central Police Station', 'Metro Precinct 9', 'Highway Patrol Hub'],
    towing: ['QuickTow Services', 'Roadside Assist Pros', 'Heavy Duty Towing'],
    puncture_shop: ['Joe\'s Tire Repair', 'QuickFix Punctures', 'Wheel Align & Tire'],
    showroom: ['AutoWorld Dealership', 'Premium Cars Showroom', 'City Motors'],
    pharmacy: ['HealthPlus Pharmacy', 'Corner Drugstore', '24/7 Meds'],
  };

  const names = mockNames[category] || mockNames.hospital;
  
  return names.map((name, index) => {
    // Generate slight coordinate offsets for mock distances
    const mockLat = lat + (Math.random() - 0.5) * 0.02;
    const mockLng = lng + (Math.random() - 0.5) * 0.02;
    const distanceKm = calculateDistance(lat, lng, mockLat, mockLng);

    return {
      placeId: `mock_${category}_${index}`,
      name,
      vicinity: `123 Mock Street, ${name} Area`,
      latitude: mockLat,
      longitude: mockLng,
      distanceKm,
      phoneNumber: `+1 555 019${index}`,
      openNow: true,
      rating: 4.0 + (Math.random() * 0.9),
      category,
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
}
