import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../utils/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  titleColor?: string;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  rightComponent,
  backgroundColor = COLORS.white,
  titleColor = COLORS.text,
  transparent = false,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + SPACING.xs, backgroundColor: transparent ? 'transparent' : backgroundColor },
        !transparent && SHADOWS.sm,
      ]}
    >
      <StatusBar
        barStyle={backgroundColor === COLORS.white || transparent ? 'dark-content' : 'light-content'}
        backgroundColor={transparent ? 'transparent' : backgroundColor}
        translucent={transparent}
      />
      <View style={styles.content}>
        {showBack ? (
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={[styles.backIcon, { color: titleColor }]}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: titleColor + '99' }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.rightContainer}>
          {rightComponent || <View style={styles.spacer} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: '700',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: FONTS.sizes.xs,
    marginTop: 2,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  spacer: { width: 40 },
});

export default Header;
