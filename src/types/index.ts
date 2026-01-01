export type Timeframe = '6 months' | '1 year' | '3 years' | 'Life';

export interface Vision {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  timeframe: Timeframe;
  color?: string; // Hex code for accent
  order: number;
}

export interface Goal {
  id: string;
  visionId: string;
  title: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string; // e.g., "hours", "dollars", "words"
  deadline: string; // ISO date string
  progress: number; // 0-100
  isCompleted: boolean;
}

export interface Task {
  id: string;
  goalId?: string; // Optional linkage
  visionId?: string; // Direct linkage to vision if no specific goal
  title: string;
  isCompleted: boolean;
  date: string; // ISO date string (YYYY-MM-DD)
  order: number;
  visionTitle?: string; // Denormalized for easy display
  visionColor?: string; // Denormalized
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  energyLevel: number; // 1-5
  focusLevel: number; // 1-5
  progressRating: 'Yes' | 'Maybe' | 'No';
  notes: string;
  mood?: string;
  completedTaskCount: number;
}

export interface AppState {
  visions: Vision[];
  goals: Goal[];
  tasks: Task[];
  logs: DayLog[];
  userSettings: {
    theme: 'light' | 'dark';
    name: string;
    hasSeenOnboarding?: boolean;
  };
}
