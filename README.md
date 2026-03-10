# Lecture Fuel

`Lecture Fuel` is an Expo Snack compatible React Native assignment app. It turns a JSON recipe catalogue into a weekly student meal plan and an automatically generated shopping list.

## What it covers

- Multi-file structure with separate screens, components, utilities, and JSON data
- Local JSON data source in [src/data/recipes.json](./src/data/recipes.json)
- Data navigation through search, filtering, sorting, and paging
- Useful transformation from recipe data to:
  - a weekly meal plan
  - a generated shopping list
  - a pantry-aware purchase view
- Persistence with `AsyncStorage`

## File structure

- [App.js](./App.js)
- [src/screens/LibraryScreen.js](./src/screens/LibraryScreen.js)
- [src/screens/RecipeDetailScreen.js](./src/screens/RecipeDetailScreen.js)
- [src/screens/PlanScreen.js](./src/screens/PlanScreen.js)
- [src/screens/PantryScreen.js](./src/screens/PantryScreen.js)
- [src/components](./src/components)
- [src/utils/plan.js](./src/utils/plan.js)
- [src/utils/storage.js](./src/utils/storage.js)

## Snack notes

1. Create a new Expo Snack.
2. Add all files from this folder into the Snack editor.
3. If Snack does not auto-resolve `@react-native-async-storage/async-storage`, add it from the dependency picker.
4. Run and publish the Snack privately, then use that URL for submission.

## Still required manually

- Publish the Expo Snack and capture the final URL
- Record the 6 minute narrated video in your own voice
- Export the transcript
- Zip this codebase for upload
