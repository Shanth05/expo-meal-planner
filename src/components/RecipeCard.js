import React, { useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, Text, View } from 'react-native';
import { recipeCardStyles as styles } from '../styles';

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

