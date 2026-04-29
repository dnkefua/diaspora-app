import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button } from '../components/Button';
import { colors, typography, spacing } from '../constants/designTokens';

export const MessagesScreen = () => {
  const [messages, setMessages] = React.useState([]);
  
  React.useEffect(() => {
    // In a real app, this would fetch messages from Firebase
    setMessages([
      { id: '1', name: 'Amara\\'s Kitchen', lastMessage: 'Thanks for your order!', time: '2:30 PM', unread: 2 },
      { id: '2', name: 'Kemi Braids Studio', lastMessage: 'Your appointment is confirmed for tomorrow', time: 'Yesterday', unread: 0 },
      { id: '3', name: 'Royal Cuts', lastMessage: 'Walk-ins welcome today!', time: 'Yesterday', unread: 1 },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Button variant="outline" size="small" onPress={() => {
          // Navigate to new message
          console.log('New message');
        }}>
          New Message
        </Button>
      </View>
      
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <View style={styles.messageInfo}>
              <Text style={styles.messageName}>{item.name}</Text>
              <Text style={styles.messagePreview}>{item.lastMessage}</Text>
            </View>
            <View style={styles.messageMeta}>
              <Text style={styles.messageTime}>{item.time}</Text>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Button variant="primary" size="small" onPress={() => {
              console.log('Start new conversation');
            }}>
              Start Conversation
            </Button>
          </View>
        }
      />
    </View>
  );
};

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
  
  messageItem: {
    padding: spacing.md,
    backgroundColor: '#fff',
    marginVertical: spacing.xs,
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
  
  messageInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  
  messageName: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.weights.semibold,
    color: colors.textDark,
  },
  
  messagePreview: {
    fontSize: typography.small.fontSize,
    color: colors.textLight,
    marginTop: 2,
  },
  
  messageMeta: {
    alignItems: 'flex-end',
  },
  
  messageTime: {
    fontSize: typography.small.fontSize,
    color: colors.textLight,
  },
  
  unreadBadge: {
    backgroundColor: colors.primaryGold,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: 10,
    minWidth:  minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  unreadText: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.weights.bold,
    color: colors.deepNavy,
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
});