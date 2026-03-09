import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  // Primary — blue (matches web Tailwind primary scale)
  primary:      '#2563eb', // primary-600
  primaryDark:  '#1d4ed8', // primary-700
  primaryLight: '#3b82f6', // primary-500
  primary50:    '#eff6ff',
  primary100:   '#dbeafe',
  primary200:   '#bfdbfe',
  primary300:   '#93c5fd',
  primary400:   '#60a5fa',
  primary500:   '#3b82f6',
  primary600:   '#2563eb',
  primary700:   '#1d4ed8',
  primary800:   '#1e40af',
  primary900:   '#1e3a8a',

  // Semantic — success (green)
  success:      '#16a34a', // success-600
  successLight: '#dcfce7', // success-100
  successDark:  '#15803d', // success-700

  // Semantic — warning (amber)
  warning:      '#d97706', // warning-600
  warningLight: '#fef3c7', // warning-100
  warningDark:  '#b45309', // warning-700

  // Semantic — error (red)
  error:        '#dc2626', // error-600
  errorLight:   '#fee2e2', // error-100
  errorDark:    '#b91c1c', // error-700

  // Semantic — info (cyan)
  info:         '#0891b2', // info-600
  infoLight:    '#cffafe', // info-100
  infoDark:     '#0e7490', // info-700

  // Neutrals
  background:    '#F8F9FA',
  surface:       '#FFFFFF',
  card:          '#FFFFFF',
  text:          '#1A1A2E',
  textSecondary: '#6C757D',
  textLight:     '#ADB5BD',
  border:        '#E9ECEF',
  divider:       '#DEE2E6',
  white:         '#FFFFFF',
  black:         '#000000',
  gray100:       '#F8F9FA',
  gray200:       '#E9ECEF',
  gray300:       '#DEE2E6',
  gray400:       '#CED4DA',
  gray500:       '#ADB5BD',
  gray600:       '#6C757D',
  gray700:       '#495057',
  gray800:       '#343A40',
  gray900:       '#212529',
  shadow:        'rgba(0,0,0,0.1)',
  overlay:       'rgba(0,0,0,0.5)',

  // Gradients / UI chrome
  gradientStart:  '#2563eb',
  gradientEnd:    '#3b82f6',
  statusBar:      '#2563eb',
  tabBar:         '#FFFFFF',
  tabBarActive:   '#2563eb',
  tabBarInactive: '#ADB5BD',

  // Legacy aliases kept for backward compat
  secondary:     '#1d4ed8',
  secondaryDark: '#1e40af',
  accent:        '#16a34a',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 32,
    hero: 36,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  section: 48,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const SCREEN = {
  width,
  height,
  isSmall: width < 375,
};

export const PAPER_THEME = {
  colors: {
    primary: COLORS.primary,
    accent: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    text: COLORS.text,
    error: COLORS.error,
    notification: COLORS.primary,
  },
};
