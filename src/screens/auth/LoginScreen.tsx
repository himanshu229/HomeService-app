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
  Dimensions,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { COLORS, FONTS, RADIUS, SPACING } from '../../utils/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { REGEX } from '../../utils/constants';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const passwordRef = useRef<TextInput>(null);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!REGEX.EMAIL.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    dispatch(clearError());
    const result = await dispatch(loginUser({ email: email.trim(), password }));
    if (loginUser.rejected.match(result)) {
      Alert.alert('Login Failed', result.payload as string);
    }
  };

  // Demo login
  const handleDemoLogin = () => {
    setEmail('harpreet@example.com');
    setPassword('Demo@1234');
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
          <View style={styles.logoSmall}>
            <Text style={styles.logoEmoji}>❄️</Text>
          </View>
          <Text style={styles.appName}>SummerFix</Text>
          <Text style={styles.welcome}>Welcome Back! 👋</Text>
          <Text style={styles.subtitle}>Sign in to book home services</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            required
            leftIcon={<Text style={styles.inputIcon}>✉️</Text>}
          />

          <Input
            ref={passwordRef}
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            error={errors.password}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            required
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
            rightIcon={
              <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁'}</Text>
            }
            onRightIconPress={() => setShowPassword(p => !p)}
          />

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title={isLoading ? 'Signing in...' : 'Sign In'}
            onPress={handleLogin}
            loading={isLoading}
            size="lg"
          />

          <TouchableOpacity style={styles.demoBtn} onPress={handleDemoLogin}>
            <Text style={styles.demoText}>Use Demo Credentials</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Login */}
          <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleText}>Sign in with Google</Text>
          </TouchableOpacity>

          {/* Sign up link */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
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
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  logoSmall: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  logoEmoji: { fontSize: 34 },
  appName: { fontSize: FONTS.sizes.xxl, fontWeight: '900', color: COLORS.white },
  welcome: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: SPACING.lg,
  },
  subtitle: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  form: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },
  inputIcon: { fontSize: 18 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: SPACING.base },
  forgotText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '600' },
  demoBtn: { alignItems: 'center', marginTop: SPACING.sm },
  demoText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    gap: SPACING.sm,
  },
  googleIcon: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '900',
    color: '#4285F4',
  },
  googleText: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  signupText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  signupLink: { fontSize: FONTS.sizes.md, color: COLORS.primary, fontWeight: '700' },
});

export default LoginScreen;
