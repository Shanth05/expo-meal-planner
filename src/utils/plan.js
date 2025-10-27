// Days of the week used for the weekly meal planner
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Returns a single recipe object by its id, or null if not found
export function getRecipeById(recipes, recipeId) {
  return recipes.find((recipe) => recipe.id === recipeId) || null;
}

// Returns all days that have a specific recipe assigned
export function getAssignedDays(planByDay, recipeId) {
  return DAYS.filter((day) => planByDay[day] === recipeId);
}

export function normalizeIngredient(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function formatQuantityNotes(quantityCounts) {
  return Object.entries(quantityCounts).map(([quantity, count]) => (count > 1 ? `${count} x ${quantity}` : quantity));
}

// Calculates summary stats for the current week: planned meals, total cook time, protein and budget
export function buildWeeklyStats(planByDay, recipes, completedDays) {
  const assignedRecipes = DAYS.map((day) => getRecipeById(recipes, planByDay[day])).filter(Boolean);

  return {
    plannedCount: assignedRecipes.length,
    totalMinutes: assignedRecipes.reduce((total, recipe) => total + recipe.cookTime, 0),
    totalBudget: assignedRecipes.reduce((total, recipe) => total + recipe.budget, 0),
    totalProtein: assignedRecipes.reduce((total, recipe) => total + recipe.protein, 0),
    completedCount: DAYS.filter((day) => completedDays[day]).length,
  };
}

// Aggregates ingredients from all planned recipes, deduplicates them and cross-checks the pantry
export function buildShoppingList(planByDay, recipes, pantry) {
  const groupedItems = {};

  DAYS.forEach((day) => {
    const recipe = getRecipeById(recipes, planByDay[day]);
    if (!recipe) {
      return;
    }

    recipe.ingredients.forEach((ingredient) => {
      const key = normalizeIngredient(ingredient.name);
      if (!groupedItems[key]) {
        groupedItems[key] = {
          key,
          name: ingredient.name,
          aisle: ingredient.aisle,
          quantityCounts: {},
          recipes: [],
        };
      }

      if (ingredient.quantity) {
        const currentCount = groupedItems[key].quantityCounts[ingredient.quantity] || 0;
        groupedItems[key].quantityCounts[ingredient.quantity] = currentCount + 1;
      }

      if (!groupedItems[key].recipes.includes(recipe.title)) {
        groupedItems[key].recipes.push(recipe.title);
      }
    });
  });

  return Object.values(groupedItems)
    .map((item) => ({
      ...item,
      quantityNotes: formatQuantityNotes(item.quantityCounts),
      isInPantry: Boolean(pantry[item.key]),
    }))
    .sort((left, right) => {
      if (left.isInPantry !== right.isInPantry) {
        return left.isInPantry ? 1 : -1;
      }
      if (left.aisle !== right.aisle) {
        return left.aisle.localeCompare(right.aisle);
      }
      return left.name.localeCompare(right.name);
    });
}

export function getUniqueIngredients(recipes) {
  const seen = {};

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const key = normalizeIngredient(ingredient.name);
      if (!seen[key]) {
        seen[key] = {
          key,
          name: ingredient.name,
          aisle: ingredient.aisle,
        };
      }
    });
  });

  return Object.values(seen).sort((left, right) => left.name.localeCompare(right.name));
}
