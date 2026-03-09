import React, { useState, forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../../utils/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  required?: boolean;
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      inputContainerStyle,
      required,
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    const borderColor = error
      ? COLORS.error
      : focused
      ? COLORS.primary
      : COLORS.border;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}
        <View
          style={[
            styles.inputContainer,
            { borderColor },
            focused && styles.inputFocused,
            inputContainerStyle,
          ]}
        >
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[styles.input, leftIcon ? styles.inputWithLeft : null]}
            placeholderTextColor={COLORS.gray400}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...rest}
          />
          {rightIcon && (
            <TouchableOpacity
              style={styles.rightIcon}
              onPress={onRightIconPress}
              activeOpacity={0.7}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : hint ? (
          <Text style={styles.hintText}>{hint}</Text>
        ) : null}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  required: { color: COLORS.error },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderRadius: RADIUS.md,
    minHeight: 52,
    ...SHADOWS.sm,
  },
  inputFocused: { ...SHADOWS.md },
  input: {
    flex: 1,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  inputWithLeft: { paddingLeft: SPACING.xs },
  leftIcon: { paddingLeft: SPACING.base },
  rightIcon: { paddingRight: SPACING.base },
  errorText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  hintText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
});

export default Input;
