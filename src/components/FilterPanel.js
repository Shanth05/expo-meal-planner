import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts, radii, spacing } from '../constants/theme';

function OptionRow({ label, options, selected, onChange }) {
  return (
    <View style={styles.optionGroup}>
      <Text style={styles.optionLabel}>{label}</Text>
      <View style={styles.optionRow}>
        {options.map((option) => {
          const active = option === selected;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={[styles.optionChip, active && styles.optionChipActive]}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function FilterPanel({
  diet,
  diets,
  filteredCount,
  mealType,
  mealTypes,
  onDietChange,
  onMealTypeChange,
  onSearchChange,
  onSortChange,
  search,
  sortBy,
  sortOptions,
  totalCount,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Library</Text>
      <Text style={styles.caption}>
        {filteredCount} of {totalCount} recipes match your current filters.
      </Text>
      <TextInput
        onChangeText={onSearchChange}
        placeholder="Search by title, tag or ingredient"
        placeholderTextColor={colors.muted}
        style={styles.searchInput}
        value={search}
      />
      <OptionRow label="Meal type" onChange={onMealTypeChange} options={mealTypes} selected={mealType} />
      <OptionRow label="Diet" onChange={onDietChange} options={diets} selected={diet} />
      <OptionRow label="Sort" onChange={onSortChange} options={sortOptions} selected={sortBy} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.heading,
    fontSize: 26,
  },
  caption: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    marginTop: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.paper,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 15,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  optionGroup: {
    marginTop: spacing.lg,
  },
  optionLabel: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionChip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  optionChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  optionText: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  optionTextActive: {
    color: colors.paper,
  },
});
