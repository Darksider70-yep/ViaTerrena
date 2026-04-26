import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { useAppStore } from '../store/useAppStore';
import { getEmergencyNumbers } from '../services/emergencyNumbers';
import { EMERGENCY_EMOJI_MAP, EMERGENCY_COLOR_MAP } from '../constants/serviceCategories';
import QuickDialCard from '../components/QuickDialCard';
import EmergencyInfoCard from '../components/EmergencyInfoCard';
import { COUNTRY_FLAGS, COUNTRY_NAMES } from '../utils/countryNames';
import IncidentReporter from '../components/IncidentReporter';
import IncidentCard from '../components/IncidentCard';
import { useIncidentLog } from '../hooks/useIncidentLog';

import { RootTabParamList } from '../navigation/RootNavigator';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { countryCode, userCoords } = useAppStore();
  const { incidents, deleteIncident } = useIncidentLog();
  const [reporterVisible, setReporterVisible] = useState(false);
  
  const emergencyNumbers = getEmergencyNumbers(countryCode);

  const dialCards = Object.entries(emergencyNumbers).map(([key, number]) => ({
    key,
    label: key.replace(/([A-Z])/g, ' $1'),
    number: number as string,
    emoji: EMERGENCY_EMOJI_MAP[key] ?? '📞',
    color: EMERGENCY_COLOR_MAP[key] ?? colors.info,
  }));

  const handleReporterOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setReporterVisible(true);
  };

  const handleDeleteIncident = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Delete Incident', 'Are you sure you want to remove this log?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteIncident(id) },
    ]);
  };

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
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            navigation.navigate('SOS');
          }}
          activeOpacity={0.9}
          accessibilityLabel="SOS Emergency Button shortcut"
          accessibilityRole="button"
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
          <TouchableOpacity 
            style={styles.viewGuideBtn}
            onPress={() => navigation.navigate('FirstAidGuide')}
          >
            <Text style={styles.viewGuideText}>View Full First Aid Guide →</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Incidents */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Incidents</Text>
            {incidents.length > 0 && (
              <Text style={styles.countBadge}>{incidents.length}</Text>
            )}
          </View>
          <View style={styles.incidentList}>
            {incidents.slice(0, 2).map((incident) => (
              <IncidentCard 
                key={incident.id} 
                incident={incident} 
                onDelete={handleDeleteIncident}
              />
            ))}
            {incidents.length === 0 && (
              <View style={styles.emptyIncidents}>
                <Text style={styles.emptyIncidentsText}>No incidents logged yet</Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Access Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.accessRow}>
            <TouchableOpacity 
              style={[styles.accessBtn, { backgroundColor: '#F0F9FF' }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('Nearby');
              }}
            >
              <Ionicons name="map" size={24} color={colors.secondary} />
              <Text style={[styles.accessBtnText, { color: colors.secondary }]}>Nearby Services</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.accessBtn, { backgroundColor: '#FFF7ED' }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('Vehicle');
              }}
            >
              <Ionicons name="car" size={24} color={colors.warning} />
              <Text style={[styles.accessBtnText, { color: colors.warning }]}>Vehicle Help</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleReporterOpen}
        activeOpacity={0.8}
        accessibilityLabel="Log a road incident"
        accessibilityRole="button"
      >
        <Ionicons name="clipboard" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <IncidentReporter 
        visible={reporterVisible} 
        onClose={() => setReporterVisible(false)} 
        coords={userCoords}
      />
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
    paddingBottom: 100,
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
    flexDirection: 'row',
    alignItems: 'center',
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
  countBadge: {
    backgroundColor: colors.secondary,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: -16,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  viewGuideBtn: {
    marginHorizontal: 24,
    marginTop: -10,
    marginBottom: 10,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewGuideText: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: 14,
  },
  incidentList: {
    paddingHorizontal: 24,
  },
  emptyIncidents: {
    padding: 20,
    backgroundColor: colors.background,
    borderRadius: 16,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyIncidentsText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
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
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#BA7517',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default HomeScreen;
