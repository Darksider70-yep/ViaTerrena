import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../constants/colors';
import { useAppStore } from '../store/useAppStore';
import { getEmergencyNumbers } from '../services/emergencyNumbers';
import { EMERGENCY_EMOJI_MAP, EMERGENCY_COLOR_MAP } from '../constants/serviceCategories';
import QuickDialCard from '../components/QuickDialCard';
import EmergencyInfoCard from '../components/EmergencyInfoCard';
import { COUNTRY_FLAGS, COUNTRY_NAMES } from '../utils/countryNames';

import { RootTabParamList } from '../navigation/RootNavigator';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { countryCode } = useAppStore();
  const emergencyNumbers = getEmergencyNumbers(countryCode);

  const dialCards = Object.entries(emergencyNumbers).map(([key, number]) => ({
    key,
    label: key.replace(/([A-Z])/g, ' $1'), // camelCase to Space Case
    number: number as string,
    emoji: EMERGENCY_EMOJI_MAP[key] ?? '📞',
    color: EMERGENCY_COLOR_MAP[key] ?? colors.info,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.brand}>ViaTerrena</Text>
        <View style={styles.locationBadge}>
          <Text style={styles.badgeText}>
            {COUNTRY_FLAGS[countryCode] || '🌐'} {COUNTRY_NAMES[countryCode] || countryCode}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SOS Shortcut Card */}
        <TouchableOpacity 
          style={styles.sosCard}
          onPress={() => navigation.navigate('SOS')}
          activeOpacity={0.9}
        >
          <View style={styles.sosIconCircle}>
            <Ionicons name="alert-circle" size={32} color="#E24B4A" />
          </View>
          <View style={styles.sosTextContainer}>
            <Text style={styles.sosTitle}>Need emergency help?</Text>
            <Text style={styles.sosSubtitle}>Tap SOS to alert services + contacts</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#E24B4A" />
        </TouchableOpacity>

        {/* Quick Dial Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Numbers</Text>
            <Text style={styles.sectionSubtitle}>For {COUNTRY_NAMES[countryCode] || countryCode} — tap to call</Text>
          </View>
          <View style={styles.grid}>
            {dialCards.map((card) => (
              <QuickDialCard 
                key={card.key}
                label={card.label}
                number={card.number}
                emoji={card.emoji}
                color={card.color}
              />
            ))}
          </View>
        </View>

        {/* Golden Hour Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Golden Hour</Text>
          <EmergencyInfoCard />
        </View>

        {/* Quick Access Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.accessRow}>
            <TouchableOpacity 
              style={[styles.accessBtn, { backgroundColor: '#F0F9FF' }]}
              onPress={() => navigation.navigate('Nearby')}
            >
              <Ionicons name="map" size={24} color={colors.secondary} />
              <Text style={[styles.accessBtnText, { color: colors.secondary }]}>Nearby Services</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.accessBtn, { backgroundColor: '#FFF7ED' }]}
              onPress={() => navigation.navigate('Vehicle')}
            >
              <Ionicons name="car" size={24} color={colors.warning} />
              <Text style={[styles.accessBtnText, { color: colors.warning }]}>Vehicle Help</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 12,
  },
  brand: {
    fontSize: 24,
    fontWeight: '900',
    color: '#E24B4A',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sosCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    margin: 24,
    marginTop: 12,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E24B4A',
    elevation: 2,
    shadowColor: '#E24B4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sosIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  sosTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sosSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginTop: 12,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  accessRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  accessBtn: {
    flex: 1,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  accessBtnText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HomeScreen;
