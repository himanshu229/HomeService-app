import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../utils/theme';
import { TIME_SLOTS } from '../../utils/constants';

interface TimeSlotPickerProps {
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
  availableSlots?: string[];
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedSlot,
  onSelectSlot,
  availableSlots = TIME_SLOTS,
}) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Select Time Slot</Text>
      <View style={styles.grid}>
        {availableSlots.map(slot => {
          const isSelected = selectedSlot === slot;
          return (
            <TouchableOpacity
              key={slot}
              style={[styles.slot, isSelected && styles.slotSelected]}
              onPress={() => onSelectSlot(slot)}
              activeOpacity={0.7}
            >
              <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>
                {slot}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  slot: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  slotSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  slotText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.text,
  },
  slotTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default TimeSlotPicker;
