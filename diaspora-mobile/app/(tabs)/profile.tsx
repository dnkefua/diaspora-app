import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Button } from '../../components/Button';
import { colors, typography, spacing, radius } from '../../constants/designTokens';

export const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        {/* In a real app, this would be the user's avatar */}
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>UD</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>User Name</Text>
          <Text style={styles.profileEmail}>user@example.com</Text>
          <Button variant="outline" size="small" onPress={() => {
            // Navigate to edit profile
            console.log('Edit profile');
          }}>
            Edit Profile
          </Button>
        </View>
      </View>
      
      {/* Stats */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statsItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Reviews Written</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Saved Businesses</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Messages Sent</Text>
          </View>
        </View>
      </View>
      
      {/* Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionItem} onPress={() => {
            // Navigate to my reviews
            console.log('My reviews');
          }}>
            <Text style={styles.actionText}>My Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => {
            // Navigate to my applications
            console.log('My applications');
          }}>
            <Text style={styles.actionText}>My Job Applications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => {
            // Navigate to settings
            console.log('Settings');
          }}>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionItem, styles.dangerAction]} onPress={() => {
            // Handle logout
            console.log('Logout');
          }}>
            <Text style={styles.actionText}>Log Out</Text>
          </TouchableOpacity>
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
  
  profileHeader: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.0,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  avatarPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: colors.primaryGold,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  
  avatarText: {
    fontSize: 24,
    fontWeight: typography.weights.bold,
    color: colors.deepNavy,
  },
  
  profileInfo: {
    flex: 1,
  },
  
  profileName: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.weights.semibold,
    color: colors.textDark,
  },
  
  profileEmail: {
    fontSize: typography.small.fontSize,
    color: colors.textLight,
  },
  
  statsSection: {
    paddingHorizontal: spacing.md,
  },
  
  sectionTitle: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.weights.semibold,
    color: colors.textDark,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  statsItem: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: '#fff',
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    width: '30%',
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
  
  statNumber: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.weights.bold,
    color: colors.primaryGold,
  },
  
  statLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  
  actionsSection: {
    paddingHorizontal: spacing.md,
  },
  
  actionsContainer: {
    gap: spacing.sm,
  },
  
  actionItem: {
    padding: spacing.md,
    backgroundColor: '#fff',
    borderRadius: radius.md,
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
  
  actionText: {
    fontSize: typography.body.fontSize,
    color: colors.textDark,
  },
  
  dangerAction: {
    backgroundColor: colors.errorRed,
  },
});