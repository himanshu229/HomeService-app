import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { COLORS, FONTS, SPACING } from '../../utils/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { REGEX } from '../../utils/constants';
import { authAPI } from '../../services/authService';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
};

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!REGEX.EMAIL.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authAPI.forgotPassword(email.trim());
      setSent(true);
    } catch {
      Alert.alert('Error', 'Could not send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>📧</Text>
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successText}>
            We've sent a password reset link to{'\n'}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Text>
          <Button
            title="Back to Login"
            onPress={() => navigation.navigate('Login')}
            size="lg"
            style={styles.btn}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.icon}>
            <Text style={styles.iconEmoji}>🔑</Text>
          </View>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Don't worry! Enter your email and we'll send you a reset link.
          </Text>

          <Input
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
            returnKeyType="done"
            onSubmitEditing={handleSend}
            required
            leftIcon={<Text style={styles.inputIcon}>✉️</Text>}
          />

          <Button
            title={loading ? 'Sending...' : 'Send Reset Link'}
            onPress={handleSend}
            loading={loading}
            size="lg"
          />

          <TouchableOpacity style={styles.loginRow} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>← Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
  content: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },
  icon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    alignSelf: 'center',
  },
  iconEmoji: { fontSize: 48 },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  subtitle: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginVertical: SPACING.md,
    marginBottom: SPACING.xl,
  },
  inputIcon: { fontSize: 18 },
  loginRow: { alignItems: 'center', marginTop: SPACING.xl },
  loginText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '600' },
  btn: { marginTop: SPACING.md },
  // Success
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  successEmoji: { fontSize: 80, marginBottom: SPACING.xl },
  successTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  successText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginVertical: SPACING.md,
    marginBottom: SPACING.xl,
  },
  emailHighlight: { color: COLORS.primary, fontWeight: '700' },
});

export default ForgotPasswordScreen;
