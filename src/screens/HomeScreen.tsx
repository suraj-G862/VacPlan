import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { WeekendPlan } from '../utils/types';
import { getPlans } from '../utils/storage';
import { weekendThemes } from '../utils/sampleData';

const HomeScreen = ({ navigation }: any) => {
  const [savedPlans, setSavedPlans] = useState<WeekendPlan[]>([]);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const plans = await getPlans();
    setSavedPlans(plans);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Create New Weekend Plan</Title>
          <Paragraph>Choose a theme for your perfect weekend</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="contained"
            onPress={() => navigation.navigate('WeekendPlan', { theme: 'custom' })}
          >
            Create Custom Plan
          </Button>
        </Card.Actions>
      </Card>

      <View style={styles.themesContainer}>
        {weekendThemes.map((theme) => (
          <Card key={theme.id} style={styles.themeCard}>
            <Card.Content>
              <Title>{theme.icon}</Title>
              <Paragraph>{theme.name}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="outlined"
                onPress={() => navigation.navigate('WeekendPlan', { theme: theme.id })}
              >
                Select
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>

      {savedPlans.length > 0 && (
        <View style={styles.savedPlansSection}>
          <Title>Your Saved Plans</Title>
          {savedPlans.map((plan) => (
            <Card key={plan.id} style={styles.planCard}>
              <Card.Content>
                <Title>{plan.name}</Title>
                <Paragraph>Created: {new Date(plan.createdAt).toLocaleDateString()}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button 
                  mode="text"
                  onPress={() => navigation.navigate('WeekendPlan', { planId: plan.id })}
                >
                  View
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
      )}
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
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  themeCard: {
    width: '48%',
    marginBottom: 16,
  },
  savedPlansSection: {
    marginTop: 16,
  },
  planCard: {
    marginVertical: 8,
  },
});

export default HomeScreen;
