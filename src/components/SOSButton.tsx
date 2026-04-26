import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';

interface SOSButtonProps {
  onTrigger: () => void;
  disabled?: boolean;
  size?: number; // default 200
  active?: boolean; // Stop pulsing when active (countdown)
}

const SOSButton: React.FC<SOSButtonProps> = ({
  onTrigger,
  disabled = false,
  size = 200,
  active = false,
}) => {
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const pulse3 = useRef(new Animated.Value(1)).current;

  const opacity1 = useRef(new Animated.Value(0.6)).current;
  const opacity2 = useRef(new Animated.Value(0.6)).current;
  const opacity3 = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (active) {
      // Stop animations
      pulse1.setValue(1);
      pulse2.setValue(1);
      pulse3.setValue(1);
      opacity1.setValue(0);
      opacity2.setValue(0);
      opacity3.setValue(0);
      return;
    }

    const createAnimation = (pulse: Animated.Value, opacity: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(pulse, {
              toValue: 1.6,
              duration: 2000,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 2000,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    const anim1 = createAnimation(pulse1, opacity1, 0);
    const anim2 = createAnimation(pulse2, opacity2, 600);
    const anim3 = createAnimation(pulse3, opacity3, 1200);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [active, pulse1, pulse2, pulse3, opacity1, opacity2, opacity3]);

  const handlePressIn = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handlePress = () => {
    if (disabled) return;
    onTrigger();
  };

  return (
    <View style={[styles.container, { width: size * 1.6, height: size * 1.6 }]}>
      {/* Pulse Rings */}
      <Animated.View
        style={[
          styles.pulse,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: pulse1 }],
            opacity: opacity1,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.pulse,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: pulse2 }],
            opacity: opacity2,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.pulse,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: pulse3 }],
            opacity: opacity3,
          },
        ]}
      />

      {/* Main Button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPress={handlePress}
        disabled={disabled}
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <Text style={styles.text}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.sosBackground,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: colors.sosBackground,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    zIndex: 10,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 4,
  },
  pulse: {
    position: 'absolute',
    backgroundColor: colors.sosPulse,
  },
});

export default React.memo(SOSButton);
