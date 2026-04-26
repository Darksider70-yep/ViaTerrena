# Architecture & Design

ViaTerrena follows a modular, service-oriented architecture designed for scalability and reliability in high-stress emergency situations.

## 🧱 Layered Architecture

### 1. Presentation Layer (`src/screens`, `src/components`)
- **Functional Components**: All UI is built using React functional components with TypeScript.
- **Design Tokens**: Every visual element derives its styling from `src/constants/colors.ts` and `typography.ts`.
- **Atomic Components**: Specialized components like `PulseRing` and `SOSButton` encapsulate complex animations and state-specific logic.

### 2. Logic Layer (`src/hooks`)
- **State Machines**: `useSOSTrigger` implements a multi-phase state machine (idle -> countdown -> executing -> done) to manage critical emergency sequences.
- **Data Hooks**: `useNearbyServices` and `usePersonalContacts` bridge the gap between persistent storage and the UI.

### 3. State Layer (`src/store`)
- **Zustand**: Lightweight, scalable state management with selective persistence.
- **Async Persistence**: Using `persist` middleware to store:
  - Cached Nearby Services (for offline recovery)
  - Personal Emergency Contacts (up to 5 entries)
  - Last SOS Trigger history

### 4. Service Layer (`src/services`)
- **Stateless Domain Services**: Each service handles a specific domain.
  - `SOSService`: Orchestrates multi-channel alerts (Call, SMS, WhatsApp).
  - `placesService`: Manages Google Places API integration and distance calculations.
  - `emergencyNumbers`: Provides a local lookup for global emergency dialers.
  - `GeminiService`: Handles AI-powered triage guidance using Google Gemini 2.0 Flash.


## 📂 Folder Structure Detail
```
src/
├── components/   # Reusable UI elements (Pills, Cards, Banners, PulseRing)
├── constants/    # Design system, category definitions, and themes
├── data/         # Static JSON data (Emergency numbers)
├── hooks/        # React hooks for lifecycle logic and SOS state
├── navigation/   # Root and feature navigation
├── screens/      # Full-page feature screens (Home, Nearby, SOS, Triage)
├── services/     # Domain-specific logic (SOS, Location, Places, Gemini)

├── store/        # Global state definitions (Zustand)
└── utils/        # Helper utilities (Distance, Location Sharing)
```

---
*Updated: April 25, 2026*
