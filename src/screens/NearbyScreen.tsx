import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { CategoryPill } from '../components/CategoryPill';
import { ServiceCard } from '../components/ServiceCard';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { SERVICE_CATEGORIES } from '../constants/serviceCategories';
import { useAppStore } from '../store/useAppStore';

export default function NearbyScreen() {
  const selectedCategory = useAppStore((state) => state.selectedCategory);
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);
  const cachedNearby = useAppStore((state) => state.cachedNearby);

  const displayPlaces = selectedCategory === 'all' 
    ? [] // Just for shell
    : cachedNearby[selectedCategory] || [];

  return (
    <ScreenContainer edges={['top']}>
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textHint} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search emergency services..." 
            placeholderTextColor={colors.textHint}
          />
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <CategoryPill 
            label="All" 
            emoji="📍" 
            active={selectedCategory === 'all'} 
            onPress={() => setSelectedCategory('all')} 
          />
          {SERVICE_CATEGORIES.map((cat) => (
            <CategoryPill 
              key={cat.id}
              label={cat.label} 
              emoji={cat.emoji} 
              active={selectedCategory === cat.id} 
              onPress={() => setSelectedCategory(cat.id as any)}
              activeColor={cat.color}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={48} color={colors.textHint} />
        <Text style={styles.mapText}>Map visualization will appear here</Text>
        <View style={styles.mapOverlay}>
          <TouchableOpacity style={styles.mapAction}>
            <Ionicons name="locate" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {selectedCategory === 'all' ? 'Nearby Services' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('_', ' ')}s Near You`}
        </Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>Filter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.resultsList}
        contentContainerStyle={styles.resultsContent}
        showsVerticalScrollIndicator={false}
      >
        {displayPlaces.length > 0 ? (
          displayPlaces.map((place) => (
            <ServiceCard key={place.placeId} place={place} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Select a category above to find help near you.</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
    color: colors.textPrimary,
  },
  categoryContainer: {
    paddingVertical: spacing.sm,
  },
  categoryScroll: {
    paddingHorizontal: spacing.md,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#E8EAED',
    marginHorizontal: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  mapText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
  },
  mapAction: {
    backgroundColor: '#FFFFFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  viewAll: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textHint,
    fontSize: 14,
  },
});
