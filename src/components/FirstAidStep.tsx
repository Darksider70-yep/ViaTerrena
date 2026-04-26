import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';


import { FirstAidStep as FirstAidStepData } from '../types/firstAid';

interface FirstAidStepProps {
  step: FirstAidStepData;
  stepNumber: number;
  isExpanded: boolean;
  onToggle: () => void;
  categoryColor: string;
}

const FirstAidStep: React.FC<FirstAidStepProps> = ({
  step,
  stepNumber,
  isExpanded,
  onToggle,
  categoryColor,
}) => {
  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  return (
    <View style={[
      styles.container, 
      { borderLeftColor: step.critical ? colors.sosBackground : categoryColor }
    ]}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles.titleRow}>
          <View style={[styles.numberCircle, { backgroundColor: categoryColor }]}>
            <Text style={styles.numberText}>{stepNumber}</Text>
          </View>
          <View style={styles.titleContent}>
            <View style={styles.titleLine}>
              <Text style={styles.title}>{step.title}</Text>
              {step.critical && (
                <View style={styles.criticalBadge}>
                  <Text style={styles.criticalText}>CRITICAL</Text>
                </View>
              )}
            </View>
            <Text style={styles.summary}>{step.summary}</Text>
          </View>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={colors.textSecondary} 
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.detail}>{step.detail}</Text>
          
          <View style={styles.listsContainer}>
            <View style={styles.listSection}>
              <Text style={styles.listTitle}>✅ DO</Text>
              {step.doList.map((item, index) => (
                <Text key={index} style={styles.listItem}>• {item}</Text>
              ))}
            </View>
            
            <View style={styles.listSection}>
              <Text style={styles.listTitle}>❌ DON'T</Text>
              {step.dontList.map((item, index) => (
                <Text key={index} style={styles.listItem}>• {item}</Text>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  titleContent: {
    flex: 1,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 8,
  },
  criticalBadge: {
    backgroundColor: colors.sosBackground + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  criticalText: {
    color: colors.sosBackground,
    fontSize: 10,
    fontWeight: '900',
  },
  summary: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  content: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detail: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    marginTop: 16,
  },
  listsContainer: {
    marginTop: 16,
    gap: 16,
  },
  listSection: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
    color: colors.textPrimary,
  },
  listItem: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
});

export default React.memo(FirstAidStep);
