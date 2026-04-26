require('dotenv').config();

module.exports = ({ config }) => {
  return {
    ...config,
    android: {
      ...config.android,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_PLACES_API_KEY || "",
        },
      },
    },
    extra: {
      ...config.extra,
      googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || "",
      geminiApiKey: process.env.GEMINI_API_KEY || "",
    },

  };
};

