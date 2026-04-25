# Setup & Configuration

Follow these steps to set up the development environment for ViaTerrena.

## 📋 Prerequisites
- **Node.js**: v18 or later
- **npm** or **yarn**
- **Expo Go App**: Installed on your mobile device for testing

## 🛠 Installation

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```bash
   GOOGLE_PLACES_API_KEY=your_google_maps_api_key_here
   ```

## 🚀 Running the Project

### Local Development
```bash
npx expo start
```
Once the server starts, you can:
- Press **`a`** for Android emulator.
- Press **`i`** for iOS simulator.
- Scan the **QR Code** with the Expo Go app to run it on a physical device.

### Type Checking
To ensure type safety across the project:
```bash
npx tsc --noEmit
```

## ⚠️ Known Issues & Solutions
- **Location Denied**: If location permissions are denied, the app will show an error banner. Reset app permissions in your phone settings to retry.
- **API Key Error**: Ensure the Google Places API Key has both "Nearby Search" and "Place Details" permissions enabled in the Google Cloud Console.
