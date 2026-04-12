import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../utils/theme';
import { Booking } from '../../types';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  PENDING: { label: 'Pending', color: COLORS.warning, bg: '#FFF8E1', emoji: '⏳' },
  CONFIRMED: { label: 'Confirmed', color: COLORS.secondary, bg: '#E8F4FD', emoji: '✅' },
  TECHNICIAN_ASSIGNED: { label: 'Assigned', color: COLORS.accent, bg: '#E8F5E9', emoji: '👨‍🔧' },
  ON_THE_WAY: { label: 'On the Way', color: COLORS.info, bg: '#E3F2FD', emoji: '🚗' },
  IN_PROGRESS: { label: 'In Progress', color: COLORS.primary, bg: '#FFF3E0', emoji: '🔧' },
  COMPLETED: { label: 'Completed', color: COLORS.success, bg: '#E8F5E9', emoji: '🎉' },
  CANCELLED: { label: 'Cancelled', color: COLORS.error, bg: '#FFEBEE', emoji: '❌' },
};

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
  onTrack?: () => void;
  onReview?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onPress, onTrack, onReview }) => {
  const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
  const isActive = ['CONFIRMED', 'TECHNICIAN_ASSIGNED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(booking.status);
  const isCompleted = booking.status === 'COMPLETED';

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View>
          <Text style={styles.serviceName}>{booking.serviceName}</Text>
          <Text style={styles.category}>{booking.serviceCategory}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={styles.statusEmoji}>{status.emoji}</Text>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailText}>{formatDate(booking.scheduledDate)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>🕐</Text>
          <Text style={styles.detailText}>{booking.scheduledSlot}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>💰</Text>
          <Text style={styles.detailText}>₹{booking.totalAmount}</Text>
        </View>
      </View>

      {(booking.technician || isActive || isCompleted) && (
        <View style={styles.footer}>
          {booking.technician && (
            <Text style={styles.technicianInfo}>
              👨‍🔧 {booking.technician.name} · ⭐ {booking.technician.rating}
            </Text>
          )}
          {isActive && onTrack && (
            <TouchableOpacity style={styles.trackBtn} onPress={onTrack} activeOpacity={0.8}>
              <Text style={styles.trackBtnText}>Track Service</Text>
            </TouchableOpacity>
          )}
          {isCompleted && !booking.technician && onReview && (
            <TouchableOpacity style={styles.reviewBtn} onPress={onReview} activeOpacity={0.8}>
              <Text style={styles.reviewBtnText}>Rate & Review</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  category: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  statusEmoji: { fontSize: 12 },
  statusText: { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailIcon: { fontSize: 13 },
  detailText: { fontSize: FONTS.sizes.xs, color: COLORS.text, fontWeight: '500' },
  footer: {
    marginTop: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  technicianInfo: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    flex: 1,
  },
  trackBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  trackBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.xs },
  reviewBtn: {
    backgroundColor: COLORS.accent + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  reviewBtnText: { color: COLORS.accent, fontWeight: '700', fontSize: FONTS.sizes.xs },
});

export default BookingCard;
