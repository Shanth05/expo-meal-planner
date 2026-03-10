import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { DayPicker } from '../components/DayPicker';
import { colors, fonts, radii, spacing } from '../constants/theme';
import { DAYS } from '../utils/plan';

export function RecipeDetailScreen({
  completedDays,
  onAssignToDay,
  onBack,
  onRemoveFromDay,
  onToggleFavorite,
  planByDay,
  recipe,
  saved,
}) {
  function handleDayToggle(day) {
    if (planByDay[day] === recipe.id) {
      onRemoveFromDay(day);
      return;
    }

    onAssignToDay(day);
  }

  const assignedCount = DAYS.filter((day) => planByDay[day] === recipe.id).length;

  return (
    <View>
      <View style={styles.hero}>
        <Text style={styles.mealType}>{recipe.mealType}</Text>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.tagline}>{recipe.tagline}</Text>
        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{recipe.cookTime}</Text>
            <Text style={styles.metricLabel}>minutes</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{recipe.protein}g</Text>
            <Text style={styles.metricLabel}>protein</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{recipe.budget}</Text>
            <Text style={styles.metricLabel}>budget</Text>
          </View>
        </View>
        <View style={styles.actionRow}>
          <Pressable onPress={onToggleFavorite} style={[styles.actionButton, saved && styles.primaryAction]}>
            <Text style={[styles.actionText, saved && styles.primaryActionText]}>{saved ? 'Saved' : 'Save meal'}</Text>
          </Pressable>
          <Pressable onPress={onBack} style={styles.actionButton}>
            <Text style={styles.actionText}>Back</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Assign to your week</Text>
        <Text style={styles.sectionBody}>
          Tap a day to place this meal there. If another meal already exists on that day it will be replaced.
        </Text>
        <DayPicker completedDays={completedDays} onToggle={handleDayToggle} planByDay={planByDay} recipeId={recipe.id} />
        <Text style={styles.assignmentSummary}>
          {assignedCount > 0 ? `Currently scheduled on ${assignedCount} day(s).` : 'Not yet added to the plan.'}
        </Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredients.map((ingredient) => (
          <View key={`${recipe.id}-${ingredient.name}`} style={styles.listRow}>
            <View>
              <Text style={styles.listTitle}>{ingredient.name}</Text>
              <Text style={styles.listMeta}>{ingredient.aisle}</Text>
            </View>
            <Text style={styles.quantity}>{ingredient.quantity}</Text>
          </View>
        ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>How it comes together</Text>
        {recipe.steps.map((step, index) => (
          <View key={`${recipe.id}-step-${index}`} style={styles.stepRow}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  mealType: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.heading,
    fontSize: 30,
    lineHeight: 36,
  },
  tagline: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  metricCard: {
    backgroundColor: colors.paper,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minWidth: 92,
  },
  metricValue: {
    color: colors.ink,
    fontFamily: fonts.heading,
    fontSize: 26,
  },
  metricLabel: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  actionButton: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  primaryAction: {
    backgroundColor: colors.accent,
  },
  actionText: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  primaryActionText: {
    color: colors.paper,
  },
  panel: {
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
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  assignmentSummary: {
    color: colors.success,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    marginTop: spacing.md,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listTitle: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  listMeta: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    marginTop: 2,
  },
  quantity: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  stepNumberBadge: {
    backgroundColor: colors.forest,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: colors.paper,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
  },
});
