import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { BusinessCard } from '../../components/BusinessCard';
import { Button } from '../../components/Button';
import { colors, typography } from '../../constants/designTokens';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../constants/firebase';

export default function ExploreScreen() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const businessesRef = collection(db, 'businesses');
      const q = query(businessesRef, orderBy('createdAt', 'desc'), limit(20));
      const querySnapshot = await getDocs(q);
      
      const businessesList = [];
      querySnapshot.forEach((doc) => {
        businessesList.push({ id: doc.id, ...doc.data() });
      });
      
      setBusinesses(businessesList);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadBusinesses();
  };

  const renderItem = ({ item }) => (
    <BusinessCard 
      business={item} 
      onPress={() => {
        // Navigate to business detail screen
        // In a real implementation, we'd use navigation
        console.log('Navigate to business detail:', item.id);
      }}
    />
  );

  if (loading && businesses.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primaryGold} />
        <Text style={styles.loadingText}>Loading businesses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Diaspora Businesses</Text>
        <Button variant="outline" size="small" onPress={() => {
          // Navigate to search
          console.log('Navigate to search');
        }}>
          Search
        </Button>
      </View>
      
      {/* Business List */}
      <FlatList
        data={businesses}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No businesses found</Text>
            <Button variant="primary" size="small" onPress={() => {
              // Navigate to add business (seller flow)
              console.log('Navigate to add business');
            }}>
              Add Your Business
            </Button>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  
  headerTitle: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.weights.semibold,
    color: colors.textDark,
  },
  
  list: {
    padding: 16,
  },
  
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  
  emptyText: {
    fontSize: typography.body.fontSize,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  
  loadingText: {
    marginTop: 16,
    fontSize: typography.body.fontSize,
    color: colors.textLight,
    textAlign: 'center',
  },
});