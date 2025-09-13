import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { WeekendPlan } from '../src/utils/types';
import { getPlans } from '../src/utils/storage';
import { weekendThemes } from '../src/utils/sampleData';
import { Link, useFocusEffect } from 'expo-router';
import { deletePlan } from '../src/utils/storage';

export default function Index() {
  const [savedPlans, setSavedPlans] = React.useState<WeekendPlan[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadPlans();
    }, [])
  );

  const loadPlans = async () => {
    const plans = await getPlans();
    setSavedPlans(plans);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Welcome to Weekendly</Title>
          <Paragraph>Plan your perfect weekend</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Link href={{ pathname: '/weekend-plan', params: { theme: 'custom' }}} asChild>
            <Button mode="contained">Create Custom Plan</Button>
          </Link>
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
              <Link href={{ pathname: '/weekend-plan', params: { theme: theme.id }}} asChild>
                <Button mode="outlined">Select</Button>
              </Link>
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
                <Link href={{ pathname: '/weekend-plan', params: { planId: plan.id }}} asChild>
                  <Button mode="text">View</Button>
                </Link>
                <Button 
                  mode="text" 
                  textColor="red" 
                  onPress={async () => {
                    await deletePlan(plan.id);
                    loadPlans();
                  }}
                >
                  Delete
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
      )}
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
