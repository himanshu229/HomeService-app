import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList, ServiceItem } from '../../types';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../utils/theme';
import { SERVICE_CATEGORIES } from '../../utils/constants';
import { MOCK_POPULAR_SERVICES } from '../../data/mockData';
import CategoryCard from '../../components/service/CategoryCard';
import ServiceCard from '../../components/service/ServiceCard';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSearchQuery, searchServices } from '../../store/slices/servicesSlice';

const { width: _width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { searchQuery, searchResults, recentlyBooked } = useAppSelector(state => state.services);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (text: string) => {
    dispatch(setSearchQuery(text));
    if (text.trim().length > 1) {
      dispatch(searchServices(text.trim()));
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };


  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        {/* Header */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>{greeting()}, {user?.name?.split(' ')[0] || 'Friend'} 👋</Text>
            <TouchableOpacity style={styles.locationRow} activeOpacity={0.7}>
              <Text style={styles.locationPin}>📍</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {user?.addresses?.[0]?.city || 'Select Location'}
              </Text>
              <Text style={styles.locationArrow}>▼</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.8}>
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, isSearchFocused && styles.searchFocused]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search AC repair, fridge, fan..."
              placeholderTextColor={COLORS.gray400}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => { dispatch(setSearchQuery('')); }}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search Results */}
        {searchQuery.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {searchResults.length === 0 ? (
              <Text style={styles.noResults}>No services found for "{searchQuery}"</Text>
            ) : (
              searchResults.slice(0, 5).map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  horizontal
                  onPress={() =>
                    navigation.navigate('ServiceDetail', { serviceId: service.id, service })
                  }
                />
              ))
            )}
          </View>
        )}

        {!searchQuery && (
          <>
            {/* Quick Categories */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Our Services</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ServiceCategories')}>
                  <Text style={styles.seeAll}>See All →</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
                {SERVICE_CATEGORIES.map(cat => (
                  <CategoryCard
                    key={cat.id}
                    category={cat as any}
                    compact
                    onPress={() =>
                      navigation.navigate('ServiceList', {
                        categoryId: cat.id,
                        categoryName: cat.name,
                      })
                    }
                  />
                ))}
              </ScrollView>
            </View>

            {/* Popular Services */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔥 Popular Services</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ServiceCategories')}>
                  <Text style={styles.seeAll}>See All →</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={MOCK_POPULAR_SERVICES}
                keyExtractor={s => s.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: SPACING.xl }}
                renderItem={({ item }) => (
                  <ServiceCard
                    service={item}
                    onPress={() =>
                      navigation.navigate('ServiceDetail', { serviceId: item.id, service: item })
                    }
                  />
                )}
              />
            </View>

            {/* Recently Booked */}
            {recentlyBooked.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recently Booked</Text>
                {recentlyBooked.slice(0, 3).map(service => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    horizontal
                    onPress={() =>
                      navigation.navigate('ServiceDetail', { serviceId: service.id, service })
                    }
                    style={styles.horizontalCardMargin}
                  />
                ))}
              </View>
            )}

            {/* Why SummerFix */}
            <View style={[styles.section, styles.whySection]}>
              <Text style={[styles.sectionTitle, { color: COLORS.white }]}>Why SummerFix?</Text>
              <View style={styles.perksGrid}>
                {[
                  { emoji: '✅', text: 'Certified\nTechnicians' },
                  { emoji: '⚡', text: '60-min\nResponse' },
                  { emoji: '🛡️', text: '30-Day\nWarranty' },
                  { emoji: '💰', text: 'Best\nPrices' },
                ].map((p, i) => (
                  <View key={i} style={styles.perk}>
                    <Text style={styles.perkEmoji}>{p.emoji}</Text>
                    <Text style={styles.perkText}>{p.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  greeting: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  locationPin: { fontSize: 13 },
  locationText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    maxWidth: 180,
    marginHorizontal: 2,
  },
  locationArrow: { fontSize: 10, color: COLORS.primary },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: { fontSize: 20 },
  searchContainer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.base,
    height: 48,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  searchFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  searchIcon: { fontSize: 18, marginRight: SPACING.sm },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.base,
    color: COLORS.text,
  },
  clearIcon: { fontSize: 16, color: COLORS.textLight, padding: SPACING.xs },
  section: { marginTop: SPACING.lg, paddingHorizontal: SPACING.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  seeAll: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '600' },
  categoriesRow: { paddingRight: SPACING.xl },
  // Why section
  whySection: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
  },
  perksGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
  },
  perk: { alignItems: 'center', width: '22%' },
  perkEmoji: { fontSize: 28, marginBottom: 4 },
  perkText: { fontSize: FONTS.sizes.xs, color: COLORS.white, textAlign: 'center', lineHeight: 16 },
  noResults: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SPACING.xl,
  },
  horizontalCardMargin: { marginHorizontal: 0 },
  bottomPad: { height: SPACING.xl },
});

export default HomeScreen;
