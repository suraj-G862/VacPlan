import { Activity } from '../src/utils/types';

describe('Types', () => {
  test('Activity type should be properly structured', () => {
    const activity: Activity = {
      id: '1',
      title: 'Test Activity',
      category: 'Entertainment',
      duration: 60,
      icon: '🎮',
      theme: 'lazy'
    };

    expect(activity).toHaveProperty('id');
    expect(activity).toHaveProperty('title');
    expect(activity).toHaveProperty('category');
    expect(activity).toHaveProperty('duration');
    expect(typeof activity.duration).toBe('number');
  });
});
