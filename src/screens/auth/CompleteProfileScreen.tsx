import React, { useState } from 'react';
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
import { RouteProp } from '@react-navigation/native';
import { User, CalendarDays, Mail } from 'lucide-react-native';
import { AuthStackParamList, Gender } from '../../types';
import { COLORS, FONTS, RADIUS, SPACING } from '../../utils/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAppDispatch, useAppSelector } from '../../store';
import { completeProfile, clearError } from '../../store/slices/authSlice';
import {
  completeProfileSchema,
  CompleteProfileFormValues,
} from '../../validations/auth.validation';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'CompleteProfile'>;
  route: RouteProp<AuthStackParamList, 'CompleteProfile'>;
};

const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: 'Male',   value: 'MALE'   },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other',  value: 'OTHER'  },
];

const CompleteProfileScreen: React.FC<Props> = ({ route }) => {
  const { phone } = route.params;
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.auth);

  // Simple date picker state
  const [dobInput, setDobInput] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: undefined,
      dob: '',
      email: '',
    },
  });

  const selectedGender = watch('gender');

  const formatDobInput = (text: string) => {
    // Auto-format as DD/MM/YYYY
    const digits = text.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 2) formatted = digits.slice(0, 2) + '/' + digits.slice(2);
    if (digits.length > 4) formatted = formatted.slice(0, 5) + '/' + formatted.slice(5);
    setDobInput(formatted);
    // Store as ISO date for validation
    if (digits.length === 8) {
      const day   = digits.slice(0, 2);
      const month = digits.slice(2, 4);
      const year  = digits.slice(4, 8);
      setValue('dob', `${year}-${month}-${day}`, { shouldValidate: true });
    } else {
      setValue('dob', '', { shouldValidate: false });
    }
  };

  const onSubmit = async (values: CompleteProfileFormValues) => {
    dispatch(clearError());
    const result = await dispatch(
      completeProfile({
        phone,
        firstName: values.firstName,
        lastName:  values.lastName,
        gender:    values.gender,
        dob:       values.dob,
        email:     values.email || undefined,
      })
    );
    if (completeProfile.rejected.match(result)) {
      Alert.alert('Error', result.payload as string || 'Failed to save profile');
    }
    // On success: isAuthenticated becomes true → AppNavigator redirects to Main
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
          <Text style={styles.stepLabel}>STEP 3 OF 3</Text>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Tell us a bit about yourself to get started
          </Text>
        </View>

        <View style={styles.form}>
          {/* First Name */}
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="First Name"
                placeholder="e.g. Harpreet"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                error={errors.firstName?.message}
                returnKeyType="next"
                required
                leftIcon={<User size={18} color={COLORS.textSecondary} />}
              />
            )}
          />

          {/* Last Name */}
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Last Name"
                placeholder="e.g. Singh"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                error={errors.lastName?.message}
                returnKeyType="next"
                required
                leftIcon={<User size={18} color={COLORS.textSecondary} />}
              />
            )}
          />

          {/* Gender */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Gender <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.genderRow}>
              {GENDER_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.genderChip,
                    selectedGender === opt.value && styles.genderChipActive,
                  ]}
                  onPress={() => setValue('gender', opt.value, { shouldValidate: true })}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.genderChipText,
                      selectedGender === opt.value && styles.genderChipTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.gender && (
              <Text style={styles.errorText}>{errors.gender.message}</Text>
            )}
          </View>

          {/* Date of Birth */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Date of Birth <Text style={styles.required}>*</Text>
            </Text>
            <Input
              placeholder="DD/MM/YYYY"
              value={dobInput}
              onChangeText={formatDobInput}
              keyboardType="number-pad"
              maxLength={10}
              error={errors.dob?.message}
              returnKeyType="next"
              leftIcon={<CalendarDays size={18} color={COLORS.textSecondary} />}
            />
          </View>

          {/* Email (optional) */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address (optional)"
                placeholder="you@example.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email?.message}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                leftIcon={<Mail size={18} color={COLORS.textSecondary} />}
              />
            )}
          />

          <Button
            title={isLoading ? 'Saving...' : 'Save & Continue'}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            size="lg"
          />
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
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  stepLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '900',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: SPACING.xs,
    lineHeight: 20,
  },
  form: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    gap: SPACING.sm,
  },
  fieldGroup: { marginBottom: SPACING.sm },
  fieldLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  required: { color: COLORS.error || '#E53935' },

  genderRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  genderChip: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  genderChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  genderChipText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  genderChipTextActive: {
    color: COLORS.primary,
  },
  errorText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.error || '#E53935',
    marginTop: 4,
  },
});

export default CompleteProfileScreen;
