# ViaTerrena 🌍

ViaTerrena is a premium React Native (Expo) mobile application designed to provide instant, location-aware access to emergency services and roadside assistance.

## 🚀 Key Features
- **🚨 Advanced SOS Panic System**: One-tap trigger with a 3-second safety window, animated pulse rings, and automatic dialing of local emergency numbers (112, 100, 108, etc.).
- **📍 Pro Map Integration**: Live map with custom themed markers for hospitals, police stations, and mechanical help.
- **🔧 Vehicle Help Hub**: Specialized tabs for Towing, Tyre Repair, and Showrooms, pulling data from high-speed local caches.
- **👤 Emergency Contacts**: Manage up to 5 personal contacts who receive your location via SMS and WhatsApp during an SOS trigger.
- **🛰️ Location Sharing**: Instantly share a Google Maps link of your precise location with one tap.
- **📶 Offline Reliability**: Pre-loaded emergency numbers for over 20 countries and local caching of nearby services.

## 🛠 Tech Stack
- **Framework**: Expo (React Native) with TypeScript
- **State Management**: Zustand (with Persistence via AsyncStorage)
- **Navigation**: React Navigation (Bottom Tabs)
- **Services**: Expo Location, Expo SMS, Google Places API
- **UI**: Vanilla React Native StyleSheet with a Premium Design System

## 📁 Project Structure
- `src/navigation`: App navigation and tab logic
- `src/screens`: Feature-specific screens (Home, SOS, Nearby, Vehicle, Contacts)
- `src/components`: Reusable premium components (SOSButton, ServiceCard, PulseRing)
- `src/services`: Core logic for SOS, Location, and Places API
- `src/store`: Global state management with Zustand
- `src/constants`: Design tokens (Colors, Typography) and configuration
- `src/hooks`: Custom logic hooks (useSOSTrigger, useNearbyServices, useTheme)

## 🏁 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   - Rename `.env.example` to `.env`.
   - Add your `GOOGLE_PLACES_API_KEY`.

3. **Run the App**:
   ```bash
   npx expo start
   ```

## 📖 Documentation
Detailed walkthroughs and task logs are available in the artifact directory:
- `walkthrough.md`: Summary of recent feature implementations.
- `task.md`: Checklist of completed work.

---
Built with ❤️ for road safety.
