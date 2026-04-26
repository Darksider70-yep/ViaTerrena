import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Vibration
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

const CANCEL_WINDOW_SECONDS = 10;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CrashAlertModal({ visible, onCancel, onConfirm }: Props) {
  const [countdown, setCountdown] = useState(CANCEL_WINDOW_SECONDS);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Pulse animation
  useEffect(() => {
    if (!visible) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [visible, pulseAnim]);

  // Countdown + haptics
  useEffect(() => {
    if (!visible) {
      setCountdown(CANCEL_WINDOW_SECONDS);
      return;
    }

    setCountdown(CANCEL_WINDOW_SECONDS);

    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onConfirm();
          return 0;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        return prev - 1;
      });
    }, 1000);

    // Continuous vibration pattern to alert unconscious/dazed user
    Vibration.vibrate([0, 500, 300, 500, 300, 500], true);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      Vibration.cancel();
    };
  }, [visible, onConfirm]);

  const handleCancel = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    Vibration.cancel();
    onCancel();
  }, [onCancel]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Pulsing crash icon */}
          <Animated.Text style={[styles.icon, { transform: [{ scale: pulseAnim }] }]}>
            💥
          </Animated.Text>

          <Text style={styles.title}>Crash Detected</Text>
          <Text style={styles.subtitle}>
            Are you okay? Emergency services will be contacted in:
          </Text>

          {/* Countdown circle */}
          <View style={styles.countdownCircle}>
            <Text style={styles.countdownNumber}>{countdown}</Text>
            <Text style={styles.countdownLabel}>seconds</Text>
          </View>

          <Text style={styles.hint}>
            If you are safe, tap Cancel now.
          </Text>

          {/* Buttons */}
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelText}>I'M OKAY — CANCEL</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sosBtn} onPress={() => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            Vibration.cancel();
            onConfirm();
          }}>
            <Text style={styles.sosText}>CALL FOR HELP NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  icon: { fontSize: 64, marginBottom: spacing.md },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  countdownCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  countdownNumber: { fontSize: 40, fontWeight: '900', color: '#fff' },
  countdownLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  hint: {
    fontSize: 13,
    color: '#888',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  cancelBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cancelText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  sosBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  sosText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
