import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../constants/colors';
import guideData from '../data/firstAidGuide.json';
import FirstAidStep from '../components/FirstAidStep';
import { FirstAidStep as FirstAidStepData } from '../types/firstAid';

const FirstAidGuideScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(guideData.categories[0].id);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  const allSteps = useMemo(() => {
    return guideData.categories.flatMap(cat => cat.steps.map(s => ({ ...s, categoryColor: cat.color })));
  }, []);

  const filteredSteps = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return allSteps.filter(step =>
        step.title.toLowerCase().includes(q) ||
        step.summary.toLowerCase().includes(q) ||
        step.detail.toLowerCase().includes(q)
      );
    }
    const category = guideData.categories.find(c => c.id === activeCategoryId);
    return category ? category.steps.map(s => ({ ...s, categoryColor: category.color })) : [];
  }, [searchQuery, activeCategoryId, allSteps]);

  const toggleStep = useCallback((id: string) => {
    setExpandedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleExpandAll = () => {
    const allExpanded = filteredSteps.reduce((acc, step) => {
      acc[step.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedSteps(allExpanded);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>First Aid Guide</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleExpandAll}>
            <Text style={styles.expandText}>Expand All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.offlineBadge}>
        <View style={styles.greenDot} />
        <Text style={styles.offlineText}>Works fully offline — no internet required</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for symptoms, injuries..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {!searchQuery && (
        <View style={styles.categoriesWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoriesList}
          >
            {guideData.categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  activeCategoryId === cat.id ? { backgroundColor: cat.color } : null
                ]}
                onPress={() => setActiveCategoryId(cat.id)}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text style={[
                  styles.categoryTitle,
                  activeCategoryId === cat.id ? styles.activeCategoryTitle : null
                ]}>
                  {cat.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={filteredSteps}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <FirstAidStep
            step={item as FirstAidStepData}
            stepNumber={index + 1}
            isExpanded={expandedSteps[item.id] || false}
            onToggle={() => toggleStep(item.id)}
            categoryColor={(item as any).categoryColor}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No matching steps found</Text>
          </View>
        }
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
  },
  headerRight: {
    padding: 8,
  },
  expandText: {
    color: colors.secondary,
    fontWeight: '600',
    fontSize: 14,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  offlineText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: colors.textPrimary,
  },
  categoriesWrapper: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeCategoryTitle: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default FirstAidGuideScreen;
