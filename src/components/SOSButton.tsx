import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { colors } from '../constants/colors';
import { PulseRing } from './PulseRing';
import { Ionicons } from '@expo/vector-icons';

interface SOSButtonProps {
  phase: 'idle' | 'countdown' | 'executing' | 'done' | 'cancelled';
  secondsRemaining: number;
  onPress: () => void;
  onCancel: () => void;
}

export const SOSButton = ({ phase, secondsRemaining, onPress, onCancel }: SOSButtonProps) => {
  const isPulsing = phase === 'countdown' || phase === 'executing';

  const renderContent = () => {
    switch (phase) {
      case 'idle':
        return (
          <View style={styles.content}>
            <Text style={styles.title}>SOS</Text>
            <Text style={styles.subtitle}>tap for emergency</Text>
          </View>
        );
      case 'countdown':
        return (
          <View style={styles.content}>
            <Text style={styles.countdown}>{secondsRemaining}</Text>
            <Text style={styles.cancelText}>CANCEL</Text>
          </View>
        );
      case 'executing':
        return (
          <View style={styles.content}>
            <Ionicons name="call" size={32} color="#fff" />
            <Text style={styles.statusText}>Calling...</Text>
          </View>
        );
      case 'done':
        return (
          <View style={styles.content}>
            <Ionicons name="checkmark-circle" size={48} color="#fff" />
            <Text style={styles.statusText}>Help Alerted</Text>
          </View>
        );
      case 'cancelled':
        return (
          <View style={styles.content}>
            <Ionicons name="close-circle" size={48} color="#fff" />
            <Text style={styles.statusText}>Cancelled</Text>
          </View>
        );
    }
  };

  const getBackgroundColor = () => {
    if (phase === 'done') return '#1D9E75';
    if (phase === 'cancelled') return colors.textSecondary || '#8E8E93';
    return colors.primary;
  };

  return (
    <View style={styles.wrapper}>
      <PulseRing active={isPulsing} size={160} />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: getBackgroundColor() }]}
        onPress={phase === 'idle' ? onPress : phase === 'countdown' ? onCancel : undefined}
        activeOpacity={0.8}
        accessibilityLabel="Emergency SOS button. Double tap to call emergency services."
        accessibilityRole="button"
      >
        {renderContent()}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  button: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: -4,
  },
  countdown: {
    fontSize: 72,
    fontWeight: '900',
    color: '#fff',
  },
  cancelText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '800',
    marginTop: -8,
  },
  statusText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '800',
    marginTop: 8,
    textAlign: 'center',
  },
});
