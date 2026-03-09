import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types';
import { COLORS, FONTS, SPACING } from '../../utils/theme';
import Header from '../../components/common/Header';
import BookingCard from '../../components/booking/BookingCard';
import EmptyState from '../../components/common/EmptyState';
import { useAppSelector, useAppDispatch } from '../../store';
import { setActiveBooking } from '../../store/slices/bookingSlice';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const FILTERS = ['All', 'Active', 'Completed', 'Cancelled'];

const BookingHistoryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { bookings } = useAppSelector(state => state.booking);
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredBookings = bookings.filter(b => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Active') return ['confirmed', 'technician_assigned', 'on_the_way', 'in_progress'].includes(b.status);
    if (activeFilter === 'Completed') return b.status === 'completed';
    if (activeFilter === 'Cancelled') return b.status === 'cancelled';
    return true;
  });

  const handleBookingPress = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) dispatch(setActiveBooking(booking));
    navigation.navigate('BookingTracking', { bookingId });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header title="My Bookings" />

      {/* Filter tabs */}
      <View style={styles.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filter, activeFilter === f && styles.filterActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={b => b.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            emoji="📋"
            title="No bookings yet"
            subtitle="Book a home service and it will appear here"
            actionLabel="Explore Services"
            onAction={() => navigation.navigate('ServiceCategories')}
          />
        }
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() => handleBookingPress(item.id)}
            onTrack={() => handleBookingPress(item.id)}
            onReview={() =>
              navigation.navigate('Review', {
                bookingId: item.id,
                technicianId: item.technician?.id || '',
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  filter: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  filterActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  filterTextActive: { color: COLORS.white },
  list: { padding: SPACING.xl },
});

export default BookingHistoryScreen;
