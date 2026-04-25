# API Configuration Guide

ViaTerrena requires a Google Cloud Project to power the Nearby Services feature.

## 🔑 Obtaining a Google Places API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named `ViaTerrena`.
3. Navigate to **APIs & Services > Library**.
4. Search for and enable:
   - **Places API**
   - **Maps SDK for Android** (optional, for future map rendering)
   - **Maps SDK for iOS** (optional, for future map rendering)
5. Go to **APIs & Services > Credentials**.
6. Click **Create Credentials > API Key**.
7. **Important**: Restrict your API key to only the "Places API" to prevent unauthorized usage.

## ⚙️ Configuration in ViaTerrena

The app uses a dynamic configuration file `app.config.js` to securely load the API key from your `.env` file.

1. Add the key to your `.env` file.
2. The key is automatically injected into the Expo configuration.
3. It is accessed in the code via:
   ```typescript
   import Constants from 'expo-constants';
   const apiKey = Constants.expoConfig?.extra?.googlePlacesApiKey;
   ```

## 🛡 Security
Never commit your `.env` file to version control. The `.gitignore` has been pre-configured to ignore `.env` files.
