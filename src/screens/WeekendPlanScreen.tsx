import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Title, Paragraph, Switch } from 'react-native-paper';
import { Activity, WeekendPlan, DayPlan } from '../utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { getPlans, savePlan } from '../utils/storage';
import DraggableActivity from '../components/DraggableActivity';

const WeekendPlanScreen = ({ route }: any) => {
  const { theme, planId } = route.params || {};
  const router = useRouter();
  const [plan, setPlan] = useState<WeekendPlan>({
    id: planId || Date.now().toString(),
    name: '',
    days: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    theme: theme,
    isLongWeekend: false,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
  });

  useEffect(() => {
    if (planId) {
      loadExistingPlan();
    }
  }, [planId]);

  const loadExistingPlan = async () => {
    try {
      const plans = await getPlans();
      const existingPlan = plans.find((p) => p.id === planId);
      if (existingPlan) {
        setPlan(existingPlan);
      }
    } catch (error) {
      console.error('Error loading existing plan:', error);
    }
  };

  React.useEffect(() => {
    if (plan.days.length === 0) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 1);
      
      setPlan(prev => ({
        ...prev,
        days: [
          { date: startDate.toISOString(), activities: [] },
          { date: endDate.toISOString(), activities: [] },
        ]
      }));
    }
  }, []);

  const handleAddActivity = async (dayIndex: number) => {
    try {
    //   // Clear any existing stored data first
      await AsyncStorage.multiRemove(['selectedActivity', 'selectedDayIndex']);
      // Set the selected day index
      await AsyncStorage.setItem('selectedDayIndex', dayIndex.toString());
      router.push('/(modals)/activity-list');
    } catch (error) {
      console.error('Error setting selected day:', error);
    }
  };

  // Add debug logging
  const checkForSelectedActivity = async () => {
    try {
      const selectedActivityJson = await AsyncStorage.getItem('selectedActivity');
      const selectedDayIndex = await AsyncStorage.getItem('selectedDayIndex');
      
      console.log('Checking for selected activity:', {
        selectedActivityJson,
        selectedDayIndex,
        hasActivity: !!selectedActivityJson,
        hasDayIndex: !!selectedDayIndex
      });
      
      if (selectedActivityJson && selectedDayIndex) {
        const activity = JSON.parse(selectedActivityJson);
        const dayIndex = parseInt(selectedDayIndex, 10);
        
        console.log('Adding activity:', activity, 'to day:', dayIndex);
        
        // Add unique ID if not present
        if (!activity.id) {
          activity.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        }
        
        setPlan((current) => {
          const updatedPlan = {
            ...current,
            days: current.days.map((day, index) => 
              index === dayIndex
                ? { ...day, activities: [...day.activities, activity] }
                : day
            ),
            updatedAt: new Date().toISOString(),
          };
          
          console.log('Updated plan:', updatedPlan);
          return updatedPlan;
        });
        
        // Clear the stored activity and day index
        await AsyncStorage.multiRemove(['selectedActivity', 'selectedDayIndex']);
      }
    } catch (error) {
      console.error('Error checking for selected activity:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Add a small delay to ensure AsyncStorage is updated
      const timeoutId = setTimeout(() => {
        checkForSelectedActivity();
      }, 100);

      return () => clearTimeout(timeoutId);
    }, [])
  );

  const handleSave = async () => {
    try {
      await savePlan(plan);
      router.push('/');
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleRemoveActivity = (dayIndex: number, activityId: string) => {
    setPlan((current) => ({
      ...current,
      days: current.days.map((day, index) => 
        index === dayIndex
          ? { ...day, activities: day.activities.filter(a => a.id !== activityId) }
          : day
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleMoveActivity = (fromDayIndex: number, toDayIndex: number, activityId: string) => {
    setPlan((current) => {
      const fromDay = current.days[fromDayIndex];
      const toDay = current.days[toDayIndex];
      const activity = fromDay.activities.find(a => a.id === activityId);
      
      if (!activity) return current;

      const updatedDays = [...current.days];
      updatedDays[fromDayIndex] = {
        ...fromDay,
        activities: fromDay.activities.filter(a => a.id !== activityId)
      };
      updatedDays[toDayIndex] = {
        ...toDay,
        activities: [...toDay.activities, activity]
      };

      return {
        ...current,
        days: updatedDays,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Your Weekend Plan</Title>
          <View style={styles.longWeekendToggle}>
            <Paragraph>Long Weekend</Paragraph>
            <Switch
              value={plan.isLongWeekend}
              onValueChange={(value) => setPlan({ ...plan, isLongWeekend: value })}
            />
          </View>
        </Card.Content>
      </Card>

      {plan.days.map((day, dayIndex) => (
        <View key={`day-${dayIndex}-${day.date}`} style={styles.daySection}>
          <Title>{new Date(day.date).toLocaleDateString()}</Title>
          <Paragraph>Activities: {day.activities.length}</Paragraph>
          {day.activities.map((activity: Activity, activityIndex: number) => (
            <DraggableActivity
              key={`activity-${activity.id}-${activityIndex}`}
              activity={activity}
              index={activityIndex}
              totalItems={day.activities.length}
              onRemove={() => handleRemoveActivity(dayIndex, activity.id)}
              onMove={() => handleMoveActivity(dayIndex, (dayIndex + 1) % plan.days.length, activity.id)}
            />
          ))}
          <Button 
            mode="outlined" 
            onPress={() => handleAddActivity(dayIndex)}
            style={styles.addButton}
          >
            Add Activity ({dayIndex})
          </Button>
        </View>
      ))}

      <Button mode="contained" style={styles.saveButton} onPress={handleSave}>
        Save Plan
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
  longWeekendToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  daySection: {
    marginVertical: 16,
  },
  addButton: {
    marginTop: 8,
  },
  saveButton: {
    marginVertical: 16,
  },
});

export default WeekendPlanScreen;