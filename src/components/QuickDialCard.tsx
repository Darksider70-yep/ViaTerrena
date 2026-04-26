import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Linking, useWindowDimensions } from 'react-native';
import * as Haptics from 'expo-haptics';

interface QuickDialCardProps {
  label: string;
  number: string;
  emoji: string;
  color: string;
}

const QuickDialCard: React.FC<QuickDialCardProps> = ({ label, number, emoji, color }) => {
  const { width } = useWindowDimensions();
  const cardWidth = (width / 2) - 30;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${number.replace(/\s/g, '')}`);
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { 
          width: cardWidth,
          backgroundColor: `${color}1A`, // 10% opacity tint
          borderColor: `${color}40`, // 25% opacity border
        }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[styles.emojiCircle, { backgroundColor: color }]}>
        <Text style={styles.emojiText}>{emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
        <Text style={[styles.number, { color }]}>{number}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 80,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  emojiCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 18,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  number: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
});

export default React.memo(QuickDialCard);
