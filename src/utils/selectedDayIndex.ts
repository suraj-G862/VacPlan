import AsyncStorage from '@react-native-async-storage/async-storage';

const SELECTED_DAY_INDEX_KEY = '@weekendly_selected_day_index';

export const storeSelectedDayIndex = async (dayIndex: number) => {
  try {
    await AsyncStorage.setItem(SELECTED_DAY_INDEX_KEY, dayIndex.toString());
    return true;
  } catch (error) {
    console.error('Error storing selected day index:', error);
    return false;
  }
};

export const getSelectedDayIndex = async () => {
  try {
    const data = await AsyncStorage.getItem(SELECTED_DAY_INDEX_KEY);
    if (data) {
      return parseInt(data, 10);
    }
    return null;
  } catch (error) {
    console.error('Error getting selected day index:', error);
    return null;
  }
};
