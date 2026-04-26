# API Configuration Guide

ViaTerrena requires a Google Cloud Project to power the Nearby Services feature.

## 🔑 Obtaining a Google Places API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named `ViaTerrena`.
3. Navigate to **APIs & Services > Library**.
4. Search for and enable:
   - **Places API**
   - **Maps SDK for Android** (MANDATORY: required for rendering `react-native-maps`)
   - **Maps SDK for iOS** (Required for rendering maps on iOS)
5. Go to **APIs & Services > Credentials**.
6. Click **Create Credentials > API Key**.
7. **Important**: Restrict your API key to only the above APIs to prevent unauthorized usage.

## ⚙️ Configuration in ViaTerrena

The app uses a dynamic configuration file `app.config.js` to securely load the API key.

### Local Development
1. Add the key to your `.env` file: `GOOGLE_PLACES_API_KEY=your_key_here`
2. The key is automatically injected into the Expo configuration for local runs.

### Cloud Builds (EAS Build)
Since EAS Build runs in the cloud, it cannot access your local `.env` file. You **must** add your API key as an EAS Secret:

```bash
eas secret:create --name GOOGLE_PLACES_API_KEY --value "your_key_here" --type string
```

Once added, EAS will inject this key into the build process, allowing `app.config.js` to read it and configure the native Google Maps SDK for Android.

## 🛡 Security
Never commit your `.env` file to version control. The `.gitignore` has been pre-configured to ignore `.env` files.
