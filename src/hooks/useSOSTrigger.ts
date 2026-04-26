import { useState, useRef, useCallback, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../store/useAppStore';
import { triggerSOS } from '../services/SOSService';

interface SOSTriggerState {
  phase: 'idle' | 'countdown' | 'executing' | 'done' | 'cancelled';
  secondsRemaining: number;
  cancel: () => void;
  trigger: () => void;
  reset: () => void;
}

export function useSOSTrigger(): SOSTriggerState {
  const [phase, setPhase] = useState<'idle' | 'countdown' | 'executing' | 'done' | 'cancelled'>('idle');
  const [secondsRemaining, setSecondsRemaining] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { userCoords, countryCode, personalContacts, setLastSOSTrigger } = useAppStore();

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('idle');
    setSecondsRemaining(3);
    console.log('[ViaTerrena][SOS] Reset to idle');
  }, []);

  const cancel = useCallback(() => {
    if (phase === 'countdown') {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('cancelled');
      console.log('[ViaTerrena][SOS] Cancelled by user');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [phase]);

  const execute = useCallback(async () => {
    setPhase('executing');
    console.log('[ViaTerrena][SOS] Phase: executing');
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    if (userCoords) {
      await triggerSOS({
        userCoords,
        countryCode,
        personalContacts,
      });
      setLastSOSTrigger(Date.now());
    }

    setPhase('done');
    console.log('[ViaTerrena][SOS] Phase: done');
    
    // Auto-reset after 5s
    setTimeout(reset, 5000);
  }, [userCoords, countryCode, personalContacts, setLastSOSTrigger, reset]);

  const trigger = useCallback(() => {
    if (phase !== 'idle') return;

    setPhase('countdown');
    setSecondsRemaining(3);
    console.log('[ViaTerrena][SOS] Phase: countdown');
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    let count = 3;
    timerRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setSecondsRemaining(count);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        console.log(`[ViaTerrena][SOS] Countdown: ${count}`);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        execute();
      }
    }, 1000);
  }, [phase, execute]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    phase,
    secondsRemaining,
    cancel,
    trigger,
    reset,
  };
}
