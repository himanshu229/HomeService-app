import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../../types';
import { COLORS, FONTS, RADIUS, SPACING } from '../../utils/theme';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import StarRating from '../../components/common/StarRating';
import { bookingAPI } from '../../services/bookingService';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Review'>;
  route: RouteProp<HomeStackParamList, 'Review'>;
};

const ReviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { bookingId, technicianId } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const QUICK_TAGS = ['Professional', 'On Time', 'Neat Work', 'Good Communication', 'Clean Service', 'Affordable'];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please give a star rating');
      return;
    }
    setLoading(true);
    try {
      const fullComment = [comment, selectedTags.length > 0 ? `Tags: ${selectedTags.join(', ')}` : '']
        .filter(Boolean)
        .join('\n');
      await bookingAPI.rateBooking(bookingId, { rating, comment: fullComment });
      setSubmitted(true);
    } catch {
      Alert.alert('Error', 'Could not submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🌟</Text>
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successText}>Your review has been submitted successfully.</Text>
          <Button title="Go to Home" onPress={() => navigation.popToTop()} size="lg" style={styles.btn} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header title="Rate & Review" showBack />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Technician avatar */}
        <View style={styles.techSection}>
          <View style={styles.techAvatar}>
            <Text style={styles.techAvatarText}>👨‍🔧</Text>
          </View>
          <Text style={styles.techLabel}>How was your experience?</Text>
        </View>

        {/* Star Rating */}
        <View style={styles.ratingSection}>
          <StarRating
            rating={rating}
            size={44}
            interactive
            onRate={setRating}
          />
          <Text style={styles.ratingHint}>
            {rating === 0 ? 'Tap to rate'
              : rating === 1 ? 'Poor 😞'
              : rating === 2 ? 'Fair 😐'
              : rating === 3 ? 'Good 🙂'
              : rating === 4 ? 'Great 😊'
              : 'Excellent! 🤩'}
          </Text>
        </View>

        {/* Quick Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Feedback</Text>
          <View style={styles.tagsGrid}>
            {QUICK_TAGS.map(tag => (
              <TouchableOpacity
                key={tag}
                style={[styles.tag, selectedTags.includes(tag) && styles.tagActive]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextActive]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Comment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Write a Review (Optional)</Text>
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="Share your experience with the technician..."
            placeholderTextColor={COLORS.gray400}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <Button
          title={loading ? 'Submitting...' : 'Submit Review'}
          onPress={handleSubmit}
          loading={loading}
          size="lg"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.xl },
  techSection: { alignItems: 'center', marginBottom: SPACING.xl },
  techAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  techAvatarText: { fontSize: 40 },
  techLabel: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text },
  ratingSection: { alignItems: 'center', marginBottom: SPACING.xl },
  ratingHint: { fontSize: FONTS.sizes.base, color: COLORS.textSecondary, marginTop: SPACING.md },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  tag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  tagActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  tagText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  tagTextActive: { color: COLORS.primary },
  commentInput: {
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: SPACING.base,
    fontSize: FONTS.sizes.base,
    color: COLORS.text,
    minHeight: 100,
  },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  successEmoji: { fontSize: 80, marginBottom: SPACING.xl },
  successTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '900', color: COLORS.text },
  successText: { fontSize: FONTS.sizes.base, color: COLORS.textSecondary, textAlign: 'center', marginVertical: SPACING.md },
  btn: { width: '100%', marginTop: SPACING.lg },
});

export default ReviewScreen;
