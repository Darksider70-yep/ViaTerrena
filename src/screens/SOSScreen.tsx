import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { useAppStore } from '../store/useAppStore';
import { getPrimaryEmergencyNumber } from '../services/EmergencyNumbers';

export default function SOSScreen() {
  const countryCode = useAppStore((state) => state.countryCode);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleSOSPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    const number = getPrimaryEmergencyNumber(countryCode);
    console.log(`[ViaTerrena] SOS Triggered: Calling ${number}`);
    // Linking.openURL(`tel:${number}`);
  };

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emergencyLabel}>EMERGENCY HELP</Text>
        <Text style={styles.countryLabel}>Location Detected: {countryCode}</Text>
      </View>

      <View style={styles.centerContent}>
        <Animated.View 
          style={[
            styles.pulseCircle, 
            { transform: [{ scale: pulseAnim }] }
          ]} 
        />
        <TouchableOpacity 
          style={styles.sosButton} 
          onPress={handleSOSPress}
          activeOpacity={0.9}
        >
          <Text style={styles.sosText}>SOS</Text>
          <Text style={styles.sosSubtext}>Tap to Call</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tapping the button will immediately call the primary emergency services for your region.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  emergencyLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  countryLabel: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.sosPulse,
  },
  sosButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 8,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sosText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: typography.letterSpacing.wide,
  },
  sosSubtext: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: -4,
  },
  footer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  footerText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.7,
  },
});
