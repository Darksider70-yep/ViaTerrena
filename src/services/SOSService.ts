import { Linking, Platform } from 'react-native';
import * as SMS from 'expo-sms';
import { getPrimaryEmergencyNumber } from './emergencyNumbers';
import { buildEmergencyMessage } from '../utils/locationShare';

export interface PersonalContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  addedAt: number;
}

export interface SOSPayload {
  coords: { latitude: number; longitude: number };
  countryCode: string;
  personalContacts: PersonalContact[];
}

/**
 * Call the primary emergency number for the detected country
 */
export async function callEmergencyNumber(countryCode: string): Promise<void> {
  try {
    const primary = getPrimaryEmergencyNumber(countryCode);
    const cleanNumber = primary.replace(/\s/g, '');
    await Linking.openURL(`tel:${cleanNumber}`);
  } catch (error) {
    console.error('[ViaTerrena][SOS] Error calling emergency number:', error);
  }
}

/**
 * Send SMS to all personal contacts with location
 */
export async function sendLocationSMS(
  contacts: PersonalContact[],
  coords: { latitude: number; longitude: number }
): Promise<void> {
  try {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      console.warn('[ViaTerrena][SOS] SMS is not available on this device');
      return;
    }

    const phoneNumbers = contacts.map(c => c.phone).filter(p => !!p);
    if (phoneNumbers.length === 0) return;

    const message = buildEmergencyMessage(coords.latitude, coords.longitude);
    await SMS.sendSMSAsync(phoneNumbers, message);
  } catch (error) {
    console.error('[ViaTerrena][SOS] Error sending SMS:', error);
  }
}

/**
 * Share location via WhatsApp
 */
export async function shareViaWhatsApp(
  coords: { latitude: number; longitude: number },
  contactPhone?: string
): Promise<void> {
  try {
    const message = buildEmergencyMessage(coords.latitude, coords.longitude);
    const encodedMsg = encodeURIComponent(message);
    
    let url = `whatsapp://send?text=${encodedMsg}`;
    if (contactPhone) {
      const cleanPhone = contactPhone.replace(/\D/g, '');
      url = `whatsapp://send?phone=${cleanPhone}&text=${encodedMsg}`;
    }

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      // Fallback to generic share or just log
      console.warn('[ViaTerrena][SOS] WhatsApp is not installed');
    }
  } catch (error) {
    console.error('[ViaTerrena][SOS] Error sharing via WhatsApp:', error);
  }
}

/**
 * Execute full SOS sequence — call + SMS simultaneously
 */
export async function triggerFullSOS(payload: SOSPayload): Promise<void> {
  console.log('[ViaTerrena][SOS] Executing full SOS sequence');
  
  // Call immediately (don't await to ensure it fires)
  callEmergencyNumber(payload.countryCode);
  
  // Send SMS in parallel
  if (payload.personalContacts.length > 0) {
    sendLocationSMS(payload.personalContacts, payload.coords);
  }
}
