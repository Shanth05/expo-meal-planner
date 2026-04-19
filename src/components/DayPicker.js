import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '../constants/theme';

export function DayPicker({ completedDays, onToggle, planByDay, recipeId }) {
  return (
    <View style={styles.container}>
      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
        const selected = planByDay[day] === recipeId;
        const completed = completedDays[day] && selected;
        return (
          <Pressable
            key={day}
            onPress={() => onToggle(day)}
            style={[styles.chip, selected && styles.chipSelected, completed && styles.chipCompleted]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{day.slice(0, 3)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  chip: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minWidth: 64,
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: colors.accentDark,
    borderColor: colors.accentDark,
  },
  chipCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  label: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  labelSelected: {
    color: colors.paper,
  },
});
