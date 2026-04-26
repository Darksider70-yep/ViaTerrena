import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';


const EmergencyInfoCard: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const tips = [
    '1. Stay calm — assess scene for danger',
    '2. Call emergency services immediately (112)',
    '3. Do not move injured persons unless in immediate danger',
    '4. Apply direct pressure to bleeding wounds',
    '5. Keep the injured person warm and conscious',
    '6. Clear the road to prevent secondary accidents',
    '7. Stay on the line with emergency services',
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.titleRow}>
          <Ionicons name="time" size={24} color={colors.onboarding3} />
          <Text style={styles.title}>Golden Hour — First 60 Seconds</Text>
        </View>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={colors.onboarding3} 
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipRow}>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F5FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.onboarding3,
    marginHorizontal: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    minHeight: 56,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.onboarding3,
    marginLeft: 10,
  },
  content: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(24, 95, 165, 0.1)',
  },
  tipRow: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: colors.onboarding3,
    lineHeight: 20,
    fontWeight: '500',
  },
});

export default React.memo(EmergencyInfoCard);
