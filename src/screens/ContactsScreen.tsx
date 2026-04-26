import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useEmergencyContacts } from '../hooks/useEmergencyContacts';
import { EmergencyContact } from '../services/SOSService';
import ContactForm from '../components/ContactForm';

const ContactsScreen: React.FC = () => {
  const { contacts, addContact, updateContact, deleteContact, loading } = useEmergencyContacts();
  const [formVisible, setFormVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  const handleAddPress = () => {
    if (contacts.length >= 5) {
      Alert.alert('Maximum reached', 'You can only add up to 5 emergency contacts.');
      return;
    }
    setEditingContact(null);
    setFormVisible(true);
  };

  const handleEditPress = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormVisible(true);
  };

  const handleDeletePress = (contact: EmergencyContact) => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to remove ${contact.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteContact(contact.id),
        },
      ]
    );
  };

  const handleSaveContact = async (data: Omit<EmergencyContact, 'id' | 'avatarInitials'>) => {
    try {
      if (editingContact) {
        await updateContact(editingContact.id, data);
      } else {
        await addContact(data);
      }
      setFormVisible(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save contact');
    }
  };

  const renderContactItem = ({ item }: { item: EmergencyContact }) => (
    <View style={styles.contactCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.avatarInitials}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactRelation}>{item.relation}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleEditPress(item)}>
          <Ionicons name="pencil" size={20} color={colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeletePress(item)}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Contacts</Text>
        <Text style={styles.subtitle}>
          Auto-notified with your GPS location on SOS trigger
        </Text>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color={colors.textHint} />
              <Text style={styles.emptyText}>No contacts added yet</Text>
              <Text style={styles.emptySubtext}>Add up to 5 personal emergency contacts</Text>
            </View>
          ) : null
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addButton, contacts.length >= 5 && styles.disabledButton]}
          onPress={handleAddPress}
          disabled={contacts.length >= 5}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
        {contacts.length >= 5 && (
          <Text style={styles.limitText}>Maximum 5 contacts reached</Text>
        )}
      </View>

      <View style={styles.infoBanner}>
        <Ionicons name="information-circle" size={20} color={colors.secondary} />
        <Text style={styles.infoText}>
          Contacts receive your GPS location via SMS when SOS is triggered
        </Text>
      </View>

      <ContactForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSave={handleSaveContact}
        initialData={editingContact}
      />
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  list: {
    padding: 16,
    paddingBottom: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00897B',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  contactRelation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: colors.textPrimary,
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    padding: 8,
    marginLeft: 4,
  },
  footer: {
    padding: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    height: 56,
    width: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.textHint,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  limitText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1565C0',
    marginLeft: 10,
    fontWeight: '500',
  },
});

export default ContactsScreen;
