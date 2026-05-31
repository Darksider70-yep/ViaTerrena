# Core Services Documentation

ViaTerrena relies on seven core service engines to provide real-time assistance, offline capability, and impact tracking.

## 1. Location Service (`LocationService.ts`)
Handles interaction with the device's GPS hardware via `expo-location`.
- **Permissions**: Requesting foreground location access.
- **Polling**: Fetching the current lat/lng coordinates.
- **Watching**: Subscribing to position updates for real-time tracking on the map.

## 2. Emergency Numbers Service (`EmergencyNumbers.ts`)
A critical offline-first service that maps coordinates to local emergency contacts.
- **Reverse Geocoding**: Converts coordinates to an ISO 3166-1 alpha-2 country code (e.g., "IN", "US").
- **JSON Lookup**: Matches the country code against `src/data/emergencyNumbers.json`.
- **Fallback**: Automatically falls back to `112` (the global emergency standard) if a country is not explicitly mapped.

## 3. Places Service (`placesService.ts`)
Interfaces with the Google Places API (Nearby Search) to find essential help.
- **Category Mapping**: Maps internal types (e.g., `puncture_shop`) to Google search keywords.
- **Distance Calculation**: Uses the **Haversine Formula** (`utils/distance.ts`) to calculate straight-line distance before the API returns results.
- **Phone Enrichment**: Performs additional **Place Details** calls for the top 10 results to fetch validated phone numbers for direct calling.

## 4. AI Triage Service (`GeminiService.ts`)
Powered by Google Gemini 2.0 Flash to provide immediate medical guidance.
- **System Prompting**: Encapsulates emergency triage expertise to guide users through the "Golden Hour".
- **Chat Context**: Maintains conversation state to allow follow-up questions during a high-stress event.
- **Safety Filtering**: Implements customized safety settings to ensure guidance remains helpful and non-harmful.
- **Fallback Logic**: Provides critical offline/error fallbacks (e.g., "Call 112") if connectivity is lost.

## 5. Crash Detection Service (`CrashDetectionService.ts`)
Uses the device accelerometer to automatically detect high-impact road accidents.
- **Physics Algorithm**: Monitors total G-force (√(x² + y² + z²)). A crash is triggered if force exceeds 3.5G for consecutive readings.
- **Auto-SOS Flow**: Automatically triggers a 10-second "I'm Okay" cancel window before firing the full SOS sequence.
- **Background Support**: Runs while the app is in the foreground to provide continuous protection during travel.

## 6. SOS Service (`SOSService.ts`)
Orchestrates emergency alert distribution across cellular, SMS, and messaging networks.
- **Auto-Dialing**: Invokes native device dialer utilizing `Linking.openURL('tel:<number>')`.
- **SMS Broadcasting**: Parallel dispatch of emergency messages to up to 5 user-defined emergency contacts with active GPS coordinate maps links using `expo-sms`.
- **WhatsApp Fallback**: Pre-formats and deep-links emergency details to WhatsApp as a supplementary notification path.

## 7. Persistence & State Store (`useAppStore.ts`)
Lightweight Zustand-based state store with AsyncStorage mapping.
- **State Synchronization**: Automatically saves emergency contacts, incident reports, theme settings, and nearby service API cache.
- **Offline Cache Hydration**: Restores cached values instantly on startup, allowing the app to render nearby map markers and services even with zero cellular signal.
- **Network Status Listener**: Evaluates device connectivity and triggers offline fallback states dynamically.



