export interface Activity {
  id: string;
  title: string;
  category: string;
  duration: number;
  mood?: 'happy' | 'relaxed' | 'energetic';
  icon?: string;
  location?: string;
  description?: string;
  theme?: 'lazy' | 'adventure' | 'family' | 'wellness';
}

export interface DayPlan {
  date: string;
  activities: Activity[];
}

export interface WeekendPlan {
  id: string;
  name: string;
  theme?: string;
  days: DayPlan[];
  activities: Array<Activity | null>;  // For direct access in share card
  isLongWeekend?: boolean;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
}
