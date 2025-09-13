export interface Activity {
  id: string;
  title: string;
  category: string;
  duration: number;
  mood?: 'happy' | 'relaxed' | 'energetic';
  icon?: string;
  location?: string;
  description?: string;
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
  isLongWeekend?: boolean;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
}
