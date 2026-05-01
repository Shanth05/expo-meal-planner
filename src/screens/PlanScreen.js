import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { planStyles as styles } from '../styles';
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
          <View style={styles.shoppingTextBlock}>
            <Text style={styles.sectionTitle}>Auto shopping list</Text>
            <Text style={styles.sectionBody}>
              Generated from your pinned meals. Pantry items drop to the bottom.
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

