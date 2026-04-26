# ViaTerrena — Demo Script

## Setup (before demo)
- Open app on Android device / simulator
- Ensure internet connected
- Location permission granted
- 2 test contacts added: "Test Contact" +91-XXXXXXXXXX

## Demo flow (8 minutes)

### 1. Introduction (30 seconds)
"ViaTerrena — Latin for 'earthly road' — is an emergency response platform
that gives road accident victims instant access to life-saving services,
even without internet."

### 2. Home Screen (1 minute)
- Point out: country auto-detected, flag visible
- Tap each QuickDialCard — show it dials the correct number
- Expand the Golden Hour card — show first-aid steps
- Tap "View Full First Aid Guide" — navigate to guide

### 3. First Aid Guide (1 minute)
- Show 6 categories in pill bar
- Tap "CPR" — show expandable steps, CRITICAL badges, DO/DON'T lists
- Type "bleeding" in search — show cross-category search
- "This works 100% offline — no internet required"

### 4. Nearby Services (2 minutes)
- Tap Nearby tab — show map loading, markers appearing
- Point out ResultsCountBadge: "47 services found near you"
- Tap "Police" pill — map filters to blue markers only
- Tap a hospital card — show Call + Directions buttons
- Tap Call — show dialler opens with real number
- Change radius to 25km — show count increase
- Enable airplane mode → OfflineBanner appears
- "Cached data still available — works without signal"
- Disable airplane mode

### 5. SOS Flow (2 minutes)
- Tap SOS tab — show pulsing button
- Press SOS button — show countdown: 3... 2... 1...
- Press Cancel — "User can cancel within 3 seconds"
- Press again — let complete — show dialler opening
- "Simultaneously sends SMS to emergency contacts with GPS location"
- Show post-SOS confirmation card
- Tap "Change Country" — show US → 911, UK → 999

### 6. Vehicle Help (30 seconds)
- Tap Vehicle tab
- Show 3 tabs: Towing / Tyre Repair / Showrooms
- Tap a towing service → Call button

### 7. Incident Reporter (30 seconds)
- Back to HomeScreen — tap amber FAB
- Type brief notes — show char counter
- Tap Save → toast appears → card shows on HomeScreen

### 8. Evaluation criteria recap (30 seconds)
- Reliability: Google Places API — live, verified data
- Contacts fetched: [show ResultsCountBadge] 47 services
- Offline: everything still works on airplane mode
- Innovation: First-aid guide + incident reporter
- Global: 36 countries, 4 continents

## Key numbers to cite
- 36 countries in emergency numbers database
- 7 service categories (medical + vehicle)
- 14 first-aid steps across 6 categories
- SOS trigger sequence: < 3 seconds from button press to dial
