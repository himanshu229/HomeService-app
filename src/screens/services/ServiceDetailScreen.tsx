import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../../types';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../utils/theme';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import StarRating from '../../components/common/StarRating';
import { MOCK_REVIEWS, MOCK_TECHNICIANS } from '../../data/mockData';
import { useAppDispatch } from '../../store';
import { setSelectedService, addToRecentlyBooked } from '../../store/slices/servicesSlice';
import { updateBookingDraft } from '../../store/slices/bookingSlice';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'ServiceDetail'>;
  route: RouteProp<HomeStackParamList, 'ServiceDetail'>;
};

const ServiceDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { service } = route.params;
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');

  const technician = MOCK_TECHNICIANS[0];
  const reviews = MOCK_REVIEWS.filter(r => r.serviceId === service.id).slice(0, 3);

  const handleBookNow = () => {
    dispatch(setSelectedService(service));
    dispatch(addToRecentlyBooked(service));
    dispatch(updateBookingDraft({
      serviceId: service.id,
      serviceName: service.name,
      serviceCategory: service.category || '',
      price: service.price,
    }));
    navigation.navigate('Booking', { service });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header title={service.name} showBack />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.heroIconBg, { backgroundColor: COLORS.primary + '15' }]}>
            <Text style={styles.heroEmoji}>🔧</Text>
          </View>
          <View style={styles.heroInfo}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{service.category}</Text>
            </View>
            <Text style={styles.heroTitle}>{service.name}</Text>
            {service.rating && (
              <View style={styles.ratingRow}>
                <StarRating rating={service.rating} size={16} showCount count={service.reviewCount} />
              </View>
            )}
          </View>
        </View>

        {/* Price & Warranty strip */}
        <View style={styles.infoStrip}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>💰</Text>
            <Text style={styles.infoValue}>₹{service.price}</Text>
            <Text style={styles.infoLabel}>Starting from</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🛡️</Text>
            <Text style={styles.infoValue}>30 Days</Text>
            <Text style={styles.infoLabel}>Warranty</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['overview', 'reviews'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'reviews' && reviews.length > 0 ? ` (${reviews.length})` : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'overview' ? (
          <View style={styles.content}>
            {/* Description */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>About This Service</Text>
              <Text style={styles.description}>
                {service.description ||
                  `Professional ${service.name} by certified technicians. We cover all major brands including LG, Samsung, Voltas, Blue Star, Daikin, and more. Original spare parts with 30-day warranty on all repairs.`}
              </Text>
            </View>

            {/* What's included */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>What's Included</Text>
              {[
                '✅ Free diagnosis & inspection',
                '✅ Certified technician',
                '✅ Original spare parts',
                '✅ 30-day service warranty',
                '✅ Real-time tracking',
                '✅ Doorstep service',
              ].map((item, i) => (
                <Text key={i} style={styles.includedItem}>
                  {item}
                </Text>
              ))}
            </View>

            {/* Technician */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Assigned Technician</Text>
              <View style={styles.technicianRow}>
                <View style={styles.techAvatar}>
                  <Text style={styles.techAvatarText}>
                    {technician.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.techInfo}>
                  <Text style={styles.techName}>{technician.name}</Text>
                  <View style={styles.techMeta}>
                    <StarRating rating={technician.rating} size={13} showCount count={technician.reviewCount} />
                  </View>
                  <Text style={styles.techExp}>
                    {technician.experience} experience · {technician.specializations[0]}
                  </Text>
                </View>
                <TouchableOpacity style={styles.callBtn}>
                  <Text style={styles.callIcon}>📞</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            {/* Coming Soon */}
            <View style={styles.comingSoonContainer}>
              <Text style={styles.comingSoonEmoji}>🚀</Text>
              <Text style={styles.comingSoonTitle}>Coming Soon</Text>
              <Text style={styles.comingSoonSubtitle}>Reviews will be available shortly. Stay tuned!</Text>
            </View>

            {/* {reviews.length === 0 ? (
              <View style={styles.noReviews}>
                <Text style={styles.noReviewsEmoji}>⭐</Text>
                <Text style={styles.noReviewsText}>No reviews yet. Be the first!</Text>
              </View>
            ) : (
              reviews.map(review => (
                <View key={review.id} style={[styles.card, styles.reviewCard]}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewAvatar}>
                      <Text style={styles.reviewAvatarText}>{review.userName.charAt(0)}</Text>
                    </View>
                    <View style={styles.reviewInfo}>
                      <Text style={styles.reviewerName}>{review.userName}</Text>
                      <StarRating rating={review.rating} size={13} />
                    </View>
                    <Text style={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))
            )} */}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPrice}>
          <Text style={styles.bottomPriceLabel}>Starting at</Text>
          <Text style={styles.bottomPriceValue}>₹{service.price}</Text>
        </View>
        <View style={styles.bottomBtn}>
          <Button title="Book Now" onPress={handleBookNow} size="lg" fullWidth />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: {
    flexDirection: 'row',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    gap: SPACING.base,
  },
  heroIconBg: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: { fontSize: 40 },
  heroInfo: { flex: 1 },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    marginBottom: 4,
  },
  categoryText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '600' },
  heroTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.xs },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  infoStrip: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginTop: SPACING.xs,
    paddingVertical: SPACING.base,
    justifyContent: 'space-around',
  },
  infoItem: { alignItems: 'center', flex: 1 },
  infoIcon: { fontSize: 20, marginBottom: 4 },
  infoValue: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.text },
  infoLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  infoDivider: { width: 1, backgroundColor: COLORS.divider },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },
  content: { padding: SPACING.xl },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  cardTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  description: { fontSize: FONTS.sizes.base, color: COLORS.textSecondary, lineHeight: 22 },
  includedItem: { fontSize: FONTS.sizes.sm, color: COLORS.text, lineHeight: 26 },
  technicianRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  techAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  techAvatarText: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary },
  techInfo: { flex: 1 },
  techName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  techMeta: { marginVertical: 2 },
  techExp: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callIcon: { fontSize: 18 },
  reviewCard: {},
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, gap: SPACING.sm },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.secondary },
  reviewInfo: { flex: 1 },
  reviewerName: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.text },
  reviewDate: { fontSize: FONTS.sizes.xs, color: COLORS.textLight },
  reviewComment: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
  noReviews: { alignItems: 'center', paddingVertical: SPACING.xxl },
  noReviewsEmoji: { fontSize: 48, marginBottom: SPACING.md },
  noReviewsText: { fontSize: FONTS.sizes.base, color: COLORS.textSecondary },  comingSoonContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  comingSoonEmoji: { fontSize: 48, marginBottom: SPACING.md },
  comingSoonTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  comingSoonSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  bottomPrice: { marginRight: SPACING.xl },
  bottomPriceLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  bottomPriceValue: { fontSize: FONTS.sizes.xxl, fontWeight: '900', color: COLORS.primary },
  bottomBtn: { flex: 1 },
});

export default ServiceDetailScreen;
