import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/designTokens';

export const MoreScreen = () => {
  const sections = [
    { title: 'Discover', items: ['Nearby Businesses', 'Trending Now', 'New Openings'] },
    { title: 'Community', items: ['Events', 'Blogs', 'Success Stories'] },
    { title: 'For Sellers', items: ['List Your Business', 'Seller Dashboard', 'Advertise'] },
    { title: 'Support', items: ['Help Center', 'Contact Us', 'Report Issue'] },
    { title: 'Legal', items: ['Privacy Policy', 'Terms of Service', 'Cookies'] },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>More</Text>
      
      {sections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>{section.title}</Text>
          <View style={styles.sectionItems}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.item}
                onPress={() => {
                  console.log(`Selected: ${item}`);
                  // Handle navigation based on item
                }}
              >
                <Text style={styles.itemText}>{item}</Text>
                {/* In a real app, you'd add a chevron icon here */}
              </TouchableOpacity>
            ))}
          </View>
          {sectionIndex < sections.length - 1 && (
            <View style={styles.divider} />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
    padding: spacing.md,
  },
  
  sectionTitle: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.weights.semibold,
    color: colors.textDark,
    marginBottom: spacing.lg,
  },
  
  sectionContainer: {
    marginBottom: spacing.lg,
  },
  
  sectionHeader: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.weights.semibold,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  
  sectionItems: {
    gap: spacing.xs,
  },
  
  item: {
    padding: spacing.md,
    backgroundColor: '#fff',
    borderRadius: radius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.0,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  
  itemText: {
    fontSize: typography.body.fontSize,
    color: colors.textDark,
  },
  
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
});