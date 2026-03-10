# Video Script Draft

Use this as a starting point for the required 6 minute commentary video. Replace any wording that does not match what you actually think or built.

## 0s to 60s: Fast screen tour

`Lecture Fuel` is a student meal planning app. The first screen is the recipe library, where users can search, filter by meal type or diet, sort by popularity, time, budget, protein, and move through pages of results. Selecting a recipe opens a detail screen where the user can save it or place it on one or more days in the weekly plan. The week plan screen then turns those recipe selections into a structured day-by-day schedule and also generates a shopping list from the chosen meals. The pantry screen lets the user mark what they already have, so the shopping list becomes more realistic.

## 60s to 180s: Compare early and final versions

Comparison 1:
At an earlier stage, the app was only a recipe browser with a favourites feature. That was too passive for the brief because it presented data but did not transform it enough. I changed the design so that selecting recipes now creates a day-by-day meal plan and a derived shopping list, which makes the app more useful and aligns better with the assignment requirement.

Comparison 2:
Initially I considered keeping everything on one screen with long scrolling sections. That made the interface feel crowded and made it harder to explain the app architecture. I moved to separate screens for the library, recipe detail, week plan, and pantry. That improved usability and also created a clearer separation between browsing data, making choices, and seeing transformed output.

Alternative considered:
I considered using restaurant or tourist attraction data because those are common examples from the brief. I rejected them because they are heavily used examples and I wanted a more specific scenario. A student meal-planning context felt more credible and gave me a stronger reason to use sorting, persistence, and derived data.

## 180s to 300s: Detailed code analysis

The most important code is in [src/utils/plan.js](./src/utils/plan.js) and [App.js](./App.js). The app stores plan data in a `planByDay` object, where each weekday key points to a recipe id. That lightweight data structure makes it easy to replace a day, clear a day, or generate a shopping list. The `buildShoppingList` function reads each planned recipe, loops through its ingredients, normalizes ingredient names, groups duplicates together, and attaches the recipes that require each ingredient. It then compares those grouped items against the pantry state so the UI can label each ingredient as either `Buy` or `In pantry`. In `App.js`, a reducer manages actions like toggling favourites, assigning a recipe to a day, and marking pantry items. That keeps the screens simpler because they render data while the reducer handles state transitions.

## 300s to 360s: Main learning

The main thing I learned was that a better mobile app often comes from modelling the data properly before designing the screens. Once I changed the state from being a flat list of saved recipes to a weekly structure with derived shopping logic, the rest of the app design became more coherent. I also learned that explaining tradeoffs is easier when the code structure mirrors the user journey.
