import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock Expo Router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
}));

// Mock React Native Paper components
jest.mock('react-native-paper', () => {
  const RealModule = jest.requireActual('react-native-paper');
  const MockModule = {
    ...RealModule,
    Button: 'Button',
    Card: {
      ...RealModule.Card,
      Content: 'Card.Content',
      Actions: 'Card.Actions',
    },
    IconButton: 'IconButton',
    Title: 'Title',
    Paragraph: 'Paragraph',
    Chip: 'Chip',
  };
  return MockModule;
});

// Mock React Native Gesture Handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    State: {
      ACTIVE: 'ACTIVE',
      END: 'END',
    },
  };
});
