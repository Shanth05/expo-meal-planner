import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '../constants/theme';
import { buildShoppingList, buildWeeklyStats, DAYS, getRecipeById } from '../utils/plan';

export function PlanScreen({
  completedDays,
  onClearDay,
  onOpenPantry,
  onOpenRecipe,
  onResetWeek,
  onToggleCompletedDay,
  pantry,
  planByDay,
  recipes,
}) {
  const weeklyStats = buildWeeklyStats(planByDay, recipes, completedDays);
  const shoppingList = buildShoppingList(planByDay, recipes, pantry);

  return (
    <View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>This week at a glance</Text>
        <Text style={styles.summaryBody}>
          Keep the plan realistic: fill the week, track what is cooked, and let the shopping list focus only on what
          is not already in the pantry.
        </Text>
        <View style={styles.metricRow}>
          <View style={styles.metricTile}>
            <Text style={styles.metricValue}>{weeklyStats.plannedCount}</Text>
            <Text style={styles.metricLabel}>scheduled meals</Text>
          </View>
          <View style={styles.metricTile}>
            <Text style={styles.metricValue}>{weeklyStats.completedCount}</Text>
            <Text style={styles.metricLabel}>days completed</Text>
          </View>
          <View style={styles.metricTile}>
            <Text style={styles.metricValue}>{weeklyStats.totalBudget}</Text>
            <Text style={styles.metricLabel}>budget points</Text>
          </View>
          <View style={styles.metricTile}>
            <Text style={styles.metricValue}>{weeklyStats.totalProtein}g</Text>
            <Text style={styles.metricLabel}>weekly protein</Text>
          </View>
        </View>
        <Pressable onPress={onResetWeek} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Reset week</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Day-by-day plan</Text>
        {DAYS.map((day) => {
          const recipe = getRecipeById(recipes, planByDay[day]);
          const completed = Boolean(completedDays[day]);
          return (
            <View key={day} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>{day}</Text>
                {recipe ? (
                  <Text style={styles.dayMeta}>{completed ? 'Cooked' : 'Planned'}</Text>
                ) : (
                  <Text style={styles.dayMeta}>Open slot</Text>
                )}
              </View>

              {recipe ? (
                <>
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  <Text style={styles.recipeMeta}>
                    {recipe.cookTime} minutes, {recipe.protein}g protein, {recipe.diet}
                  </Text>
                  <View style={styles.dayActions}>
                    <Pressable onPress={() => onOpenRecipe(recipe.id)} style={styles.primaryButton}>
                      <Text style={styles.primaryButtonText}>View</Text>
                    </Pressable>
                    <Pressable onPress={() => onToggleCompletedDay(day)} style={styles.secondaryButtonSmall}>
                      <Text style={styles.secondaryButtonText}>{completed ? 'Undo cooked' : 'Mark cooked'}</Text>
                    </Pressable>
                    <Pressable onPress={() => onClearDay(day)} style={styles.ghostButton}>
                      <Text style={styles.ghostButtonText}>Remove</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <Text style={styles.emptyDayText}>Choose a recipe from the library to fill this slot.</Text>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <View style={styles.shoppingHeader}>
          <View>
            <Text style={styles.sectionTitle}>Auto shopping list</Text>
            <Text style={styles.sectionBody}>
              Generated from all meals currently pinned to the week. Stocked pantry items stay visible but drop to the
              bottom.
            </Text>
          </View>
          <Pressable onPress={onOpenPantry} style={styles.secondaryButtonSmall}>
            <Text style={styles.secondaryButtonText}>Manage pantry</Text>
          </Pressable>
        </View>

        {shoppingList.length === 0 ? (
          <Text style={styles.emptyDayText}>Add at least one recipe to see a generated shopping list.</Text>
        ) : (
          shoppingList.map((item) => (
            <View key={item.key} style={styles.shoppingItem}>
              <View style={styles.shoppingCopy}>
                <Text style={styles.shoppingName}>{item.name}</Text>
                <Text style={styles.shoppingMeta}>
                  {item.aisle} | {item.quantityNotes.join(', ')}
                </Text>
                <Text style={styles.shoppingRecipes}>Needed for {item.recipes.join(', ')}</Text>
              </View>
              <Text style={[styles.shoppingStatus, item.isInPantry && styles.shoppingStatusMuted]}>
                {item.isInPantry ? 'In pantry' : 'Buy'}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    color: colors.ink,
    fontFamily: fonts.heading,
    fontSize: 28,
  },
  summaryBody: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    marginTop: spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  metricTile: {
    backgroundColor: colors.paper,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minWidth: 130,
  },
  metricValue: {
    color: colors.ink,
    fontFamily: fonts.heading,
    fontSize: 24,
  },
  metricLabel: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  section: {
    backgroundColor: colors.paper,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: fonts.heading,
    fontSize: 24,
  },
  sectionBody: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  dayCard: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.lg,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  dayName: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  dayMeta: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
  },
  recipeTitle: {
    color: colors.ink,
    fontFamily: fonts.heading,
    fontSize: 22,
    marginTop: spacing.sm,
  },
  recipeMeta: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  emptyDayText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  dayActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  primaryButtonText: {
    color: colors.paper,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  secondaryButton: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.lg,
  },
  secondaryButtonSmall: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  secondaryButtonText: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  ghostButton: {
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  ghostButtonText: {
    color: colors.muted,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  shoppingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  shoppingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  shoppingCopy: {
    flex: 1,
  },
  shoppingName: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  shoppingMeta: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    marginTop: 4,
  },
  shoppingRecipes: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  shoppingStatus: {
    color: colors.paper,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  shoppingStatusMuted: {
    backgroundColor: colors.success,
  },
});
