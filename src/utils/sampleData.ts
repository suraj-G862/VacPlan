import { Activity } from './types';

export const sampleActivities: Activity[] = [
  {
    id: '1',
    title: 'Brunch',
    category: 'Food & Dining',
    duration: 90,
    mood: 'relaxed',
    icon: '🍳',
    description: 'Enjoy a relaxed brunch at your favorite cafe',
  },
  {
    id: '2',
    title: 'Hiking',
    category: 'Outdoor',
    duration: 180,
    mood: 'energetic',
    icon: '🏃‍♂️',
    description: 'Go for a refreshing hike in nature',
  },
  {
    id: '3',
    title: 'Movie Night',
    category: 'Entertainment',
    duration: 150,
    mood: 'relaxed',
    icon: '🎬',
    description: 'Watch a movie at home or in theaters',
  },
  {
    id: '4',
    title: 'Reading',
    category: 'Leisure',
    duration: 60,
    mood: 'relaxed',
    icon: '📚',
    description: 'Spend time with your favorite book',
  },
  {
    id: '5',
    title: 'Yoga Session',
    category: 'Wellness',
    duration: 60,
    mood: 'relaxed',
    icon: '🧘‍♂️',
    description: 'Practice yoga for mind and body wellness',
  },
  {
    id: '6',
    title: 'Gaming',
    category: 'Entertainment',
    duration: 120,
    mood: 'happy',
    icon: '🎮',
    description: 'Play your favorite video games',
  },
  {
    id: '7',
    title: 'Park Visit',
    category: 'Outdoor',
    duration: 120,
    mood: 'happy',
    icon: '🌳',
    description: 'Spend time at a local park',
  },
  {
    id: '8',
    title: 'Shopping',
    category: 'Leisure',
    duration: 180,
    mood: 'happy',
    icon: '🛍️',
    description: 'Go shopping at your favorite stores',
  },
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
