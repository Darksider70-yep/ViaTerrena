import { Linking } from 'react-native';
import * as SMS from 'expo-sms';
import { getPrimaryEmergencyNumber } from './emergencyNumbers';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  avatarInitials: string;
}

export type PersonalContact = EmergencyContact;

export interface SOSTriggerPayload {
  userCoords: { latitude: number; longitude: number };
  countryCode: string;
  personalContacts: EmergencyContact[];
}

export interface SOSResult {
  dialledNumber: string;
  smsSentCount: number;
  whatsappOpened: boolean;
  locationShareUrl: string;
}

/**
 * Orchestrates the full SOS trigger sequence
 */
export async function triggerSOS(payload: SOSTriggerPayload): Promise<SOSResult> {
  const { userCoords, countryCode, personalContacts } = payload;
  const lat = userCoords.latitude;
  const lng = userCoords.longitude;

  // Step 1 — Build location share URL (synchronous, no network)
  const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}, ${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  
  const message = `🚨 EMERGENCY — ViaTerrena Alert\n\nI've been in a road accident and need help.\n\n📍 My location:\n${mapsUrl}\n\n⏰ Time: ${timeStr}\n\nPlease call emergency services or come to my location immediately.\n\n— Sent via ViaTerrena`;

  console.log('[ViaTerrena][SOS] Starting trigger sequence...');

  // Step 2 — Dial primary emergency number IMMEDIATELY (before anything else)
  const emergencyNumber = getPrimaryEmergencyNumber(countryCode);
  console.log(`[ViaTerrena][SOS] Step 2: Dialling ${emergencyNumber}`);
  
  // We wrap the rest in non-blocking try-catch as per rules
  let smsSentCount = 0;
  let whatsappOpened = false;

  try {
    await Linking.openURL(`tel:${emergencyNumber}`);
  } catch (error) {
    console.error('[ViaTerrena][SOS] Failed to dial number', error);
  }

  // Step 3 — Send SMS to all personal contacts (parallel, non-blocking)
  if (personalContacts.length > 0) {
    try {
      console.log(`[ViaTerrena][SOS] Step 3: Sending SMS to ${personalContacts.length} contacts`);
      const isSmsAvailable = await SMS.isAvailableAsync();
      if (isSmsAvailable) {
        const phoneNumbers = personalContacts.map(c => c.phone);
        const { result } = await SMS.sendSMSAsync(phoneNumbers, message);
        if (result === 'sent') {
          smsSentCount = personalContacts.length;
        }
      }
    } catch (error) {
      console.error('[ViaTerrena][SOS] SMS Step failed', error);
    }
  }

  // Step 4 — Attempt WhatsApp share as supplement
  try {
    console.log('[ViaTerrena][SOS] Step 4: Attempting WhatsApp share');
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
      whatsappOpened = true;
    }
  } catch (error) {
    console.error('[ViaTerrena][SOS] WhatsApp Step failed', error);
  }

  // Step 5 — Return result
  console.log('[ViaTerrena][SOS] Sequence complete');
  return {
    dialledNumber: emergencyNumber,
    smsSentCount,
    whatsappOpened,
    locationShareUrl: mapsUrl,
  };
}
