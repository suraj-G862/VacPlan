import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';
import { WeekendPlan } from '../utils/types';

interface ShareableWeekendCardProps {
  plan: WeekendPlan;
}

export function ShareableWeekendCard({ plan }: ShareableWeekendCardProps) {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Weekend Plan</Title>
          <Text style={styles.date}>{new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}</Text>
          
          {plan.days.map((day, index) => {
            const activity = day.activities[0]; // Get the first activity of the day
            return (
              <View key={index} style={styles.activityContainer}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayText}>Day {index + 1}</Text>
                  {activity?.theme && (
                    <View style={[
                      styles.themeTag,
                      activity.theme === 'lazy' && styles.lazyTheme,
                      activity.theme === 'adventure' && styles.adventureTheme,
                      activity.theme === 'family' && styles.familyTheme,
                      activity.theme === 'wellness' && styles.wellnessTheme,
                    ]}>
                      <Text style={styles.themeText}>{activity.theme}</Text>
                    </View>
                  )}
                </View>
                {activity ? (
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.icon} {activity.title}</Text>
                    <Text style={styles.activityDetails}>{activity.category} • {activity.duration} min</Text>
                  </View>
                ) : (
                  <Text style={styles.noActivity}>No activity planned</Text>
                )}
              </View>
            );
          })}
        </Card.Content>
      </Card>
      <Text style={styles.watermark}>Created with Weekendly</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    width: 350,
  },
  card: {
    backgroundColor: 'white',
    elevation: 4,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  date: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  activityContainer: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayText: {
    fontWeight: 'bold',
    color: '#444',
  },
  themeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lazyTheme: {
    backgroundColor: '#FFE0B2',
  },
  adventureTheme: {
    backgroundColor: '#C8E6C9',
  },
  familyTheme: {
    backgroundColor: '#BBDEFB',
  },
  wellnessTheme: {
    backgroundColor: '#E1BEE7',
  },
  themeText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  activityContent: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDetails: {
    color: '#666',
  },
  noActivity: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  watermark: {
    textAlign: 'center',
    color: '#999',
    marginTop: 8,
    fontSize: 12,
  },
});
