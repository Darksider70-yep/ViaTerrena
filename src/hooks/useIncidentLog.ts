import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const STORAGE_KEY = 'incident_log';
const MAX_INCIDENTS = 20;

export interface IncidentReport {
  id: string;
  timestamp: number;
  coords: { latitude: number; longitude: number };
  locationLabel: string;
  notes: string;
  photoUri?: string;
  shared: boolean;
}

export function useIncidentLog() {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIncidents = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setIncidents(JSON.parse(data));
      }
    } catch (error) {
      console.error('[ViaTerrena] Failed to load incidents', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  const addIncident = async (report: Omit<IncidentReport, 'id' | 'timestamp' | 'shared' | 'locationLabel'>) => {
    try {
      let locationLabel = `${report.coords.latitude.toFixed(4)}, ${report.coords.longitude.toFixed(4)}`;
      try {
        const [address] = await Location.reverseGeocodeAsync(report.coords);
        if (address) {
          locationLabel = `${address.name || address.street || ''}, ${address.district || address.city || ''}`.replace(/^, /, '');
        }
      } catch (e) {
        console.warn('[ViaTerrena] Reverse geocode failed', e);
      }

      const newIncident: IncidentReport = {
        ...report,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        locationLabel,
        shared: false,
      };

      const updated = [newIncident, ...incidents].slice(0, MAX_INCIDENTS);
      setIncidents(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('[ViaTerrena] Failed to add incident', error);
      throw error;
    }
  };

  const deleteIncident = async (id: string) => {
    try {
      const updated = incidents.filter(i => i.id !== id);
      setIncidents(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('[ViaTerrena] Failed to delete incident', error);
    }
  };

  const markShared = async (id: string) => {
    try {
      const updated = incidents.map(i => i.id === id ? { ...i, shared: true } : i);
      setIncidents(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('[ViaTerrena] Failed to mark shared', error);
    }
  };

  return {
    incidents,
    addIncident,
    deleteIncident,
    markShared,
    loading,
  };
}
