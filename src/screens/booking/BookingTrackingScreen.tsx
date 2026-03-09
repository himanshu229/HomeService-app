import React, { useState } from 'react';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../../types';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../utils/theme';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { BOOKING_STATUS_STEPS } from '../../utils/constants';
import { useAppSelector, useAppDispatch } from '../../store';
import { cancelBooking } from '../../store/slices/bookingSlice';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'BookingTracking'>;
  route: RouteProp<HomeStackParamList, 'BookingTracking'>;
};

const STATUS_ORDER = ['confirmed', 'technician_assigned', 'on_the_way', 'in_progress', 'completed'];

const BookingTrackingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { bookingId } = route.params;
  const dispatch = useAppDispatch();
  const { bookings, activeBooking } = useAppSelector(state => state.booking);

  const booking = activeBooking || bookings.find(b => b.id === bookingId);
  const currentStatusIndex = booking ? STATUS_ORDER.indexOf(booking.status) : 0;

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            await dispatch(cancelBooking(bookingId));
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!booking) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Track Booking" showBack />
        <View style={styles.center}>
          <Text style={styles.notFoundEmoji}>❓</Text>
          <Text style={styles.notFoundText}>Booking not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header
        title="Track Service"
        subtitle={`#${booking.id.slice(-8).toUpperCase()}`}
        showBack
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Status</Text>
          <View style={styles.timeline}>
            {BOOKING_STATUS_STEPS.map((step, index) => {
              const stepStatusIndex = STATUS_ORDER.indexOf(step.key);
              const isDone = stepStatusIndex <= currentStatusIndex;
              const isActive = step.key === booking.status;

              return (
                <View key={step.key} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[
                      styles.timelineDot,
                      isDone && styles.timelineDotDone,
                      isActive && styles.timelineDotActive,
                    ]}>
                      <Text style={styles.timelineEmoji}>{isDone ? '✓' : step.emoji}</Text>
                    </View>
                    {index < BOOKING_STATUS_STEPS.length - 1 && (
                      <View style={[styles.timelineLine, isDone && styles.timelineLineDone]} />
                    )}
                  </View>
                  <View style={[styles.timelineContent, isActive && styles.timelineContentActive]}>
                    <Text style={[styles.timelineLabel, isActive && styles.timelineLabelActive]}>
                      {step.label}
                    </Text>
                    {isActive && (
                      <Text style={styles.timelineActiveTag}>← Current Status</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Technician Info */}
        {booking.technician && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Technician</Text>
            <View style={styles.techCard}>
              <View style={styles.techAvatar}>
                <Text style={styles.techAvatarText}>{booking.technician.name.charAt(0)}</Text>
              </View>
              <View style={styles.techInfo}>
                <Text style={styles.techName}>{booking.technician.name}</Text>
                <Text style={styles.techExp}>{booking.technician.experience} · ⭐ {booking.technician.rating}</Text>
                {booking.technician.estimatedArrival && (
                  <Text style={styles.techETA}>
                    🚗 ETA: {booking.technician.estimatedArrival}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => Alert.alert('Calling...', `Calling ${booking.technician!.name}`)}
              >
                <Text style={styles.callBtnText}>📞 Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={styles.detailsCard}>
            {[
              { label: '🔧 Service', value: booking.serviceName },
              { label: '📅 Date', value: booking.scheduledDate },
              { label: '⏰ Time', value: booking.timeSlot },
              { label: '📍 Address', value: booking.address?.fullAddress },
              { label: '💳 Payment', value: booking.paymentMethod?.toUpperCase() },
              { label: '💰 Amount', value: `₹${booking.price}` },
            ].map(item => (
              <View key={item.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue} numberOfLines={2}>{item.value || '-'}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Cancel */}
        {['confirmed', 'technician_assigned'].includes(booking.status) && (
          <View style={styles.section}>
            <Button
              title="Cancel Booking"
              onPress={handleCancel}
              variant="danger"
              size="md"
            />
          </View>
        )}

        {/* Review */}
        {booking.status === 'completed' && (
          <View style={styles.section}>
            <Button
              title="⭐ Rate & Review"
              onPress={() =>
                navigation.navigate('Review', {
                  bookingId: booking.id,
                  technicianId: booking.technician?.id || '',
                })
              }
              size="md"
            />
          </View>
        )}

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundEmoji: { fontSize: 64, marginBottom: SPACING.md },
  notFoundText: { fontSize: FONTS.sizes.lg, color: COLORS.textSecondary },
  section: { marginHorizontal: SPACING.xl, marginTop: SPACING.xl },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.md },
  // Timeline
  timeline: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.base, ...SHADOWS.sm },
  timelineItem: { flexDirection: 'row', minHeight: 60 },
  timelineLeft: { alignItems: 'center', width: 40, marginRight: SPACING.md },
  timelineDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotDone: { backgroundColor: COLORS.success + '20' },
  timelineDotActive: { backgroundColor: COLORS.primary + '20', borderWidth: 2, borderColor: COLORS.primary },
  timelineEmoji: { fontSize: 16 },
  timelineLine: { flex: 1, width: 2, backgroundColor: COLORS.gray200, marginTop: 4, marginBottom: 4 },
  timelineLineDone: { backgroundColor: COLORS.success },
  timelineContent: { flex: 1, paddingVertical: SPACING.sm, paddingBottom: SPACING.md },
  timelineContentActive: {
    backgroundColor: COLORS.primary + '08',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
  },
  timelineLabel: { fontSize: FONTS.sizes.base, fontWeight: '600', color: COLORS.textSecondary },
  timelineLabelActive: { color: COLORS.primary, fontWeight: '800' },
  timelineActiveTag: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  // Technician
  techCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    gap: SPACING.md,
    ...SHADOWS.sm,
  },
  techAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  techAvatarText: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary },
  techInfo: { flex: 1 },
  techName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  techExp: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  techETA: { fontSize: FONTS.sizes.xs, color: COLORS.accent, marginTop: 2, fontWeight: '600' },
  callBtn: {
    backgroundColor: COLORS.accent + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  callBtnText: { fontSize: FONTS.sizes.sm, color: COLORS.accent, fontWeight: '700' },
  // Details
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    ...SHADOWS.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  detailLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, flex: 1 },
  detailValue: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.text, flex: 1, textAlign: 'right' },
});

export default BookingTrackingScreen;
