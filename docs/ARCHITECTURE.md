# Architecture & Design

ViaTerrena follows a modular, service-oriented architecture designed for scalability and reliability in high-stress emergency situations.

## 🧱 Layered Architecture

### 1. Presentation Layer (`src/screens`, `src/components`)
- **Functional Components**: All UI is built using React functional components with TypeScript.
- **Design Tokens**: Every visual element derives its styling from `src/constants/colors.ts` and `typography.ts`.
- **Containers**: `ScreenContainer` provides a unified background and safe-area handling across all screens.

### 2. Logic Layer (`src/hooks`)
- **Custom Hooks**: Encapsulate complex logic like location permission management (`useLocation`) and network monitoring (`useNetworkStatus`).
- **Separation of Concerns**: Hooks communicate between the UI and the Services/Store layers.

### 3. State Layer (`src/store`)
- **Zustand**: Lightweight, scalable state management.
- **Persistence**: Using `persist` middleware to cache nearby services and user preferences in `AsyncStorage`, ensuring the app remains useful even when offline.

### 4. Service Layer (`src/services`)
- **Stateless Services**: Each service handles a specific domain (e.g., `placesService` handles Google API calls).
- **Error Handling**: Every async operation is wrapped in try/catch blocks to prevent app crashes during network or API failures.

## 📂 Folder Structure Detail
```
src/
├── components/   # Reusable UI elements (Pills, Cards, Banners)
├── constants/    # Design system and category definitions
├── data/         # Static JSON data (Emergency numbers, guides)
├── hooks/        # React hooks for lifecycle logic
├── navigation/   # Root and feature navigation
├── screens/      # Full-page screen components
├── services/     # Pure logic and API wrappers
├── store/        # Global state definitions
└── utils/        # Mathematical and helper utilities
```
