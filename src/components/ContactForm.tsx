import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../constants/colors';
import { EmergencyContact } from '../services/SOSService';

interface ContactFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (contact: Omit<EmergencyContact, 'id' | 'avatarInitials'>) => Promise<void>;
  initialData?: EmergencyContact | null;
}

const ContactForm: React.FC<ContactFormProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible && initialData) {
      setName(initialData.name);
      setPhone(initialData.phone);
      setRelation(initialData.relation);
    } else if (visible) {
      setName('');
      setPhone('');
      setRelation('');
    }
  }, [visible, initialData]);

  const handleSave = async () => {
    // Validation
    if (name.trim().length < 2) {
      Alert.alert('Invalid Name', 'Name must be at least 2 characters.');
      return;
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (cleanPhone.length < 7) {
      Alert.alert('Invalid Phone', 'Phone number must be at least 7 digits.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        name: name.trim(),
        phone: cleanPhone,
        relation: relation.trim() || 'Emergency Contact',
      });
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save contact.';
      Alert.alert('Error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {initialData ? 'Edit Contact' : 'Add Emergency Contact'}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Alex Brown"
                  placeholderTextColor={colors.textHint}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="e.g. +91 9876543210"
                  placeholderTextColor={colors.textHint}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Relation (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={relation}
                  onChangeText={setRelation}
                  placeholder="e.g. Spouse, Father"
                  placeholderTextColor={colors.textHint}
                />
              </View>

              <TouchableOpacity
                style={[styles.saveButton, isSubmitting ? styles.disabledButton : null]}
                onPress={handleSave}
                disabled={isSubmitting}
              >
                <Text style={styles.saveButtonText}>
                  {isSubmitting ? 'Saving...' : 'Save Contact'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    width: '100%',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  saveButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default React.memo(ContactForm);
