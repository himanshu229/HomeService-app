import React, { useState, useRef } from 'react';
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
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { COLORS, FONTS, RADIUS, SPACING } from '../../utils/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAppDispatch, useAppSelector } from '../../store';
import { signupUser, clearError } from '../../store/slices/authSlice';
import { REGEX } from '../../utils/constants';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Signup'>;
};

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.auth);

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const update = (key: keyof typeof form, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<typeof form> = {};
    if (!form.name.trim() || form.name.length < 2) newErrors.name = 'Enter a valid name';
    if (!REGEX.EMAIL.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!REGEX.PHONE.test(form.phone)) newErrors.phone = 'Enter a valid 10-digit mobile number';
    if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    dispatch(clearError());
    const result = await dispatch(
      signupUser({ name: form.name.trim(), email: form.email.trim(), phone: form.phone, password: form.password })
    );
    if (signupUser.fulfilled.match(result)) {
      navigation.navigate('OtpVerification', { phone: form.phone, email: form.email.trim(), mode: 'signup' });
    } else {
      Alert.alert('Signup Failed', result.payload as string || 'Please try again');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join SummerFix for hassle-free home services</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Harpreet Singh"
            value={form.name}
            onChangeText={v => update('name', v)}
            autoCapitalize="words"
            error={errors.name}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            required
            leftIcon={<Text style={styles.icon}>👤</Text>}
          />
          <Input
            ref={emailRef}
            label="Email Address"
            placeholder="you@example.com"
            value={form.email}
            onChangeText={v => update('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            required
            leftIcon={<Text style={styles.icon}>✉️</Text>}
          />
          <Input
            ref={phoneRef}
            label="Mobile Number"
            placeholder="9876543210"
            value={form.phone}
            onChangeText={v => update('phone', v)}
            keyboardType="phone-pad"
            maxLength={10}
            error={errors.phone}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            required
            leftIcon={<Text style={styles.icon}>📱</Text>}
          />
          <Input
            ref={passwordRef}
            label="Password"
            placeholder="At least 8 characters"
            value={form.password}
            onChangeText={v => update('password', v)}
            secureTextEntry={!showPassword}
            error={errors.password}
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
            required
            leftIcon={<Text style={styles.icon}>🔒</Text>}
            rightIcon={<Text style={styles.icon}>{showPassword ? '🙈' : '👁'}</Text>}
            onRightIconPress={() => setShowPassword(p => !p)}
          />
          <Input
            ref={confirmRef}
            label="Confirm Password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChangeText={v => update('confirmPassword', v)}
            secureTextEntry={!showPassword}
            error={errors.confirmPassword}
            returnKeyType="done"
            onSubmitEditing={handleSignup}
            required
            leftIcon={<Text style={styles.icon}>🔒</Text>}
          />

          <Text style={styles.terms}>
            By signing up, you agree to our{' '}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>

          <Button
            title={isLoading ? 'Creating Account...' : 'Create Account'}
            onPress={handleSignup}
            loading={isLoading}
            size="lg"
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.white },
  container: { flexGrow: 1, paddingBottom: SPACING.xxl },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.primary + '10',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: SPACING.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  backIcon: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  headerText: {},
  title: { fontSize: FONTS.sizes.xxxl, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 4 },
  form: { paddingHorizontal: SPACING.xl },
  icon: { fontSize: 18 },
  terms: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: SPACING.base,
  },
  link: { color: COLORS.primary, fontWeight: '600' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  loginText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  loginLink: { fontSize: FONTS.sizes.md, color: COLORS.primary, fontWeight: '700' },
});

export default SignupScreen;
