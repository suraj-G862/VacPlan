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
    activities: [],
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
        ],
        activities: [null, null] 
      }));
    }
  }, []);

  const handleAddActivity = async (dayIndex: number) => {
    try {
      await AsyncStorage.multiRemove(['selectedActivity', 'selectedDayIndex']);
      await AsyncStorage.setItem('selectedDayIndex', dayIndex.toString());
      router.push('/(modals)/activity-list');
    } catch (error) {
      console.error('Error setting selected day:', error);
    }
  };

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
        
        await AsyncStorage.multiRemove(['selectedActivity', 'selectedDayIndex']);
      }
    } catch (error) {
      console.error('Error checking for selected activity:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
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
    setPlan((current) => {
      const updatedDays = current.days.map((day, index) => 
        index === dayIndex
          ? { ...day, activities: day.activities.filter(a => a.id !== activityId) }
          : day
      );

      const updatedActivities = updatedDays.map(day => 
        day.activities.length > 0 ? day.activities[0] : null
      );

      return {
        ...current,
        days: updatedDays,
        activities: updatedActivities,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleMoveActivity = (dayIndex: number, dragIndex: number, hoverIndex: number) => {
    setPlan((current) => {
      const newPlan = { ...current };
      const day = newPlan.days[dayIndex];
      const [draggedActivity] = day.activities.splice(dragIndex, 1);
      day.activities.splice(hoverIndex, 0, draggedActivity);
      
      newPlan.activities = newPlan.days.map(day => 
        day.activities.length > 0 ? day.activities[0] : null
      );
      
      newPlan.updatedAt = new Date().toISOString();
      return newPlan;
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
              onMove={(position) => {
                if (typeof position === 'number') {
                  const nextDayIndex = (dayIndex + 1) % plan.days.length;
                  setPlan((current) => {
                    const newPlan = { ...current };
                    const [movedActivity] = newPlan.days[dayIndex].activities.splice(position, 1);
                    newPlan.days[nextDayIndex].activities.push(movedActivity);
                    
                    newPlan.activities = newPlan.days.map(day => 
                      day.activities.length > 0 ? day.activities[0] : null
                    );
                    
                    newPlan.updatedAt = new Date().toISOString();
                    return newPlan;
                  });
                }
              }}
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