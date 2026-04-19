# Submission Checklist

## Ready now

- App code is multi-file (screens, components, utils, constants all separate)
- Initial data is stored in JSON in [src/data/recipes.json](./src/data/recipes.json) — 20 recipes across 4 meal types and 6 diet categories
- Data is transformed into: saved meals collection, weekly meal plan, shopping list, and pantry-aware purchase view
- Search, filtering (meal type + diet), sorting (5 options), and pagination are implemented in [src/screens/LibraryScreen.js](./src/screens/LibraryScreen.js)
- Dedicated Saved Meals screen shows favourited recipes with aggregate stats
- AsyncStorage persistence is implemented in [src/utils/storage.js](./src/utils/storage.js)
- App does not require signup or registration
- Video script is in [VIDEO_SCRIPT.md](./VIDEO_SCRIPT.md)
- Transcript draft is in [VIDEO_TRANSCRIPT_DRAFT.txt](./VIDEO_TRANSCRIPT_DRAFT.txt)

## Still needs your action

- Publish the app as an Expo Snack at expo.dev/snacks and paste the final URL below
- Record the 6 minute video **in your own voice** following the structure in VIDEO_SCRIPT.md
- Export the audio transcript from the recorded video using Microsoft Word Transcribe or similar
- Submit all items as separate files (not a single zip) to Canvas before 28 April 2026

## Final links

- Expo Snack URL: `ADD_YOUR_PRIVATE_SNACK_URL_HERE`
- External service URL: `Not used — data is hard-wired JSON`

## Files to submit to Canvas

1. Expo Snack URL (paste as text)
2. External service URL (not applicable — write "not used")
3. Code zip file
4. Video file (under 100 MB)
5. Transcript file

## Notes on Expo Snack upload

When creating the Snack at expo.dev/snacks:
- Add `@react-native-async-storage/async-storage` as a dependency in the Snack editor
- Copy all files preserving the folder structure: `App.js`, `src/data/recipes.json`, `src/screens/`, `src/components/`, `src/utils/`, `src/constants/`
- The Snack URL must be kept private — do not share it with other students

## Brief requirements met

| Requirement | Status |
|---|---|
| React Native only | Done |
| Works as Expo Snack | Pending — needs upload |
| Data is JSON | Done — recipes.json |
| Not a single App.js file | Done — 12 files across screens/components/utils |
| No signup required | Done |
| Navigation: sort, filter, page | Done |
| AsyncStorage for persistence | Done |
| App transforms data, not just lists it | Done — plan + shopping list + pantry |
