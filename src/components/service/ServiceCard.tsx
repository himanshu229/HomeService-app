import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../utils/theme';
import { ServiceItem } from '../../types';
import StarRating from '../common/StarRating';

interface ServiceCardProps {
  service: ServiceItem;
  onPress: () => void;
  style?: ViewStyle;
  horizontal?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress, style, horizontal = false }) => {
  if (horizontal) {
    return (
      <TouchableOpacity style={[styles.horizontalCard, style]} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.horizontalContent}>
          <View style={styles.horizontalLeft}>
            <Text style={styles.serviceName}>{service.name}</Text>
            {service.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{service.category}</Text>
              </View>
            )}
            {service.rating && (
              <View style={styles.ratingRow}>
                <StarRating rating={service.rating} size={13} showCount count={service.reviewCount} />
              </View>
            )}
            <View style={styles.metaRow}>
              <Text style={styles.duration}>⏱ {service.duration}</Text>
            </View>
          </View>
          <View style={styles.horizontalRight}>
            <Text style={styles.price}>
              <Text style={styles.priceSymbol}>₹</Text>
              {service.price}
            </Text>
            <Text style={styles.priceLabel}>onwards</Text>
            <TouchableOpacity style={styles.bookBtn} onPress={onPress} activeOpacity={0.8}>
              <Text style={styles.bookBtnText}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.8}>
      {service.isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>🔥 Popular</Text>
        </View>
      )}
      <Text style={styles.emoji}>🔧</Text>
      <Text style={styles.cardServiceName} numberOfLines={2}>
        {service.name}
      </Text>
      {service.rating && (
        <View style={styles.ratingRow}>
          <StarRating rating={service.rating} size={12} />
          <Text style={styles.ratingText}>{service.rating}</Text>
        </View>
      )}
      <View style={styles.cardBottom}>
        <Text style={styles.cardPrice}>₹{service.price}</Text>
        <Text style={styles.cardDuration}>{service.duration}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Vertical card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    width: 150,
    ...SHADOWS.md,
    marginRight: SPACING.md,
  },
  popularBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight + '20',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  popularText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  emoji: { fontSize: 28, marginBottom: SPACING.xs },
  cardServiceName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  ratingText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  cardPrice: {
    fontSize: FONTS.sizes.md,
    fontWeight: '800',
    color: COLORS.primary,
  },
  cardDuration: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
  },
  // Horizontal card
  horizontalCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  horizontalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  horizontalLeft: { flex: 1, marginRight: SPACING.md },
  horizontalRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  serviceName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  categoryText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.xs },
  duration: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  price: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.primary },
  priceSymbol: { fontSize: FONTS.sizes.md },
  priceLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textLight, marginBottom: SPACING.xs },
  bookBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  bookBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.sm },
});

export default ServiceCard;
