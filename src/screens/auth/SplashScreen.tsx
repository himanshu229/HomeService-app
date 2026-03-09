import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { COLORS, FONTS } from '../../utils/theme';
import { useAppSelector } from '../../store';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Splash'>;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    // Logo animation
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslate, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Navigate after splash
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigation.replace('Login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigation, logoScale, logoOpacity, taglineOpacity, taglineTranslate]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Background circles */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />

      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={styles.logoFrame}>
          <Text style={styles.logoEmoji}>❄️</Text>
        </View>
        <Text style={styles.appName}>SummerFix</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.taglineContainer,
          { opacity: taglineOpacity, transform: [{ translateY: taglineTranslate }] },
        ]}
      >
        <Text style={styles.tagline}>Home Appliance Services</Text>
        <Text style={styles.subtitle}>Fast · Reliable · Affordable</Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by SummerFix Technologies</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  circle1: { width: 300, height: 300, top: -80, left: -80 },
  circle2: { width: 200, height: 200, bottom: 50, right: -60 },
  circle3: { width: 150, height: 150, top: height * 0.4, left: -50 },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  logoFrame: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoEmoji: { fontSize: 52 },
  appName: {
    fontSize: FONTS.sizes.hero,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 1,
  },
  taglineContainer: { alignItems: 'center' },
  tagline: {
    fontSize: FONTS.sizes.lg,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
    letterSpacing: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.5)',
  },
});

export default SplashScreen;
