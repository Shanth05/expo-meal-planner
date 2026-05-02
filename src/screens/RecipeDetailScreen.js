import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { DayPicker } from '../components/DayPicker';
import { recipeDetailStyles as styles } from '../styles';
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

