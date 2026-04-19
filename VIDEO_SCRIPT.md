# Video Script Draft

Use this as a starting point for the required 6 minute commentary video. Replace any wording that does not match what you actually think or built.

## 0s to 60s: Fast screen tour

`Lecture Fuel` is a student meal planning app built in React Native. The first screen is the recipe library, where users can search, filter by meal type or diet, sort by popularity, time, budget, or protein, and move through pages of results. Selecting a recipe opens a detail screen where the user can save it to their saved meals collection or place it on one or more days in the weekly plan. The saved meals screen shows the user's personal collection with aggregate stats like total protein and average cook time. The week plan screen turns recipe selections into a structured day-by-day schedule and also generates a shopping list from the chosen meals. The pantry screen lets the user mark what they already have, so the shopping list only highlights what still needs to be bought.

## 60s to 180s: Compare early and final versions

Comparison 1:
At an earlier stage, the app was only a recipe browser with a search field. There was no way to do anything with the recipes beyond viewing them. That was too passive for the assignment brief, which requires the app to take information and transform it into something useful. I changed the design so that selecting recipes creates a day-by-day meal plan, a derived shopping list, and a saved meals collection. Each of those three outputs is a genuine transformation of the original recipe data.

Comparison 2:
Initially I kept everything on one screen with scrolling sections. That made the interface feel crowded, made navigation harder to explain, and made the app feel like a long webpage rather than a mobile application. I moved to separate screens — library, saved meals, detail, week plan, and pantry — each with its own clear purpose. That improved usability by giving the user a clear mental model: browse here, save here, plan here, track here.

Alternative considered:
I also considered using restaurant or tourist attraction data because those are common examples from the brief. I rejected them because they are heavily used and I wanted a more specific scenario. A student meal-planning context gave me a stronger reason to use sorting by budget and protein, persistence across sessions, and derived data like the shopping list — all of which are harder to justify in a generic restaurant list.

## 180s to 300s: Detailed code analysis

The most important code is in [src/utils/plan.js](./src/utils/plan.js) and [App.js](./App.js). The app stores plan data in a `planByDay` object, where each weekday key maps to a recipe id string. That lightweight data structure makes it easy to replace a day, clear a day, or generate a shopping list without touching any other state. The `buildShoppingList` function reads each planned recipe, loops through its ingredients, normalises ingredient names using a regex, groups duplicates together so shared ingredients only appear once, and attaches the recipe titles that need each ingredient. It then compares those grouped items against the `pantry` state map so the interface can label each ingredient as either `Buy` or `In pantry`. In `App.js`, a `useReducer` manages actions like toggling favourites, assigning a recipe to a day, marking a day cooked, and toggling pantry items. That centralises all state transitions in one place so the individual screens stay simple — they receive data and call callbacks, but they do not manage state themselves.

## 300s to 360s: Main learning

The main thing I learned was that a better mobile app often comes from modelling the data properly before designing the screens. Once I changed the state from being a flat list of saved recipes to a weekly structure with derived shopping logic, the rest of the app design became more coherent and the screens were easier to reason about. I also learned that explaining architectural tradeoffs is easier when the code structure mirrors the user journey — because then the structure itself makes the tradeoffs visible without having to invent examples.
