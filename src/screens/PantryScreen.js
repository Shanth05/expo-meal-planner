import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts, radii, shadows, spacing } from '../constants/theme';
import { buildShoppingList, getUniqueIngredients } from '../utils/plan';

const FILTERS = ['All', 'Needed', 'Stocked'];

export function PantryScreen({ onOpenPlan, onTogglePantryItem, pantry, planByDay, recipes }) {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('All');

  const shoppingList = buildShoppingList(planByDay, recipes, pantry);
  const neededKeys = shoppingList.map((item) => item.key);

  const ingredients = getUniqueIngredients(recipes)
    .map((ingredient) => ({
      ...ingredient,
      isInPantry: Boolean(pantry[ingredient.key]),
      neededThisWeek: neededKeys.includes(ingredient.key),
    }))
    .filter((ingredient) => ingredient.name.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((ingredient) => {
      if (filterMode === 'Needed') {
        return ingredient.neededThisWeek;
      }
      if (filterMode === 'Stocked') {
        return ingredient.isInPantry;
      }
      return true;
    })
    .sort((left, right) => {
      if (left.neededThisWeek !== right.neededThisWeek) {
        return left.neededThisWeek ? -1 : 1;
      }
      if (left.isInPantry !== right.isInPantry) {
        return left.isInPantry ? 1 : -1;
      }
      return left.name.localeCompare(right.name);
    });

  return (
    <View>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Pantry tracker</Text>
        <Text style={styles.body}>
          Mark what you already have at home. The weekly shopping list uses this to separate true purchases from items
          you can skip.
        </Text>
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerValue}>{shoppingList.filter((item) => !item.isInPantry).length}</Text>
            <Text style={styles.headerLabel}>still to buy</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerValue}>{Object.values(pantry).filter(Boolean).length}</Text>
            <Text style={styles.headerLabel}>stocked items</Text>
          </View>
        </View>
        <Pressable onPress={onOpenPlan} style={styles.planButton}>
          <Text style={styles.planButtonText}>Back to week plan</Text>
        </Pressable>
      </View>

      <View style={styles.controlsCard}>
        <TextInput
          onChangeText={setSearch}
          placeholder="Search ingredients"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={search}
        />
        <View style={styles.filterRow}>
          {FILTERS.map((filterModeOption) => {
            const active = filterModeOption === filterMode;
            return (
              <Pressable
                key={filterModeOption}
                onPress={() => setFilterMode(filterModeOption)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{filterModeOption}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.listCard}>
        {ingredients.map((ingredient) => (
          <Pressable
            key={ingredient.key}
            onPress={() => onTogglePantryItem(ingredient.key)}
            style={[
              styles.ingredientRow,
              ingredient.neededThisWeek && styles.ingredientRowNeeded,
              ingredient.isInPantry && styles.ingredientRowStocked,
            ]}
          >
            <View style={styles.ingredientCopy}>
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
              <Text style={styles.ingredientMeta}>
                {ingredient.aisle} {ingredient.neededThisWeek ? '| used this week' : '| optional'}
              </Text>
            </View>
            <Text
              style={[
                styles.ingredientStatus,
                ingredient.isInPantry ? styles.ingredientStatusStocked : styles.ingredientStatusMissing,
              ]}
            >
              {ingredient.isInPantry ? 'Stocked' : 'Missing'}
            </Text>
          </Pressable>
        ))}
        {ingredients.length === 0 ? (
          <Text style={styles.emptyText}>No pantry items match the current search or filter.</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: colors.paper,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.soft,
  },
  title: {
    color: colors.forest,
    fontFamily: fonts.heading,
    fontSize: 28,
  },
  body: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    marginTop: spacing.sm,
  },
  headerStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  headerStat: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerValue: {
    color: colors.ink,
    fontFamily: fonts.heading,
    fontSize: 24,
  },
  headerLabel: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  planButton: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    backgroundColor: colors.accentDark,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.lg,
  },
  planButtonText: {
    color: colors.paper,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  controlsCard: {
    backgroundColor: colors.paper,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.soft,
  },
  searchInput: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 15,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  filterChip: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.accent,
  },
  filterLabel: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  filterLabelActive: {
    color: colors.paper,
  },
  listCard: {
    backgroundColor: colors.paper,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.soft,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ingredientRowNeeded: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    paddingLeft: spacing.md,
  },
  ingredientRowStocked: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
  },
  ingredientCopy: {
    flex: 1,
  },
  ingredientName: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  ingredientMeta: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    marginTop: 4,
  },
  ingredientStatus: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  ingredientStatusStocked: {
    color: colors.success,
  },
  ingredientStatusMissing: {
    color: colors.danger,
  },
  emptyText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
