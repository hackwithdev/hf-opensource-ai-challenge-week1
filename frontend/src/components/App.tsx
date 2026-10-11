import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  db, 
  initializeDatabase, 
  type MyPlantRecord 
} from '../db';
import type { 
  GardenProfile, 
  TaskItem, 
  WeeklyPlan, 
  JournalEntry, 
  UserSettings, 
  Plant 
} from '../types';
import { CURATED_PLANTS } from '../data/plants';

import { Navigation } from './Navigation';
import { Dashboard } from './Dashboard';
import { WeeklyPlanner } from './WeeklyPlanner';
import { GardenSetup } from './GardenSetup';
import { PlantLibrary } from './PlantLibrary';
import { OutdoorMode } from './OutdoorMode';
import { Journal } from './Journal';
import { Settings } from './Settings';
import { TaskDetailModal } from './TaskDetailModal';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [outdoorMode, setOutdoorMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Core Data States
  const [profile, setProfile] = useState<GardenProfile | null>(null);
  const [myPlants, setMyPlants] = useState<MyPlantRecord[]>([]);
  const [customPlants, setCustomPlants] = useState<Plant[]>([]);
  const [activePlan, setActivePlan] = useState<WeeklyPlan | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    ollamaUrl: 'http://localhost:11434',
    modelName: 'gemma:2b',
    apiUrl: 'http://localhost:8000',
    highContrastOutdoor: false,
    hapticFeedback: true,
    soundFeedback: false,
  });

  // UI state
  const [activeTaskModal, setActiveTaskModal] = useState<TaskItem | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState<{ connected: boolean; model: string }>({
    connected: false,
    model: 'gemma:2b',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Initial Load from IndexedDB
  const reloadData = useCallback(async () => {
    try {
      await initializeDatabase();
      
      const loadedProfile = await db.profile.get('main-profile');
      if (loadedProfile) setProfile(loadedProfile);

      const loadedPlants = await db.myPlants.toArray();
      setMyPlants(loadedPlants);

      const loadedCustomPlants = await db.customPlants.toArray();
      setCustomPlants(loadedCustomPlants);

      const loadedSettings = await db.settings.get('default');
      if (loadedSettings) {
        setSettings(loadedSettings);
      }

      const allPlans = await db.plans.toArray();
      if (allPlans.length > 0) {
        const latestPlan = allPlans[allPlans.length - 1];
        setActivePlan(latestPlan);
      }

      const loadedTasks = await db.tasks.toArray();
      setTasks(loadedTasks);

      const loadedJournal = await db.journal.orderBy('createdAt').reverse().toArray();
      setJournalEntries(loadedJournal);

    } catch (err) {
      console.error('Failed to load database records:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Health Check
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${settings.apiUrl}/api/health?ollama_url=${encodeURIComponent(settings.ollamaUrl)}`, {
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) {
        const data = await res.json();
        setOllamaStatus({
          connected: data.ollamaAvailable,
          model: data.models?.[0] || settings.modelName,
        });
        return;
      }
    } catch {
      // Backend not running, try pinging Ollama directly
      try {
        const oRes = await fetch(`${settings.ollamaUrl}/api/tags`, { signal: AbortSignal.timeout(2000) });
        if (oRes.ok) {
          const oData = await oRes.json();
          setOllamaStatus({
            connected: true,
            model: oData.models?.[0]?.name || settings.modelName,
          });
          return;
        }
      } catch {
        // Both unreachable
      }
    }

    setOllamaStatus({
      connected: false,
      model: settings.modelName,
    });
  }, [settings.apiUrl, settings.ollamaUrl, settings.modelName]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  useEffect(() => {
    if (!isLoading) {
      checkHealth();
    }
  }, [isLoading, checkHealth]);

  // 3. Task Completion Toggle
  const handleToggleTask = async (taskId: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const nextCompleted = !targetTask.completed;
    const updatedTask: TaskItem = {
      ...targetTask,
      completed: nextCompleted,
      completedAt: nextCompleted ? new Date().toISOString() : null,
    };

    await db.tasks.put(updatedTask);
    
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? updatedTask : t))
    );

    if (activeTaskModal?.id === taskId) {
      setActiveTaskModal(updatedTask);
    }

    if (nextCompleted) {
      // Check if all tasks are completed for celebratory confetti!
      const remaining = tasks.filter((t) => t.id !== taskId && !t.completed).length;
      if (remaining === 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#488A62', '#FDE68A', '#34704E', '#DF5E3A']
        });
        showToast('🎉 All garden tasks completed for the week!');
      } else {
        showToast('Task completed! Great work tending your garden.');
      }
    }
  };

  // 4. Save Task Observation
  const handleSaveObservation = async (taskId: string, observation: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    const updated = { ...target, observation };
    await db.tasks.put(updated);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    showToast('Observation recorded.');
  };

  // 5. Add Journal Entry
  const handleAddJournalEntry = async (plantName: string, notes: string) => {
    const entry: JournalEntry = {
      id: `entry-${Date.now()}`,
      createdAt: new Date().toISOString(),
      plantName,
      mood: 'healthy',
      notes,
    };
    await db.journal.put(entry);
    setJournalEntries((prev) => [entry, ...prev]);
    showToast('Observation added to Journal.');
  };

  // 6. Direct Journal Entry
  const handleAddDirectJournalEntry = async (entry: JournalEntry) => {
    await db.journal.put(entry);
    setJournalEntries((prev) => [entry, ...prev]);
    showToast('Journal entry saved.');
  };

  const handleDeleteJournalEntry = async (id: string) => {
    await db.journal.delete(id);
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));
    showToast('Journal entry deleted.');
  };

  // 7. Save Garden Profile
  const handleSaveProfile = async (updatedProfile: GardenProfile) => {
    await db.profile.put(updatedProfile);
    setProfile(updatedProfile);

    // Sync plants list to myPlants
    const currentPlantIds = myPlants.map((p) => p.plantId);
    const newIds = updatedProfile.plants;

    // Add newly selected
    for (const id of newIds) {
      if (!currentPlantIds.includes(id)) {
        const found = CURATED_PLANTS.find((p) => p.id === id) || customPlants.find((p) => p.id === id);
        if (found) {
          const newRecord: MyPlantRecord = {
            id: found.id,
            plantId: found.id,
            name: found.name,
            scientificName: found.scientificName,
            category: found.category,
            plantedDate: new Date().toISOString(),
            icon: found.icon || '🌱',
          };
          await db.myPlants.put(newRecord);
        }
      }
    }

    // Remove unselected
    for (const p of myPlants) {
      if (!newIds.includes(p.plantId)) {
        await db.myPlants.delete(p.id);
      }
    }

    const reloaded = await db.myPlants.toArray();
    setMyPlants(reloaded);
    showToast('Garden profile saved.');
  };

  // 8. Toggle Garden Plant in Library
  const handleToggleGardenPlant = async (plant: Plant) => {
    const exists = myPlants.some((p) => p.plantId === plant.id);
    if (exists) {
      await db.myPlants.delete(plant.id);
      setMyPlants((prev) => prev.filter((p) => p.plantId !== plant.id));
      if (profile) {
        const updatedPlants = profile.plants.filter((id) => id !== plant.id);
        const updatedProfile = { ...profile, plants: updatedPlants };
        await db.profile.put(updatedProfile);
        setProfile(updatedProfile);
      }
      showToast(`Removed ${plant.name} from My Garden.`);
    } else {
      const newRec: MyPlantRecord = {
        id: plant.id,
        plantId: plant.id,
        name: plant.name,
        scientificName: plant.scientificName,
        category: plant.category,
        plantedDate: new Date().toISOString(),
        icon: plant.icon || '🌱',
      };
      await db.myPlants.put(newRec);
      setMyPlants((prev) => [...prev, newRec]);
      if (profile) {
        const updatedPlants = [...profile.plants, plant.id];
        const updatedProfile = { ...profile, plants: updatedPlants };
        await db.profile.put(updatedProfile);
        setProfile(updatedProfile);
      }
      showToast(`Added ${plant.name} to My Garden!`);
    }
  };

  // 9. Add Custom Plant
  const handleAddCustomPlant = async (plant: Plant) => {
    await db.customPlants.put(plant);
    setCustomPlants((prev) => [...prev, plant]);
    showToast(`Added custom plant ${plant.name}.`);
  };

  // 10. Generate Plan (with dual-engine backend or client-side fallback)
  const handleGeneratePlan = async () => {
    if (!profile) {
      showToast('Please configure your garden profile first.');
      setCurrentTab('garden');
      return;
    }

    setIsGenerating(true);
    showToast('Synthesizing practical gardening plan...');

    try {
      // 1. Try FastAPI backend first
      const res = await fetch(`${settings.apiUrl}/api/plan/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          modelName: settings.modelName,
          ollamaUrl: settings.ollamaUrl,
        }),
        signal: AbortSignal.timeout(45000), // 45s for local LLM
      });

      if (res.ok) {
        const data = await res.json();
        const plan: WeeklyPlan = data.plan;
        plan.engineUsed = data.engineUsed;
        plan.modelUsed = data.modelUsed;

        // Save plan and tasks to IndexedDB
        await db.plans.put(plan);
        // Clear previous tasks and put new ones
        await db.tasks.clear();
        await db.tasks.bulkPut(plan.tasks);

        setActivePlan(plan);
        setTasks(plan.tasks);
        setIsGenerating(false);

        if (data.engineUsed === 'ollama') {
          showToast(`✨ Generated with local AI (${data.modelUsed || 'Gemma'})!`);
        } else {
          showToast('Generated using botanical knowledge base.');
        }
        return;
      }
    } catch (backendErr) {
      console.warn('Backend unavailable or timed out; generating locally on client side:', backendErr);
    }

    // 2. Client-Side Deterministic Botanical Fallback Engine
    // Even if Python backend or Ollama is offline, the user gets a comprehensive 7-day plan!
    const activePlantObjects = myPlants.map((mp) => {
      return CURATED_PLANTS.find((cp) => cp.id === mp.plantId) || {
        id: mp.plantId,
        name: mp.name,
        scientificName: mp.scientificName,
        category: mp.category as any,
        wateringInstructions: 'Water deeply at the base when top 2-3 cm of soil is dry.',
        sunlightHours: '6 hours gentle light',
        careTips: ['Maintain good airflow and remove yellowing leaves.'],
        pestsAndProblems: [{ problem: 'Pests', solution: 'Inspect leaves closely.' }],
        tools: ['Watering can']
      };
    });

    const primaryPlant = activePlantObjects[0] || CURATED_PLANTS[0];
    const secondaryPlant = activePlantObjects[1] || CURATED_PLANTS[1] || primaryPlant;

    const generatedTasks: TaskItem[] = [
      {
        id: `local-task-1-${Date.now()}`,
        day: 'Monday',
        title: `Deep Base Hydration & Moisture Check`,
        plantId: primaryPlant.id,
        plantName: primaryPlant.name,
        category: 'watering',
        instructions: `Check soil moisture 3 cm deep around ${primaryPlant.name}. Water early in the morning directly at the root zone, keeping foliage dry.`,
        estimatedMinutes: 15,
        tools: ['Watering can with narrow rose', 'Moisture meter or finger'],
        careTips: primaryPlant.wateringInstructions || 'Avoid leaving containers standing in stagnant water.',
        completed: false,
      },
      {
        id: `local-task-2-${Date.now()}`,
        day: 'Tuesday',
        title: `Underside Foliage & Pest Scout`,
        plantId: secondaryPlant.id,
        plantName: secondaryPlant.name,
        category: 'pest_check',
        instructions: `Inspect the undersides of leaves on ${secondaryPlant.name} for aphids, mites, or whiteflies. Gently wipe dusty foliage with a damp cloth.`,
        estimatedMinutes: 10,
        tools: ['Microfiber cloth', 'Hand magnifying loupe'],
        careTips: 'Early detection allows safe mechanical removal before pests establish colonies.',
        completed: false,
      },
      {
        id: `local-task-3-${Date.now()}`,
        day: 'Wednesday',
        title: `Pruning, Deadheading & Airflow Thinning`,
        plantId: primaryPlant.id,
        plantName: primaryPlant.name,
        category: 'pruning',
        instructions: `Snip away yellowing lower leaves or spent blooms using clean shears. Pinch top nodes to encourage lateral bushy branch structure.`,
        estimatedMinutes: 15,
        tools: ['Clean bypass pruning shears', 'Rubbing alcohol wipe'],
        careTips: primaryPlant.careTips[0] || 'Prune above a healthy node to trigger double shoots.',
        completed: false,
      },
      {
        id: `local-task-4-${Date.now()}`,
        day: 'Thursday',
        title: `Soil Aeration & Organic Nourishment`,
        plantId: secondaryPlant.id,
        plantName: secondaryPlant.name,
        category: 'feeding',
        instructions: `Gently cultivate crusty surface soil. Apply a balanced organic seaweed tonic or compost tea around root perimeters.`,
        estimatedMinutes: 15,
        tools: ['Hand cultivator or trowel', 'Diluted organic fertilizer'],
        careTips: 'Feed lightly and consistently rather than heavy doses that burn sensitive root hairs.',
        completed: false,
      },
      {
        id: `local-task-5-${Date.now()}`,
        day: 'Friday',
        title: `Mid-Week Moisture Balance & Mist`,
        plantId: primaryPlant.id,
        plantName: primaryPlant.name,
        category: 'watering',
        instructions: `Verify that pots have drained properly and haven't dried out in the afternoon sun. Give a gentle refresh.`,
        estimatedMinutes: 10,
        tools: ['Watering can'],
        careTips: 'Morning moisture allows plants to withstand afternoon heat without wilting stress.',
        completed: false,
      },
      {
        id: `local-task-6-${Date.now()}`,
        day: 'Saturday',
        title: `Gentle Harvest & Staking Check`,
        plantId: secondaryPlant.id,
        plantName: secondaryPlant.name,
        category: 'harvesting',
        instructions: `Harvest fresh sprigs or ripe produce using clean scissors. Check bamboo stakes and soft ties to ensure stems are well supported.`,
        estimatedMinutes: 20,
        tools: ['Harvest snips', 'Jute plant ties', 'Harvest basket'],
        careTips: 'Harvesting herbs frequently prevents bolting and extends culinary season.',
        completed: false,
      },
      {
        id: `local-task-7-${Date.now()}`,
        day: 'Sunday',
        title: `Screen-Free Garden Walkthrough & Reflection`,
        plantId: null,
        plantName: 'Entire Garden',
        category: 'soil',
        instructions: `Spend 15 relaxed minutes walking your garden without screens or distractions. Top-dress bare soil with clean mulch or compost.`,
        estimatedMinutes: 15,
        tools: ['Gardening gloves', 'Mulch or compost'],
        careTips: 'Observation and stillness are the gardener’s greatest tools.',
        completed: false,
      },
    ];

    const localPlan: WeeklyPlan = {
      id: `local-plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      weekTheme: `Mindful Rhythms & Root Care for ${profile.gardenType.toUpperCase()} Spaces`,
      season: 'Active Growing Season',
      summary: `Tailored 7-day routine for ${profile.plants.join(', ')}. Calibrated for ${profile.experience} gardeners with ${profile.sunlight.replace('_', ' ')} exposure.`,
      tasks: generatedTasks,
      gardenTips: [
        'Water early in the morning so foliage dries quickly in the sunlight.',
        'Always check moisture 3 cm below the surface before watering.',
        'Pinch flowers on culinary herbs to promote vigorous aromatic leaf production.',
      ],
      engineUsed: 'botanical_heuristic',
    };

    await db.plans.put(localPlan);
    await db.tasks.clear();
    await db.tasks.bulkPut(generatedTasks);

    setActivePlan(localPlan);
    setTasks(generatedTasks);
    setIsGenerating(false);
    showToast('Weekly care plan generated locally via botanical knowledge base!');
  };

  // 11. Settings Save
  const handleSaveSettings = async (newSettings: UserSettings) => {
    await db.settings.put(newSettings);
    setSettings(newSettings);
    checkHealth();
    showToast('Settings saved.');
  };

  // 12. Backup Export / Import / Reset
  const handleExportData = async () => {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile: await db.profile.toArray(),
      myPlants: await db.myPlants.toArray(),
      customPlants: await db.customPlants.toArray(),
      plans: await db.plans.toArray(),
      tasks: await db.tasks.toArray(),
      journal: await db.journal.toArray(),
      settings: await db.settings.toArray(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `growwise-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup downloaded successfully.');
  };

  const handleImportData = async (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.profile) {
        await db.profile.clear();
        await db.profile.bulkPut(parsed.profile);
      }
      if (parsed.myPlants) {
        await db.myPlants.clear();
        await db.myPlants.bulkPut(parsed.myPlants);
      }
      if (parsed.customPlants) {
        await db.customPlants.clear();
        await db.customPlants.bulkPut(parsed.customPlants);
      }
      if (parsed.plans) {
        await db.plans.clear();
        await db.plans.bulkPut(parsed.plans);
      }
      if (parsed.tasks) {
        await db.tasks.clear();
        await db.tasks.bulkPut(parsed.tasks);
      }
      if (parsed.journal) {
        await db.journal.clear();
        await db.journal.bulkPut(parsed.journal);
      }
      await reloadData();
      showToast('Garden data restored successfully!');
    } catch (err) {
      alert('Invalid backup file. Please select a valid GrowWise JSON export.');
    }
  };

  const handleResetDatabase = async () => {
    if (confirm('Are you sure you want to reset your local garden data? This will clear tasks and re-seed default starter plants.')) {
      await db.delete();
      await db.open();
      await initializeDatabase();
      await reloadData();
      showToast('Database reset to defaults.');
    }
  };

  // If in Outdoor Mode, render dedicated distraction-free screen
  if (outdoorMode) {
    return (
      <OutdoorMode
        tasks={tasks}
        onToggleTask={handleToggleTask}
        onExit={() => setOutdoorMode(false)}
        onAddJournalEntry={handleAddJournalEntry}
      />
    );
  }

  return (
    <div className="min-h-screen bg-earth-100/60 text-forest-950 font-sans selection:bg-forest-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-forest-900 text-white px-4 py-2.5 rounded-2xl shadow-elevated text-xs sm:text-sm font-semibold border border-forest-700 animate-fade-in flex items-center space-x-2">
          <span>🌿</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        outdoorMode={outdoorMode}
        setOutdoorMode={setOutdoorMode}
        ollamaStatus={ollamaStatus}
      />

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-forest-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-sage-600">Loading your local garden sanctuary...</p>
          </div>
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <Dashboard
                profile={profile}
                myPlants={myPlants}
                activePlan={activePlan}
                tasks={tasks}
                journalEntries={journalEntries}
                onToggleTask={handleToggleTask}
                onNavigateTab={setCurrentTab}
                onEnterOutdoor={() => setOutdoorMode(true)}
                onOpenTaskDetails={(t) => setActiveTaskModal(t)}
                onGeneratePlan={handleGeneratePlan}
                isGenerating={isGenerating}
              />
            )}

            {currentTab === 'planner' && (
              <WeeklyPlanner
                plan={activePlan}
                tasks={tasks}
                profile={profile}
                onToggleTask={handleToggleTask}
                onOpenTaskDetails={(t) => setActiveTaskModal(t)}
                onGeneratePlan={handleGeneratePlan}
                isGenerating={isGenerating}
                ollamaStatus={ollamaStatus}
              />
            )}

            {currentTab === 'garden' && (
              <GardenSetup
                profile={profile}
                onSaveProfile={handleSaveProfile}
                onNavigateTab={setCurrentTab}
                customPlants={customPlants}
              />
            )}

            {currentTab === 'library' && (
              <PlantLibrary
                myPlantIds={myPlants.map((p) => p.plantId)}
                onToggleGardenPlant={handleToggleGardenPlant}
                customPlants={customPlants}
                onAddCustomPlant={handleAddCustomPlant}
              />
            )}

            {currentTab === 'journal' && (
              <Journal
                entries={journalEntries}
                myPlants={myPlants}
                onAddEntry={handleAddDirectJournalEntry}
                onDeleteEntry={handleDeleteJournalEntry}
              />
            )}

            {currentTab === 'settings' && (
              <Settings
                settings={settings}
                onSaveSettings={handleSaveSettings}
                onExportData={handleExportData}
                onImportData={handleImportData}
                onResetDatabase={handleResetDatabase}
                ollamaStatus={ollamaStatus}
                onRefreshHealth={checkHealth}
              />
            )}
          </>
        )}
      </main>

      {/* Task Details Modal */}
      {activeTaskModal && (
        <TaskDetailModal
          task={activeTaskModal}
          onClose={() => setActiveTaskModal(null)}
          onToggleTask={handleToggleTask}
          onSaveObservation={handleSaveObservation}
          onAddJournalEntry={handleAddJournalEntry}
        />
      )}
    </div>
  );
};
