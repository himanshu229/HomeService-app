import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../utils/theme';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateUser } from '../../store/slices/authSlice';
import { REGEX } from '../../utils/constants';

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector(state => state.auth);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!form.phone.trim() || !REGEX.PHONE.test(form.phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }
    if (!form.email.trim() || !REGEX.EMAIL.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    dispatch(updateUser({ name: form.name, phone: form.phone, email: form.email }));
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header title="Edit Profile" />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{form.name.charAt(0) || 'U'}</Text>
          </View>
          <TouchableOpacity style={styles.changeAvatarBtn}>
            <Text style={styles.changeAvatarText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <Input
            label="Full Name"
            value={form.name}
            onChangeText={v => setForm(f => ({ ...f, name: v }))}
            placeholder="Enter your full name"
            error={errors.name}
            leftIcon="person-outline"
            autoCapitalize="words"
          />
          <Input
            label="Email Address"
            value={form.email}
            onChangeText={v => setForm(f => ({ ...f, email: v }))}
            placeholder="Enter your email"
            error={errors.email}
            leftIcon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Phone Number"
            value={form.phone}
            onChangeText={v => setForm(f => ({ ...f, phone: v }))}
            placeholder="10-digit mobile number"
            error={errors.phone}
            leftIcon="call-outline"
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        <View style={styles.saveBtn}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={loading}
            size="lg"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.xl, gap: SPACING.lg },
  avatarSection: { alignItems: 'center', paddingVertical: SPACING.base },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary + '40',
    marginBottom: SPACING.sm,
  },
  avatarText: { fontSize: 40, fontWeight: '900', color: COLORS.primary },
  changeAvatarBtn: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primary + '15',
    borderRadius: RADIUS.full,
  },
  changeAvatarText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.primary },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    ...SHADOWS.sm,
    gap: SPACING.xs,
  },
  saveBtn: {},
});

export default EditProfileScreen;
