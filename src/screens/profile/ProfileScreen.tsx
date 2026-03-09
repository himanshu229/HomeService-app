import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../utils/theme';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAppSelector(state => state.auth);
  const { bookings } = useAppSelector(state => state.booking);

  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logoutUser()),
      },
    ]);
  };

  const menuItems = [
    { emoji: '✏️', label: 'Edit Profile', onPress: () => navigation.navigate('EditProfile') },
    { emoji: '📍', label: 'Saved Addresses', onPress: () => navigation.navigate('AddressManager') },
    { emoji: '📋', label: 'My Bookings', onPress: () => navigation.navigate('BookingTracking', { bookingId: '' }) },
    { emoji: '💳', label: 'Payment Methods', onPress: () => {} },
    { emoji: '🔔', label: 'Notifications', onPress: () => {} },
    { emoji: '💬', label: 'Help & Support', onPress: () => {} },
    { emoji: '⭐', label: 'Rate the App', onPress: () => {} },
    { emoji: 'ℹ️', label: 'About SummerFix', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header title="My Profile" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <Text style={styles.profilePhone}>📱 +91 {user?.phone}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{bookings.length}</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedBookings}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.addresses?.length || 0}</Text>
            <Text style={styles.statLabel}>Addresses</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuItem, i === menuItems.length - 1 && styles.menuItemLast]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Button
            title="🚪 Logout"
            onPress={handleLogout}
            variant="outline"
            size="lg"
          />
        </View>

        <Text style={styles.version}>SummerFix v1.0.0</Text>
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    gap: SPACING.base,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary + '40',
  },
  avatarText: { fontSize: FONTS.sizes.xxl, fontWeight: '900', color: COLORS.primary },
  profileInfo: { flex: 1 },
  profileName: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.text },
  profileEmail: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  profilePhone: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginTop: SPACING.xs,
    paddingVertical: SPACING.md,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: FONTS.sizes.xxl, fontWeight: '900', color: COLORS.primary },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: COLORS.divider },
  menu: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    ...SHADOWS.sm,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    gap: SPACING.md,
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuEmoji: { fontSize: 22, width: 28 },
  menuLabel: { flex: 1, fontSize: FONTS.sizes.base, fontWeight: '600', color: COLORS.text },
  menuArrow: { fontSize: FONTS.sizes.xl, color: COLORS.textLight },
  logoutSection: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xl },
  version: { textAlign: 'center', fontSize: FONTS.sizes.xs, color: COLORS.textLight, marginTop: SPACING.lg },
});

export default ProfileScreen;
