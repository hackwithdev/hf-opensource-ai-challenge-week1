import Dexie, { type Table } from 'dexie';
import type { GardenProfile, TaskItem, WeeklyPlan, JournalEntry, UserSettings, Plant } from '../types';

export interface MyPlantRecord {
  id: string;
  plantId: string;
  name: string;
  scientificName: string;
  category: string;
  plantedDate: string;
  notes?: string;
  icon: string;
}

export class GrowWiseDatabase extends Dexie {
  profile!: Table<GardenProfile, string>;
  myPlants!: Table<MyPlantRecord, string>;
  plans!: Table<WeeklyPlan, string>;
  tasks!: Table<TaskItem, string>;
  journal!: Table<JournalEntry, string>;
  settings!: Table<UserSettings, string>;
  customPlants!: Table<Plant, string>;

  constructor() {
    super('GrowWiseDB');
    this.version(1).stores({
      profile: 'id',
      myPlants: 'id, plantId, category, plantedDate',
      plans: 'id, createdAt',
      tasks: 'id, planId, day, completed, plantId',
      journal: 'id, createdAt, plantId, mood',
      settings: 'id',
      customPlants: 'id, category, name'
    });
  }
}

export const db = new GrowWiseDatabase();

// Default initial state generator
export async function initializeDatabase() {
  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.put({
      id: 'default',
      ollamaUrl: 'http://localhost:11434',
      modelName: 'gemma:2b',
      apiUrl: 'http://localhost:8000',
      highContrastOutdoor: false,
      hapticFeedback: true,
      soundFeedback: false,
    });
  }

  const profileCount = await db.profile.count();
  if (profileCount === 0) {
    // Seed initial thoughtful starter garden
    const initialProfile: GardenProfile = {
      id: 'main-profile',
      name: 'Sunlit Haven',
      gardenType: 'balcony',
      sunlight: 'full_sun',
      spaceSize: 'compact',
      experience: 'beginner',
      weeklyTime: '1-2 hours',
      plants: ['sweet-basil', 'cherry-tomato'],
      notes: 'Compact sunny container setup with fresh herbs and cherry tomatoes.',
      updatedAt: new Date().toISOString()
    };
    await db.profile.put(initialProfile);

    // Seed myPlants
    await db.myPlants.bulkPut([
      {
        id: 'sweet-basil',
        plantId: 'sweet-basil',
        name: 'Sweet Basil',
        scientificName: 'Ocimum basilicum',
        category: 'herb',
        plantedDate: new Date(Date.now() - 14 * 86400000).toISOString(),
        notes: 'Potted in 20cm terracotta pot on the south ledge.',
        icon: '🌿'
      },
      {
        id: 'cherry-tomato',
        plantId: 'cherry-tomato',
        name: 'Cherry Tomato',
        scientificName: 'Solanum lycopersicum var. cerasiforme',
        category: 'vegetable',
        plantedDate: new Date(Date.now() - 21 * 86400000).toISOString(),
        notes: 'Staked with bamboo cane; setting first flower clusters.',
        icon: '🍅'
      }
    ]);

    // Seed starter journal entry
    await db.journal.put({
      id: 'entry-starter-1',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      plantId: 'cherry-tomato',
      plantName: 'Cherry Tomato',
      mood: 'thriving',
      weather: 'Sunny & mild, 22°C',
      notes: 'First small yellow flower blossom opened today! Soil moisture level feels balanced.',
      actionTaken: 'Tied main stem loosely to bamboo stake using soft jute twine.'
    });
  }
}
