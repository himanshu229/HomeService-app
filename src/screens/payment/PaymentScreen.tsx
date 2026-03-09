import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../../types';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../utils/theme';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { PAYMENT_METHODS } from '../../utils/constants';
import { useAppDispatch } from '../../store';
import { createBooking } from '../../store/slices/bookingSlice';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'PaymentScreen'>;
  route: RouteProp<HomeStackParamList, 'PaymentScreen'>;
};

const PaymentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { bookingDraft } = route.params;
  const dispatch = useAppDispatch();
  const [selectedMethod, setSelectedMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const result = await dispatch(createBooking({ ...bookingDraft, paymentMethod: selectedMethod }));
      if (createBooking.fulfilled.match(result)) {
        navigation.replace('BookingConfirmation', { bookingId: result.payload.id });
      }
    } catch {
      Alert.alert('Payment Failed', 'Please try again');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header title="Payment" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        {PAYMENT_METHODS.map(method => (
          <TouchableOpacity
            key={method.id}
            style={[styles.card, selectedMethod === method.id && styles.cardActive]}
            onPress={() => setSelectedMethod(method.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.methodIcon}>{method.icon}</Text>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>{method.name}</Text>
              <Text style={styles.methodDesc}>{method.description}</Text>
            </View>
            <View style={[styles.radio, selectedMethod === method.id && styles.radioActive]}>
              {selectedMethod === method.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Amount Card */}
        <View style={styles.amountCard}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Service Charge</Text>
            <Text style={styles.amountValue}>₹{bookingDraft.price}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Platform Fee</Text>
            <Text style={styles.amountValue}>₹0</Text>
          </View>
          <View style={[styles.amountRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{bookingDraft.price}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isProcessing ? 'Processing...' : `Pay ₹${bookingDraft.price}`}
          onPress={handlePay}
          loading={isProcessing}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.xl },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
    ...SHADOWS.sm,
  },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  methodIcon: { fontSize: 28 },
  methodInfo: { flex: 1 },
  methodName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  methodDesc: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
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
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: COLORS.primary },
  amountCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginTop: SPACING.lg,
    ...SHADOWS.sm,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  amountLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  amountValue: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.text },
  totalRow: { borderBottomWidth: 0 },
  totalLabel: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.text },
  totalValue: { fontSize: FONTS.sizes.xl, fontWeight: '900', color: COLORS.primary },
  footer: { padding: SPACING.xl, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border },
});

export default PaymentScreen;
