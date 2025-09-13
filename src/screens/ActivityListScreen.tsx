import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Searchbar, Chip, Card, Title, Button } from 'react-native-paper';
import { Activity } from '../utils/types';
import { sampleActivities, activityCategories } from '../utils/sampleData';

const ActivityListScreen = ({ route, navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { onSelect } = route.params || {};

  const filteredActivities = sampleActivities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectActivity = (activity: Activity) => {
    if (onSelect) {
      onSelect(activity);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search activities"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView horizontal style={styles.categoriesScroll}>
        <View style={styles.categories}>
          {activityCategories.map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
              style={styles.categoryChip}
            >
              {category}
            </Chip>
          ))}
        </View>
      </ScrollView>

      <ScrollView style={styles.activitiesList}>
        {filteredActivities.map((activity) => (
          <Card
            key={activity.id}
            style={styles.activityCard}
            onPress={() => handleSelectActivity(activity)}
          >
            <Card.Content style={styles.cardContent}>
              <View style={styles.activityInfo}>
                <Title>{activity.icon} {activity.title}</Title>
                <View style={styles.tags}>
                  <Chip compact>{activity.category}</Chip>
                  <Chip compact>{activity.duration} min</Chip>
                  {activity.mood && <Chip compact>{activity.mood}</Chip>}
                </View>
              </View>
              <Button mode="contained" onPress={() => handleSelectActivity(activity)}>
                Add
              </Button>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
  },
  categoriesScroll: {
    maxHeight: 50,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  activitiesList: {
    padding: 16,
  },
  activityCard: {
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
});

export default ActivityListScreen;
