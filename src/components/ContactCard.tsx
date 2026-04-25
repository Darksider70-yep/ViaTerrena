import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PersonalContact } from '../services/SOSService';
import { useTheme } from '../hooks/useTheme';

interface ContactCardProps {
  contact: PersonalContact;
  onCall: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ContactCard = ({ contact, onCall, onEdit, onDelete }: ContactCardProps) => {
  const { theme, colors } = useTheme();
  const initials = contact.name.charAt(0).toUpperCase();

  const handleDelete = () => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to remove ${contact.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.left}>
        <View style={[styles.avatar, { backgroundColor: colors.pharmacy + '20' }]}>
          <Text style={[styles.avatarText, { color: colors.pharmacy }]}>{initials}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.textPrimary }]}>{contact.name}</Text>
          <Text style={[styles.sub, { color: theme.textSecondary }]}>
            {contact.relationship} · {contact.phone}
          </Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.pharmacy + '15' }]} onPress={onCall}>
          <Ionicons name="call" size={18} color={colors.pharmacy} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.background }]} onPress={onEdit}>
          <Ionicons name="pencil" size={18} color={theme.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.danger + '10' }]} onPress={handleDelete}>
          <Ionicons name="trash" size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
