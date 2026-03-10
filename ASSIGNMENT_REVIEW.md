# Assignment Review

The brief in [App Finallll.pdf](./App%20Finallll.pdf) is dated **March 8, 2026** and shows a submission deadline of **April 28, 2026**.

## Non-negotiable constraints from the brief

- The app must run as an **Expo Snack**
- The initial data must be encoded in **JSON**
- The app must transform provided information into something else useful
- Users must be able to navigate data through methods such as **sorting, filtering, or paging**
- The solution must **not** be a single `App.js` file
- The app must not require signup or registration
- `AsyncStorage` is acceptable for saving preferences or app data

## What this solution does

- Uses a local JSON recipe catalogue in [src/data/recipes.json](./src/data/recipes.json)
- Transforms that catalogue into:
  - a weekly meal plan
  - an auto-generated shopping list
  - a pantry tracker that reduces unnecessary purchases
- Includes search, filter, sort, and pagination in [src/screens/LibraryScreen.js](./src/screens/LibraryScreen.js)
- Uses multiple files across screens, components, and utilities
- Saves favourites, week selections, completion state, and pantry status through `AsyncStorage`

## Review of the brief itself

- The automatic 20% deduction risks are clear: single-file apps and non-Snack submissions are explicitly penalized.
- The rubric rewards originality, architectural tradeoff discussion, and evidence of iteration. A plain CRUD-style list alone is unlikely to score near the top bands.
- The video matters almost as much as the artefact. Even a strong app can lose marks if the comparison, code analysis, and tradeoff sections are weak.
