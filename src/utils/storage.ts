import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeekendPlan } from './types';

const STORAGE_KEY = '@weekendly_plans';

export const savePlan = async (plan: WeekendPlan) => {
  try {
    const existingPlansJSON = await AsyncStorage.getItem(STORAGE_KEY);
    const existingPlans = existingPlansJSON ? JSON.parse(existingPlansJSON) : [];
    
    const planIndex = existingPlans.findIndex((p: WeekendPlan) => p.id === plan.id);
    if (planIndex !== -1) {
      existingPlans[planIndex] = plan;
    } else {
      existingPlans.push(plan);
    }
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingPlans));
    return true;
  } catch (error) {
    console.error('Error saving plan:', error);
    return false;
  }
};

export const getPlans = async (): Promise<WeekendPlan[]> => {
  try {
    const plansJSON = await AsyncStorage.getItem(STORAGE_KEY);
    return plansJSON ? JSON.parse(plansJSON) : [];
  } catch (error) {
    console.error('Error getting plans:', error);
    return [];
  }
};

export const deletePlan = async (planId: string) => {
  try {
    const existingPlansJSON = await AsyncStorage.getItem(STORAGE_KEY);
    if (!existingPlansJSON) return false;

    const existingPlans = JSON.parse(existingPlansJSON);
    const updatedPlans = existingPlans.filter((plan: WeekendPlan) => plan.id !== planId);
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
    return true;
  } catch (error) {
    console.error('Error deleting plan:', error);
    return false;
  }
};
