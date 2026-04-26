import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { useAppStore } from '../store/useAppStore';
import VehicleServiceTab from '../components/VehicleServiceTab';

type TabType = 'towing' | 'puncture_shop' | 'showroom';

const VehicleHelpScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('towing');
  const { cachedNearby } = useAppStore();
  const { width } = useWindowDimensions();
  
  const tabWidth = (width - 32) / 3;
  const underlinePos = useRef(new Animated.Value(0)).current;

  const handleTabPress = (tab: TabType, index: number) => {
    setActiveTab(tab);
    Animated.spring(underlinePos, {
      toValue: index * tabWidth,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const getCount = (cat: TabType) => cachedNearby[cat]?.length || 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vehicle Assistance</Text>
        <Text style={styles.subtitle}>Services near your current location</Text>
      </View>

      <View style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={styles.tab} 
            onPress={() => handleTabPress('towing', 0)}
          >
            <Text style={[styles.tabText, activeTab === 'towing' ? styles.activeTabText : null]}>
              Towing ({getCount('towing')})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tab} 
            onPress={() => handleTabPress('puncture_shop', 1)}
          >
            <Text style={[styles.tabText, activeTab === 'puncture_shop' ? styles.activeTabText : null]}>
              Tyre ({getCount('puncture_shop')})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tab} 
            onPress={() => handleTabPress('showroom', 2)}
          >
            <Text style={[styles.tabText, activeTab === 'showroom' ? styles.activeTabText : null]}>
              Showroom ({getCount('showroom')})
            </Text>
          </TouchableOpacity>

          <Animated.View 
            style={[
              styles.underline, 
              { 
                width: tabWidth,
                transform: [{ translateX: underlinePos }]
              }
            ]} 
          />
        </View>
      </View>

      <View style={styles.content}>
        <VehicleServiceTab category={activeTab} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tabBarContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    position: 'relative',
  },
  tab: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.warning, // Amber underline + amber text as per spec
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: colors.warning,
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
});

export default VehicleHelpScreen;
