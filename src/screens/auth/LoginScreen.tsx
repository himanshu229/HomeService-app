import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Snowflake, Smartphone } from 'lucide-react-native';
import { AuthStackParamList } from '../../types';
import { COLORS, FONTS, RADIUS, SPACING } from '../../utils/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAppDispatch, useAppSelector } from '../../store';
import { sendOtp, clearError } from '../../store/slices/authSlice';
import { phoneSchema, PhoneFormValues } from '../../validations/auth.validation';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.auth);

  const { control, handleSubmit, formState: { errors } } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  const onSubmit = async (values: PhoneFormValues) => {
    dispatch(clearError());
    const result = await dispatch(sendOtp(values.phone));
    if (sendOtp.rejected.match(result)) {
      Alert.alert('Error', result.payload as string || 'Failed to send OTP');
      return;
    }
    navigation.navigate('OtpVerification', { phone: values.phone });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Snowflake size={38} color={COLORS.white} strokeWidth={2} />
          </View>
          <Text style={styles.appName}>SummerFix</Text>
          <Text style={styles.headline}>Welcome! 👋</Text>
          <Text style={styles.subtitle}>Enter your mobile number to get started</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Mobile Number"
                placeholder="e.g. 9876543210"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                maxLength={10}
                error={errors.phone?.message}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                required
                leftIcon={<Smartphone size={18} color={COLORS.textSecondary} />}
                leftLabel="+91"
              />
            )}
          />

          <Text style={styles.hint}>
            We'll send a 6-digit OTP to verify your number.
          </Text>

          <Button
            title={isLoading ? 'Sending OTP...' : 'Send OTP'}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            size="lg"
          />
        </View>

        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.white },
  container: { flexGrow: 1, paddingBottom: SPACING.xxl },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },

  appName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '900',
    color: COLORS.white,
  },
  headline: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: SPACING.lg,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    textAlign: 'center',
  },
  form: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },

  hint: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    marginTop: 4,
    lineHeight: 18,
  },
  terms: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    lineHeight: 18,
  },
  termsLink: { color: COLORS.primary, fontWeight: '600' },
});

export default LoginScreen;
