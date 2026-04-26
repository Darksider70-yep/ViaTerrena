import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RootNavigator from './src/navigation/RootNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { useLocation } from './src/hooks/useLocation';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import { ToastHost } from './src/utils/toast';
import { useAppStore } from './src/store/useAppStore';
import { colors } from './src/constants/colors';
import { crashDetectionService } from './src/services/CrashDetectionService';
import CrashAlertModal from './src/components/CrashAlertModal';
import { triggerSOS } from './src/services/SOSService';


function AppContent({ onboardingSeen, setOnboardingSeen }: { 
  onboardingSeen: boolean, 
  setOnboardingSeen: (val: boolean) => void 
}) {
  useLocation();
  useNetworkStatus();

  const [crashModalVisible, setCrashModalVisible] = useState(false);
  const { userCoords, countryCode, personalContacts, setLastSOSTrigger } = useAppStore();

  useEffect(() => {
    crashDetectionService.start(() => {
      setCrashModalVisible(true);
    });
    return () => crashDetectionService.stop();
  }, []);

  const handleCrashCancel = () => {
    setCrashModalVisible(false);
    crashDetectionService.arm();
  };

  const handleCrashConfirm = async () => {
    setCrashModalVisible(false);
    if (userCoords) {
      await triggerSOS({
        userCoords,
        countryCode,
        personalContacts,
      });
      setLastSOSTrigger(Date.now());
    }
  };

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {Boolean(onboardingSeen) ? (
        <RootNavigator />
      ) : (
        <OnboardingScreen onComplete={() => setOnboardingSeen(true)} />
      )}
      <ToastHost />
      <CrashAlertModal
        visible={crashModalVisible}
        onCancel={handleCrashCancel}
        onConfirm={handleCrashConfirm}
      />
    </NavigationContainer>
  );
}


export default function App() {
  const [onboardingSeen, setOnboardingSeen] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAppStore.persist.hasHydrated()) setHydrated(true);

    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem('onboarding_seen');
      if (seen === 'true') {
        setOnboardingSeen(true);
      }
    };
    
    checkOnboarding();
    return unsub;
  }, []);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
        <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '900', letterSpacing: 2 }}>VIATERRENA</Text>
        <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 24 }} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppContent onboardingSeen={onboardingSeen} setOnboardingSeen={setOnboardingSeen} />
    </SafeAreaProvider>
  );
}
