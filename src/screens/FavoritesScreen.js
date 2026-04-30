import React from 'react';
import { Text, View } from 'react-native';
import { RecipeCard } from '../components/RecipeCard';
import { favoritesStyles as styles } from '../styles';
import { getAssignedDays } from '../utils/plan';

export function FavoritesScreen({ favorites, onOpenRecipe, onToggleFavorite, planByDay, recipes }) {
  const favoriteRecipes = recipes.filter((recipe) => favorites.includes(recipe.id));

  return (
    <View>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Saved Meals</Text>
        <Text style={styles.body}>
          {favoriteRecipes.length > 0
            ? `${favoriteRecipes.length} recipe${favoriteRecipes.length === 1 ? '' : 's'} saved. Tap any card to open it and assign it to the week.`
            : 'Tap "Save idea" on any recipe in the library to build your personal collection here.'}
        </Text>
        {favoriteRecipes.length > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Text style={styles.statValue}>{favoriteRecipes.length}</Text>
              <Text style={styles.statLabel}>saved</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statValue}>
                {favoriteRecipes.reduce((total, recipe) => total + recipe.protein, 0)}g
              </Text>
              <Text style={styles.statLabel}>total protein</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statValue}>
                {Math.round(
                  favoriteRecipes.reduce((total, recipe) => total + recipe.cookTime, 0) /
                    favoriteRecipes.length
                )}
                min
              </Text>
              <Text style={styles.statLabel}>avg cook time</Text>
            </View>
          </View>
        )}
      </View>

      {favoriteRecipes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No saved meals yet.</Text>
          <Text style={styles.emptyBody}>
            Browse the recipe library and press "Save idea" on anything that catches your eye.
          </Text>
        </View>
      ) : (
        favoriteRecipes.map((recipe) => (
          <RecipeCard
            assignedDays={getAssignedDays(planByDay, recipe.id)}
            key={recipe.id}
            onOpen={() => onOpenRecipe(recipe.id)}
            onToggleFavorite={() => onToggleFavorite(recipe.id)}
            recipe={recipe}
            saved
          />
        ))
      )}
    </View>
  );
}

