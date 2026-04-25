import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';

export default function ContactsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Emergency Contacts</Text>
        <Text style={styles.sub}>Your personal emergency contacts will appear here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  sub: { fontSize: 14, color: colors.textSecondary, marginTop: 8 },
});
