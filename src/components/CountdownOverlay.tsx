import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../constants/colors';

interface CountdownOverlayProps {
  visible: boolean;
  secondsRemaining: number;
  onCancel: () => void;
  emergencyNumber: string;
}

export const CountdownOverlay = ({ visible, secondsRemaining, onCancel, emergencyNumber }: CountdownOverlayProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.5, duration: 100, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }),
      ]).start();
    }
  }, [secondsRemaining, visible, scaleAnim]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.alertIcon}>🚨</Text>
          <Text style={styles.title}>CALLING EMERGENCY SERVICES</Text>
          
          <Animated.View style={[styles.timerContainer, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.timerText}>{secondsRemaining}</Text>
          </Animated.View>

          <Text style={styles.description}>
            Calling {emergencyNumber} in {secondsRemaining} seconds...
            {"\n"}Your location will be shared with your emergency contacts.
          </Text>

          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
            <Text style={styles.cancelBtnText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '85%',
    alignItems: 'center',
    padding: 32,
  },
  alertIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 40,
  },
  timerContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 59, 48, 0.5)',
  },
  timerText: {
    fontSize: 84,
    fontWeight: '900',
    color: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 60,
    opacity: 0.9,
  },
  cancelBtn: {
    width: '100%',
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF3B30',
  },
});
