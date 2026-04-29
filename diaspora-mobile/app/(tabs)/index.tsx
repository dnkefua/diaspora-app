import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreScreen from './explore';
import { SearchScreen } from './search';
import { MessagesScreen } from './messages';
import { ProfileScreen } from './profile';
import { MoreScreen } from './more';
import { colors } from '../../constants/designTokens';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primaryGold,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.deepNavy,
          height: 60,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            // In a real app, you'd use actual icons from Feather Icons/Heroicons
            // For now, we'll use a placeholder
            null
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => null,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }) => null,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => null,
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ color, size }) => null,
        }}
      />
    </Tab.Navigator>
  );
}