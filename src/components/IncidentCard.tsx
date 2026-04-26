import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { IncidentReport } from '../hooks/useIncidentLog';

interface IncidentCardProps {
  incident: IncidentReport;
  onDelete: (id: string) => void;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onDelete }) => {
  const handleShare = async () => {
    const timeStr = new Date(incident.timestamp).toLocaleString();
    const message = `🚗 Road Incident Report — ViaTerrena\n\n📍 Location: ${incident.locationLabel}\n⏰ Time: ${timeStr}\n\n📝 Notes: ${incident.notes || "No notes added"}\n\n📍 Map: https://maps.google.com/?q=${incident.coords.latitude},${incident.coords.longitude}\n\n— Reported via ViaTerrena`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch (e) {
      console.warn('Share failed', e);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.main}>
        {incident.photoUri ? (
          <Image source={{ uri: incident.photoUri }} style={styles.thumbnail} />
        ) : (
          <View style={styles.iconContainer}>
            <Ionicons name="pin" size={24} color={colors.secondary} />
          </View>
        )}
        
        <View style={styles.info}>
          <Text style={styles.location} numberOfLines={1}>{incident.locationLabel}</Text>
          <Text style={styles.time}>{new Date(incident.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</Text>
          {incident.notes ? (
            <Text style={styles.notes} numberOfLines={1}>{incident.notes}</Text>
          ) : null}
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={20} color={colors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(incident.id)}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  location: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notes: {
    fontSize: 13,
    color: colors.textPrimary,
    opacity: 0.8,
    marginTop: 4,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  actionBtn: {
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
});

export default React.memo(IncidentCard);
