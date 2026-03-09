import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../utils/theme';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showCount?: boolean;
  count?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 16,
  interactive = false,
  onRate,
  showCount = false,
  count,
}) => {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  const renderStar = (index: number) => {
    const filled = index <= Math.floor(rating);
    const halfFilled = !filled && index === Math.ceil(rating) && rating % 1 !== 0;

    const symbol = filled ? '★' : halfFilled ? '⯨' : '☆';
    const color = filled || halfFilled ? COLORS.warning : COLORS.gray300;

    if (interactive) {
      return (
        <TouchableOpacity key={index} onPress={() => onRate?.(index)} activeOpacity={0.7}>
          <Text style={{ fontSize: size, color }}>{symbol}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <Text key={index} style={{ fontSize: size, color }}>
        {symbol}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.stars}>{stars.map(renderStar)}</View>
      {showCount && count !== undefined && (
        <Text style={[styles.count, { fontSize: size * 0.75 }]}>({count})</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  count: {
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
});

export default StarRating;
