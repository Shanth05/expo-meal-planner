import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'lecture-fuel-state-v1';

export async function loadStoredState(defaultState) {
  try {
    const rawState = await AsyncStorage.getItem(STORAGE_KEY);
    if (!rawState) {
      return defaultState;
    }

    const parsed = JSON.parse(rawState);
    return {
      ...defaultState,
      ...parsed,
    };
  } catch (error) {
    return defaultState;
  }
}

export async function saveStoredState(state) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    return null;
  }

  return true;
}
