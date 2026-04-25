import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../store/useAppStore';
import { PersonalContact } from '../services/SOSService';

const STORAGE_KEY = 'personal_contacts';

interface UsePersonalContactsResult {
  contacts: PersonalContact[];
  loading: boolean;
  addContact: (contact: Omit<PersonalContact, 'id' | 'addedAt'>) => Promise<void>;
  updateContact: (id: string, updates: Partial<PersonalContact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
}

export function usePersonalContacts(): UsePersonalContactsResult {
  const [loading, setLoading] = useState(true);
  const { personalContacts, setPersonalContacts } = useAppStore();

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setPersonalContacts(JSON.parse(stored));
        }
      } catch (error) {
        console.error('[ViaTerrena][Contacts] Failed to load contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, [setPersonalContacts]);

  const saveContacts = async (newContacts: PersonalContact[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
      setPersonalContacts(newContacts);
    } catch (error) {
      console.error('[ViaTerrena][Contacts] Failed to save contacts:', error);
    }
  };

  const addContact = useCallback(async (contact: Omit<PersonalContact, 'id' | 'addedAt'>) => {
    if (personalContacts.length >= 5) {
      throw new Error('Maximum 5 contacts allowed');
    }

    const newContact: PersonalContact = {
      ...contact,
      id: Math.random().toString(36).substring(2, 9), // Simple UUID fallback
      addedAt: Date.now(),
    };

    const updated = [...personalContacts, newContact];
    await saveContacts(updated);
  }, [personalContacts]);

  const updateContact = useCallback(async (id: string, updates: Partial<PersonalContact>) => {
    const updated = personalContacts.map(c => 
      c.id === id ? { ...c, ...updates } : c
    );
    await saveContacts(updated);
  }, [personalContacts]);

  const deleteContact = useCallback(async (id: string) => {
    const updated = personalContacts.filter(c => c.id !== id);
    await saveContacts(updated);
  }, [personalContacts]);

  return {
    contacts: personalContacts,
    loading,
    addContact,
    updateContact,
    deleteContact,
  };
}
