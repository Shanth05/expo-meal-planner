import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '../constants/theme';

export function RecipeCard({ recipe, saved, assignedDays, onOpen, onToggleFavorite }) {
  return (
    <View style={styles.card}>
      <Pressable onPress={onOpen} style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{recipe.mealType}</Text>
          </View>
          <Text style={styles.ratingText}>{recipe.rating.toFixed(1)} rating</Text>
        </View>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.tagline}>{recipe.tagline}</Text>
        <View style={styles.factRow}>
          <Text style={styles.factText}>{recipe.cookTime} min</Text>
          <Text style={styles.factText}>Budget {recipe.budget}</Text>
          <Text style={styles.factText}>{recipe.protein}g protein</Text>
        </View>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{recipe.diet}</Text>
          </View>
          {recipe.tags.slice(0, 2).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        {assignedDays.length > 0 ? (
          <Text style={styles.assignmentText}>Assigned to {assignedDays.join(', ')}</Text>
        ) : (
          <Text style={styles.assignmentTextMuted}>Not yet in your weekly plan</Text>
        )}
      </Pressable>
      <Pressable onPress={onToggleFavorite} style={[styles.saveButton, saved && styles.saveButtonActive]}>
        <Text style={[styles.saveLabel, saved && styles.saveLabelActive]}>{saved ? 'Saved' : 'Save idea'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  body: {
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.paper,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  badgeText: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  ratingText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.heading,
    fontSize: 24,
    lineHeight: 29,
  },
  tagline: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  factRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  factText: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  tagText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  assignmentText: {
    color: colors.success,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  assignmentTextMuted: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  saveButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  saveButtonActive: {
    backgroundColor: colors.accent,
  },
  saveLabel: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  saveLabelActive: {
    color: colors.paper,
  },
});
