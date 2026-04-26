import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RootNavigator from './src/navigation/RootNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { useLocation } from './src/hooks/useLocation';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import { ToastHost } from './src/utils/toast';

// Disable native screens to prevent RN 0.81 strict property casting crash
enableScreens(false);

function AppContent({ onboardingSeen, setOnboardingSeen }: { 
  onboardingSeen: boolean, 
  setOnboardingSeen: (val: boolean) => void 
}) {
  useLocation();
  useNetworkStatus();

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      {onboardingSeen ? (
        <RootNavigator />
      ) : (
        <OnboardingScreen onComplete={() => setOnboardingSeen(true)} />
      )}
      <ToastHost />
    </NavigationContainer>
  );
}

export default function App() {
  const [onboardingSeen, setOnboardingSeen] = useState<boolean | null>(null);

  useEffect(() => {
    // One-time migration: wipe corrupt Zustand storage from pre-v2 builds
    AsyncStorage.getItem('via-terrena-storage-version').then((version) => {
      if (version !== '2') {
        AsyncStorage.removeItem('via-terrena-storage').finally(() => {
          AsyncStorage.setItem('via-terrena-storage-version', '2');
        });
      }
    });

    AsyncStorage.getItem('onboarding_seen').then((val) => {
      setOnboardingSeen(val === 'true');
    });
  }, []);

  if (onboardingSeen === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#E24B4A" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppContent onboardingSeen={onboardingSeen} setOnboardingSeen={setOnboardingSeen} />
    </SafeAreaProvider>
  );
}
