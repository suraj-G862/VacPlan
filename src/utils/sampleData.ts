import { Activity } from './types';

export const sampleActivities: Activity[] = [
  // Lazy Weekend Activities
  {
    id: '1',
    title: 'Netflix Marathon',
    category: 'Entertainment',
    duration: 180,
    mood: 'relaxed',
    icon: '📺',
    description: 'Binge-watch your favorite shows',
    theme: 'lazy'
  },
  {
    id: '2',
    title: 'Late Brunch',
    category: 'Food & Dining',
    duration: 90,
    mood: 'relaxed',
    icon: '🍳',
    description: 'Enjoy a relaxed late brunch',
    theme: 'lazy'
  },
  {
    id: '3',
    title: 'Reading',
    category: 'Leisure',
    duration: 120,
    mood: 'relaxed',
    icon: '📚',
    description: 'Cozy up with a good book',
    theme: 'lazy'
  },

  // Adventurous Weekend Activities
  {
    id: '4',
    title: 'Hiking',
    category: 'Outdoor',
    duration: 180,
    mood: 'energetic',
    icon: '🏃‍♂️',
    description: 'Go for a challenging hike',
    theme: 'adventure'
  },
  {
    id: '5',
    title: 'Rock Climbing',
    category: 'Sports',
    duration: 120,
    mood: 'energetic',
    icon: '🧗‍♀️',
    description: 'Try indoor or outdoor climbing',
    theme: 'adventure'
  },
  {
    id: '6',
    title: 'Kayaking',
    category: 'Sports',
    duration: 150,
    mood: 'energetic',
    icon: '�',
    description: 'Paddle through scenic waters',
    theme: 'adventure'
  },

  // Family Weekend Activities
  {
    id: '7',
    title: 'Board Games',
    category: 'Entertainment',
    duration: 120,
    mood: 'happy',
    icon: '🎲',
    description: 'Family board game session',
    theme: 'family'
  },
  {
    id: '8',
    title: 'Park Picnic',
    category: 'Outdoor',
    duration: 150,
    mood: 'happy',
    icon: '🧺',
    description: 'Family picnic at the park',
    theme: 'family'
  },
  {
    id: '9',
    title: 'Movie Night',
    category: 'Entertainment',
    duration: 150,
    mood: 'relaxed',
    icon: '�',
    description: 'Family movie night with snacks',
    theme: 'family'
  },

  // Wellness Weekend Activities
  {
    id: '10',
    title: 'Yoga Session',
    category: 'Wellness',
    duration: 60,
    mood: 'relaxed',
    icon: '🧘‍♂️',
    description: 'Morning yoga practice',
    theme: 'wellness'
  },
  {
    id: '11',
    title: 'Spa Day',
    category: 'Wellness',
    duration: 180,
    mood: 'relaxed',
    icon: '�‍♀️',
    description: 'Relaxing spa treatment',
    theme: 'wellness'
  },
  {
    id: '12',
    title: 'Meditation',
    category: 'Wellness',
    duration: 30,
    mood: 'relaxed',
    icon: '🧠',
    description: 'Guided meditation session',
    theme: 'wellness'
  }
];

export const activityCategories = [
  'Food & Dining',
  'Outdoor',
  'Entertainment',
  'Leisure',
  'Wellness',
  'Sports',
  'Cultural',
  'Social',
];

export const weekendThemes = [
  {
    id: 'lazy',
    name: 'Lazy Weekend',
    icon: '😴',
  },
  {
    id: 'adventure',
    name: 'Adventurous Weekend',
    icon: '🏃‍♂️',
  },
  {
    id: 'family',
    name: 'Family Weekend',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'wellness',
    name: 'Wellness Weekend',
    icon: '🧘‍♀️',
  },
];
