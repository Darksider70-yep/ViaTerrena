import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { EmergencyContact } from '../services/SOSService';
import { showToast } from '../utils/toast';

const STORAGE_KEY = 'emergency_contacts';

export function useEmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  const loadContacts = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setContacts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('[ViaTerrena][Contacts] Failed to load contacts', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const computeInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const addContact = async (contactData: Omit<EmergencyContact, 'id' | 'avatarInitials'>) => {
    if (contacts.length >= 5) {
      throw new Error('Maximum 5 contacts allowed');
    }

    const newContact: EmergencyContact = {
      ...contactData,
      id: Date.now().toString(),
      avatarInitials: computeInitials(contactData.name),
    };

    const updated = [...contacts, newContact];
    setContacts(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast('Contact saved successfully');
  };

  const updateContact = async (id: string, updates: Partial<EmergencyContact>) => {
    const updated = contacts.map((c) => {
      if (c.id === id) {
        const merged = { ...c, ...updates };
        if (updates.name) {
          merged.avatarInitials = computeInitials(updates.name);
        }
        return merged;
      }
      return c;
    });

    setContacts(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast('Contact updated');
  };

  const deleteContact = async (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    showToast('Contact removed');
  };

  return {
    contacts,
    loading,
    addContact,
    updateContact,
    deleteContact,
    refresh: loadContacts,
  };
}
