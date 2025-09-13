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
  const [selectedTheme, setSelectedTheme] = React.useState<Activity['theme'] | null>(null);
  const [showNewActivityDialog, setShowNewActivityDialog] = React.useState(false);
  type NewActivityForm = {
    title: string;
    category: string;
    duration: string;
    icon: string;
    description: string;
    theme: Activity['theme'];
  };

  const [newActivity, setNewActivity] = React.useState<NewActivityForm>({
    title: '',
    category: '',
    duration: '',
    icon: '',
    description: '',
    theme: undefined,
  });
  const router = useRouter();
  const { dayIndex } = useLocalSearchParams<{ dayIndex: string }>();

  const filteredActivities = sampleActivities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || activity.category === selectedCategory;
    const matchesTheme = !selectedTheme || activity.theme === selectedTheme;
    return matchesSearch && matchesCategory && matchesTheme;
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

      <View style={styles.filtersContainer}>
        <View style={styles.filterSection}>
          <Title style={styles.filterTitle}>Themes</Title>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chips}>
              <Chip
                key="lazy"
                selected={selectedTheme === 'lazy'}
                onPress={() => setSelectedTheme(selectedTheme === 'lazy' ? null : 'lazy')}
                style={[
                  styles.categoryChip,
                  selectedTheme === 'lazy' ? styles.lazyChipSelected : styles.lazyChip
                ]}
                icon="sleep"
              >
                Lazy
              </Chip>
              <Chip
                key="adventure"
                selected={selectedTheme === 'adventure'}
                onPress={() => setSelectedTheme(selectedTheme === 'adventure' ? null : 'adventure')}
                style={[
                  styles.categoryChip,
                  selectedTheme === 'adventure' ? styles.adventureChipSelected : styles.adventureChip
                ]}
                icon="hiking"
              >
                Adventure
              </Chip>
              <Chip
                key="family"
                selected={selectedTheme === 'family'}
                onPress={() => setSelectedTheme(selectedTheme === 'family' ? null : 'family')}
                style={[
                  styles.categoryChip,
                  selectedTheme === 'family' ? styles.familyChipSelected : styles.familyChip
                ]}
                icon="account-group"
              >
                Family
              </Chip>
              <Chip
                key="wellness"
                selected={selectedTheme === 'wellness'}
                onPress={() => setSelectedTheme(selectedTheme === 'wellness' ? null : 'wellness')}
                style={[
                  styles.categoryChip,
                  selectedTheme === 'wellness' ? styles.wellnessChipSelected : styles.wellnessChip
                ]}
                icon="meditation"
              >
                Wellness
              </Chip>
            </View>
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Title style={styles.filterTitle}>Categories</Title>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chips}>
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
        </View>
      </View>

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
                  {activity.theme && (
                    <Chip 
                      compact 
                      style={[
                        styles.themeChip,
                        activity.theme === 'lazy' && styles.lazyChip,
                        activity.theme === 'adventure' && styles.adventureChip,
                        activity.theme === 'family' && styles.familyChip,
                        activity.theme === 'wellness' && styles.wellnessChip,
                      ]}
                    >
                      {activity.theme.charAt(0).toUpperCase() + activity.theme.slice(1)}
                    </Chip>
                  )}
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
            <View style={styles.themePicker}>
              <Title style={styles.themeTitle}>Theme</Title>
              <View style={styles.themeChips}>
                <Chip
                  selected={newActivity.theme === 'lazy'}
                  onPress={() => setNewActivity(prev => ({ ...prev, theme: 'lazy' }))}
                  style={[
                    styles.categoryChip,
                    newActivity.theme === 'lazy' ? styles.lazyChipSelected : styles.lazyChip
                  ]}
                  icon="sleep"
                >
                  Lazy
                </Chip>
                <Chip
                  selected={newActivity.theme === 'adventure'}
                  onPress={() => setNewActivity(prev => ({ ...prev, theme: 'adventure' }))}
                  style={[
                    styles.categoryChip,
                    newActivity.theme === 'adventure' ? styles.adventureChipSelected : styles.adventureChip
                  ]}
                  icon="hiking"
                >
                  Adventure
                </Chip>
                <Chip
                  selected={newActivity.theme === 'family'}
                  onPress={() => setNewActivity(prev => ({ ...prev, theme: 'family' }))}
                  style={[
                    styles.categoryChip,
                    newActivity.theme === 'family' ? styles.familyChipSelected : styles.familyChip
                  ]}
                  icon="account-group"
                >
                  Family
                </Chip>
                <Chip
                  selected={newActivity.theme === 'wellness'}
                  onPress={() => setNewActivity(prev => ({ ...prev, theme: 'wellness' }))}
                  style={[
                    styles.categoryChip,
                    newActivity.theme === 'wellness' ? styles.wellnessChipSelected : styles.wellnessChip
                  ]}
                  icon="meditation"
                >
                  Wellness
                </Chip>
              </View>
            </View>
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
                theme: newActivity.theme,
              };
              handleSelectActivity(activity);
              setShowNewActivityDialog(false);
              setNewActivity({
                title: '',
                category: '',
                duration: '',
                icon: '',
                description: '',
                theme: undefined,
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
  filtersContainer: {
    paddingVertical: 8,
  },
  filterSection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  filterTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  themePicker: {
    marginTop: 12,
  },
  themeTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  themeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  searchbar: {
    margin: 16,
  },
  categoriesScroll: {
    marginVertical: 8,
  },
  categories: {
    paddingHorizontal: 16,
  },
  chipGroup: {
    marginBottom: 16,
  },
  chipGroupTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  lazyChip: {
    backgroundColor: '#FFE0B2',
  },
  lazyChipSelected: {
    backgroundColor: '#FFE0B2',
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  adventureChip: {
    backgroundColor: '#C8E6C9',
  },
  adventureChipSelected: {
    backgroundColor: '#C8E6C9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  familyChip: {
    backgroundColor: '#BBDEFB',
  },
  familyChipSelected: {
    backgroundColor: '#BBDEFB',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  wellnessChip: {
    backgroundColor: '#E1BEE7',
  },
  wellnessChipSelected: {
    backgroundColor: '#E1BEE7',
    borderWidth: 2,
    borderColor: '#9C27B0',
  },
  themeChip: {
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
