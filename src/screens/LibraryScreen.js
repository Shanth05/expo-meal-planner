import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { FilterPanel } from '../components/FilterPanel';
import { Pagination } from '../components/Pagination';
import { RecipeCard } from '../components/RecipeCard';
import { libraryStyles as styles } from '../styles';
import { getAssignedDays } from '../utils/plan';

const PAGE_SIZE = 4;
const MEAL_TYPES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
const DIETS = ['All', 'Balanced', 'High Protein', 'Vegetarian', 'Vegan', 'Pescatarian'];
const SORT_OPTIONS = ['Popular', 'Time', 'Budget', 'Protein', 'A-Z'];

export function LibraryScreen({ favorites, onOpenRecipe, onToggleFavorite, planByDay, recipes }) {
  const [search, setSearch] = useState('');
  const [mealType, setMealType] = useState('All');
  const [diet, setDiet] = useState('All');
  const [sortBy, setSortBy] = useState('Popular');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [diet, mealType, search, sortBy]);

  const filteredRecipes = recipes
    .filter((recipe) => {
      const searchableContent = [
        recipe.title,
        recipe.tagline,
        recipe.diet,
        recipe.mealType,
        ...recipe.tags,
        ...recipe.ingredients.map((ingredient) => ingredient.name),
      ]
        .join(' ')
        .toLowerCase();

      return searchableContent.includes(search.trim().toLowerCase());
    })
    .filter((recipe) => (mealType === 'All' ? true : recipe.mealType === mealType))
    .filter((recipe) => (diet === 'All' ? true : recipe.diet === diet))
    .sort((left, right) => {
      if (sortBy === 'Time') {
        return left.cookTime - right.cookTime;
      }
      if (sortBy === 'Budget') {
        return left.budget - right.budget;
      }
      if (sortBy === 'Protein') {
        return right.protein - left.protein;
      }
      if (sortBy === 'A-Z') {
        return left.title.localeCompare(right.title);
      }
      return right.rating - left.rating;
    });

  const pageCount = Math.max(1, Math.ceil(filteredRecipes.length / PAGE_SIZE));
  const pagedRecipes = filteredRecipes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <View>
      <FilterPanel
        diet={diet}
        diets={DIETS}
        filteredCount={filteredRecipes.length}
        mealType={mealType}
        mealTypes={MEAL_TYPES}
        onDietChange={setDiet}
        onMealTypeChange={setMealType}
        onSearchChange={setSearch}
        onSortChange={setSortBy}
        search={search}
        sortBy={sortBy}
        sortOptions={SORT_OPTIONS}
        totalCount={recipes.length}
      />

      {pagedRecipes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No recipes match those filters.</Text>
          <Text style={styles.emptyBody}>Try a broader meal type or remove one of the filters.</Text>
        </View>
      ) : (
        pagedRecipes.map((recipe) => (
          <RecipeCard
            assignedDays={getAssignedDays(planByDay, recipe.id)}
            key={recipe.id}
            onOpen={() => onOpenRecipe(recipe.id)}
            onToggleFavorite={() => onToggleFavorite(recipe.id)}
            recipe={recipe}
            saved={favorites.includes(recipe.id)}
          />
        ))
      )}

      <Pagination currentPage={currentPage} onChange={setCurrentPage} pageCount={pageCount} />
    </View>
  );
}

