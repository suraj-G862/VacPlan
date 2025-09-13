import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Button, Card, Title, Paragraph, Switch, TextInput, Portal, Dialog } from 'react-native-paper';
import { Activity, WeekendPlan, DayPlan } from '../src/utils/types';
import { getPlans, savePlan } from '../src/utils/storage';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { getAndClearSelectedActivity } from '../src/utils/selectedActivity';
import { storeSelectedDayIndex } from '../src/utils/selectedDayIndex';
import DraggableActivity from '../src/components/DraggableActivity';

export default function WeekendPlanScreen() {
  const { theme, planId, startDate: initialStartDate, endDate: initialEndDate } = useLocalSearchParams();
  const router = useRouter();
  const [showStartDatePicker, setShowStartDatePicker] = React.useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = React.useState(false);
  const [plan, setPlan] = React.useState<WeekendPlan>(() => {
    const today = new Date();
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7));
    
    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);

    return {
      id: planId?.toString() || Date.now().toString(),
      name: 'Weekend Plan',
      days: [
        {
          date: saturday.toISOString(),
          activities: []
        },
        {
          date: sunday.toISOString(),
          activities: []
        }
      ],
      activities: [null, null], // Initialize with null for each day
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      theme: theme?.toString(),
      isLongWeekend: false,
      startDate: initialStartDate?.toString() || saturday.toISOString(),
      endDate: initialEndDate?.toString() || sunday.toISOString(),
    };
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

    const generateDaysFromDateRange = React.useCallback(() => {
    if (!plan.isLongWeekend || !plan.startDate || !plan.endDate) return;

    const startDate = new Date(plan.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(plan.endDate);
    endDate.setHours(23, 59, 59, 999);
    
    const days: DayPlan[] = [];
    let currentDate = new Date(startDate);
    
    do {
      const existingDay = plan.days.find(
        d => new Date(d.date).toDateString() === currentDate.toDateString()
      );
      
      days.push({
        date: currentDate.toISOString(),
        activities: existingDay?.activities || []
      });
      currentDate.setDate(currentDate.getDate() + 1);
    } while (currentDate <= endDate);

    setPlan(prev => ({
      ...prev,
      days,
      activities: days.map(day => day.activities.length > 0 ? day.activities[0] : null)
    }));
  }, [plan.startDate, plan.endDate, plan.isLongWeekend]);

  React.useEffect(() => {
    if (plan.isLongWeekend) {
      generateDaysFromDateRange();
    } else {
      const existingActivities = plan.days.length >= 2 ? [
        plan.days[0]?.activities || [],
        plan.days[1]?.activities || []
      ] : [[], []];

      const today = new Date();
      const saturday = new Date(today);
      saturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7));
      
      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1);

      const newDays = [
        {
          date: saturday.toISOString(),
          activities: existingActivities[0]
        },
        {
          date: sunday.toISOString(),
          activities: existingActivities[1]
        }
      ];

      setPlan(prev => ({
        ...prev,
        days: newDays,
        // Set the first activity of each day or null if no activities
        activities: newDays.map(day => day.activities[0] || null)
      }));
    }
  }, [plan.isLongWeekend, plan.startDate, plan.endDate]);

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
            setPlan((current) => {
              const updatedDays = current.days.map((day, index) => 
                index === dayIndex
                  ? { ...day, activities: [...day.activities, activity] }
                  : day
              );

              // Update activities array to match days
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
    setPlan((current) => {
      const updatedDays = current.days.map((day, index) => 
        index === dayIndex
          ? { ...day, activities: day.activities.filter(a => a.id !== activityId) }
          : day
      );
      
      // Update activities array to match days
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

      // Update activities array to match days
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
          <View style={styles.longWeekendToggle}>
            <Paragraph>Long Weekend</Paragraph>
            <Switch
              value={plan.isLongWeekend}
              onValueChange={(value) => setPlan(prev => ({
                ...prev,
                isLongWeekend: value,
              }))}
            />
          </View>
          {plan.isLongWeekend && (
            <View style={styles.dateContainer}>
              <Button 
                mode="outlined" 
                onPress={() => setShowStartDatePicker(true)}
                style={styles.dateButton}
              >
                Start: {new Date(plan.startDate).toLocaleDateString()}
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => setShowEndDatePicker(true)}
                style={styles.dateButton}
              >
                End: {new Date(plan.endDate).toLocaleDateString()}
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
      
      {(showStartDatePicker || showEndDatePicker) && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(showStartDatePicker ? plan.startDate : plan.endDate)}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (Platform.OS === 'android') {
              setShowStartDatePicker(false);
              setShowEndDatePicker(false);
            }
            if (selectedDate) {
              setPlan(prev => ({
                ...prev,
                [showStartDatePicker ? 'startDate' : 'endDate']: selectedDate.toISOString(),
              }));
            }
          }}
        />
      )}

      {plan.days.map((day, dayIndex) => (
        <View key={`day-${dayIndex}`} style={styles.daySection}>
          <Title>{new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</Title>
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
