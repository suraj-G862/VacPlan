import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Searchbar, Chip, Card, Title, Button, FAB, Portal, Dialog, TextInput } from 'react-native-paper';
import { Activity } from '../../src/utils/types';
import { sampleActivities, activityCategories } from '../../src/utils/sampleData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { storeSelectedActivity } from '../../src/utils/selectedActivity';

export default function ActivityListScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [showNewActivityDialog, setShowNewActivityDialog] = React.useState(false);
  const [newActivity, setNewActivity] = React.useState({
    title: '',
    category: '',
    duration: '',
    icon: '',
    description: '',
  });
  const router = useRouter();
  const { dayIndex } = useLocalSearchParams<{ dayIndex: string }>();

  const filteredActivities = sampleActivities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectActivity = async (activity: Activity) => {
    try {
      if (dayIndex) {
        console.log('Storing activity for day:', dayIndex);
        await storeSelectedActivity(activity, parseInt(dayIndex, 10));
      } else {
        console.error('No day index provided');
      }
      router.back();
    } catch (error) {
      console.error('Error selecting activity:', error);
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

      <Portal>
        <Dialog visible={showNewActivityDialog} onDismiss={() => setShowNewActivityDialog(false)}>
          <Dialog.Title>Create New Activity</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Title"
              value={newActivity.title}
              onChangeText={(text) => setNewActivity(prev => ({ ...prev, title: text }))}
              style={styles.input}
            />
            <TextInput
              label="Category"
              value={newActivity.category}
              onChangeText={(text) => setNewActivity(prev => ({ ...prev, category: text }))}
              style={styles.input}
            />
            <TextInput
              label="Duration (minutes)"
              value={newActivity.duration}
              onChangeText={(text) => setNewActivity(prev => ({ ...prev, duration: text }))}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Emoji Icon"
              value={newActivity.icon}
              onChangeText={(text) => setNewActivity(prev => ({ ...prev, icon: text }))}
              style={styles.input}
            />
            <TextInput
              label="Description"
              value={newActivity.description}
              onChangeText={(text) => setNewActivity(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowNewActivityDialog(false)}>Cancel</Button>
            <Button onPress={() => {
              const activity: Activity = {
                id: Date.now().toString(),
                title: newActivity.title,
                category: newActivity.category,
                duration: parseInt(newActivity.duration) || 30,
                icon: newActivity.icon,
                description: newActivity.description,
              };
              handleSelectActivity(activity);
              setShowNewActivityDialog(false);
              setNewActivity({
                title: '',
                category: '',
                duration: '',
                icon: '',
                description: '',
              });
            }} mode="contained">
              Create & Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowNewActivityDialog(true)}
        label="Create Activity"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
  },
  categoriesScroll: {
    maxHeight: 65,
    marginVertical: 8,
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
  input: {
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
