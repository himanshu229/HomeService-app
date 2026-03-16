import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../utils/theme';
import { ServiceCategory } from '../../types';

interface CategoryCardProps {
  category: ServiceCategory;
  onPress: () => void;
  style?: ViewStyle;
  compact?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress, style, compact = false }) => {
  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, { backgroundColor: category.bgColor }, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.compactEmoji}>{category.emoji}</Text>
        <Text style={[styles.compactName, { color: category.color }]} numberOfLines={2}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.card, SHADOWS.md, style]} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.emojiContainer, { backgroundColor: category.bgColor }]}>
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{category.name}</Text>
        <Text style={styles.count}>{(category.serviceCount ?? category.services.length)} services</Text>
      </View>
      <View style={[styles.arrow, { backgroundColor: category.color + '15' }]}>
        <Text style={[styles.arrowText, { color: category.color }]}>→</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  emojiContainer: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  emoji: { fontSize: 28 },
  info: { flex: 1 },
  name: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  count: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: { fontSize: FONTS.sizes.lg, fontWeight: '700' },
  // Compact
  compactCard: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  compactEmoji: { fontSize: 28 },
  compactName: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default CategoryCard;
