import React, { useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, shadows, spacing } from '../constants/theme';

export function RecipeCard({ recipe, saved, assignedDays, onOpen, onToggleFavorite }) {
  const [showActions, setShowActions] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  const swipeBgOpacity = translateX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 8 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5,
      onPanResponderMove: (_, gs) => {
        if (gs.dx < 0) {
          translateX.setValue(Math.max(gs.dx, -110));
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -60) {
          onToggleFavorite();
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.wrapper}>
      {/* Revealed when swiping left */}
      <Animated.View style={[styles.swipeBg, { opacity: swipeBgOpacity }]}>
        <Text style={styles.swipeBgText}>{saved ? '✓ Saved' : '♥ Save'}</Text>
      </Animated.View>

      <Animated.View
        style={[styles.card, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {/* Long press toggles quick action bar */}
        <Pressable
          onPress={onOpen}
          onLongPress={() => setShowActions((v) => !v)}
          delayLongPress={400}
          style={styles.body}
        >
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

        {showActions ? (
          /* Quick action bar shown on long press */
          <View style={styles.quickActions}>
            <Pressable
              onPress={() => { onToggleFavorite(); setShowActions(false); }}
              style={[styles.quickAction, saved && styles.quickActionSaved]}
            >
              <Text style={[styles.quickActionText, saved && styles.quickActionTextSaved]}>
                {saved ? '✓ Saved' : '♥ Save'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => { onOpen(); setShowActions(false); }}
              style={styles.quickAction}
            >
              <Text style={styles.quickActionText}>View →</Text>
            </Pressable>
            <Pressable
              onPress={() => setShowActions(false)}
              style={[styles.quickAction, styles.quickActionDismiss]}
            >
              <Text style={styles.quickActionText}>✕</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={onToggleFavorite}
            style={[styles.saveButton, saved && styles.saveButtonActive]}
          >
            <Text style={[styles.saveLabel, saved && styles.saveLabelActive]}>
              {saved ? 'Saved' : 'Save idea'}
            </Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  swipeBg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.accentDark,
    borderRadius: radii.lg,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: spacing.xl,
  },
  swipeBgText: {
    color: colors.paper,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.paper,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 5,
    borderLeftColor: colors.accent,
    ...shadows.soft,
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
    backgroundColor: colors.sky,
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
    color: colors.accentDark,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  title: {
    color: colors.forest,
    fontFamily: fonts.heading,
    fontSize: 26,
    lineHeight: 31,
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
    backgroundColor: colors.surfaceSoft,
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
    color: colors.forest,
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
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.accentDark,
    backgroundColor: colors.surfaceSoft,
  },
  quickActionSaved: {
    backgroundColor: colors.accentDark,
  },
  quickActionDismiss: {
    flex: 0,
    paddingHorizontal: spacing.md,
  },
  quickActionText: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  quickActionTextSaved: {
    color: colors.paper,
  },
  saveButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.accentDark,
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  saveButtonActive: {
    backgroundColor: colors.accentDark,
    borderColor: colors.accentDark,
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
