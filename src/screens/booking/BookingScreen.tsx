import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../../types';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../utils/theme';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import TimeSlotPicker from '../../components/booking/TimeSlotPicker';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateBookingDraft, createBooking } from '../../store/slices/bookingSlice';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Booking'>;
  route: RouteProp<HomeStackParamList, 'Booking'>;
};

const STEPS = ['Date & Time', 'Address', 'Payment'];

const BookingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { service } = route.params;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { isLoading } = useAppSelector(state => state.booking);

  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [address, setAddress] = useState(user?.addresses?.[0] || {
    id: 'new', label: 'Home', street: '', city: '', state: '', pincode: '', isDefault: false,
  });
  const [notes, setNotes] = useState('');
  // COD-only: payment is always Cash on Delivery. Online payments are disabled.
  const paymentMethod = 'CASH';

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      key: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-IN', { month: 'short' }),
      isToday: i === 0,
    };
  });

  const handleNext = () => {
    if (step === 0) {
      if (!selectedDate || !selectedSlot) {
        Alert.alert('Required', 'Please select a date and time slot');
        return;
      }
      dispatch(updateBookingDraft({ scheduledDate: selectedDate, scheduledSlot: selectedSlot }));
    } else if (step === 1) {
      if (!address.street || !address.city || !address.pincode) {
        Alert.alert('Required', 'Please fill in complete address details');
        return;
      }
      dispatch(updateBookingDraft({ addressId: address.id !== 'new' ? address.id : undefined, notes }));
    }
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleConfirmBooking();
    }
  };

  const handleConfirmBooking = async () => {
    dispatch(updateBookingDraft({ paymentMethod }));
    const result = await dispatch(
      createBooking({
        serviceId:    service.id,
        scheduledDate: selectedDate,
        scheduledSlot: selectedSlot,
        addressId:    address.id !== 'new' ? address.id : undefined as any,
        paymentMethod: 'CASH' as any,
        totalAmount:  service.price,
        notes,
      })
    );
    if (createBooking.fulfilled.match(result)) {
      navigation.replace('BookingConfirmation', { bookingId: result.payload.id });
    } else {
      Alert.alert('Booking Failed', 'Please try again');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header title="Book Service" showBack />

      {/* Service Summary */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>🔧 {service.name}</Text>
        <Text style={styles.summaryPrice}>₹{service.price}</Text>
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, i <= step && styles.stepCircleActive]}>
                <Text style={[styles.stepNumber, i <= step && styles.stepNumberActive]}>
                  {i < step ? '✓' : i + 1}
                </Text>
              </View>
              <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{s}</Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[styles.stepLine, i < step && styles.stepLineActive]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Step 0: Date & Time */}
        {step === 0 && (
          <View>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateRow}>
              {dates.map(d => (
                <TouchableOpacity
                  key={d.key}
                  style={[styles.dateCard, selectedDate === d.key && styles.dateCardActive]}
                  onPress={() => setSelectedDate(d.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dateDay, selectedDate === d.key && styles.dateDayActive]}>
                    {d.day}
                  </Text>
                  <Text style={[styles.dateNum, selectedDate === d.key && styles.dateNumActive]}>
                    {d.date}
                  </Text>
                  <Text style={[styles.dateMon, selectedDate === d.key && styles.dateMonActive]}>
                    {d.month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.timeSlotWrap}>
              <TimeSlotPicker selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot} />
            </View>
          </View>
        )}

        {/* Step 1: Address */}
        {step === 1 && (
          <View>
            {/* Saved addresses */}
            {user?.addresses && user.addresses.length > 0 && (
              <View style={styles.savedSection}>
                <Text style={styles.sectionTitle}>Saved Addresses</Text>
                {user.addresses.map(addr => (
                  <TouchableOpacity
                    key={addr.id}
                    style={[
                      styles.savedAddr,
                      address.id === addr.id && styles.savedAddrActive,
                    ]}
                    onPress={() => setAddress(addr)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addrLabel}>{addr.isDefault ? '🏠' : '💼'} {addr.label}</Text>
                    <Text style={styles.addrText}>{addr.street}</Text>
                    <Text style={styles.addrCity}>{addr.city}, {addr.pincode}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.sectionTitle}>Service Address</Text>
            <Input
              label="Full Address"
              placeholder="House/Flat no., Street, Area"
              value={address.street}
              onChangeText={v => setAddress(a => ({ ...a, street: v }))}
              multiline
              numberOfLines={2}
              required
              leftIcon={<Text>📍</Text>}
            />
            <Input
              label="City"
              placeholder="City"
              value={address.city}
              onChangeText={v => setAddress(a => ({ ...a, city: v }))}
              required
              leftIcon={<Text>🏙️</Text>}
            />
            <Input
              label="Pincode"
              placeholder="110001"
              value={address.pincode}
              onChangeText={v => setAddress(a => ({ ...a, pincode: v }))}
              keyboardType="number-pad"
              maxLength={6}
              required
              leftIcon={<Text>📮</Text>}
            />
            <Input
              label="Service Notes (Optional)"
              placeholder="Any specific instructions for the technician..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              leftIcon={<Text>📝</Text>}
            />
          </View>
        )}

        {/* Step 2: Payment — COD only */}
        {step === 2 && (
          <View>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={[styles.paymentCard, styles.paymentCardActive]}>
              <Text style={styles.paymentIcon}>💵</Text>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>Cash on Delivery (COD)</Text>
                <Text style={styles.paymentDesc}>Pay in cash when the technician arrives</Text>
              </View>
              <View style={[styles.radio, styles.radioActive]}>
                <View style={styles.radioDot} />
              </View>
            </View>

            {/* Order Summary */}
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Service</Text>
                <Text style={styles.summaryVal}>{service.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Date</Text>
                <Text style={styles.summaryVal}>{selectedDate}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Time</Text>
                <Text style={styles.summaryVal}>{selectedSlot}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Address</Text>
                <Text style={styles.summaryVal} numberOfLines={2}>{address.street}</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.totalKey}>Total Amount</Text>
                <Text style={styles.totalVal}>₹{service.price}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        {step > 0 && (
          <Button
            title="Back"
            onPress={() => setStep(s => s - 1)}
            variant="outline"
            size="lg"
            style={{ flex: 1, marginRight: SPACING.sm }}
          />
        )}
        <Button
          title={step === STEPS.length - 1 ? (isLoading ? 'Confirming...' : 'Confirm Booking') : 'Continue →'}
          onPress={handleNext}
          loading={isLoading}
          size="lg"
          style={{ flex: 2 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  summaryText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.text },
  summaryPrice: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.primary },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stepItem: { alignItems: 'center', flex: 1 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCircleActive: { backgroundColor: COLORS.primary },
  stepNumber: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textSecondary },
  stepNumberActive: { color: COLORS.white },
  stepLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textLight },
  stepLabelActive: { color: COLORS.primary, fontWeight: '700' },
  stepLine: { flex: 1, height: 2, backgroundColor: COLORS.gray200, marginBottom: 16 },
  stepLineActive: { backgroundColor: COLORS.primary },
  content: { padding: SPACING.xl, paddingBottom: SPACING.xxxl },
  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md, marginTop: SPACING.md },
  dateRow: { marginBottom: SPACING.xl },
  dateCard: {
    width: 60,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  dateCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  dateDay: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, fontWeight: '500' },
  dateDayActive: { color: COLORS.primary },
  dateNum: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.text },
  dateNumActive: { color: COLORS.primary },
  dateMon: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  dateMonActive: { color: COLORS.primary },
  timeSlotWrap: { marginTop: SPACING.sm },
  savedSection: { marginBottom: SPACING.md },
  savedAddr: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  savedAddrActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  addrLabel: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  addrText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  addrCity: { fontSize: FONTS.sizes.xs, color: COLORS.textLight, marginTop: 2 },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  paymentCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  paymentIcon: { fontSize: 28 },
  paymentInfo: { flex: 1 },
  paymentName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  paymentDesc: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.primary },
  radioDot: { width: 11, height: 11, borderRadius: 5.5, backgroundColor: COLORS.primary },
  summary: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginTop: SPACING.lg,
    ...SHADOWS.sm,
  },
  summaryTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  summaryKey: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, flex: 1 },
  summaryVal: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.text, flex: 2, textAlign: 'right' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: COLORS.divider, paddingTop: SPACING.sm, marginTop: SPACING.xs },
  totalKey: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.text, flex: 1 },
  totalVal: { fontSize: FONTS.sizes.xl, fontWeight: '900', color: COLORS.primary, flex: 2, textAlign: 'right' },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
});

export default BookingScreen;
