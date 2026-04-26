import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';

interface OfflineBannerProps {
  isFromCache: boolean;
  cacheTimestamp: number | null;
  locationMismatch?: boolean;
}

export const OfflineBanner = ({ isFromCache, cacheTimestamp, locationMismatch }: OfflineBannerProps) => {
  const isOnline = useAppStore((state) => state.isOnline);
  const { colors } = useTheme();

  if (isOnline) return null;

  const getTimeAgo = () => {
    if (!cacheTimestamp) return null;
    const diffMs = Date.now() - cacheTimestamp;
    const diffMins = Math.floor(diffMs / (60 * 1000));
    if (diffMins < 1) return 'just now';
    return `${diffMins} min ago`;
  };

  const timeAgo = getTimeAgo();

  return (
    <View
      style={[
        styles.container, 
        { 
          backgroundColor: locationMismatch ? 'rgba(255, 0, 0, 0.05)' : 'rgba(255, 243, 205, 0.15)', 
          borderColor: locationMismatch ? colors.danger + '50' : colors.warning + '50' 
        }
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{locationMismatch ? '📍' : '📡'}</Text>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: locationMismatch ? colors.danger : colors.warning }]}>
            {locationMismatch 
              ? "Showing results for a different location" 
              : isFromCache ? "You're offline — showing cached results" : "You're offline"}
          </Text>
          {isFromCache && cacheTimestamp ? (
            <Text style={[styles.subtitle, { color: locationMismatch ? colors.danger : colors.warning, opacity: 0.8 }]}>
              {locationMismatch ? "You've moved > 5km from cached area." : `Last updated: ${timeAgo}`}
            </Text>
          ) : !isFromCache ? (
            <Text style={[styles.subtitle, { color: colors.warning, opacity: 0.8 }]}>No cached data — connect to find services</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});
