import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../../utils/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = true,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      ...styles.base,
      ...styles[`size_${size}`],
      ...(fullWidth ? styles.fullWidth : {}),
    };

    switch (variant) {
      case 'primary':
        return { ...base, ...styles.primary, ...(disabled ? styles.primaryDisabled : {}) };
      case 'secondary':
        return { ...base, ...styles.secondary };
      case 'outline':
        return { ...base, ...styles.outline };
      case 'ghost':
        return { ...base, ...styles.ghost };
      case 'danger':
        return { ...base, ...styles.danger };
      default:
        return { ...base, ...styles.primary };
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = { ...styles.text, ...styles[`textSize_${size}`] };
    switch (variant) {
      case 'outline':
        return { ...base, color: COLORS.primary };
      case 'ghost':
        return { ...base, color: COLORS.primary };
      case 'secondary':
        return { ...base, color: COLORS.white };
      default:
        return { ...base, color: COLORS.white };
    }
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  fullWidth: { width: '100%' },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  iconLeft: { marginRight: SPACING.xs },
  iconRight: { marginLeft: SPACING.xs },
  // Sizes
  size_sm: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md, minHeight: 36 },
  size_md: { paddingVertical: SPACING.sm + 2, paddingHorizontal: SPACING.base, minHeight: 48 },
  size_lg: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, minHeight: 56 },
  // Variants
  primary: { backgroundColor: COLORS.primary },
  primaryDisabled: { backgroundColor: COLORS.gray400 },
  secondary: { backgroundColor: COLORS.secondary },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  ghost: { backgroundColor: 'transparent', shadowOpacity: 0, elevation: 0 },
  danger: { backgroundColor: COLORS.error },
  // Text
  text: { fontWeight: '700', textAlign: 'center' },
  textSize_sm: { fontSize: FONTS.sizes.sm },
  textSize_md: { fontSize: FONTS.sizes.md },
  textSize_lg: { fontSize: FONTS.sizes.lg },
});

export default Button;
