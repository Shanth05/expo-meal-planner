import React, { useEffect, useReducer, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import recipes from './src/data/recipes.json';
import { colors, fonts, radii, shadows, spacing } from './src/constants/theme';
import { TabBar } from './src/components/TabBar';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { RecipeDetailScreen } from './src/screens/RecipeDetailScreen';
import { PlanScreen } from './src/screens/PlanScreen';
import { PantryScreen } from './src/screens/PantryScreen';
import { buildShoppingList, buildWeeklyStats, getRecipeById } from './src/utils/plan';
import { loadStoredState, saveStoredState } from './src/utils/storage';

const DEFAULT_STATE = {
  favorites: [],
  planByDay: {},
  completedDays: {},
  pantry: {},
};

const TABS = [
  { key: 'library', label: 'Recipes' },
  { key: 'plan', label: 'Week Plan' },
  { key: 'pantry', label: 'Pantry' },
];

function appReducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return {
        favorites: Array.isArray(action.payload.favorites) ? action.payload.favorites : [],
        planByDay: action.payload.planByDay && typeof action.payload.planByDay === 'object' ? action.payload.planByDay : {},
        completedDays:
          action.payload.completedDays && typeof action.payload.completedDays === 'object'
            ? action.payload.completedDays
            : {},
        pantry: action.payload.pantry && typeof action.payload.pantry === 'object' ? action.payload.pantry : {},
      };
    case 'toggle_favorite': {
      const exists = state.favorites.includes(action.recipeId);
      return {
        ...state,
        favorites: exists
          ? state.favorites.filter((recipeId) => recipeId !== action.recipeId)
          : [...state.favorites, action.recipeId],
      };
    }
    case 'assign_recipe': {
      const nextPlan = {
        ...state.planByDay,
        [action.day]: action.recipeId,
      };
      const nextCompleted = {
        ...state.completedDays,
        [action.day]: false,
      };
      return {
        ...state,
        planByDay: nextPlan,
        completedDays: nextCompleted,
      };
    }
    case 'remove_day': {
      const nextPlan = { ...state.planByDay };
      const nextCompleted = { ...state.completedDays };
      delete nextPlan[action.day];
      delete nextCompleted[action.day];
      return {
        ...state,
        planByDay: nextPlan,
        completedDays: nextCompleted,
      };
    }
    case 'toggle_completed_day':
      return {
        ...state,
        completedDays: {
          ...state.completedDays,
          [action.day]: !state.completedDays[action.day],
        },
      };
    case 'toggle_pantry_item':
      return {
        ...state,
        pantry: {
          ...state.pantry,
          [action.itemKey]: !state.pantry[action.itemKey],
        },
      };
    case 'reset_week':
      return {
        ...state,
        planByDay: {},
        completedDays: {},
      };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(appReducer, DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeScreen, setActiveScreen] = useState('library');
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [detailReturnScreen, setDetailReturnScreen] = useState('library');

  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      const storedState = await loadStoredState(DEFAULT_STATE);
      if (!isMounted) {
        return;
      }
      dispatch({ type: 'hydrate', payload: storedState });
      setIsHydrated(true);
    }

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    saveStoredState(state);
  }, [isHydrated, state]);

  const weeklyStats = buildWeeklyStats(state.planByDay, recipes, state.completedDays);
  const shoppingList = buildShoppingList(state.planByDay, recipes, state.pantry);
  const selectedRecipe = getRecipeById(recipes, selectedRecipeId);

  function openRecipe(recipeId, returnScreen) {
    setSelectedRecipeId(recipeId);
    setDetailReturnScreen(returnScreen);
    setActiveScreen('detail');
  }

  function goBackFromDetail() {
    setActiveScreen(detailReturnScreen);
    setSelectedRecipeId(null);
  }

  function renderMainScreen() {
    if (!isHydrated) {
      return (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading your saved week...</Text>
        </View>
      );
    }

    if (activeScreen === 'detail' && selectedRecipe) {
      return (
        <RecipeDetailScreen
          completedDays={state.completedDays}
          onAssignToDay={(day) => dispatch({ type: 'assign_recipe', day, recipeId: selectedRecipe.id })}
          onBack={goBackFromDetail}
          onRemoveFromDay={(day) => dispatch({ type: 'remove_day', day })}
          onToggleFavorite={() => dispatch({ type: 'toggle_favorite', recipeId: selectedRecipe.id })}
          planByDay={state.planByDay}
          recipe={selectedRecipe}
          saved={state.favorites.includes(selectedRecipe.id)}
        />
      );
    }

    if (activeScreen === 'plan') {
      return (
        <PlanScreen
          completedDays={state.completedDays}
          onClearDay={(day) => dispatch({ type: 'remove_day', day })}
          onOpenPantry={() => setActiveScreen('pantry')}
          onOpenRecipe={(recipeId) => openRecipe(recipeId, 'plan')}
          onResetWeek={() => dispatch({ type: 'reset_week' })}
          onToggleCompletedDay={(day) => dispatch({ type: 'toggle_completed_day', day })}
          pantry={state.pantry}
          planByDay={state.planByDay}
          recipes={recipes}
        />
      );
    }

    if (activeScreen === 'pantry') {
      return (
        <PantryScreen
          onOpenPlan={() => setActiveScreen('plan')}
          onTogglePantryItem={(itemKey) => dispatch({ type: 'toggle_pantry_item', itemKey })}
          pantry={state.pantry}
          planByDay={state.planByDay}
          recipes={recipes}
        />
      );
    }

    return (
      <LibraryScreen
        favorites={state.favorites}
        onOpenRecipe={(recipeId) => openRecipe(recipeId, 'library')}
        onToggleFavorite={(recipeId) => dispatch({ type: 'toggle_favorite', recipeId })}
        planByDay={state.planByDay}
        recipes={recipes}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.backgroundShapeOne} />
      <View style={styles.backgroundShapeTwo} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>LECTURE FUEL</Text>
          <Text style={styles.heroTitle}>Turn quick recipe data into a realistic student meal plan.</Text>
          <Text style={styles.heroBody}>
            Browse the recipe library, sort and filter it, pin meals to days, then let the app build a shopping list
            from your chosen week.
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{weeklyStats.plannedCount}/7</Text>
              <Text style={styles.statLabel}>days planned</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{weeklyStats.totalMinutes}</Text>
              <Text style={styles.statLabel}>total minutes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{shoppingList.filter((item) => !item.isInPantry).length}</Text>
              <Text style={styles.statLabel}>items to buy</Text>
            </View>
          </View>
        </View>

        <View style={styles.workspace}>
          {activeScreen === 'detail' ? (
            <Pressable onPress={goBackFromDetail} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back to {detailReturnScreen === 'plan' ? 'week plan' : 'recipes'}</Text>
            </Pressable>
          ) : (
            <TabBar activeTab={activeScreen} onChange={setActiveScreen} tabs={TABS} />
          )}
          {renderMainScreen()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  backgroundShapeOne: {
    position: 'absolute',
    top: -90,
    right: -40,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: colors.sun,
    opacity: 0.32,
  },
  backgroundShapeTwo: {
    position: 'absolute',
    bottom: 60,
    left: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.rose,
    opacity: 0.34,
  },
  heroCard: {
    backgroundColor: colors.paper,
    borderRadius: radii.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  eyebrow: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    color: colors.ink,
    fontFamily: fonts.heading,
    fontSize: 31,
    lineHeight: 38,
  },
  heroBody: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.md,
    maxWidth: 720,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  statCard: {
    minWidth: 120,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  statValue: {
    color: colors.ink,
    fontFamily: fonts.heading,
    fontSize: 28,
  },
  statLabel: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: 4,
  },
  workspace: {
    marginTop: spacing.xl,
    backgroundColor: colors.paper,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.soft,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  backButtonText: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  loadingState: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 15,
    marginTop: spacing.md,
  },
});
