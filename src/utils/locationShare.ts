// src/utils/locationShare.ts

/**
 * Generate a Google Maps link from coordinates
 */
export function buildGoogleMapsLink(latitude: number, longitude: number): string {
  return `https://maps.google.com/?q=${latitude},${longitude}`;
}

/**
 * Build the full emergency message for SMS/WhatsApp
 */
export function buildEmergencyMessage(latitude: number, longitude: number): string {
  const mapLink = buildGoogleMapsLink(latitude, longitude);
  return `🚨 EMERGENCY ALERT 🚨\nI've been in a road accident and need help.\nMy location: ${mapLink}\nPlease call emergency services or come immediately.`;
}

/**
 * Build a short version for SMS character limits
 */
export function buildShortEmergencyMessage(latitude: number, longitude: number): string {
  const mapLink = buildGoogleMapsLink(latitude, longitude);
  return `EMERGENCY: Road accident. My location: ${mapLink}`;
}
