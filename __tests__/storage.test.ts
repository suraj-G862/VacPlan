import { savePlan, getPlans, deletePlan } from '../src/utils/storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('Storage Utils', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('savePlan should store plan in AsyncStorage', async () => {
    const mockPlan = {
      id: '1',
      name: 'Test Plan',
      days: [],
      activities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };

    await savePlan(mockPlan);

    expect(require('@react-native-async-storage/async-storage').getItem).toHaveBeenCalled();
    expect(require('@react-native-async-storage/async-storage').setItem).toHaveBeenCalled();
  });

  test('getPlans should return an empty array when no plans exist', async () => {
    require('@react-native-async-storage/async-storage').getItem.mockResolvedValue(null);
    
    const plans = await getPlans();
    
    expect(plans).toEqual([]);
  });

  test('deletePlan should remove plan from storage', async () => {
    const mockPlans = [
      { id: '1', name: 'Plan 1' },
      { id: '2', name: 'Plan 2' },
    ];

    require('@react-native-async-storage/async-storage').getItem.mockResolvedValue(JSON.stringify(mockPlans));
    
    await deletePlan('1');

    expect(require('@react-native-async-storage/async-storage').setItem).toHaveBeenCalled();
  });
});
