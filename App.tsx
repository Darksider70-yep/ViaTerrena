import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RootNavigator from './src/navigation/RootNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { useLocation } from './src/hooks/useLocation';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import { ToastHost } from './src/utils/toast';

function AppContent({ onboardingSeen, setOnboardingSeen }: { 
  onboardingSeen: boolean, 
  setOnboardingSeen: (val: boolean) => void 
}) {
  useLocation();
  useNetworkStatus();

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {Boolean(onboardingSeen) ? (
        <RootNavigator />
      ) : (
        <OnboardingScreen onComplete={() => setOnboardingSeen(true)} />
      )}
      <ToastHost />
    </NavigationContainer>
  );
}

export default function App() {
  const [onboardingSeen, setOnboardingSeen] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const version = await AsyncStorage.getItem('via-terrena-storage-version');
        if (version !== '6') {
          await AsyncStorage.removeItem('via-terrena-storage');
          await AsyncStorage.setItem('via-terrena-storage-version', '6');
        }

        const seen = await AsyncStorage.getItem('onboarding_seen');
        if (seen === 'true') {
          setOnboardingSeen(true);
        }
      } catch (e) {
        console.warn('Init error', e);
      } finally {
        setHydrated(true);
      }
    };

    init();
  }, []);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <Text style={{ color: '#E24B4A', fontSize: 18, fontWeight: '700' }}>INITIALIZING...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppContent onboardingSeen={onboardingSeen} setOnboardingSeen={setOnboardingSeen} />
    </SafeAreaProvider>
  );
}
