require('dotenv').config();

module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || "",
    },
  };
};
