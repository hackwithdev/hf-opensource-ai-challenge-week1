export type GardenType = 'indoor' | 'balcony' | 'terrace' | 'backyard';
export type SunlightType = 'full_sun' | 'partial_sun' | 'indirect' | 'shade';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';
export type TimeCommitment = 'minimal' | 'moderate' | 'dedicated';

export interface PestProblem {
  problem: string;
  solution: string;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  category: 'vegetable' | 'herb' | 'fruit' | 'indoor' | 'flower';
  difficulty: 'easy' | 'moderate' | 'advanced';
  sunlight: SunlightType;
  sunlightHours: string;
  watering: 'low' | 'moderate' | 'frequent';
  wateringInstructions: string;
  soil: string;
  idealTemperature: string;
  spacing: string;
  daysToHarvest: number | null;
  companionPlants: string[];
  pestsAndProblems: PestProblem[];
  careTips: string[];
  icon: string;
  custom?: boolean;
}

export interface GardenProfile {
  id?: string;
  name?: string;
  gardenType: GardenType;
  sunlight: SunlightType;
  spaceSize: 'compact' | 'medium' | 'large';
  experience: ExperienceLevel;
  weeklyTime: string;
  plants: string[]; // Plant IDs
  notes?: string;
  updatedAt?: string;
}

export interface TaskItem {
  id: string;
  planId?: string;
  day: string;
  title: string;
  plantId?: string | null;
  plantName: string;
  category: 'watering' | 'pruning' | 'feeding' | 'pest_check' | 'harvesting' | 'soil';
  instructions: string;
  estimatedMinutes: number;
  tools: string[];
  careTips: string;
  completed: boolean;
  completedAt?: string | null;
  observation?: string | null;
}

export interface WeeklyPlan {
  id: string;
  createdAt: string;
  weekTheme: string;
  season: string;
  summary: string;
  tasks: TaskItem[];
  gardenTips: string[];
  engineUsed?: 'ollama' | 'botanical_heuristic';
  modelUsed?: string;
}

export interface JournalEntry {
  id: string;
  createdAt: string;
  plantId?: string;
  plantName?: string;
  notes: string;
  mood: 'thriving' | 'healthy' | 'struggling' | 'recovering';
  weather?: string;
  actionTaken?: string;
  photoUrl?: string;
}

export interface UserSettings {
  id?: string;
  ollamaUrl: string;
  modelName: string;
  apiUrl: string;
  highContrastOutdoor: boolean;
  hapticFeedback: boolean;
  soundFeedback: boolean;
}

export interface HealthStatus {
  status: string;
  ollamaAvailable: boolean;
  ollamaUrl: string;
  models: string[];
  plantCount: number;
}
