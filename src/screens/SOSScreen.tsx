import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  TextInput,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../constants/colors';
import { useAppStore } from '../store/useAppStore';
import { useEmergencyContacts } from '../hooks/useEmergencyContacts';
import { getPrimaryEmergencyNumber } from '../services/emergencyNumbers';
import { 
  triggerSOS, 
  SOSResult, 
  generateSOSMessage, 
  shareViaWhatsApp, 
  shareViaSMS 
} from '../services/SOSService';
import SOSButton from '../components/SOSButton';
import SOSCountdown from '../components/SOSCountdown';
import { COUNTRY_NAMES, COUNTRY_FLAGS } from '../utils/countryNames';
import emergencyNumbersData from '../data/emergencyNumbers.json';

import * as Haptics from 'expo-haptics';
import { showToast } from '../utils/toast';
import { RootTabParamList } from '../navigation/RootNavigator';

const SOSScreen: React.FC = () => {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { userCoords, countryCode, setCountryCode } = useAppStore();
  const { contacts } = useEmergencyContacts();
  const [countdownVisible, setCountdownVisible] = useState(false);
  const [sosResult, setSOSResult] = useState<SOSResult | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dismissAnim = useRef(new Animated.Value(0)).current;
  const primaryNumber = getPrimaryEmergencyNumber(countryCode);

  const handleSOSPress = () => setCountdownVisible(true);

  const handleCountdownComplete = async () => {
    setCountdownVisible(false);
    if (!userCoords) return;
    
    const result = await triggerSOS({
      userCoords,
      countryCode,
      personalContacts: contacts,
    });
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast('Emergency services alerted', 'success');
    
    setSOSResult(result);
    startDismissTimer();
  };

  const handleCountdownCancel = () => {
    setCountdownVisible(false);
  };

  const startDismissTimer = () => {
    dismissAnim.setValue(0);
    Animated.timing(dismissAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) setSOSResult(null);
    });
  };

  const handleWhatsAppShare = async () => {
    if (!userCoords) return;
    const message = generateSOSMessage(userCoords.latitude, userCoords.longitude);
    const success = await shareViaWhatsApp(message);
    if (!success) showToast('WhatsApp not installed', 'error');
  };

  const handleSMSShare = async () => {
    if (!userCoords) return;
    const message = generateSOSMessage(userCoords.latitude, userCoords.longitude);
    const phoneNumbers = contacts.map(c => c.phone);
    if (phoneNumbers.length === 0) {
      showToast('Add emergency contacts first', 'info');
      return;
    }
    const success = await shareViaSMS(phoneNumbers, message);
    if (!success) showToast('Could not send SMS', 'error');
  };

  const countries = Object.keys(emergencyNumbersData).map((code) => ({
    code,
    name: COUNTRY_NAMES[code] || code,
    flag: COUNTRY_FLAGS[code] || '🌐',
    number: (emergencyNumbersData as any)[code].emergency || (emergencyNumbersData as any)[code].police,
  }));

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!userCoords) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={{ color: colors.sosBackground, fontSize: 18, fontWeight: '800', marginBottom: 12 }}>GPS LOCKING...</Text>
        <Text style={styles.loadingText}>Waiting for GPS lock...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency SOS</Text>
        <View style={styles.countryBadge}>
          <Text style={styles.badgeText}>{COUNTRY_FLAGS[countryCode] || '🌐'} {countryCode}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Text style={styles.heroSubtitle}>Press and hold to call emergency services</Text>
          
          <View style={styles.buttonWrapper}>
            <SOSButton onTrigger={handleSOSPress} active={countdownVisible} />
          </View>

          <TouchableOpacity style={styles.numberRow} onPress={() => setPickerVisible(true)}>
            <Text style={styles.numberLabel}>Will dial: </Text>
            <Text style={styles.numberValue}>{primaryNumber}</Text>
            <View style={styles.changeBtn}>
              <Text style={styles.changeBtnText}>Change</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.secondary} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.shareSection}>
          <TouchableOpacity style={styles.shareBtn} onPress={handleWhatsAppShare}>
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            <Text style={styles.shareBtnText}>Share via WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.shareBtn, { backgroundColor: '#F0F0F0', borderWidth: 0 }]} onPress={handleSMSShare}>
            <Ionicons name="chatbubble-ellipses" size={20} color={colors.textPrimary} />
            <Text style={[styles.shareBtnText, { color: colors.textPrimary }]}>Share via SMS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactsSection}>
          <View style={styles.contactsHeader}>
            <Text style={styles.sectionTitle}>Notifying {contacts.length} contacts on SOS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Contacts')}>
              <Text style={styles.manageBtn}>Manage →</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.avatarList}>
            {contacts.slice(0, 5).map((c) => (
              <View key={c.id} style={styles.avatarMini}>
                <Text style={styles.avatarMiniText}>{c.avatarInitials}</Text>
              </View>
            ))}
            {contacts.length === 0 ? (
              <Text style={styles.noContactsText}>No personal contacts added</Text>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {/* SOS Result Card */}
      {sosResult && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={styles.resultTitle}>Emergency services alerted</Text>
          </View>
          <Text style={styles.resultDetails}>
            Called: {sosResult.dialledNumber} | SMS sent to {sosResult.smsSentCount} contacts
          </Text>
          <View style={styles.progressBarBg}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: dismissAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['100%', '0%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Country Picker Modal */}
      <Modal visible={pickerVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity onPress={() => setPickerVisible(false)}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search country..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryRow}
                onPress={() => {
                  setCountryCode(item.code);
                  setPickerVisible(false);
                }}
              >
                <Text style={styles.rowFlag}>{item.flag}</Text>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowName}>{item.name}</Text>
                  <Text style={styles.rowNumber}>SOS: {item.number}</Text>
                </View>
                {countryCode === item.code && (
                  <Ionicons name="checkmark" size={20} color={colors.secondary} />
                )}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>

      <SOSCountdown
        visible={countdownVisible}
        onComplete={handleCountdownComplete}
        onCancel={handleCountdownCancel}
        emergencyNumber={primaryNumber}
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
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  countryBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 40,
  },
  buttonWrapper: {
    marginVertical: 20,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 16,
  },
  numberLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  numberValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.sosBackground,
    marginRight: 10,
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingLeft: 10,
  },
  changeBtnText: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
    marginRight: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.textSecondary,
    fontSize: 14,
  },
  shareSection: {
    paddingHorizontal: 24,
    gap: 12,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  shareBtnText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#25D366',
  },
  contactsSection: {
    marginTop: 40,
    paddingHorizontal: 24,
  },
  contactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  manageBtn: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
  },
  avatarList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarMiniText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  noContactsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  resultCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  resultDetails: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: colors.background,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.success,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    margin: 24,
    marginTop: 0,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: colors.textPrimary,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowFlag: {
    fontSize: 32,
    marginRight: 16,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  rowNumber: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});

export default SOSScreen;
