import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../types';
import { COLORS, FONTS, RADIUS, SPACING } from '../../utils/theme';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../store';
import { verifyOtp, resendOtp } from '../../store/slices/authSlice';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'OtpVerification'>;
  route: RouteProp<AuthStackParamList, 'OtpVerification'>;
};

const OTP_LENGTH = 6;

const OtpVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { phone, email, mode } = route.params;
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.auth);
  const [resending, setResending] = useState(false);

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(30);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    // Handle paste
    if (cleanText.length > 1) {
      const pasted = cleanText.slice(0, OTP_LENGTH);
      const arr = pasted.split('');
      for (let i = 0; i < OTP_LENGTH; i++) {
        newOtp[i] = arr[i] || '';
      }
      setOtp(newOtp);
      inputs.current[OTP_LENGTH - 1]?.focus();
      return;
    }

    newOtp[index] = cleanText;
    setOtp(newOtp);
    if (cleanText && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length < OTP_LENGTH) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP');
      return;
    }
    const result = await dispatch(verifyOtp({ email, code: otpString }));
    if (verifyOtp.rejected.match(result)) {
      Alert.alert('Verification Failed', result.payload as string || 'Invalid OTP');
    }
  };

  const handleResend = async () => {
    setResending(true);
    const result = await dispatch(resendOtp(email));
    setResending(false);
    if (resendOtp.rejected.match(result)) {
      Alert.alert('Error', result.payload as string || 'Failed to resend OTP');
    } else {
      setOtp(Array(OTP_LENGTH).fill(''));
      setCountdown(30);
      inputs.current[0]?.focus();
      Alert.alert('OTP Sent', `A new OTP has been sent to ${email}`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.illustration}>
          <Text style={styles.illustrationEmoji}>📱</Text>
        </View>

        <Text style={styles.title}>Verify Your Number</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to{'\n'}
          <Text style={styles.phone}>+91 {phone}</Text>
        </Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => { inputs.current[index] = ref; }}
              style={[styles.otpInput, digit ? styles.otpFilled : null]}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* Demo OTP hint */}
        <Text style={styles.demoHint}>Demo OTP: 123456</Text>

        <Button
          title={isLoading ? 'Verifying...' : 'Verify OTP'}
          onPress={handleVerify}
          loading={isLoading}
          size="lg"
        />

        <View style={styles.resendRow}>
          {countdown > 0 ? (
            <Text style={styles.resendCountdown}>Resend OTP in {countdown}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={resending}>
              <Text style={styles.resendLink}>{resending ? 'Sending...' : 'Resend OTP'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  backBtn: {
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    marginLeft: SPACING.xl,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    alignItems: 'center',
  },
  illustration: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  illustrationEmoji: { fontSize: 48 },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  subtitle: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  phone: { color: COLORS.primary, fontWeight: '700' },
  otpContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    backgroundColor: COLORS.gray100,
  },
  otpFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  demoHint: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  resendRow: { marginTop: SPACING.xl },
  resendCountdown: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  resendLink: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '700' },
});

export default OtpVerificationScreen;
