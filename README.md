# ViaTerrena 🌍

ViaTerrena is a React Native (Expo) mobile application designed to provide instant, location-aware access to emergency services during road accidents and emergencies.

## 🚀 Key Features
- **SOS Button**: One-tap access to primary emergency numbers (Police, Ambulance, Fire) based on your current country.
- **Nearby Services**: Find the closest hospitals, towing services, mechanics, and showrooms using Google Places API.
- **Offline Reliability**: Essential emergency numbers for over 20 countries are stored locally and accessible without an internet connection.
- **Location Aware**: Automatically detects your country and coordinates to provide relevant local help.

## 🛠 Tech Stack
- **Framework**: Expo (React Native) with TypeScript
- **State Management**: Zustand (with Persistence)
- **Navigation**: React Navigation (Bottom Tabs)
- **Services**: Expo Location, Expo Network, Axios
- **UI**: Vanilla React Native StyleSheet with a custom Design System

## 📁 Project Structure
- `src/navigation`: App navigation logic
- `src/screens`: Feature-specific screens (Home, SOS, Nearby, etc.)
- `src/services`: Core logic for Location, Places API, and Emergency Numbers
- `src/store`: Global state management with Zustand
- `src/constants`: Design tokens (Colors, Typography) and configuration
- `docs/`: Detailed project documentation

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
Detailed documentation can be found in the [docs/](./docs) folder:
- [Architecture & Design](./docs/ARCHITECTURE.md)
- [Setup & Configuration](./docs/SETUP.md)
- [Service Logic](./docs/SERVICES.md)
- [API Configuration](./docs/API_KEYS.md)

---
Built with ❤️ for road safety.
