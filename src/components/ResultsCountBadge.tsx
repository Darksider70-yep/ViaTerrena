import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ResultsCountBadgeProps {
  totalCount: number;
  loading: boolean;
}

export const ResultsCountBadge = ({ totalCount, loading }: ResultsCountBadgeProps) => {
  const { theme, colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    
    if (loading) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.4, duration: 750, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 750, useNativeDriver: true }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [loading, pulseAnim]);

  const renderContent = () => {
    if (loading) return "Searching nearby services...";
    if (totalCount === 0) return "No services found";
    return `${totalCount} services found near you`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.success + '15' }]}>
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: loading ? colors.warning : colors.success,
            opacity: pulseAnim,
          },
        ]}
      />
      <Text style={[styles.text, { color: colors.success }]}>{renderContent()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginVertical: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
