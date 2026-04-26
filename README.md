# ViaTerrena 🚨

> Latin: *via* (road) + *terrena* (earthly) — "Earthly Road"

Emergency road assistance platform providing instant access to life-saving
services during road accidents. Built for the RoadSoS challenge.

## Features

- **8 service categories**: hospitals, ambulance, police, towing, tyre repair, showrooms, pharmacies
- **Real-time live tracking**: Location auto-detected and updated via `watchLocation` for active service discovery
- **SOS panic button**: 3s countdown → auto-dials country emergency number + SMS contacts
- **36 countries**: localised emergency numbers auto-detected by GPS
- **100% offline-capable**: cached services + static first-aid guide + local emergency numbers
- **First Aid Guide**: 6 categories, 14 steps, DO/DON'T lists — no internet required
- **Incident Reporter**: timestamped accident log with photo + location, shareable via WhatsApp
- **Live Google Places API**: 100% real data with zero mock fallback (verified API key required)

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 54 |
| Navigation | React Navigation v7 (bottom tabs + stack) |
| Maps | react-native-maps |
| Location | expo-location |
| Places data | Google Places Nearby Search API |
| State | Zustand + AsyncStorage persist |
| Sharing | expo-sms + Linking (WhatsApp, tel:) |
| Build | EAS Build (Expo Application Services) |

## Setup

```bash
git clone https://github.com/Darksider70-yep/ViaTerrena
cd ViaTerrena
npm install
cp .env.example .env
# Add your Google Places API key to .env
npx expo start
```

## Environment variables

```
GOOGLE_PLACES_API_KEY=your_key_here
```

Enable these APIs in Google Cloud Console:
- Places API (New)
- Maps SDK for Android
- Maps SDK for iOS
- Geocoding API

## Build
 
 ```bash
 # Development
 npx expo start
 
+# Set EAS Secrets (Required for Cloud Builds)
+eas secret:create --name GOOGLE_PLACES_API_KEY --value "your_key" --type string
+
 # Android APK
 eas build --platform android --profile preview
 
 # iOS
 eas build --platform ios --profile preview
 ```


## Evaluation criteria

| Criterion | Implementation |
|-----------|---------------|
| Reliability & data accuracy | Google Places API — verified, real-time data |
| Number of contacts fetched | Parallel fetch across 7 categories → 40–140 results |
| Offline functionality | AsyncStorage cache + NetInfo fallback + static data |
| Innovation | First Aid Guide (offline, searchable) + Incident Reporter |
| Global integration | 36-country emergency number map + Places API global coverage |

## Emergency numbers coverage

India, USA, UK, Australia, Germany, France, Italy, Spain, Japan, China,
South Korea, Brazil, Mexico, Argentina, Canada, South Africa, Nigeria,
Egypt, Saudi Arabia, UAE, Turkey, Russia, Indonesia, Pakistan, Bangladesh,
Philippines, Malaysia, Singapore, Thailand, New Zealand, Netherlands,
Sweden, Norway, Switzerland, Portugal, Greece, Poland + DEFAULT (112)

## Project structure

```
src/
├── screens/          # HomeScreen, NearbyScreen, SOSScreen, VehicleHelpScreen,
│                     # ContactsScreen, FirstAidGuideScreen, OnboardingScreen
├── components/       # SOSButton, ServiceCard, CategoryPill, SkeletonCard,
│                     # OfflineBanner, FirstAidStep, IncidentReporter, ...
├── services/         # LocationService, PlacesService, EmergencyNumbers, SOSService
├── hooks/            # useLocation, useNearbyServices, useNetworkStatus,
│                     # useEmergencyContacts, useIncidentLog
├── store/            # useAppStore (Zustand)
├── data/             # emergencyNumbers.json, firstAidGuide.json
├── constants/        # colors, typography, spacing, serviceCategories
└── utils/            # distance (Haversine), storage, toast
```
