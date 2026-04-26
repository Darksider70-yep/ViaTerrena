import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../hooks/useTheme';

import HomeScreen from '../screens/HomeScreen';
import NearbyScreen from '../screens/NearbyScreen';
import SOSScreen from '../screens/SOSScreen';
import VehicleHelpScreen from '../screens/VehicleHelpScreen';
import ContactsScreen from '../screens/ContactsScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FirstAidGuideScreen from '../screens/FirstAidGuideScreen';
import TriageScreen from '../screens/TriageScreen';


export type RootTabParamList = {
  Home: undefined;
  Nearby: undefined;
  SOS: undefined;
  Vehicle: undefined;
  Contacts: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  FirstAidGuide: undefined;
  Triage: undefined;
};


const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="FirstAidGuide" component={FirstAidGuideScreen} />
    <Stack.Screen name="Triage" component={TriageScreen} />
  </Stack.Navigator>

);

export default function RootNavigator() {
  const { theme, colors } = useTheme();

  const light = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const warn = () => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: theme.textHint,
        tabBarStyle: [
          styles.tabBar, 
          { 
            backgroundColor: theme.surface, 
            borderTopColor: theme.border 
          }
        ],
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        listeners={{ tabPress: light }}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Nearby"
        component={NearbyScreen}
        listeners={{ tabPress: light }}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'location' : 'location-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SOS"
        component={SOSScreen}
        listeners={{ tabPress: warn }}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <View style={[styles.sosButton, { backgroundColor: colors.primary, borderColor: theme.surface }]}>
              <Ionicons name="alert-circle" size={32} color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Vehicle"
        component={VehicleHelpScreen}
        listeners={{ tabPress: light }}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'car' : 'car-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        listeners={{ tabPress: light }}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingTop: 8,
  },
  sosButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 34 : 24,
    borderWidth: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});
