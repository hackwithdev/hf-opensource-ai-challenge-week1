import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Wrench, 
  Droplet, 
  Scissors, 
  Sprout, 
  Bug, 
  Apple, 
  Layers, 
  ChevronRight,
  Info,
  Check
} from 'lucide-react';
import type { WeeklyPlan, TaskItem, GardenProfile } from '../types';

interface WeeklyPlannerProps {
  plan: WeeklyPlan | null;
  tasks: TaskItem[];
  profile: GardenProfile | null;
  onToggleTask: (taskId: string) => void;
  onOpenTaskDetails: (task: TaskItem) => void;
  onGeneratePlan: () => void;
  isGenerating: boolean;
  ollamaStatus: { connected: boolean; model: string };
}

export const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({
  plan,
  tasks,
  profile,
  onToggleTask,
  onOpenTaskDetails,
  onGeneratePlan,
  isGenerating,
  ollamaStatus,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const categoryIcons: Record<string, any> = {
    watering: Droplet,
    pruning: Scissors,
    feeding: Sprout,
    pest_check: Bug,
    harvesting: Apple,
    soil: Layers,
  };

  const filteredTasks = tasks.filter((t) => {
    if (selectedDay !== 'all' && t.day.toLowerCase() !== selectedDay.toLowerCase()) return false;
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header with generation trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-earth-50 rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-soft">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-forest-600" />
              <span>
                {plan?.engineUsed === 'ollama' 
                  ? `Local AI Planner (${plan.modelUsed || ollamaStatus.model})` 
                  : 'Botanical Knowledge Engine'}
              </span>
            </div>
            {profile && (
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-sage-200 text-sage-800 capitalize">
                {profile.gardenType} • {profile.sunlight.replace('_', ' ')}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">
            {plan?.weekTheme || 'Weekly Gardening Care Plan'}
          </h1>
          <p className="text-sm text-sage-600 max-w-2xl">
            {plan?.summary || 'Tailored practical schedule based on your garden sunlight, plants, and experience level.'}
          </p>
        </div>

        <button
          onClick={onGeneratePlan}
          disabled={isGenerating}
          className="flex-shrink-0 flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-forest-700 hover:bg-forest-600 text-white font-medium shadow-soft transition-all disabled:opacity-50 active:scale-95"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Synthesizing with AI...' : 'Generate New Plan'}</span>
        </button>
      </div>

      {/* Plan Wisdom Tips */}
      {plan?.gardenTips && plan.gardenTips.length > 0 && (
        <div className="bg-forest-50/70 border border-forest-200 rounded-2xl p-5 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-forest-600" />
            Weekly Botanical Guidance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-forest-900">
            {plan.gardenTips.map((tip, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-forest-600 font-bold">•</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs: Days of Week */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-forest-900">
            Tasks ({completedCount}/{tasks.length} Completed)
          </h2>
          <span className="text-xs text-sage-600">Click task to view full steps & record notes</span>
        </div>

        {/* Day Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDay === 'all'
                ? 'bg-forest-700 text-white shadow-soft'
                : 'bg-earth-50 hover:bg-sage-100 text-sage-700 border border-sage-200'
            }`}
          >
            All Days ({tasks.length})
          </button>
          {days.map((d) => {
            const countForDay = tasks.filter((t) => t.day.toLowerCase() === d.toLowerCase()).length;
            const isSelected = selectedDay.toLowerCase() === d.toLowerCase();
            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-forest-700 text-white shadow-soft'
                    : 'bg-earth-50 hover:bg-sage-100 text-sage-700 border border-sage-200'
                }`}
              >
                {d} {countForDay > 0 && `(${countForDay})`}
              </button>
            );
          })}
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-sage-500 font-medium mr-1">Category:</span>
          {['all', 'watering', 'pruning', 'feeding', 'pest_check', 'harvesting', 'soil'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                selectedCategory === cat
                  ? 'bg-sage-300 text-forest-900 font-semibold'
                  : 'text-sage-600 hover:text-forest-800'
              }`}
            >
              {cat === 'pest_check' ? 'Pest Check' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-earth-50 rounded-3xl border border-dashed border-sage-300 p-8 space-y-3">
          <Calendar className="w-10 h-10 text-sage-400 mx-auto" />
          <h3 className="text-base font-semibold text-forest-900">No tasks found for this filter</h3>
          <p className="text-xs text-sage-600">Try selecting a different day or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const CatIcon = categoryIcons[task.category] || Sprout;
            return (
              <div
                key={task.id}
                className={`rounded-2xl border p-5 transition-all bg-earth-50 shadow-soft hover:shadow-medium flex flex-col justify-between ${
                  task.completed
                    ? 'border-emerald-200 bg-emerald-50/40 text-sage-600'
                    : 'border-sage-200 hover:border-forest-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Checkbox + Tags */}
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        task.completed
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                          : 'border-sage-400 hover:border-forest-600 bg-white'
                      }`}
                    >
                      {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-forest-100 text-forest-800">
                        {task.day}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-sage-200 text-sage-800">
                        <CatIcon className="w-3 h-3 text-sage-600" />
                        {task.category.replace('_', ' ')}
                      </span>
                    </div>

                    <span className="text-xs text-sage-500 flex items-center gap-1 ml-auto">
                      <Clock className="w-3.5 h-3.5" />
                      {task.estimatedMinutes}m
                    </span>
                  </div>

                  {/* Title & Instructions */}
                  <div className="cursor-pointer" onClick={() => onOpenTaskDetails(task)}>
                    <div className="text-xs font-semibold text-emerald-800 mb-0.5">{task.plantName}</div>
                    <h3 className={`text-base font-bold ${task.completed ? 'line-through text-sage-500' : 'text-forest-950'}`}>
                      {task.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-sage-700 mt-1.5 leading-relaxed">
                      {task.instructions}
                    </p>
                  </div>

                  {/* Care tip quote */}
                  <div className="p-2.5 rounded-xl bg-forest-100/50 border border-forest-200/50 text-xs text-forest-900 leading-snug">
                    <strong className="text-forest-800">Pro Tip: </strong>
                    {task.careTips}
                  </div>
                </div>

                {/* Footer Tools & Action */}
                <div className="mt-4 pt-3 border-t border-sage-200/60 flex items-center justify-between text-xs text-sage-600">
                  <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                    <Wrench className="w-3.5 h-3.5 text-sage-500 flex-shrink-0" />
                    <span className="truncate">{task.tools.join(', ')}</span>
                  </div>

                  <button
                    onClick={() => onOpenTaskDetails(task)}
                    className="text-forest-700 hover:text-forest-900 font-semibold flex items-center gap-1 ml-2"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
