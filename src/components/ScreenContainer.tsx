import React from 'react';
import { StyleSheet, View, ViewStyle, ScrollView } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

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
  const { theme } = useTheme();
  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={edges}>
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
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
