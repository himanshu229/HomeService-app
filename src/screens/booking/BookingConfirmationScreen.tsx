import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../../types';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../utils/theme';
import Button from '../../components/common/Button';
import { useAppSelector } from '../../store';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'BookingConfirmation'>;
  route: RouteProp<HomeStackParamList, 'BookingConfirmation'>;
};

const BookingConfirmationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { bookingId } = route.params;
  const { activeBooking } = useAppSelector(state => state.booking);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim, fadeAnim]);

  const booking = activeBooking;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.content}>
        {/* Success Icon */}
        <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.successEmoji}>✅</Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.bookingId}>Booking ID: #{(bookingId ?? '').slice(-8).toUpperCase()}</Text>
          <Text style={styles.subtitle}>
            Your service request has been confirmed. A technician will be assigned shortly.
          </Text>
        </Animated.View>

        {/* Booking Summary Card */}
        {booking && (
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <View style={styles.cardRow}>
              <Text style={styles.cardIcon}>🔧</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Service</Text>
                <Text style={styles.cardValue}>{booking.service?.name ?? booking.serviceName ?? ''}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <Text style={styles.cardIcon}>📅</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Scheduled</Text>
                <Text style={styles.cardValue}>{booking.scheduledDate} · {booking.scheduledSlot}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <Text style={styles.cardIcon}>📍</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Service Address</Text>
                <Text style={styles.cardValue} numberOfLines={2}>
                  {[booking.address?.street, booking.address?.city].filter(Boolean).join(', ')}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <Text style={styles.cardIcon}>💰</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Amount</Text>
                <Text style={[styles.cardValue, { color: COLORS.primary }]}>₹{booking.totalAmount}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* What's next */}
        <View style={styles.nextSteps}>
          <Text style={styles.nextStepsTitle}>What happens next?</Text>
          {[
            { emoji: '👨‍🔧', text: 'Technician will be assigned within 30 minutes' },
            { emoji: '📱', text: 'You\'ll get an SMS with technician details' },
            { emoji: '🔔', text: 'Track service status in real-time' },
          ].map((step, i) => (
            <View key={i} style={styles.nextStep}>
              <Text style={styles.nextStepEmoji}>{step.emoji}</Text>
              <Text style={styles.nextStepText}>{step.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Track Booking"
          onPress={() => navigation.replace('BookingTracking', { bookingId })}
          size="lg"
        />
        <Button
          title="Go to Home"
          onPress={() => navigation.popToTop()}
          variant="outline"
          size="lg"
          style={{ marginTop: SPACING.sm }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.success + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  successEmoji: { fontSize: 52 },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: '900', color: COLORS.text, textAlign: 'center' },
  bookingId: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.xl,
    ...SHADOWS.sm,
  },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: SPACING.sm },
  cardIcon: { fontSize: 20, marginRight: SPACING.md, marginTop: 2 },
  cardContent: { flex: 1 },
  cardLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, fontWeight: '500' },
  cardValue: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.divider },
  nextSteps: { width: '100%' },
  nextStepsTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  nextStep: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.sm, gap: SPACING.md },
  nextStepEmoji: { fontSize: 20 },
  nextStepText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
  actions: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.md,
  },
});

export default BookingConfirmationScreen;
