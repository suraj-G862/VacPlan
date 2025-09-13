import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity } from './types';

const SELECTED_ACTIVITY_KEY = '@weekendly_selected_activity';

export const storeSelectedActivity = async (activity: Activity, dayIndex: number) => {
  try {
    await AsyncStorage.setItem(SELECTED_ACTIVITY_KEY, JSON.stringify({ activity, dayIndex }));
    return true;
  } catch (error) {
    console.error('Error storing selected activity:', error);
    return false;
  }
};

export const getAndClearSelectedActivity = async () => {
  try {
    const data = await AsyncStorage.getItem(SELECTED_ACTIVITY_KEY);
    if (data) {
      await AsyncStorage.removeItem(SELECTED_ACTIVITY_KEY);
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error getting selected activity:', error);
    return null;
  }
};
