import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Button, Card, Title, Paragraph, Switch, TextInput, Portal, Dialog } from 'react-native-paper';
import { Activity, WeekendPlan, DayPlan } from '../src/utils/types';
import { getPlans, savePlan } from '../src/utils/storage';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { getAndClearSelectedActivity } from '../src/utils/selectedActivity';
import { storeSelectedDayIndex } from '../src/utils/selectedDayIndex';
import DraggableActivity from '../src/components/DraggableActivity';

export default function WeekendPlanScreen() {
  const { theme, planId } = useLocalSearchParams();
  const router = useRouter();
  const [plan, setPlan] = React.useState<WeekendPlan>({
    id: planId?.toString() || Date.now().toString(),
    name: 'Weekend Plan',
    days: [
      {
        date: new Date().toISOString(),
        activities: []
      },
      {
        date: new Date().toISOString(),
        activities: []
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    theme: theme?.toString(),
    isLongWeekend: false,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
  });


  React.useEffect(() => {
    if (planId) {
      loadExistingPlan();
    }
  }, [planId]);

  const loadExistingPlan = async () => {
    const plans = await getPlans();
    const existingPlan = plans.find((p) => p.id === planId);
    if (existingPlan) {
      setPlan(existingPlan);
    }
  };

  const [selectedDayIndex, setSelectedDayIndex] = React.useState<number>(0);

  useFocusEffect(
    React.useCallback(() => {
      const checkForSelectedActivity = async () => {
        console.log('Checking for selected activity...');
        const selectedActivityData = await getAndClearSelectedActivity();
        console.log('Selected activity data:', selectedActivityData);
        if (selectedActivityData) {
          const { activity, dayIndex } = selectedActivityData;
          if (dayIndex >= 0 && dayIndex < plan.days.length) {
            console.log('Adding activity to day:', dayIndex);
            setPlan((current) => ({
              ...current,
              days: current.days.map((day, index) => 
                index === dayIndex
                  ? { ...day, activities: [...day.activities, activity] }
                  : day
              ),
              updatedAt: new Date().toISOString(),
            }));
          }
        }
      };

      checkForSelectedActivity();
    }, [])
  );

  const handleAddActivity = async (dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
    await storeSelectedDayIndex(dayIndex);
    router.push({
      pathname: '/(modals)/activity-list',
      params: { dayIndex: dayIndex.toString() }
    });
  };

  const handleSave = async () => {
    await savePlan(plan);
    router.push('/');
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

  const handleMoveActivity = (fromDayIndex: number, toDayIndex: number, activityId: string, position?: number) => {
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

      if (fromDayIndex === toDayIndex && typeof position === 'number') {
        const activities = [...updatedDays[toDayIndex].activities];
        activities.splice(position, 0, activity);
        updatedDays[toDayIndex] = { ...toDay, activities };
      } else {
        updatedDays[toDayIndex] = {
          ...toDay,
          activities: [...toDay.activities, activity]
        };
      }

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
          <TextInput
            label="Plan Name"
            value={plan.name}
            onChangeText={(text) => setPlan(prev => ({ ...prev, name: text }))}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {plan.days.map((day, dayIndex) => (
        <View key={`day-${dayIndex}`} style={styles.daySection}>
          <Title>{dayIndex === 0 ? 'Saturday' : 'Sunday'}</Title>
          {day.activities.map((activity: Activity, activityIndex: number) => {
            const uniqueKey = `${dayIndex}-${activity.id}-${activityIndex}`;
            return (
              <DraggableActivity
                key={uniqueKey}
                activity={activity}
                index={activityIndex}
                totalItems={day.activities.length}
                onRemove={() => handleRemoveActivity(dayIndex, activity.id)}
                onMove={(position) => handleMoveActivity(dayIndex, dayIndex, activity.id, position)}
              />
            );
          })}
          <Button mode="outlined" onPress={() => handleAddActivity(dayIndex)}>
            Add Activity
          </Button>
        </View>
      ))}

      <Button mode="contained" style={styles.saveButton} onPress={handleSave}>
        Save Plan
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    marginHorizontal: 4,
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
  saveButton: {
    marginVertical: 16,
  },
});
