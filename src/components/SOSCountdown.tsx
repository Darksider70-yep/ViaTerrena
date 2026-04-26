import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import * as Haptics from 'expo-haptics';

interface SOSCountdownProps {
  visible: boolean;
  onComplete: () => void;
  onCancel: () => void;
  emergencyNumber: string;
}

const SOSCountdown: React.FC<SOSCountdownProps> = ({
  visible,
  onComplete,
  onCancel,
  emergencyNumber,
}) => {
  const [count, setCount] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      setCount(3);
      timerRef.current = setInterval(() => {
        setCount((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            onComplete();
            return 0;
          }
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [visible, onComplete]);

  const handleCancel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onCancel();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.countText}>{count}</Text>
            <Text style={styles.subtitle}>Dialling: {emergencyNumber}</Text>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(226, 75, 74, 0.95)',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 80,
    fontWeight: '800',
    marginBottom: 20,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 18,
    opacity: 0.8,
  },
  cancelButton: {
    height: 56,
    width: 200,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});

export default React.memo(SOSCountdown);
