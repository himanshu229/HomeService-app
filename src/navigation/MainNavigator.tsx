import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList, HomeStackParamList, ServicesStackParamList, BookingsStackParamList } from '../types';
import { COLORS, FONTS, SHADOWS } from '../utils/theme';

// Home Stack Screens
import HomeScreen from '../screens/home/HomeScreen';
import ServiceCategoriesScreen from '../screens/services/ServiceCategoriesScreen';
import ServiceListScreen from '../screens/services/ServiceListScreen';
import ServiceDetailScreen from '../screens/services/ServiceDetailScreen';
import BookingScreen from '../screens/booking/BookingScreen';
import BookingConfirmationScreen from '../screens/booking/BookingConfirmationScreen';
import BookingTrackingScreen from '../screens/booking/BookingTrackingScreen';
import PaymentScreen from '../screens/payment/PaymentScreen';
import ReviewScreen from '../screens/review/ReviewScreen';
import AddressManagerScreen from '../screens/profile/AddressManagerScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

// Tab Screens
import BookingHistoryScreen from '../screens/booking/BookingHistoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ServicesStack = createNativeStackNavigator<ServicesStackParamList>();
const BookingsStack = createNativeStackNavigator<BookingsStackParamList>();

// ─── Home Stack ───────────────────────────────────────────────
const HomeStackNavigator: React.FC = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    <HomeStack.Screen name="ServiceCategories" component={ServiceCategoriesScreen} />
    <HomeStack.Screen name="ServiceList" component={ServiceListScreen} />
    <HomeStack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
    <HomeStack.Screen name="Booking" component={BookingScreen} />
    <HomeStack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    <HomeStack.Screen name="BookingTracking" component={BookingTrackingScreen} />
    <HomeStack.Screen name="PaymentScreen" component={PaymentScreen} />
    <HomeStack.Screen name="Review" component={ReviewScreen} />
    <HomeStack.Screen name="AddressManager" component={AddressManagerScreen} />
    <HomeStack.Screen name="EditProfile" component={EditProfileScreen} />
  </HomeStack.Navigator>
);

// ─── Services Stack (fixes bottom-tab navigation bug) ─────────────────────
// The Services tab previously pointed to ServiceCategoriesScreen directly,
// which meant navigation.navigate('ServiceList', ...) had no parent stack
// to push onto. Wrapping it in its own stack fixes the bug.
const ServicesStackNavigator: React.FC = () => (
  <ServicesStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <ServicesStack.Screen name="ServiceCategories" component={ServiceCategoriesScreen} />
    <ServicesStack.Screen name="ServiceList" component={ServiceListScreen} />
    <ServicesStack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
    <ServicesStack.Screen name="Booking" component={BookingScreen} />
    <ServicesStack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    <ServicesStack.Screen name="BookingTracking" component={BookingTrackingScreen} />
  </ServicesStack.Navigator>
);

// ─── Bookings Stack ───────────────────────────────────────────
const BookingsStackNavigator: React.FC = () => (
  <BookingsStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <BookingsStack.Screen name="BookingHistory" component={BookingHistoryScreen} />
    <BookingsStack.Screen name="BookingTracking" component={BookingTrackingScreen} />
    <BookingsStack.Screen name="Review" component={ReviewScreen} />
  </BookingsStack.Navigator>
);

// ─── Custom Tab Bar Icon ──────────────────────────────────────
const TabIcon = ({
  emoji,
  label,
  focused,
}: {
  emoji: string;
  label: string;
  focused: boolean;
}) => (
  <View style={styles.tabIconContainer}>
    <Text style={styles.tabEmoji}>{emoji}</Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
  </View>
);

// ─── Bottom Tab Navigator ─────────────────────────────────────
const MainNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeStackNavigator}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="🏠" label="Home" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Services"
      component={ServicesStackNavigator}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="🔧" label="Services" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Bookings"
      component={BookingsStackNavigator}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="📋" label="Bookings" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="👤" label="Profile" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    ...SHADOWS.md,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    marginTop: 2,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default MainNavigator;
