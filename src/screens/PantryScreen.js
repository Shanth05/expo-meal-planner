import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { pantryStyles as styles } from '../styles';
import { buildShoppingList, getUniqueIngredients } from '../utils/plan';

const FILTERS = ['All', 'Needed', 'Stocked'];

export function PantryScreen({ onOpenPlan, onTogglePantryItem, pantry, planByDay, recipes }) {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('All');

  const shoppingList = buildShoppingList(planByDay, recipes, pantry);
  const neededKeys = shoppingList.map((item) => item.key);

  const ingredients = getUniqueIngredients(recipes)
    .map((ingredient) => ({
      ...ingredient,
      isInPantry: Boolean(pantry[ingredient.key]),
      neededThisWeek: neededKeys.includes(ingredient.key),
    }))
    .filter((ingredient) => ingredient.name.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((ingredient) => {
      if (filterMode === 'Needed') {
        return ingredient.neededThisWeek;
      }
      if (filterMode === 'Stocked') {
        return ingredient.isInPantry;
      }
      return true;
    })
    .sort((left, right) => {
      if (left.neededThisWeek !== right.neededThisWeek) {
        return left.neededThisWeek ? -1 : 1;
      }
      if (left.isInPantry !== right.isInPantry) {
        return left.isInPantry ? 1 : -1;
      }
      return left.name.localeCompare(right.name);
    });

  return (
    <View>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Pantry tracker</Text>
        <Text style={styles.body}>
          Mark what you already have at home. The weekly shopping list uses this to separate true purchases from items
          you can skip.
        </Text>
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerValue}>{shoppingList.filter((item) => !item.isInPantry).length}</Text>
            <Text style={styles.headerLabel}>still to buy</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerValue}>{Object.values(pantry).filter(Boolean).length}</Text>
            <Text style={styles.headerLabel}>stocked items</Text>
          </View>
        </View>
        <Pressable onPress={onOpenPlan} style={styles.planButton}>
          <Text style={styles.planButtonText}>Back to week plan</Text>
        </Pressable>
      </View>

      <View style={styles.controlsCard}>
        <TextInput
          onChangeText={setSearch}
          placeholder="Search ingredients"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={search}
        />
        <View style={styles.filterRow}>
          {FILTERS.map((filterModeOption) => {
            const active = filterModeOption === filterMode;
            return (
              <Pressable
                key={filterModeOption}
                onPress={() => setFilterMode(filterModeOption)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{filterModeOption}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.listCard}>
        {ingredients.map((ingredient) => (
          <Pressable
            key={ingredient.key}
            onPress={() => onTogglePantryItem(ingredient.key)}
            style={[
              styles.ingredientRow,
              ingredient.neededThisWeek && styles.ingredientRowNeeded,
              ingredient.isInPantry && styles.ingredientRowStocked,
            ]}
          >
            <View style={styles.ingredientCopy}>
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
              <Text style={styles.ingredientMeta}>
                {ingredient.aisle} {ingredient.neededThisWeek ? '| used this week' : '| optional'}
              </Text>
            </View>
            <Text
              style={[
                styles.ingredientStatus,
                ingredient.isInPantry ? styles.ingredientStatusStocked : styles.ingredientStatusMissing,
              ]}
            >
              {ingredient.isInPantry ? 'Stocked' : 'Missing'}
            </Text>
          </Pressable>
        ))}
        {ingredients.length === 0 ? (
          <Text style={styles.emptyText}>No pantry items match the current search or filter.</Text>
        ) : null}
      </View>
    </View>
  );
}

