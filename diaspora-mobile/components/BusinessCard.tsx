import React from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '../constants/designTokens';

export const BusinessCard = ({ 
  business, 
  onPress,
  ...props 
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      {...props}
    >
      {/* Image */}
      <Image
        source={{ uri: business.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* Content */}
      <View style={styles.content}>
        {/* Name and Category */}
        <View style={styles.header}>
          <Text style={styles.name}>{business.name}</Text>
          <Text style={styles.category}>{business.category}</Text>
        </View>
        
        {/* Rating and Location */}
        <View style={styles.meta}>
          <Text style={styles.rating}>
            {business.rating} ★ ({business.reviewCount})
          </Text>
          <Text style={styles.location}>
            {business.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginVertical: spacing.md,
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
  
  image: {
    width: 100,
    height: 100,
    backgroundColor: colors.lightGray,
  },
  
  content: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  
  name: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.weights.semibold,
    color: colors.textDark,
    flexShrink: 1,
  },
  
  category: {
    fontSize: typography.body.fontSize,
    color: colors.textLight,
    backgroundColor: colors.primaryGold,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  rating: {
    fontSize: typography.body.fontSize,
    color: colors.primaryOrange,
    fontWeight: typography.weights.semibold,
  },
  
  location: {
    fontSize: typography.small.fontSize,
    color: colors.textLight,
  },
});