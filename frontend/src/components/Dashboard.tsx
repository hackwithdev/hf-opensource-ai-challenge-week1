import React from 'react';
import { 
  Sparkles, 
  SunMedium, 
  Clock, 
  Wrench, 
  Sprout, 
  CalendarDays, 
  ArrowRight,
  TrendingUp,
  Leaf,
  Plus,
  Check
} from 'lucide-react';
import type { GardenProfile, TaskItem, WeeklyPlan, JournalEntry } from '../types';
import type { MyPlantRecord } from '../db';

interface DashboardProps {
  profile: GardenProfile | null;
  myPlants: MyPlantRecord[];
  activePlan: WeeklyPlan | null;
  tasks: TaskItem[];
  journalEntries: JournalEntry[];
  onToggleTask: (taskId: string) => void;
  onNavigateTab: (tab: string) => void;
  onEnterOutdoor: () => void;
  onOpenTaskDetails: (task: TaskItem) => void;
  onGeneratePlan: () => void;
  isGenerating: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  myPlants,
  activePlan,
  tasks,
  journalEntries,
  onToggleTask,
  onNavigateTab,
  onEnterOutdoor,
  onOpenTaskDetails,
  onGeneratePlan,
  isGenerating,
}) => {
  const completedTasks = tasks.filter((t) => t.completed);
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  
  // Total estimated minutes saved or spent
  const totalMinutes = tasks.reduce((acc, t) => acc + (t.completed ? t.estimatedMinutes : 0), 0);

  // Group pending tasks vs completed
  const pendingTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 text-white p-6 sm:p-8 shadow-elevated">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-forest-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-700/60 border border-forest-500/30 text-emerald-300 text-xs font-medium">
              <Sprout className="w-3.5 h-3.5" />
              <span>
                {profile ? `${profile.gardenType.toUpperCase()} GARDEN • ${profile.sunlight.replace('_', ' ').toUpperCase()}` : 'NEW GARDEN'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-white">
              {profile?.name ? profile.name : "Welcome to GrowWise"}
            </h1>
            <p className="text-sage-200 text-sm sm:text-base leading-relaxed">
              Step away from screens and connect with living soil. You have{' '}
              <strong className="text-emerald-300 font-semibold">{pendingTasks.length} gardening tasks</strong> waiting this week.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onEnterOutdoor}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold shadow-medium transition-transform active:scale-95"
            >
              <SunMedium className="w-4 h-4" />
              <span>Outdoor Mode</span>
            </button>
            <button
              onClick={onGeneratePlan}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-forest-700/80 hover:bg-forest-600 text-emerald-100 border border-forest-500/50 font-medium transition-colors disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-emerald-300 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing...' : 'Regenerate Plan'}</span>
            </button>
          </div>
        </div>

        {/* Tip of the day ticker */}
        <div className="mt-6 pt-5 border-t border-forest-700/60 flex items-start space-x-3 text-xs sm:text-sm text-sage-300">
          <Leaf className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-emerald-200">Daily Wisdom:</strong> Most container plants thrive best when watered deeply at the root zone in early morning rather than evening, minimizing root saturation overnight.
          </p>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-earth-50 rounded-2xl p-5 border border-sage-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sage-600 uppercase tracking-wider">Weekly Progress</span>
            <TrendingUp className="w-4 h-4 text-forest-600" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-forest-900">{progressPercent}%</span>
            <span className="text-xs text-sage-600">{completedTasks.length}/{totalTasks} tasks</span>
          </div>
          <div className="mt-2 w-full bg-sage-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-forest-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-earth-50 rounded-2xl p-5 border border-sage-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sage-600 uppercase tracking-wider">Cared For</span>
            <Clock className="w-4 h-4 text-forest-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-forest-900">{totalMinutes}</span>
            <span className="text-xs text-sage-600 ml-1">mins in dirt</span>
          </div>
          <p className="mt-1 text-xs text-sage-600">Screen-free mindfulness</p>
        </div>

        <div className="bg-earth-50 rounded-2xl p-5 border border-sage-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sage-600 uppercase tracking-wider">Saved Plants</span>
            <Sprout className="w-4 h-4 text-forest-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-forest-900">{myPlants.length}</span>
            <span className="text-xs text-sage-600 ml-1">varieties</span>
          </div>
          <p className="mt-1 text-xs text-sage-600">Active garden bed</p>
        </div>

        <div className="bg-earth-50 rounded-2xl p-5 border border-sage-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sage-600 uppercase tracking-wider">Journal Entries</span>
            <CalendarDays className="w-4 h-4 text-forest-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-forest-900">{journalEntries.length}</span>
            <span className="text-xs text-sage-600 ml-1">observations</span>
          </div>
          <p className="mt-1 text-xs text-sage-600">Documented growth</p>
        </div>
      </div>

      {/* Main Grid: Today's Tasks + Garden Plants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Actionable Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-forest-900">Weekly Care Schedule</h2>
              <p className="text-xs sm:text-sm text-sage-600">
                {activePlan ? activePlan.weekTheme : 'Tailored practical tasks for your plants'}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('planner')}
              className="text-xs sm:text-sm font-semibold text-forest-700 hover:text-forest-900 flex items-center space-x-1"
            >
              <span>Full Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="bg-earth-50 border border-dashed border-sage-300 rounded-3xl p-8 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-semibold text-forest-900">No active weekly plan</h3>
                <p className="text-xs sm:text-sm text-sage-600">
                  Generate your first personalized gardening plan using your plants and garden setup.
                </p>
              </div>
              <button
                onClick={onGeneratePlan}
                disabled={isGenerating}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-600 text-white font-medium shadow-soft text-sm transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Create Gardening Plan'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group rounded-2xl border p-4 sm:p-5 transition-all bg-earth-50 shadow-soft hover:shadow-medium flex items-start gap-4 ${
                    task.completed
                      ? 'border-emerald-200 bg-emerald-50/40 text-sage-600'
                      : 'border-sage-200 hover:border-forest-300'
                  }`}
                >
                  {/* Big Checkbox */}
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                        : 'border-sage-400 hover:border-forest-600 bg-white'
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  {/* Task details */}
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onOpenTaskDetails(task)}>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-forest-100 text-forest-800">
                        {task.day}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-sage-200 text-sage-800">
                        {task.plantName}
                      </span>
                      <span className="text-[11px] text-sage-500 flex items-center gap-1 ml-auto">
                        <Clock className="w-3 h-3" />
                        {task.estimatedMinutes}m
                      </span>
                    </div>

                    <h3 className={`text-base font-semibold ${task.completed ? 'line-through text-sage-500' : 'text-forest-950'}`}>
                      {task.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-sage-700 mt-1 line-clamp-2 leading-relaxed">
                      {task.instructions}
                    </p>

                    {/* Tools & Care tip footer */}
                    <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-sage-200/60 text-xs text-sage-600">
                      {task.tools.length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Wrench className="w-3 h-3 text-sage-500" />
                          {task.tools.slice(0, 2).join(', ')}
                        </span>
                      )}
                      {task.observation && (
                        <span className="ml-auto italic text-forest-700 text-xs">
                          Note: "{task.observation}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Plants Snapshot & Quick Journal */}
        <div className="space-y-6">
          {/* Plants in My Garden */}
          <div className="bg-earth-50 rounded-3xl p-6 border border-sage-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-forest-900 text-lg">My Garden</h3>
                <p className="text-xs text-sage-600">{myPlants.length} plants thriving</p>
              </div>
              <button
                onClick={() => onNavigateTab('library')}
                className="w-8 h-8 rounded-full bg-forest-100 hover:bg-forest-200 text-forest-800 flex items-center justify-center transition-colors"
                title="Add plants from library"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {myPlants.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <Sprout className="w-8 h-8 text-sage-400 mx-auto" />
                <p className="text-xs text-sage-600">No plants added yet.</p>
                <button
                  onClick={() => onNavigateTab('library')}
                  className="text-xs font-semibold text-forest-700 hover:underline"
                >
                  Browse Plant Library
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {myPlants.map((plant) => (
                  <div
                    key={plant.id}
                    className="flex items-center space-x-3 p-3 rounded-2xl bg-white/80 border border-sage-200 hover:border-forest-300 transition-colors"
                  >
                    <span className="text-2xl p-1.5 rounded-xl bg-forest-50">{plant.icon || '🌱'}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-forest-900 truncate">{plant.name}</h4>
                      <p className="text-xs text-sage-600 italic truncate">{plant.scientificName}</p>
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-sage-100 text-sage-700">
                      {plant.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Journal Snippet */}
          <div className="bg-earth-50 rounded-3xl p-6 border border-sage-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-forest-900 text-lg">Recent Notes</h3>
              <button
                onClick={() => onNavigateTab('journal')}
                className="text-xs font-semibold text-forest-700 hover:underline"
              >
                View All
              </button>
            </div>

            {journalEntries.length === 0 ? (
              <p className="text-xs text-sage-600 py-3 text-center">
                No observations recorded yet. Take a moment outdoors to write your first note!
              </p>
            ) : (
              <div className="space-y-3">
                {journalEntries.slice(0, 2).map((entry) => (
                  <div key={entry.id} className="p-3.5 rounded-2xl bg-white/80 border border-sage-200 space-y-1">
                    <div className="flex items-center justify-between text-xs text-sage-600">
                      <span className="font-semibold text-forest-800">{entry.plantName || 'General Garden'}</span>
                      <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-sage-700 line-clamp-2">{entry.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
