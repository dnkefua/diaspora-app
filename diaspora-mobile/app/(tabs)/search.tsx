import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography, spacing } from '../constants/designTokens';

export const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <View style={styles.searchInput}>
          {/* In a real app, this would be a TextInput */}
          <Text style={styles.searchPlaceholder}>Search businesses, services, jobs...</Text>
          <View style={styles.searchIcon} />
        </View>
        <View style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </View>
      </View>
      
      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesContainer}>
          {/* Category chips - in a real app, these would be scrollable */}
          <View style={styles.categoryChip}>
            <Text style={styles.categoryChipText>Restaurants</Text>
          </View>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryChipText>Food Sellers</Text>
          </View>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryChipText>Barbers</Text>
          </View>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryChipText>Stylists</Text>
          </View>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryChipText>Jobs</Text>
          </View>
        </View>
      </View>
      
      {/* Featured Businesses */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured This Week</Text>
        <View style={styles.featuredContainer}>
          {/* Placeholder for featured business cards */}
          <View style={styles.featuredPlaceholder}>
            <Text style={styles.placeholderText}>Featured businesses will appear here</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  
  searchBar: {
    backgroundColor: '#fff',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  
  searchPlaceholder: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.textLight,
  },
  
  searchIcon: {
    width: 20,
    height: 20,
    backgroundColor: colors.primaryGold,
    borderRadius: radius.sm,
    marginLeft: 8,
  },
  
  searchButton: {
    backgroundColor: colors.primaryGold,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginLeft: spacing.md,
  },
  
  searchButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.weights.semibold,
    color: colors.deepNavy,
  },
  
  categoriesSection: {
    paddingHorizontal: spacing.md,
  },
  
  sectionTitle: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.weights.semibold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  
  categoryChip: {
    backgroundColor: colors.primaryGold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  
  categoryChipText: {
    fontSize: typography.small.fontSize,
    color: colors.deepNavy,
    fontWeight: typography.weights.semibold,
  },
  
  featuredSection: {
    paddingHorizontal: spacing.md,
  },
  
  featuredContainer: {
    // In a real app, this would be a horizontal scrollable list
  },
  
  featuredPlaceholder: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  placeholderText: {
    fontSize: typography.body.fontSize,
    color: colors.textLight,
    textAlign: 'center',
  },
});