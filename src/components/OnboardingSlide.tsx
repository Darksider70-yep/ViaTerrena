import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors as themeColors } from '../constants/colors';

interface OnboardingSlideProps {
  slide: {
    emoji: string;
    title: string;
    subtitle: string;
    color: string;
  };
  width: number;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ slide, width }) => {
  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.content}>
        <View style={styles.emojiContainer}>
          <View style={[styles.glow, { backgroundColor: slide.color, opacity: 0.15 }]} />
          <Text style={styles.emoji}>{slide.emoji}</Text>
        </View>
        
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  emojiContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: themeColors.textPrimary,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: themeColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default React.memo(OnboardingSlide);
