import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SMS from 'expo-sms';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { useSOSTrigger } from '../hooks/useSOSTrigger';
import { SOSButton } from '../components/SOSButton';
import { CountdownOverlay } from '../components/CountdownOverlay';
import { QuickDialCard } from '../components/QuickDialCard';
import { getEmergencyNumbers, getPrimaryEmergencyNumber } from '../services/emergencyNumbers';
import { buildEmergencyMessage } from '../utils/locationShare';

const INDIA_FALLBACK = [
  { label: 'National Emergency', number: '112', description: 'Police, Fire, Ambulance', color: '#E24B4A', icon: 'alert-circle' },
  { label: 'Ambulance', number: '108', description: 'Medical emergency', color: '#E24B4A', icon: 'medical' },
  { label: 'Police', number: '100', description: 'Law enforcement', color: '#185FA5', icon: 'shield' },
  { label: 'Fire', number: '101', description: 'Fire & rescue', color: '#BA7517', icon: 'flame' },
  { label: 'Highway Helpline', number: '1033', description: 'NHAI road assistance', color: '#1D9E75', icon: 'car' },
  { label: 'Women Helpline', number: '1091', description: 'Women in distress', color: '#8B5CF6', icon: 'woman' },
];

export default function SOSScreen() {
  const { theme, colors } = useTheme();
  const { countryCode, userCoords, personalContacts } = useAppStore();
  const { phase, secondsRemaining, trigger, cancel } = useSOSTrigger();

  const emergencyNumbers = countryCode === 'IN' 
    ? INDIA_FALLBACK 
    : (() => {
        const numbers = getEmergencyNumbers(countryCode);
        return [
          { label: 'Emergency', number: numbers.emergency || '112', description: 'Primary emergency', color: colors.primary, icon: 'alert-circle' },
          { label: 'Police', number: numbers.police || '100', description: 'Law enforcement', color: colors.secondary, icon: 'shield' },
          { label: 'Ambulance', number: numbers.ambulance || '108', description: 'Medical help', color: colors.danger, icon: 'medical' },
        ].filter(n => !!n.number);
      })();

  const handleSMSShare = async () => {
    if (!userCoords) {
      Alert.alert('Location not ready', 'Please wait while we detect your location.');
      return;
    }
    const msg = buildEmergencyMessage(userCoords.latitude, userCoords.longitude);
    const phones = personalContacts.map(c => c.phone).filter(p => !!p);
    if (phones.length === 0) {
      Alert.alert('No contacts', 'Add emergency contacts in the Contacts tab first.');
      return;
    }
    await SMS.sendSMSAsync(phones, msg);
  };

  const handleWhatsAppShare = async () => {
    if (!userCoords) {
      Alert.alert('Location not ready', 'Please wait while we detect your location.');
      return;
    }
    const msg = buildEmergencyMessage(userCoords.latitude, userCoords.longitude);
    const url = `whatsapp://send?text=${encodeURIComponent(msg)}`;
    
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('WhatsApp not installed', 'Please install WhatsApp to use this feature.');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Emergency SOS</Text>
          <View style={[styles.countryBadge, { backgroundColor: theme.surface }]}>
            <Text style={styles.countryEmoji}>{countryCode === 'IN' ? '🇮🇳' : '📍'}</Text>
            <Text style={[styles.countryCode, { color: theme.textPrimary }]}>{countryCode}</Text>
          </View>
        </View>

        <View style={styles.sosSection}>
          <SOSButton 
            phase={phase} 
            secondsRemaining={secondsRemaining} 
            onPress={trigger} 
            onCancel={cancel} 
          />
          <Text style={[styles.sosHint, { color: theme.textSecondary }]}>
            {phase === 'idle' ? 'Hold button to trigger emergency alert' : 'Emergency sequence initiated'}
          </Text>
        </View>

        <View style={styles.shareRow}>
          <TouchableOpacity 
            style={[styles.shareBtn, { backgroundColor: theme.surface, borderColor: theme.border }]} 
            onPress={handleSMSShare}
          >
            <Ionicons name="phone-portrait" size={20} color={colors.secondary} />
            <Text style={[styles.shareText, { color: theme.textPrimary }]}>Share via SMS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.shareBtn, { backgroundColor: theme.surface, borderColor: theme.border }]} 
            onPress={handleWhatsAppShare}
          >
            <Ionicons name="logo-whatsapp" size={20} color={colors.success} />
            <Text style={[styles.shareText, { color: theme.textPrimary }]}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            {countryCode === 'IN' ? 'India Emergency Numbers' : 'Local Emergency Numbers'}
          </Text>
        </View>

        <View style={styles.dialerList}>
          {emergencyNumbers.map((item, idx) => (
            <QuickDialCard 
              key={idx}
              label={item.label}
              number={item.number}
              description={item.description}
              color={item.color}
              icon={item.icon}
            />
          ))}
        </View>

        <View style={[styles.tipsCard, { backgroundColor: theme.surfaceElevated }]}>
          <Text style={[styles.tipsTitle, { color: theme.textPrimary }]}>While waiting for help:</Text>
          <View style={styles.tipRow}>
            <Text style={styles.tipDot}>•</Text>
            <Text style={[styles.tipText, { color: theme.textSecondary }]}>Stay calm and keep breathing</Text>
          </View>
          <View style={styles.tipRow}>
            <Text style={styles.tipDot}>•</Text>
            <Text style={[styles.tipText, { color: theme.textSecondary }]}>Don't move injured persons unless in danger</Text>
          </View>
          <View style={styles.tipRow}>
            <Text style={styles.tipDot}>•</Text>
            <Text style={[styles.tipText, { color: theme.textSecondary }]}>Turn on hazard lights</Text>
          </View>
          <View style={styles.tipRow}>
            <Text style={styles.tipDot}>•</Text>
            <Text style={[styles.tipText, { color: theme.textSecondary }]}>Keep line open with emergency operator</Text>
          </View>
        </View>
      </ScrollView>

      <CountdownOverlay 
        visible={phase === 'countdown'} 
        secondsRemaining={secondsRemaining} 
        onCancel={cancel}
        emergencyNumber={getPrimaryEmergencyNumber(countryCode)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  countryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  countryEmoji: { fontSize: 16, marginRight: 6 },
  countryCode: { fontSize: 14, fontWeight: '800' },
  sosSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sosHint: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: -8,
  },
  shareRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  shareText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  dialerList: {
    marginBottom: 32,
  },
  tipsCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 40,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  tipDot: {
    width: 12,
    fontSize: 14,
    color: '#8E8E93',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
