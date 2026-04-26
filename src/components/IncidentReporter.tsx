import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { colors } from '../constants/colors';
import { useIncidentLog } from '../hooks/useIncidentLog';
import { showToast } from '../utils/toast';

interface IncidentReporterProps {
  visible: boolean;
  onClose: () => void;
  coords: { latitude: number; longitude: number } | null;
}

const IncidentReporter: React.FC<IncidentReporterProps> = ({ visible, onClose, coords }) => {
  const { addIncident } = useIncidentLog();
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [locationLabel, setLocationLabel] = useState('Fetching location...');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible && coords) {
      setNotes('');
      setPhotoUri(undefined);
      fetchLocationLabel();
    }
  }, [visible, coords]);

  const fetchLocationLabel = async () => {
    if (!coords) return;
    try {
      const [address] = await Location.reverseGeocodeAsync(coords);
      if (address) {
        setLocationLabel(`${address.name || address.street || ''}, ${address.district || address.city || ''}`.replace(/^, /, ''));
      } else {
        setLocationLabel(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
      }
    } catch (e) {
      setLocationLabel(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('Permission to access gallery was denied', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showToast('Permission to access camera was denied', 'error');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async (share = false) => {
    if (!coords) return;
    setIsSaving(true);
    try {
      await addIncident({
        coords,
        notes,
        photoUri,
      });

      if (share) {
        const timeStr = new Date().toLocaleString();
        const message = `🚗 Road Incident Report — ViaTerrena\n\n📍 Location: ${locationLabel}\n⏰ Time: ${timeStr}\n\n📝 Notes: ${notes || "No notes added"}\n\n📍 Map: https://maps.google.com/?q=${coords.latitude},${coords.longitude}\n\n— Reported via ViaTerrena`;
        const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
        
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          showToast('WhatsApp not installed', 'error');
        }
      }

      showToast('Incident logged successfully', 'success');
      onClose();
    } catch (error) {
      showToast('Failed to log incident', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Report Incident</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={colors.textSecondary} />
            <Text style={styles.locationText}>{locationLabel}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color={colors.textSecondary} />
            <Text style={styles.locationText}>{new Date().toLocaleString()}</Text>
          </View>

          <Text style={styles.sectionTitle}>Add Photo (Optional)</Text>
          <View style={styles.photoContainer}>
            {photoUri ? (
              <View style={styles.photoWrapper}>
                <Image source={{ uri: photoUri }} style={styles.photo} />
                <TouchableOpacity style={styles.removePhoto} onPress={() => setPhotoUri(undefined)}>
                  <Ionicons name="close-circle" size={24} color="#FF0000" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoButtons}>
                <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
                  <Ionicons name="camera" size={32} color={colors.secondary} />
                  <Text style={styles.photoBtnText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
                  <Ionicons name="images" size={32} color={colors.secondary} />
                  <Text style={styles.photoBtnText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={4}
            placeholder="Describe what happened (pothole, accident, hazard...)"
            value={notes}
            onChangeText={setNotes}
            maxLength={500}
          />
          <Text style={styles.charCount}>{notes.length}/500</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.mainBtn, styles.saveBtn]} 
              onPress={() => handleSave(false)}
              disabled={isSaving}
            >
              <Text style={styles.saveBtnText}>💾 Save Report</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.mainBtn, styles.shareBtn]} 
              onPress={() => handleSave(true)}
              disabled={isSaving}
            >
              <Text style={styles.shareBtnText}>📤 Save & Share</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 10,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  photoContainer: {
    marginBottom: 20,
  },
  photoWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  removePhoto: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  photoBtn: {
    flex: 1,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  photoBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
  },
  notesInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 32,
    gap: 12,
    paddingBottom: 40,
  },
  mainBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  shareBtn: {
    backgroundColor: colors.warning,
  },
  shareBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default IncidentReporter;
