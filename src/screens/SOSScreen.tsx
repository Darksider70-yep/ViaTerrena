import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as SMS from 'expo-sms';
import { colors } from '../constants/colors';
import { useAppStore } from '../store/useAppStore';
import { getPrimaryEmergencyNumber } from '../services/emergencyNumbers';

export default function SOSScreen() {
  const countryCode = useAppStore((s) => s.countryCode);
  const userCoords = useAppStore((s) => s.userCoords);
  const pulse = useRef(new Animated.Value(1)).current;
  
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    if (countdown === null) {
      anim.start();
    } else {
      anim.stop();
      pulse.setValue(1);
    }
    return () => anim.stop();
  }, [countdown]);

  const executeEmergencyProtocol = async () => {
    const number = getPrimaryEmergencyNumber(countryCode);
    console.log('[ViaTerrena] Executing SOS. Calling:', number);
    
    // Attempt to send SMS if available
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable && userCoords) {
      const mapsLink = `https://maps.google.com/?q=${userCoords.latitude},${userCoords.longitude}`;
      const message = `EMERGENCY! I need help. My current location is: ${mapsLink}`;
      // Note: we don't await this so the call can happen immediately, but on mobile SMS opens a composer
      SMS.sendSMSAsync([], message).catch(console.error);
    }
    
    // Trigger Phone Call
    Linking.openURL(`tel:${number}`).catch((err) => {
      console.error('[ViaTerrena] Error opening dialer', err);
      Alert.alert('Error', `Could not open dialer for ${number}`);
    });
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    if (countdown !== null) {
      // Cancel
      if (countdownRef.current) clearInterval(countdownRef.current);
      setCountdown(null);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      // Start Countdown
      setCountdown(3);
      let count = 3;
      countdownRef.current = setInterval(() => {
        count -= 1;
        if (count > 0) {
          setCountdown(count);
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else {
          if (countdownRef.current) clearInterval(countdownRef.current);
          setCountdown(null);
          executeEmergencyProtocol();
        }
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.label}>EMERGENCY</Text>
        <Text style={styles.country}>{countryCode}</Text>
        <View style={styles.pulseWrapper}>
          <Animated.View style={[styles.pulse, { transform: [{ scale: pulse }] }]} />
          <TouchableOpacity 
            style={[styles.button, countdown !== null && styles.buttonActive]} 
            onPress={handlePress} 
            activeOpacity={0.85}
          >
            {countdown !== null ? (
              <>
                <Text style={styles.sos}>{countdown}</Text>
                <Text style={styles.tap}>Tap to Cancel</Text>
              </>
            ) : (
              <>
                <Text style={styles.sos}>SOS</Text>
                <Text style={styles.tap}>Tap to Call</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>
          {countdown !== null 
            ? 'Emergency protocol initiated. Press again to abort.' 
            : 'Immediately calls your region\'s primary emergency service.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  label: { fontSize: 12, fontWeight: '700', color: colors.primary, marginBottom: 4 },
  country: { fontSize: 16, fontWeight: '500', color: colors.textSecondary, marginBottom: 40 },
  pulseWrapper: { alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  pulse: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: colors.sosPulse,
  },
  button: {
    width: 180, height: 180, borderRadius: 90, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonActive: { backgroundColor: colors.danger },
  sos: { fontSize: 52, fontWeight: '900', color: '#fff' },
  tap: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: -4 },
  hint: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', opacity: 0.7 },
});
