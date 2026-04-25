import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { usePersonalContacts } from '../hooks/usePersonalContacts';
import { ContactCard } from '../components/ContactCard';
import { AddContactModal } from '../components/AddContactModal';
import { PersonalContact } from '../services/SOSService';

export default function ContactsScreen() {
  const { theme, colors } = useTheme();
  const { contacts, addContact, updateContact, deleteContact, loading } = usePersonalContacts();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<PersonalContact | undefined>();

  const handleAdd = () => {
    if (contacts.length >= 5) {
      Alert.alert('Limit Reached', 'You can only add up to 5 emergency contacts.');
      return;
    }
    setEditingContact(undefined);
    setModalVisible(true);
  };

  const handleEdit = (contact: PersonalContact) => {
    setEditingContact(contact);
    setModalVisible(true);
  };

  const handleSave = async (data: Omit<PersonalContact, 'id' | 'addedAt'>) => {
    try {
      if (editingContact) {
        await updateContact(editingContact.id, data);
      } else {
        await addContact(data);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save contact');
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Emergency Contacts</Text>
      </View>

      <View style={[styles.infoBanner, { backgroundColor: colors.info + '10', borderColor: colors.info + '20' }]}>
        <Ionicons name="information-circle" size={20} color={colors.info} />
        <Text style={[styles.infoText, { color: theme.textPrimary }]}>
          These contacts will receive your location via SMS when you trigger SOS.
        </Text>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContactCard
            contact={item}
            onCall={() => handleCall(item.phone)}
            onEdit={() => handleEdit(item)}
            onDelete={() => deleteContact(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconBox, { backgroundColor: theme.surface }]}>
                <Ionicons name="people-outline" size={48} color={theme.textHint} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No contacts added yet</Text>
              <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                Add up to 5 people who should be notified in an emergency.
              </Text>
            </View>
          ) : null
        }
      />

      {contacts.length < 5 && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.addBtn, { backgroundColor: colors.pharmacy }]} 
            onPress={handleAdd}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.addBtnText}>Add Emergency Contact</Text>
          </TouchableOpacity>
        </View>
      )}

      <AddContactModal
        visible={modalVisible}
        contact={editingContact}
        onSave={handleSave}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 12,
    lineHeight: 18,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  emptySub: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  addBtn: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
});
