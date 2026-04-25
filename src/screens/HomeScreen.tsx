import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { SERVICE_CATEGORIES } from '../constants/serviceCategories';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');
const GRID_PADDING = 20;
const ITEM_SPACING = 12;
const CARD_WIDTH = (width - (GRID_PADDING * 2) - ITEM_SPACING) / 2;

export default function HomeScreen() {
  const countryCode = useAppStore((s) => s.countryCode);
  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory);
  const { theme, colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.appName, { color: theme.textPrimary }]}>ViaTerrena</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color={colors.secondary} />
              <Text style={[styles.locationText, { color: theme.textSecondary }]}>
                {countryCode === 'IN' ? 'Chennai, India' : countryCode}
              </Text>
            </View>
          </View>
          <View style={[styles.profileBtn, { backgroundColor: theme.surface }]}>
            <Ionicons name="person" size={20} color={colors.secondary} />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Emergency Services</Text>
        
        <View style={styles.grid}>
          {SERVICE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catCard, 
                { 
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedCategory(cat.id as any)}
            >
              <View style={[styles.catIconContainer, { backgroundColor: cat.color + '15' }]}>
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
              </View>
              <Text style={[styles.catLabel, { color: theme.textPrimary }]}>{cat.label}</Text>
              <View style={[styles.catBadge, { backgroundColor: cat.color }]} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.banner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.bannerContent}>
            <View style={[styles.bannerIcon, { backgroundColor: colors.accent + '20' }]}>
              <Ionicons name="shield-checkmark" size={24} color={colors.accent} />
            </View>
            <View style={styles.bannerText}>
              <Text style={[styles.bannerTitle, { color: theme.textPrimary }]}>You are protected</Text>
              <Text style={[styles.bannerSub, { color: theme.textSecondary }]}>ViaTerrena is active and monitoring your safety.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: GRID_PADDING },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  appName: { 
    fontSize: 34, 
    fontWeight: '900', 
    letterSpacing: -1.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  profileBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  catCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.1,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    marginBottom: ITEM_SPACING,
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  catIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catEmoji: { 
    fontSize: 28,
  },
  catLabel: { 
    fontSize: 16, 
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  catBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  banner: {
    marginTop: 20,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    marginBottom: 40,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 13,
    lineHeight: 18,
  },
});
