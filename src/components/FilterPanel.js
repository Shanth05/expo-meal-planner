import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { colors } from '../constants/theme';
import { filterPanelStyles as styles } from '../styles';

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

