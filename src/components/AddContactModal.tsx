import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PersonalContact } from '../services/SOSService';
import { useTheme } from '../hooks/useTheme';

interface AddContactModalProps {
  visible: boolean;
  contact?: PersonalContact;
  onSave: (contact: Omit<PersonalContact, 'id' | 'addedAt'>) => void;
  onClose: () => void;
}

export const AddContactModal = ({ visible, contact, onSave, onClose }: AddContactModalProps) => {
  const { theme, colors } = useTheme();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      if (contact) {
        setName(contact.name);
        setPhone(contact.phone);
        setRelationship(contact.relationship);
      } else {
        setName('');
        setPhone('');
        setRelationship('');
      }
      setErrors({});
    }
  }, [visible, contact]);

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!phone.trim() || phone.length < 7) newErrors.phone = 'Valid phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({ name, phone, relationship });
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={[styles.content, { backgroundColor: theme.surface }]}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.textPrimary }]}>
                  {contact ? 'Edit Contact' : 'Add Emergency Contact'}
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>Name *</Text>
                  <TextInput
                    style={[styles.input, { color: theme.textPrimary, borderColor: errors.name ? colors.danger : theme.border }]}
                    placeholder="Full name"
                    placeholderTextColor={theme.textHint}
                    value={name}
                    onChangeText={(val) => {
                      setName(val);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    maxLength={40}
                  />
                  {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>Phone *</Text>
                  <TextInput
                    style={[styles.input, { color: theme.textPrimary, borderColor: errors.phone ? colors.danger : theme.border }]}
                    placeholder="+91 98765 43210"
                    placeholderTextColor={theme.textHint}
                    value={phone}
                    onChangeText={(val) => {
                      setPhone(val);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    keyboardType="phone-pad"
                  />
                  {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>Relationship</Text>
                  <TextInput
                    style={[styles.input, { color: theme.textPrimary, borderColor: theme.border }]}
                    placeholder="e.g. Spouse, Parent"
                    placeholderTextColor={theme.textHint}
                    value={relationship}
                    onChangeText={setRelationship}
                    maxLength={20}
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.saveBtn, { backgroundColor: colors.pharmacy }]} 
                  onPress={handleSave}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveBtnText}>Save Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
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
  content: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    marginLeft: 4,
  },
  saveBtn: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
