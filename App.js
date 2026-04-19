import React, { useEffect, useReducer, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
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
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { buildShoppingList, buildWeeklyStats, getRecipeById } from './src/utils/plan';
import { loadStoredState, saveStoredState } from './src/utils/storage';
import { FavoritesScreen } from './src/screens/FavoritesScreen';

const DEFAULT_STATE = {
  favorites: [],
  planByDay: {},
  completedDays: {},
  pantry: {},
};

const TABS = [
  { key: 'library', label: 'Recipes' },
  { key: 'saved', label: 'Saved' },
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
      const nextPlan = { ...state.planByDay, [action.day]: action.recipeId };
      const nextCompleted = { ...state.completedDays, [action.day]: false };
      return { ...state, planByDay: nextPlan, completedDays: nextCompleted };
    }
    case 'remove_day': {
      const nextPlan = { ...state.planByDay };
      const nextCompleted = { ...state.completedDays };
      delete nextPlan[action.day];
      delete nextCompleted[action.day];
      return { ...state, planByDay: nextPlan, completedDays: nextCompleted };
    }
    case 'toggle_completed_day':
      return {
        ...state,
        completedDays: { ...state.completedDays, [action.day]: !state.completedDays[action.day] },
      };
    case 'toggle_pantry_item':
      return {
        ...state,
        pantry: { ...state.pantry, [action.itemKey]: !state.pantry[action.itemKey] },
      };
    case 'reset_week':
      return { ...state, planByDay: {}, completedDays: {} };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(appReducer, DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeScreen, setActiveScreen] = useState('welcome');
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [detailReturnScreen, setDetailReturnScreen] = useState('library');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function hydrate() {
      const storedState = await loadStoredState(DEFAULT_STATE);
      if (!isMounted) return;
      dispatch({ type: 'hydrate', payload: storedState });
      setIsHydrated(true);
    }
    hydrate();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
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

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  }

  function getBackLabel() {
    if (detailReturnScreen === 'plan') return 'Week Plan';
    if (detailReturnScreen === 'saved') return 'Saved';
    return 'Recipes';
  }

  function renderMainScreen() {
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

    if (activeScreen === 'saved') {
      return (
        <FavoritesScreen
          favorites={state.favorites}
          onOpenRecipe={(recipeId) => openRecipe(recipeId, 'saved')}
          onToggleFavorite={(recipeId) => dispatch({ type: 'toggle_favorite', recipeId })}
          planByDay={state.planByDay}
          recipes={recipes}
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

  const itemsToBuy = shoppingList.filter((item) => !item.isInPantry).length;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.phoneFrame}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar style="dark" />
          <View style={styles.bgShapeOne} pointerEvents="none" />
          <View style={styles.bgShapeTwo} pointerEvents="none" />

          {!isHydrated ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.loadingText}>Loading your saved week...</Text>
            </View>
          ) : activeScreen === 'welcome' ? (
            <WelcomeScreen onGetStarted={() => setActiveScreen('library')} />
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                activeScreen === 'library' ? (
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    tintColor={colors.accent}
                    colors={[colors.accent]}
                  />
                ) : undefined
              }
            >
              {/* Compact app header */}
              <View style={styles.appHeader}>
                <View>
                  <Text style={styles.appHeaderTitle}>LectureFuel</Text>
                  <Text style={styles.appHeaderSub}>student meal planner</Text>
                </View>
                <View style={styles.headerStats}>
                  <View style={styles.statPill}>
                    <Text style={styles.statPillText}>{weeklyStats.plannedCount}/7 days</Text>
                  </View>
                  {itemsToBuy > 0 && (
                    <View style={[styles.statPill, styles.statPillDark]}>
                      <Text style={[styles.statPillText, styles.statPillTextLight]}>
                        {itemsToBuy} to buy
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Navigation: back arrow or tab bar */}
              <View style={styles.workspace}>
                {activeScreen === 'detail' ? (
                  <Pressable onPress={goBackFromDetail} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                    <Text style={styles.backButtonText}>Back to {getBackLabel()}</Text>
                  </Pressable>
                ) : (
                  <TabBar activeTab={activeScreen} onChange={setActiveScreen} tabs={TABS} />
                )}
                {renderMainScreen()}
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#0d2b22' : colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: colors.background,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          shadowColor: '#000',
          shadowOpacity: 0.45,
          shadowRadius: 50,
          shadowOffset: { width: 0, height: 10 },
        }
      : {}),
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bgShapeOne: {
    position: 'absolute',
    top: -110,
    right: -20,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.sun,
    opacity: 0.34,
  },
  bgShapeTwo: {
    position: 'absolute',
    bottom: 90,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.sky,
    opacity: 0.6,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 15,
    marginTop: spacing.md,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  appHeaderTitle: {
    color: colors.forest,
    fontFamily: fonts.heading,
    fontSize: 22,
  },
  appHeaderSub: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    marginTop: 1,
  },
  headerStats: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  statPill: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statPillDark: {
    backgroundColor: colors.forest,
    borderColor: colors.forest,
  },
  statPillText: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  statPillTextLight: {
    color: colors.paper,
  },
  workspace: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.soft,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    backgroundColor: colors.sky,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  backArrow: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  backButtonText: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
});
