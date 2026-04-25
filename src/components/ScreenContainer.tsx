import React from 'react';
import { StyleSheet, View, ViewStyle, ScrollView, Platform } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  scrollable?: boolean;
}

export const ScreenContainer = ({ 
  children, 
  style, 
  edges = ['top', 'left', 'right'], 
  scrollable = false 
}: ScreenContainerProps) => {
  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      <Container 
        style={[styles.container, style]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={scrollable ? styles.scrollContent : undefined}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
