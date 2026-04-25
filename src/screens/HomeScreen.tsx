import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { CategoryPill } from '../components/CategoryPill';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { SERVICE_CATEGORIES } from '../constants/serviceCategories';
import { useAppStore } from '../store/useAppStore';

export default function HomeScreen() {
  const countryCode = useAppStore((state) => state.countryCode);
  const selectedCategory = useAppStore((state) => state.selectedCategory);
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);

  return (
    <ScreenContainer scrollable>
      <AppHeader 
        title="ViaTerrena" 
        subtitle="Your safety companion"
        rightElement={
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={32} color={colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      <View style={styles.statusCard}>
        <View style={styles.statusInfo}>
          <Text style={styles.statusLabel}>CURRENT LOCATION</Text>
          <Text style={styles.statusValue}>{countryCode === 'IN' ? 'India' : countryCode}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statusInfo}>
          <Text style={styles.statusLabel}>STATUS</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Protected</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Services</Text>
        <View style={styles.categoriesGrid}>
          {SERVICE_CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.categoryCard, { backgroundColor: cat.color + '10' }]}
              onPress={() => setSelectedCategory(cat.id as any)}
            >
              <View style={[styles.iconContainer, { backgroundColor: cat.color }]}>
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={24} color={colors.secondary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Offline Protection</Text>
            <Text style={styles.infoDesc}>Emergency numbers work without internet.</Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    padding: spacing.xs,
  },
  statusCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.md,
    borderRadius: 20,
    padding: spacing.lg,
    marginTop: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statusInfo: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.md,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textHint,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '31%',
    aspectRatio: 0.9,
    borderRadius: 16,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  infoSection: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  infoTextContainer: {
    marginLeft: spacing.md,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  infoDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
